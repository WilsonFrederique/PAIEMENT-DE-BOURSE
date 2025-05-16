import React, { useState, useEffect, useRef } from "react";
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
import { ImPrinter } from "react-icons/im";
import { 
  getAllPaiements, 
  deletePaiement,
  getPaiement,
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
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [showPrintView, setShowPrintView] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any[]>([]);
  const printRef = useRef<HTMLDivElement>(null);
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

  // Gestion de l'impression
  const handlePrint = () => {
    if (!printRef.current) return;
    
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    
    // Recharger la page pour restaurer le comportement normal
    window.location.reload();
  };

  const handlePrintClick = async (idPaiement: number) => {
    try {
      // Récupérer les détails complets du paiement
      const paiement = await getPaiement(idPaiement);
      
      // Vérifier si les montants sont définis, sinon utiliser des valeurs par défaut
      const paiementWithDefaults = {
        ...paiement,
        MontantEquipement: paiement.Equipement ?? 0,
        MontantMensuel: paiement.montantMensuel ?? 0
      };
      
      setSelectedPaiement(paiementWithDefaults);
      
      // Simuler les détails des mois payés
      const details = [];
      if (paiementWithDefaults.DateHeur && paiementWithDefaults.NombreMois > 0) {
        const months = generatePaymentMonths(paiementWithDefaults.DateHeur, paiementWithDefaults.NombreMois);
        months.forEach(month => {
          details.push({
            mois: month,
            montant: paiementWithDefaults.MontantMensuel
          });
        });
      }
      
      setPaymentDetails(details);
      setShowPrintView(true);
    } catch (error) {
      console.error("Erreur lors de la récupération du paiement:", error);
      toast.error("Erreur lors de la récupération du paiement");
    }
  };

  // Générer les mois de paiement avec année
  const generatePaymentMonths = (dateString: string, numberOfMonths: number) => {
    if (!dateString || !numberOfMonths || numberOfMonths <= 0) return [];
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return [];
    
    const months = [];
    const monthNames = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    
    for (let i = 0; i < numberOfMonths; i++) {
      const currentDate = new Date(date);
      currentDate.setMonth(date.getMonth() - i);
      const monthName = monthNames[currentDate.getMonth()];
      const year = currentDate.getFullYear();
      months.push(`${monthName} ${year}`);
    }
    
    return months.reverse();
  };

  // Calcul du total
  const calculateTotal = () => {
    if (!selectedPaiement) return 0;
    
    const equipement = selectedPaiement.MontantEquipement || 0;
    const mensuel = selectedPaiement.MontantMensuel || 0;
    const nbMois = selectedPaiement.NombreMois || 0;
    
    return equipement + (nbMois * mensuel);
  };

  // Formater les montants
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant);
  };

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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('fr-FR');
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
        <div className="Nav bar">
          <NavBar />
        </div>

        <div className="container-container">
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

              {/* Modale d'impression */}
              {showPrintView && selectedPaiement && (
                <div className="modal-overlay" onClick={() => setShowPrintView(false)}>
                  <div 
                    className="print-modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="print-modal-header">
                      <h2>Reçu de Paiement</h2>
                      <button 
                        className="close-modal-btn" 
                        onClick={() => setShowPrintView(false)}
                      >
                        &times;
                      </button>
                    </div>
                    
                    <div className="papier">
                      <div className="vrais-imprimer" ref={printRef}>
                        <div className="header">
                          <h2>Aujourd'hui le <b>{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</b></h2>
                        </div>
                        
                        <div className="student-info">
                          <p><strong>Matricule :</strong> {selectedPaiement.Matricule || 'N/A'}</p>
                          <p><strong>{selectedPaiement.Nom} {selectedPaiement.Prenom}</strong></p>
                          <p><strong>Née le :</strong> {selectedPaiement.Naissance ? formatDate(selectedPaiement.Naissance) : 'N/A'}</p>
                          <p><strong>Sexe :</strong> {selectedPaiement.Sexe || 'N/A'}</p>
                          <p><strong>Institution :</strong> {selectedPaiement.Etablissement || 'N/A'} / <strong>Niveau :</strong> {selectedPaiement.Niveau || 'N/A'}</p>
                        </div>
                        
                        <table>
                          <thead>
                            <tr>
                              <th className="th">Mois</th>
                              <th className="th">Montant (Ar)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedPaiement.MontantEquipement > 0 && (
                              <tr>
                                <td className="td">Equipement</td>
                                <td className="td">{formatMontant(selectedPaiement.MontantEquipement)}</td>
                              </tr>
                            )}
                            {paymentDetails.map((detail, index) => (
                              <tr key={index}>
                                <td className="td">{detail.mois}</td>
                                <td className="td">{formatMontant(detail.montant)}</td>
                              </tr>
                            ))}
                            <tr>
                              <td className="td"><strong>Total</strong></td>
                              <td className="td"><strong>{formatMontant(calculateTotal())}</strong></td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <div className="total">
                          Total Payé : {formatMontant(calculateTotal())} Ariary
                        </div>
                      </div>
                      
                      <div className="print-actions">
                        <button onClick={handlePrint}>Imprimer</button>
                        <button onClick={() => setShowPrintView(false)}>Fermer</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="table">
                <table className="table-moderne">
                  <thead className="thead-moderne">
                    <tr className="tr-moderne">
                      <th>Num compte</th>
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
                        <td>{paiement?.Nom || '-'}</td>
                        <td>{paiement?.Prenom || '-'}</td>
                        <td>{paiement?.AnneeUniversitaire || '-'}</td>
                        <td>{paiement?.DateHeur ? formatDate(paiement.DateHeur) : '-'}</td>
                        <td>{paiement?.NombreMois || '-'}</td>
                        <td className="action-td">
                          {paiement?.idPaiement ? (
                            <>
                              <button 
                                className="btn-imprimer"
                                onClick={() => handlePrintClick(paiement.idPaiement)}
                                aria-label="Imprimer le reçu"
                              >
                                <ImPrinter className="eye-icon" />
                              </button>
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
                            <>-</>
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