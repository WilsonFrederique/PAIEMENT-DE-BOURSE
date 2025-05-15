import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Pagination
} from '@mui/material';
import NavBar from "../../../NavBar/NavBar";
import "./ComPayer.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaRegEye, FaEdit } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { 
  getAllPaiements, 
  deletePaiement,
  Paiement 
} from "../../../services/paiement_api";

const ComPayer = () => {
  const navigate = useNavigate();
  const [activeCrumb, setActiveCrumb] = useState("payer");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [paiementToDelete, setPaiementToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // Charger les paiements
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllPaiements();
        setPaiements(data);
      } catch (error) {
        console.error("Erreur lors du chargement des paiements:", error);
        toast.error("Erreur lors du chargement des paiements");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Gestion de la suppression
  const handleDeleteClick = (idPaiement: number) => {
    setPaiementToDelete(idPaiement);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!paiementToDelete) return;
    
    try {
      await deletePaiement(paiementToDelete);
      toast.success("Paiement supprimé avec succès");
      // Recharger la liste après suppression
      const data = await getAllPaiements();
      setPaiements(data);
    } catch (error) {
      console.error("Erreur lors de la suppression du paiement:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression");
    } finally {
      setOpenDeleteDialog(false);
      setPaiementToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setPaiementToDelete(null);
  };

  const handleCrumbClick = (path: string, crumbName: string) => {
    setActiveCrumb(crumbName);
    navigate(path);
    localStorage.setItem('activeSidebarItem', crumbName === "accueil" ? "acceuil" : crumbName);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' - ' + date.toLocaleTimeString('fr-FR');
  };

  // Filtrage des données
  const filteredPaiements = paiements.filter(paiement =>
    Object.values(paiement).some(value =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredPaiements.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPaiements = filteredPaiements.slice(indexOfFirstItem, indexOfLastItem);

  // Créer un tableau avec toujours 10 éléments
  const displayData = [...currentPaiements];
  while (displayData.length < itemsPerPage) {
    displayData.push({} as Paiement);
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
          Êtes-vous sûr de vouloir supprimer ce paiement ?
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
              <h3 className="h3-title">Paiements</h3>
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
                  className={`breadcrumb-step ${activeCrumb === "payer" ? "active" : ""}`}
                  onClick={() => handleCrumbClick("/payer", "payer")}
                >
                  <a 
                    href="#" 
                    className="breadcrumb-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MdOutlinePayment className="breadcrumb-icon" />
                    <span className="active-txt">Paiements</span>
                  </a>
                </li>
              </ol>
            </nav>
          </div>

          {/* Table */}
          <div className="detailDonnee">
            <div className="recentOrders">
              <div className="title-table">
                <h3 className="h3-title-table">Liste des paiements</h3>
                <div className="action-title">
                  <a href="/frmPayer"><button><IoMdAdd />Ajouter</button></a>
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
              <div className="table">
                <table className="table-moderne">
                  <thead className="thead-moderne">
                    <tr className="tr-moderne">
                      <th>Num compte</th>
                      <th>Matricule</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Année universitaire</th>
                      <th>Date et heure</th>
                      <th>Nombre de mois</th>
                      <th className="action">Action</th>
                    </tr>
                  </thead>
                  <tbody className="tbody-moderne">
                    {displayData.map((paiement, index) => (
                      <tr key={paiement?.idPaiement || `empty-${index}`} className="tr-moderne">
                        <td>{paiement?.NumeroCompte || '-'}</td>
                        <td>{paiement?.Matricule || '-'}</td>
                        <td>{paiement?.Nom || '-'}</td>
                        <td>{paiement?.Prenom || '-'}</td>
                        <td>{paiement?.AnneeUniversitaire || '-'}</td>
                        <td>{paiement?.DateHeur ? formatDate(paiement.DateHeur) : '-'}</td>
                        <td>{paiement?.NombreMois || '-'}</td>
                        <td className="action-td">
                          {paiement?.idPaiement ? (
                            <>
                              <button 
                                className="btn-detail"
                                onClick={() => navigate(`/detailPayer/${paiement.idPaiement}`)}
                                aria-label="Voir les détails"
                              >
                                <FaRegEye className="eye-icon" />
                              </button>
                              <button 
                                className="btn-edit"
                                onClick={() => navigate(`/modifierFrmPayer/${paiement.idPaiement}`)}
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="btn-delete"
                                onClick={() => handleDeleteClick(paiement.idPaiement)}
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

export default ComPayer;