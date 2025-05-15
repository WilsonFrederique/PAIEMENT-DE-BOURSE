import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { BiMoney } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

import { getAllMontants, deleteMontant } from "../../../services/montant_api";
import type { Montant } from "../../../services/montant_api";

import NavBar from "../../../NavBar/NavBar";

const ComMontants = () => {
  const navigate = useNavigate();
  const [activeCrumb, setActiveCrumb] = useState("montant");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [montants, setMontants] = useState<Montant[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [montantToDelete, setMontantToDelete] = useState<string | null>(null);
  const itemsPerPage = 5;

  // Charger les montants
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllMontants();
        setMontants(data);
      } catch (error) {
        console.error("Erreur lors du chargement des montants :", error);
        toast.error("Erreur lors du chargement des montants");
      }
    };
    fetchData();
  }, []);

  // Gestion de la suppression
  const handleDeleteClick = (idMontant: string) => {
    setMontantToDelete(idMontant);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!montantToDelete) return;
    
    try {
      await deleteMontant(montantToDelete);
      toast.success("Montant supprimé avec succès");
      // Recharger la liste après suppression
      const data = await getAllMontants();
      setMontants(data);
    } catch (error) {
      console.error("Erreur lors de la suppression du montant :", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression");
    } finally {
      setOpenDeleteDialog(false);
      setMontantToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setMontantToDelete(null);
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
  const filteredMontants = montants.filter(montant =>
    Object.values(montant).some(value =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredMontants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMontants = filteredMontants.slice(indexOfFirstItem, indexOfLastItem);

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
          Êtes-vous sûr de vouloir supprimer ce montant ?
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
              <h3 className="h3-title">Montants</h3>
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
                  className={`breadcrumb-step ${activeCrumb === "parametres" ? "active" : ""}`}
                  onClick={() => handleCrumbClick("/parametre", "parametres")}
                >
                  <a 
                    href="#" 
                    className="breadcrumb-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <RiHomeLine className="breadcrumb-icon" />
                    <span>Paramètres</span>
                  </a>
                </li>
                <li 
                  className={`breadcrumb-step ${activeCrumb === "montant" ? "active" : ""}`}
                  onClick={() => handleCrumbClick("/montant", "montant")}
                >
                  <a 
                    href="#" 
                    className="breadcrumb-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <BiMoney className="breadcrumb-icon" />
                    <span className="active-txt">Montants</span>
                  </a>
                </li>
              </ol>
            </nav>
          </div>

          {/* Table */}
          <div className="detailDonnee">
            <div className="recentOrders">
              <div className="title-table">
                <h3 className="h3-title-table">Liste des montants</h3>
                <div className="action-title">
                  <a href="/frmMontant"><button><IoMdAdd /> Ajouter</button></a>
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
                      <th>ID Montant</th>
                      <th>Niveau</th>
                      <th>Montant</th>
                      <th>Équipement</th>
                      <th className="action">Action</th>
                    </tr>
                  </thead>
                  <tbody className="tbody-moderne">
                    {currentMontants.map((montant) => (
                      <tr key={montant.idMontant} className="tr-moderne">
                        <td>{montant.idMontant}</td>
                        <td>{montant.Niveau || montant.idNiveau}</td>
                        <td>{montant.Montant}</td>
                        <td>{montant.Equipement}</td>
                        <td className="action-td">
                          <a 
                            href={`/modifierFrmMontant/${montant.idMontant}`}
                            className="btn-edit"
                          >
                            <FaEdit />
                          </a>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleDeleteClick(montant.idMontant)}
                          >
                            <MdDeleteOutline />
                          </button>
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

export default ComMontants;