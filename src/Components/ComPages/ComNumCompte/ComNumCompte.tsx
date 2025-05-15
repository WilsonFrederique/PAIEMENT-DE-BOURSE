import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { PiCreditCardBold } from "react-icons/pi";
import { IoMdAdd } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

import { getAllNumComptes, deleteNumCompte, type NumCompte } from "../../../services/tablenumcompte_api";
import NavBar from "../../../NavBar/NavBar";

const ComNumCompte = () => {
  const navigate = useNavigate();
  const [activeCrumb, setActiveCrumb] = useState("compte");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [numComptes, setNumComptes] = useState<NumCompte[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [numCompteToDelete, setNumCompteToDelete] = useState<number | null>(null);
  const itemsPerPage = 5;

  // Charger les numéros de compte
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllNumComptes();
        setNumComptes(data);
      } catch (error) {
        console.error("Erreur lors du chargement des numéros de compte :", error);
        toast.error("Erreur lors du chargement des numéros de compte");
      }
    };
    fetchData();
  }, []);

  // Gestion de la suppression
  const handleDeleteClick = (idNumCompte: number) => {
    setNumCompteToDelete(idNumCompte);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (numCompteToDelete === null) return;
    
    try {
      await deleteNumCompte(numCompteToDelete);
      toast.success("Numéro de compte supprimé avec succès");
      // Recharger la liste après suppression
      const data = await getAllNumComptes();
      setNumComptes(data);
    } catch (error) {
      console.error("Erreur lors de la suppression du numéro de compte :", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression");
    } finally {
      setOpenDeleteDialog(false);
      setNumCompteToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setNumCompteToDelete(null);
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
  const filteredNumComptes = numComptes.filter(numCompte =>
    Object.values(numCompte).some(value =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredNumComptes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNumComptes = filteredNumComptes.slice(indexOfFirstItem, indexOfLastItem);

  // Nombre de lignes vides à afficher
  const emptyRowsCount = itemsPerPage - currentNumComptes.length;

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
          Êtes-vous sûr de vouloir supprimer ce numéro de compte ?
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
              <h3 className="h3-title">Numéros de compte</h3>
            </div>
            <nav className="breadcrumb-nav">
              <ol className="breadcrumb-path">
                <li 
                  className={`breadcrumb-step ${activeCrumb === "accueil" ? "active" : ""}`}
                  onClick={() => handleCrumbClick("/dashbord", "accueil")}
                >
                  <a href="#" className="breadcrumb-link" onClick={e => e.preventDefault()}>
                    <RiHomeLine className="breadcrumb-icon" />
                    <span>Accueil</span>
                  </a>
                </li>
                <li 
                  className={`breadcrumb-step ${activeCrumb === "compte" ? "active" : ""}`}
                  onClick={() => handleCrumbClick("/numeroCompte", "compte")}
                >
                  <a href="#" className="breadcrumb-link" onClick={e => e.preventDefault()}>
                    <PiCreditCardBold className="breadcrumb-icon" />
                    <span className="active-txt">Numéros de compte</span>
                  </a>
                </li>
              </ol>
            </nav>
          </div>

          {/* Table */}
          <div className="detailDonnee">
            <div className="recentOrders">
              <div className="title-table">
                <h3 className="h3-title-table">Liste des numéros de compte</h3>
                <div className="action-title">
                  <a href="/frmNumCompte">
                    <button><IoMdAdd /> Ajouter</button>
                  </a>
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
              <div className="tableMontant">
                <table className="table-moderne">
                  <thead className="thead-moderne">
                    <tr className="tr-moderne">
                      <th>Matricule</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Numéro de compte</th>
                      <th className="action">Action</th>
                    </tr>
                  </thead>
                  <tbody className="tbody-moderne">
                    {currentNumComptes.map((numCompte) => (
                      <tr key={numCompte.idNumCompte} className="tr-moderne">
                        <td>{numCompte.Matricule}</td>
                        <td>{numCompte.Nom}</td>
                        <td>{numCompte.Prenom}</td>
                        <td>{numCompte.NumeroCompte}</td>
                        <td className="action-td">
                          <a href={`/modifierFrmNumCompte/${numCompte.idNumCompte}`} className="btn-edit">
                            <FaEdit />
                          </a>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleDeleteClick(numCompte.idNumCompte!)}
                          >
                            <MdDeleteOutline />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Lignes « vides » pour compléter jusqu'à itemsPerPage */}
                    {emptyRowsCount > 0 && Array.from({ length: emptyRowsCount }).map((_, idx) => (
                      <tr key={`empty-${idx}`} className="tr-moderne">
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
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

export default ComNumCompte;
