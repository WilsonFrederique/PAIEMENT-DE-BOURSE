import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import SidBar from '../../../SidBar/SidBar'
import "./FrmMontant.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { LuUserRoundPlus } from "react-icons/lu";
import { createMontant, getMontant, updateMontant, checkMontantExists } from "../../../services/montant_api";
import { getAllNiveaux } from "../../../services/niveaux_api";
import type { Montant } from "../../../services/montant_api";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

interface FormData {
  idMontant: string;
  idNiveau: string;
  Montant: number;
  Equipement: number;
}

const FrmMontant = () => {
    const navigate = useNavigate();
    const { idMontant } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeCrumb, setActiveCrumb] = useState("montant");
    const [formData, setFormData] = useState<FormData>({
      idMontant: '',
      idNiveau: '',
      Montant: 0,
      Equipement: 65000 // Valeur par défaut définie ici
    });
    const [originalData, setOriginalData] = useState<FormData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [niveaux, setNiveaux] = useState<{idNiveau: string, Niveau: string}[]>([]);
    const [idExists, setIdExists] = useState(false);
    const [checkingId, setCheckingId] = useState(false);

    // Charger les niveaux pour le select
    useEffect(() => {
      const fetchNiveaux = async () => {
        try {
          const data = await getAllNiveaux();
          setNiveaux(data);
        } catch (error) {
          console.error("Erreur lors du chargement des niveaux :", error);
          toast.error("Erreur lors du chargement des niveaux");
        }
      };
      fetchNiveaux();
    }, []);

    // Charger les données du montant si en mode édition
    useEffect(() => {
      if (idMontant) {
        const fetchMontantData = async () => {
          try {
            const montantData = await getMontant(idMontant);
            setFormData({
              idMontant: montantData.idMontant,
              idNiveau: montantData.idNiveau,
              Montant: montantData.Montant,
              Equipement: montantData.Equipement
            });
            setOriginalData({
              idMontant: montantData.idMontant,
              idNiveau: montantData.idNiveau,
              Montant: montantData.Montant,
              Equipement: montantData.Equipement
            });
            setIsEditMode(true);
          } catch (error) {
            console.error("Erreur lors du chargement du montant :", error);
            toast.error("Erreur lors du chargement du montant");
          }
        };
        fetchMontantData();
      }
    }, [idMontant]);

    const handleCrumbClick = (path: string, crumbName: string) => {
        setActiveCrumb(crumbName);
        navigate(path);
        localStorage.setItem(
        "activeSidebarItem",
        crumbName === "accueil" ? "acceuil" : crumbName
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [id]: id === 'Montant' || id === 'Equipement' ? Number(value) : value
      }));
    };

    const handleIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setFormData(prev => ({
        ...prev,
        idMontant: value
      }));

      if (!isEditMode && value.length > 0) {
        setCheckingId(true);
        try {
          const exists = await checkMontantExists(value);
          setIdExists(exists);
          if (exists) {
            toast.warning("Cet ID Montant existe déjà");
          }
        } catch (err) {
          console.error("Erreur lors de la vérification de l'ID", err);
        } finally {
          setCheckingId(false);
        }
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Validation simple
      if (!formData.idMontant || !formData.idNiveau || !formData.Montant || !formData.Equipement) {
        toast.error("Tous les champs sont obligatoires");
        return;
      }

      if (formData.idMontant.length > 5) {
        toast.error("L'ID Montant ne doit pas dépasser 5 caractères");
        return;
      }

      if (!isEditMode) {
        // Vérifier si l'ID existe déjà
        try {
          const exists = await checkMontantExists(formData.idMontant);
          if (exists) {
            toast.error("Cet ID Montant existe déjà");
            return;
          }
        } catch (err) {
          toast.error("Erreur lors de la vérification de l'ID");
          return;
        }
      }

      if (isEditMode) {
        // Vérifier si des modifications ont été apportées
        if (originalData && 
            formData.idNiveau === originalData.idNiveau &&
            formData.Montant === originalData.Montant &&
            formData.Equipement === originalData.Equipement) {
          toast.info("Aucune modification détectée");
          return;
        }
        setOpenConfirmDialog(true);
      } else {
        await createNewMontant();
      }
    };

    const createNewMontant = async () => {
      try {
        await createMontant(formData);
        toast.success("Montant créé avec succès");
        navigate("/montant");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Une erreur inattendue est survenue");
      }
    };

    const updateExistingMontant = async () => {
      try {
        await updateMontant(formData);
        toast.success("Montant modifié avec succès");
        navigate("/montant");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Une erreur inattendue est survenue");
      }
    };

    const handleConfirmUpdate = async () => {
      setOpenConfirmDialog(false);
      await updateExistingMontant();
    };

    const handleCancelUpdate = () => {
      setOpenConfirmDialog(false);
    };

    const handleCancel = () => {
      navigate("/montant");
    };

    const getNiveauLabel = (id: string) => {
      const niveau = niveaux.find(n => n.idNiveau === id);
      return niveau ? niveau.Niveau : id;
    };

    return (
        <div className="container">
            <SidBar />
            <div className="main">
                <div className="Nav bar">
                    <NavBar />
                </div>

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

                {/* Dialog de confirmation de modification */}
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
                                Êtes-vous sûr de vouloir modifier ce montant ?<br/>
                                <strong>Niveau:</strong> {getNiveauLabel(originalData.idNiveau)} → {getNiveauLabel(formData.idNiveau)}<br/>
                                <strong>Montant:</strong> {originalData.Montant} → {formData.Montant}<br/>
                                <strong>Equipement:</strong> {originalData.Equipement} → {formData.Equipement}
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
                    {/* Fil d'ariane */}
                    <div className="breadcrumb-container">
                        <div>
                            <h3 className="h3-title">
                              {isEditMode ? "Modifier Montant" : "Ajout Montant"}
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
                                        activeCrumb === "montants" ? "active" : ""
                                    }`}
                                    onClick={() => handleCrumbClick("/montant", "montant")}
                                    >
                                    <a
                                        href="#"
                                        className="breadcrumb-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <FaRegUser className="breadcrumb-icon" />
                                        <span>Montants</span>
                                    </a>
                                </li>
                                <li
                                    className={`breadcrumb-step ${
                                        activeCrumb === "ajout" ? "active" : ""
                                    }`}
                                    onClick={() => handleCrumbClick("/frmMontant", "ajout")}
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

                    {/* Formulaire */}
                    <div className="detailDonnee">
                        <div className="frm">
                            <h2 className="form-title">
                                {isEditMode ? "Modification de Montant" : "Ajout de Montant"}
                            </h2>
                            
                            <form className="modern-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="idMontant" className="form-label">
                                    ID Montant
                                    {checkingId && <span className="checking-id"> (Vérification...)</span>}
                                    {idExists && !isEditMode && <span className="id-exists-error"> (Cet ID existe déjà)</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="idMontant"
                                        className={`form-input ${idExists && !isEditMode ? 'input-error' : ''}`}
                                        placeholder="Entrez l'ID du montant"
                                        value={formData.idMontant}
                                        onChange={handleIdChange}
                                        maxLength={5}
                                        readOnly={isEditMode}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="idNiveau" className="form-label">
                                    Niveau
                                    </label>
                                    <select 
                                        id="idNiveau" 
                                        className="form-input"
                                        value={formData.idNiveau}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Sélectionnez un niveau</option>
                                        {niveaux.map(niveau => (
                                          <option key={niveau.idNiveau} value={niveau.idNiveau}>
                                            {niveau.Niveau}
                                          </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="Montant" className="form-label">
                                    Montant (FCFA)
                                    </label>
                                    <input
                                        type="number"
                                        id="Montant"
                                        className="form-input"
                                        placeholder="Entrez le montant"
                                        value={formData.Montant || ''}
                                        onChange={handleInputChange}
                                        min="0"
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="Equipement" className="form-label">
                                    Equipement (FCFA)
                                    </label>
                                    <input
                                        type="number"
                                        id="Equipement"
                                        className="form-input"
                                        placeholder="65000"
                                        value={formData.Equipement}
                                        onChange={handleInputChange}
                                        min="0"
                                        required
                                    />
                                </div>
                                
                                <div className="form-actions">
                                    <button 
                                        type="button" 
                                        className="btn cancel-btn"
                                        onClick={handleCancel}
                                    >
                                        Annuler
                                    </button>
                                    
                                    <button 
                                      type="submit" 
                                      className="btn submit-btn"
                                      disabled={idExists && !isEditMode}
                                    >
                                        {isEditMode ? "Modifier" : "Enregistrer"}
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

export default FrmMontant;