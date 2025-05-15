import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import SidBar from '../../../SidBar/SidBar'
import "./FrmPayer.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { LuUserRoundPlus } from "react-icons/lu";
import { createPaiement, getPaiement, updatePaiement, getPaiementsByNumCompte } from "../../../services/paiement_api";
import { getAllNumComptes } from "../../../services/tablenumcompte_api";
import type { NumCompte, Paiement } from "../../../services/paiement_api";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

interface FormData {
  idNumCompte: number;
  AnneeUniversitaire: string;
  DateHeur: string;
  NombreMois: number;
}

interface Conflict {
  date: string;
  mois: string;
  idPaiement?: number;
  anneeUniversitaire: string;
}

const FrmPayer = () => {
    const navigate = useNavigate();
    const { idPaiement } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeCrumb, setActiveCrumb] = useState("payer");
    const [formData, setFormData] = useState<FormData>({
      idNumCompte: 0,
      AnneeUniversitaire: getDefaultAnneeUniversitaire(),
      DateHeur: new Date().toISOString().slice(0, 16),
      NombreMois: 1
    });
    const [originalData, setOriginalData] = useState<FormData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [numComptes, setNumComptes] = useState<NumCompte[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [filteredNumComptes, setFilteredNumComptes] = useState<NumCompte[]>([]);
    const [selectedCompte, setSelectedCompte] = useState<NumCompte | null>(null);
    const [conflitsPaiement, setConflitsPaiement] = useState<Conflict[]>([]);
    const [hasConflits, setHasConflits] = useState(false);

    function getDefaultAnneeUniversitaire() {
      const currentYear = new Date().getFullYear();
      return `${currentYear - 1}-${currentYear}`;
    }

    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const getMonthName = (monthIndex: number) => {
      const months = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
      ];
      return months[monthIndex];
    };

    useEffect(() => {
      const fetchNumComptes = async () => {
        try {
          const data = await getAllNumComptes();
          setNumComptes(data);
          setFilteredNumComptes(data);
        } catch (error) {
          console.error("Erreur lors du chargement des numéros de compte :", error);
          toast.error("Erreur lors du chargement des numéros de compte");
        }
      };
      fetchNumComptes();
    }, []);

    useEffect(() => {
      const checkConflitsPaiement = async () => {
        if (!formData.idNumCompte || !formData.DateHeur || !formData.NombreMois || !formData.AnneeUniversitaire) {
          setConflitsPaiement([]);
          setHasConflits(false);
          return;
        }

        try {
          const paiements = await getPaiementsByNumCompte(formData.idNumCompte);
          const nouvelleDate = new Date(formData.DateHeur);
          const nbMois = formData.NombreMois;
          
          const moisConcernes: Date[] = [];
          for (let i = 0; i < nbMois; i++) {
            const date = new Date(nouvelleDate);
            date.setMonth(date.getMonth() - i);
            moisConcernes.push(date);
          }
          
          const conflits: Conflict[] = [];
          
          paiements.forEach(p => {
            // Ignorer le paiement actuel en mode édition
            if (isEditMode && p.idPaiement === Number(idPaiement)) return;
            
            if (!p.DateHeur || p.AnneeUniversitaire !== formData.AnneeUniversitaire) return;
            
            const datePaiementExist = new Date(p.DateHeur);
            const nbMoisExist = p.NombreMois;
            
            for (let i = 0; i < nbMoisExist; i++) {
              const dateExist = new Date(datePaiementExist);
              dateExist.setMonth(dateExist.getMonth() - i);
              
              const existeConflit = moisConcernes.some(m => 
                m.getMonth() === dateExist.getMonth() && 
                m.getFullYear() === dateExist.getFullYear()
              );
              
              if (existeConflit) {
                const dateStr = formatDate(dateExist);
                const moisStr = `${getMonthName(dateExist.getMonth())} ${dateExist.getFullYear()}`;
                
                if (!conflits.some(c => c.date === dateStr)) {
                  conflits.push({
                    date: dateStr,
                    mois: moisStr,
                    idPaiement: p.idPaiement,
                    anneeUniversitaire: p.AnneeUniversitaire
                  });
                }
              }
            }
          });
          
          setConflitsPaiement(conflits);
          setHasConflits(conflits.length > 0);
          
          if (conflits.length > 0) {
            let message = "Conflit de paiement pour les mois : ";
            const moisConflits = conflits.map(c => c.mois);
            
            if (moisConflits.length <= 3) {
              message += moisConflits.join(", ");
            } else {
              message += `${moisConflits.slice(0, 3).join(", ")} et ${moisConflits.length - 3} autres`;
            }
            
            toast.warning(message, {
              autoClose: 8000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
          
        } catch (error) {
          console.error("Erreur lors de la vérification des conflits:", error);
          setConflitsPaiement([]);
          setHasConflits(false);
        }
      };
      
      checkConflitsPaiement();
    }, [formData.idNumCompte, formData.DateHeur, formData.NombreMois, formData.AnneeUniversitaire, idPaiement, isEditMode]);

    useEffect(() => {
      if (idPaiement) {
        const fetchPaiementData = async () => {
          try {
            const paiementData = await getPaiement(Number(idPaiement));
            setFormData({
              idNumCompte: paiementData.idNumCompte,
              AnneeUniversitaire: paiementData.AnneeUniversitaire,
              DateHeur: paiementData.DateHeur ? 
                new Date(paiementData.DateHeur).toISOString().slice(0, 16) : 
                new Date().toISOString().slice(0, 16),
              NombreMois: paiementData.NombreMois
            });
            setOriginalData({
              idNumCompte: paiementData.idNumCompte,
              AnneeUniversitaire: paiementData.AnneeUniversitaire,
              DateHeur: paiementData.DateHeur ? 
                new Date(paiementData.DateHeur).toISOString().slice(0, 16) : 
                new Date().toISOString().slice(0, 16),
              NombreMois: paiementData.NombreMois
            });
            setIsEditMode(true);
            
            const compte = numComptes.find(c => c.idNumCompte === paiementData.idNumCompte);
            if (compte) {
              setSelectedCompte(compte);
              setSearchInput(`${compte.NumeroCompte} - ${compte.Matricule} (${compte.Nom} ${compte.Prenom})`);
            }
          } catch (error) {
            console.error("Erreur lors du chargement du paiement :", error);
            toast.error("Erreur lors du chargement du paiement");
          }
        };
        fetchPaiementData();
      }
    }, [idPaiement, numComptes]);

    useEffect(() => {
      if (searchInput) {
        const filtered = numComptes.filter(compte => 
          `${compte.NumeroCompte} - ${compte.Matricule} (${compte.Nom} ${compte.Prenom})`
            .toLowerCase()
            .includes(searchInput.toLowerCase())
        );
        setFilteredNumComptes(filtered);
      } else {
        setFilteredNumComptes(numComptes);
      }
    }, [searchInput, numComptes]);

    const handleCrumbClick = (path: string, crumbName: string) => {
        setActiveCrumb(crumbName);
        navigate(path);
        localStorage.setItem(
        "activeSidebarItem",
        crumbName === "accueil" ? "acceuil" : crumbName
        );
    };

    const handleNumCompteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchInput(value);
      
      if (!value) {
        setSelectedCompte(null);
        setFormData(prev => ({ ...prev, idNumCompte: 0 }));
      }
    };

    const handleSelectCompte = (compte: NumCompte) => {
      setSelectedCompte(compte);
      setSearchInput(`${compte.NumeroCompte} - ${compte.Matricule} (${compte.Nom} ${compte.Prenom})`);
      setFormData(prev => ({ ...prev, idNumCompte: compte.idNumCompte }));
      setFilteredNumComptes(numComptes);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [id]: id === 'NombreMois' ? Number(value) : value
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      if (!formData.idNumCompte || !formData.AnneeUniversitaire || !formData.NombreMois || !formData.DateHeur) {
        toast.error("Tous les champs sont obligatoires");
        setLoading(false);
        return;
      }

      const anneeRegex = /^\d{4}-\d{4}$/;
      if (!anneeRegex.test(formData.AnneeUniversitaire)) {
        toast.error("Format d'année universitaire invalide (doit être AAAA-AAAA)");
        setLoading(false);
        return;
      }

      if (formData.NombreMois < 1 || formData.NombreMois > 12) {
        toast.error("Le nombre de mois doit être entre 1 et 12");
        setLoading(false);
        return;
      }

      if (hasConflits) {
        toast.error(
          <div>
            <h4>Conflits détectés</h4>
            <p>Il existe des conflits avec des paiements existants pour l'année {formData.AnneeUniversitaire}:</p>
            <ul>
              {conflitsPaiement.slice(0, 3).map((conflit, index) => (
                <li key={index}>
                  {conflit.date} ({conflit.mois}) {conflit.idPaiement && `- Paiement #${conflit.idPaiement}`}
                </li>
              ))}
              {conflitsPaiement.length > 3 && (
                <li>et {conflitsPaiement.length - 3} autres conflits...</li>
              )}
            </ul>
            <p>Veuillez ajuster la date, le nombre de mois ou l'année universitaire avant de soumettre.</p>
          </div>,
          {
            autoClose: false,
            closeOnClick: false,
            draggable: false,
          }
        );
        setLoading(false);
        return;
      }

      if (isEditMode) {
        if (originalData && 
            formData.idNumCompte === originalData.idNumCompte &&
            formData.AnneeUniversitaire === originalData.AnneeUniversitaire &&
            formData.NombreMois === originalData.NombreMois &&
            formData.DateHeur === originalData.DateHeur) {
          toast.info("Aucune modification détectée");
          setLoading(false);
          return;
        }
        
        setOpenConfirmDialog(true);
      } else {
        await createNewPaiement();
      }
      setLoading(false);
    };

    const createNewPaiement = async () => {
        try {
            const dateObj = new Date(formData.DateHeur);
            const formattedDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');

            const dataToSend = {
              idNumCompte: formData.idNumCompte,
              AnneeUniversitaire: formData.AnneeUniversitaire,
              DateHeur: formattedDate,
              NombreMois: formData.NombreMois
            };

            await createPaiement(dataToSend);
            
            toast.success(
              <div>
                <h4>Paiement enregistré avec succès</h4>
                <div style={{ marginTop: '10px' }}>
                  <p><strong>Date:</strong> {new Date(formData.DateHeur).toLocaleString('fr-FR')}</p>
                  <p><strong>Numéro de compte:</strong> {selectedCompte?.NumeroCompte}</p>
                  <p><strong>Étudiant:</strong> {selectedCompte?.Nom} {selectedCompte?.Prenom}</p>
                  <p><strong>Année universitaire:</strong> {formData.AnneeUniversitaire}</p>
                  <p><strong>Nombre de mois:</strong> {formData.NombreMois}</p>
                </div>
              </div>,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                onClose: () => navigate("/payer")
              }
            );
            
        } catch (err) {
            console.error("Erreur lors de la création du paiement:", err);
            toast.error(
              <div>
                <h4>Erreur lors de l'enregistrement</h4>
                <p>{err instanceof Error ? err.message : "Une erreur inattendue est survenue"}</p>
              </div>,
              {
                position: "top-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              }
            );
        }
    };

    const updateExistingPaiement = async () => {
      try {
        const dateObj = new Date(formData.DateHeur);
        const formattedDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');

        const dataToSend = {
          AnneeUniversitaire: formData.AnneeUniversitaire,
          DateHeur: formattedDate,
          NombreMois: formData.NombreMois
        };

        await updatePaiement(Number(idPaiement), dataToSend);
        
        toast.success(
          <div>
            <h4>Paiement modifié avec succès</h4>
            <div style={{ marginTop: '10px' }}>
              <p><strong>Nouvelle date:</strong> {new Date(formData.DateHeur).toLocaleString('fr-FR')}</p>
              <p><strong>Ancienne date:</strong> {originalData?.DateHeur ? new Date(originalData.DateHeur).toLocaleString('fr-FR') : '-'}</p>
              <p><strong>Numéro de compte:</strong> {selectedCompte?.NumeroCompte}</p>
              <p><strong>Année universitaire:</strong> {formData.AnneeUniversitaire}</p>
              <p><strong>Nombre de mois:</strong> {formData.NombreMois}</p>
            </div>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            onClose: () => navigate("/payer")
          }
        );
        
      } catch (err) {
        console.error("Erreur lors de la modification du paiement:", err);
        toast.error(
          <div>
            <h4>Erreur lors de la modification</h4>
            <p>{err instanceof Error ? err.message : "Une erreur inattendue est survenue"}</p>
          </div>,
          {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      }
    };

    const handleConfirmUpdate = async () => {
      setOpenConfirmDialog(false);
      await updateExistingPaiement();
    };

    const handleCancelUpdate = () => {
      setOpenConfirmDialog(false);
    };

    const handleCancel = () => {
      navigate("/payer");
    };

    return (
        <div className="container">
            <SidBar />
            <div className="main">
                <div className="Nav bar">
                    <NavBar />
                </div>

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
                    open={openConfirmDialog}
                    onClose={handleCancelUpdate}
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
                        {originalData && (
                            <span>
                                <p>Êtes-vous sûr de vouloir modifier ce paiement ?</p>
                                <p><strong>Modifications :</strong></p>
                                <p>Année universitaire: {originalData.AnneeUniversitaire} → {formData.AnneeUniversitaire}</p>
                                <p>Date: {originalData.DateHeur ? new Date(originalData.DateHeur).toLocaleString('fr-FR') : '-'} → {new Date(formData.DateHeur).toLocaleString('fr-FR')}</p>
                                <p>Nombre de mois: {originalData.NombreMois} → {formData.NombreMois}</p>
                            </span>
                        )}
                    </DialogTitle>
                    <DialogActions>
                        <Button className="cancel-btn" onClick={handleCancelUpdate}>
                            Annuler
                        </Button>
                        <Button className="confirm-btn" onClick={handleConfirmUpdate} autoFocus>
                            Confirmer
                        </Button>
                    </DialogActions>
                </Dialog>

                <div className="container-container">
                    <div className="breadcrumb-container">
                        <div>
                            <h3 className="h3-title">
                              {isEditMode ? "Modifier Paiement" : "Ajout Paiement"}
                            </h3>
                        </div>
                        <nav className="breadcrumb-nav">
                            <ol className="breadcrumb-path">
                                <li
                                    className={`breadcrumb-step ${
                                        activeCrumb === "accueil" ? "active" : ""
                                    }`}
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
                                    className={`breadcrumb-step ${
                                        activeCrumb === "payerliste" ? "active" : ""
                                    }`}
                                    onClick={() => handleCrumbClick("/payer", "payerliste")}
                                    >
                                    <a
                                        href="#"
                                        className="breadcrumb-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <FaRegUser className="breadcrumb-icon" />
                                        <span>Paiements</span>
                                    </a>
                                </li>
                                <li
                                    className={`breadcrumb-step ${
                                        activeCrumb === "payer" ? "active" : ""
                                    }`}
                                    onClick={() => handleCrumbClick("/frmPayer", "payer")}
                                    >
                                    <a
                                        href="#"
                                        className="breadcrumb-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <LuUserRoundPlus className="breadcrumb-icon" />
                                        <span className="active-txt">
                                          {isEditMode ? "Modification" : "Ajout"}
                                        </span>
                                    </a>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <div className="detailDonnee">
                        <div className="frm">
                            <h2 className="form-title">
                                {isEditMode ? "Modification de Paiement" : "Ajout de Paiement"}
                            </h2>
                            
                            <form className="modern-form" onSubmit={handleSubmit}>

                                {/* CONFLIT  */}
                                {conflitsPaiement.length > 0 && (
                                    <div className={`conflicts-details conflit-color ${hasConflits ? 'has-conflicts' : ''}`}>
                                        <p>Mois en conflit pour l'année {formData.AnneeUniversitaire}:</p>
                                        <ul>
                                            {conflitsPaiement.slice(0, 5).map((conflit, index) => (
                                                <li key={index}>
                                                    {conflit.date} ({conflit.mois}) 
                                                    {conflit.idPaiement && ` - Paiement #${conflit.idPaiement}`}
                                                </li>
                                            ))}
                                            {conflitsPaiement.length > 5 && (
                                                <li>et {conflitsPaiement.length - 5} autres...</li>
                                            )}
                                        </ul>
                                        {!isEditMode ? (
                                            <p className="conflict-warning">
                                                Ce compte a déjà des paiements pour ces mois à l'année {formData.AnneeUniversitaire}. 
                                                Veuillez ajuster la date, le nombre de mois ou l'année universitaire.
                                            </p>
                                        ) : (
                                            <p className="conflict-warning">
                                                Attention : Cette modification crée des conflits avec des paiements existants pour l'année {formData.AnneeUniversitaire}.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Nbr mois et Date paiment  */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="NombreMois" className="form-label">
                                            Nombre de mois
                                        </label>
                                        <input
                                            type="number"
                                            id="NombreMois"
                                            className="form-input"
                                            placeholder="Nombre de mois payés"
                                            value={formData.NombreMois || ''}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="12"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="DateHeur" className="form-label">
                                            Date de paiement
                                        </label>
                                        <input
                                            type="datetime-local"
                                            id="DateHeur"
                                            className="form-input"
                                            value={formData.DateHeur}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>                              
                                </div>                                

                                {/* NumCompte et AnnéeUniver  */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="idNumCompte" className="form-label">
                                            Numéro de compte
                                        </label>
                                        <div className="custom-select-container">
                                            <input
                                                type="text"
                                                id="idNumCompte"
                                                className="form-input"
                                                value={searchInput}
                                                onChange={handleNumCompteChange}
                                                placeholder="Rechercher un numéro de compte..."
                                                disabled={isEditMode}
                                                required
                                            />
                                            {!isEditMode && searchInput && filteredNumComptes.length > 0 && (
                                                <ul className="custom-select-dropdown">
                                                    {filteredNumComptes.map(compte => (
                                                        <li 
                                                            key={compte.idNumCompte} 
                                                            onClick={() => handleSelectCompte(compte)}
                                                        >
                                                            {compte.NumeroCompte} - {compte.Matricule} ({compte.Nom} {compte.Prenom})
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="AnneeUniversitaire" className="form-label">
                                            Année universitaire
                                        </label>
                                        <input
                                            type="text"
                                            id="AnneeUniversitaire"
                                            className="form-input"
                                            value={formData.AnneeUniversitaire}
                                            onChange={handleInputChange}
                                            pattern="\d{4}-\d{4}"
                                            title="Format: AAAA-AAAA (ex: 2023-2024)"
                                            placeholder="AAAA-AAAA"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                {/* Btns  */}
                                <div className="form-actions">
                                    <button 
                                        type="button" 
                                        className="btn cancel-btn"
                                        onClick={handleCancel}
                                        disabled={loading}
                                    >
                                        Annuler
                                    </button>
                                    
                                    <button 
                                      type="submit" 
                                      className="btn submit-btn"
                                      disabled={loading || hasConflits}
                                    >
                                        {loading ? "En cours..." : (isEditMode ? "Modifier" : "Enregistrer")}
                                    </button>
                                </div>
                                
                            </form>
                        </div>
                    </div>
                </div>

                <footer className="footer">
                    <div className="footer-text">
                        <p>
                        &copy; 2025 Gestion des paiements de bourses des étudiants | Tous
                        droits réservés.
                        </p>
                    </div>
                    <div className="footer-iconTop">
                        <a onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        <GoMoveToTop />
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default FrmPayer;