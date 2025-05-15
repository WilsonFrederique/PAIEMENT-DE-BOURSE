import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button
} from '@mui/material';
import NavBar from "../../../NavBar/NavBar";
import "./ComEtudiants.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { FaRegEye, FaEdit } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { getAllEtudiants, deleteEtudiant, Etudiant, getMineurs } from "../../../services/etudiant_api";

const ComEtudiants = () => {
  const navigate = useNavigate();
  const [activeCrumb, setActiveCrumb] = useState("etudiant");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [etudiantToDelete, setEtudiantToDelete] = useState<string | null>(null);
  const itemsPerPage = 10;


  const [showMineursOnly, setShowMineursOnly] = useState(false);

  // Charger les étudiants
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllEtudiants();
        setEtudiants(data);
      } catch (error) {
        console.error("Erreur lors du chargement des étudiants:", error);
        toast.error("Erreur lors du chargement des étudiants");
      }
    };
    fetchData();
  }, []);

  // Gestion de la suppression
  const handleDeleteClick = (matricule: string) => {
    setEtudiantToDelete(matricule);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!etudiantToDelete) return;
    
    try {
      await deleteEtudiant(etudiantToDelete);
      toast.success("Étudiant supprimé avec succès");
      // Recharger la liste après suppression
      const data = await getAllEtudiants();
      setEtudiants(data);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étudiant:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression");
    } finally {
      setOpenDeleteDialog(false);
      setEtudiantToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setEtudiantToDelete(null);
  };

  const handleCrumbClick = (path: string, crumbName: string) => {
    setActiveCrumb(crumbName);
    navigate(path);
    localStorage.setItem('activeSidebarItem', crumbName === "accueil" ? "acceuil" : crumbName);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Filtrage des données
  const filteredEtudiants = etudiants.filter(etudiant => {
  if (!etudiant.Matricule) return false; // Ignore les lignes vides
  
  const matchesSearch = Object.values(etudiant).some(value =>
    value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (showMineursOnly && etudiant.Naissance) {
    const dateNaissance = new Date(etudiant.Naissance);
    const dateMajeure = new Date(dateNaissance);
    dateMajeure.setFullYear(dateMajeure.getFullYear() + 18);
    const isMineur = dateMajeure > new Date();
    return matchesSearch && isMineur;
  }
  
  return matchesSearch;
});

  // Fonction pour gérer le clic sur le bouton mineur
 const toggleMineursFilter = async () => {
  try {
    if (!showMineursOnly) {
      let data: Etudiant[];
      
      try {
        // Essayez d'abord la requête API
        data = await getMineurs();
      } catch (apiError) {
        console.warn("Erreur API, filtrage côté client:", apiError);
        // Fallback: filtre côté client
        const all = await getAllEtudiants();
        data = all.filter(e => {
          if (!e.Naissance) return false;
          const birthDate = new Date(e.Naissance);
          const ageDate = new Date();
          ageDate.setFullYear(ageDate.getFullYear() - 18);
          return birthDate > ageDate;
        });
      }
      
      setEtudiants(data);
      setShowMineursOnly(true);
      setCurrentPage(1);
      
      if (data.length === 0) {
        toast.info("Aucun étudiant mineur trouvé");
      } else {
        toast.success(`${data.length} étudiant(s) mineur(s) trouvé(s)`);
      }
    } else {
      const data = await getAllEtudiants();
      setEtudiants(data);
      setShowMineursOnly(false);
      setCurrentPage(1);
      toast.success("Affichage de tous les étudiants");
    }
  } catch (error) {
    console.error("Erreur:", error);
    toast.error(error instanceof Error ? error.message : "Erreur lors du filtrage");
  }
};

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredEtudiants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEtudiants = filteredEtudiants.slice(indexOfFirstItem, indexOfLastItem);

  // Créer un tableau avec toujours 10 éléments
  const displayData = [...currentEtudiants];
  while (displayData.length < itemsPerPage) {
    displayData.push({} as Etudiant);
  }
  return (
    <div className="container">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        classes={{ paper: 'delete-confirmation-dialog' }}
      >
        <DialogTitle id="alert-dialog-title">
          <div className="dialog-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          Êtes-vous sûr de vouloir supprimer cet étudiant ?
        </DialogTitle>
        <DialogActions>
          <Button className="cancel-btn" onClick={handleCancelDelete}>
            Annuler
          </Button>
          <Button className="confirm-btn" onClick={handleConfirmDelete} autoFocus>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <div className="main">
        {/* Nav Bar */}
        <div className="Nav bar">
          <NavBar />
        </div>

        <div className="container-container">
          {/* Fil d'ariane */}
          <div className="breadcrumb-container">
            <div>
              <h3 className="h3-title">Étudiants</h3>
            </div>
            <nav className="breadcrumb-nav">
              <ol className="breadcrumb-path">
                <li 
                  className={`breadcrumb-step ${activeCrumb === "accueil" ? "active" : ""}`}
                  onClick={() => handleCrumbClick("/dashbord", "accueil")}
                >
                  <a 
                    href="#" 
                    className="breadcrumb-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <RiHomeLine className="breadcrumb-icon" />
                    <span>Accueil</span>
                  </a>
                </li>
                <li 
                  className={`breadcrumb-step ${activeCrumb === "etudiant" ? "active" : ""}`}
                  onClick={() => handleCrumbClick("/etudiant", "etudiant")}
                >
                  <a 
                    href="#" 
                    className="breadcrumb-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <CiUser className="breadcrumb-icon" />
                    <span className="active-txt">Étudiants</span>
                  </a>
                </li>
              </ol>
            </nav>
          </div>

          {/* Table */}
          <div className="detailDonnee">
            <div className="recentOrders">
              <div className="title-table">
                <h3 className="h3-title-table">Liste des étudiants</h3>
                <div className="action-title">
                  <a href="/frmEtudiant"><button><IoMdAdd />Ajouter</button></a>
                </div>
              </div>

              <div className="search-table">
                <div>
                  <IoSearchOutline />
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Section Recherche Avancée */}
              <div className="advanced-search-container">
                <div className="search-filters">
                  <button 
                    className={`minor-filter-btn ${showMineursOnly ? 'active' : ''}`}
                    onClick={toggleMineursFilter}
                  >
                    <span className="filter-icon">👶</span>
                    {showMineursOnly ? 'Tous les étudiants' : 'Liste des mineurs'}
                  </button>
                  
                  <div className="custom-select">
                    <select className="level-select">
                      <option value="">Tous les niveaux</option>
                      <option value="L1">Licence 1</option>
                      <option value="L2">Licence 2</option>
                      <option value="L3">Licence 3</option>
                      <option value="M1">Master 1</option>
                      <option value="M2">Master 2</option>
                    </select>
                    <div className="select-arrow">▼</div>
                  </div>
                  
                  <div className="custom-select">
                    <select className="institution-select">
                      <option value="">Tous les établissements</option>
                      <option value="UCAD">UCAD</option>
                      <option value="UGB">UGB</option>
                      <option value="UVS">UVS</option>
                      <option value="ESP">ESP</option>
                      <option value="ENS">ENS</option>
                    </select>
                    <div className="select-arrow">▼</div>
                  </div>
                </div>
              </div>

              <div className="table">
                <table className="table-moderne">
                  <thead className="thead-moderne">
                    <tr className="tr-moderne">
                      <th>Matricule</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Sexe</th>
                      <th>Contact</th>
                      <th>Établissement</th>
                      <th>Niveau</th>
                      <th className="action">Action</th>
                    </tr>
                  </thead>
                  <tbody className="tbody-moderne">
                    {displayData.map((etudiant, index) => (
                      <tr key={etudiant?.Matricule || `empty-${index}`} className="tr-moderne">
                        <td>{etudiant?.Matricule || '-'}</td>
                        <td>{etudiant?.Nom || '-'}</td>
                        <td>{etudiant?.Prenom || '-'}</td>
                        <td>{etudiant?.Sexe ? (etudiant.Sexe === 'M' ? 'Masculin' : 'Féminin') : '-'}</td>
                        <td>{etudiant?.Telephone || '-'}</td>
                        <td>{etudiant?.Etablissement || '-'}</td>
                        <td>{etudiant?.Niveau || '-'}</td>
                        <td className="action-td">
                          {etudiant?.Matricule ? (
                            <>
                              <button 
                                className="btn-detail"
                                onClick={() => navigate(`/detailEtudiant/${etudiant.Matricule}`)}
                                aria-label="Voir les détails"
                              >
                                <FaRegEye className="eye-icon" />
                              </button>
                              <button 
                                className="btn-edit"
                                onClick={() => navigate(`/modifierEtudiant/${etudiant.Matricule}`)}
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="btn-delete"
                                onClick={() => handleDeleteClick(etudiant.Matricule)}
                              >
                                <MdDeleteOutline />
                              </button>
                            </>
                          ) : (
                            <>
                              -
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination-container">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'blue',
                    },
                    '& .MuiPaginationItem-page.Mui-selected': {
                      backgroundColor: 'rgba(44, 15, 188, 0.91)',
                      color: 'white',
                    },
                    '& .MuiPaginationItem-page:hover': {
                      backgroundColor: 'rgba(55, 17, 248, 0.1)',
                    }
                  }}
                  showFirstButton
                  showLastButton
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="footer-text">
            <p>&copy; 2025 Gestion des paiements de bourses des étudiants | Tous droits réservés.</p>
          </div>
          <div className="footer-iconTop">
            <a onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <GoMoveToTop />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ComEtudiants;