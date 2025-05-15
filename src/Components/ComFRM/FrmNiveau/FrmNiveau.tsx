import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import SidBar from '../../../SidBar/SidBar'
import "./FrmNiveau.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { LuUserRoundPlus } from "react-icons/lu";
import { createNiveau, getNiveau, updateNiveau } from "../../../services/niveaux_api";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

interface FormData {
  idNiveau: string;
  Niveau: string;
}

const FrmNiveau = () => {
    const navigate = useNavigate();
    const { idNiveau } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeCrumb, setActiveCrumb] = useState("niveau");
    const [formData, setFormData] = useState<FormData>({
      idNiveau: '',
      Niveau: ''
    });
    const [originalData, setOriginalData] = useState<FormData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    // Charger les données du niveau si en mode édition
    useEffect(() => {
      if (idNiveau) {
        const fetchNiveauData = async () => {
          try {
            const niveauData = await getNiveau(idNiveau);
            setFormData({
              idNiveau: niveauData.idNiveau,
              Niveau: niveauData.Niveau
            });
            setOriginalData({
              idNiveau: niveauData.idNiveau,
              Niveau: niveauData.Niveau
            });
            setIsEditMode(true);
          } catch (error) {
            console.error("Erreur lors du chargement du niveau :", error);
            setError("Erreur lors du chargement du niveau");
          }
        };
        fetchNiveauData();
      }
    }, [idNiveau]);

    const handleCrumbClick = (path: string, crumbName: string) => {
        setActiveCrumb(crumbName);
        navigate(path);
        localStorage.setItem(
        "activeSidebarItem",
        crumbName === "accueil" ? "acceuil" : crumbName
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Validation simple
      if (!formData.idNiveau || !formData.Niveau) {
        setError("Tous les champs sont obligatoires");
        return;
      }

      if (formData.idNiveau.length > 5) {
        setError("L'ID Niveau ne doit pas dépasser 5 caractères");
        return;
      }

      if (isEditMode) {
        // Vérifier si des modifications ont été apportées
        if (originalData && formData.Niveau === originalData.Niveau) {
          toast.info("Aucune modification détectée");
          return;
        }
        setOpenConfirmDialog(true);
      } else {
        await createNewNiveau();
      }
    };

    const createNewNiveau = async () => {
      try {
        await createNiveau(formData);
        toast.success("Niveau créé avec succès");
        navigate("/niveau");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur inattendue est survenue");
      }
    };

    const updateExistingNiveau = async () => {
      try {
        await updateNiveau(formData);
        toast.success("Niveau modifié avec succès");
        navigate("/niveau");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur inattendue est survenue");
      }
    };

    const handleConfirmUpdate = async () => {
      setOpenConfirmDialog(false);
      await updateExistingNiveau();
    };

    const handleCancelUpdate = () => {
      setOpenConfirmDialog(false);
    };

    const handleCancel = () => {
      navigate("/niveau");
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
                                Êtes-vous sûr de vouloir modifier ce niveau : <br/>
                                <strong>{originalData.Niveau}</strong> → <strong>{formData.Niveau}</strong> ?
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
                              {isEditMode ? "Modifier Niveau" : "Ajout Niveau"}
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
                                    className={`breadcrumb-step ${activeCrumb === "parametre" ? "active" : ""}`}
                                    onClick={() => handleCrumbClick("/parametre", "parametre")}
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
                                    className={`breadcrumb-step ${
                                        activeCrumb === "niveau" ? "active" : ""
                                    }`}
                                    onClick={() => handleCrumbClick("/niveau", "niveau")}
                                    >
                                    <a
                                        href="#"
                                        className="breadcrumb-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <FaRegUser className="breadcrumb-icon" />
                                        <span>Niveaux</span>
                                    </a>
                                </li>
                                <li
                                    className={`breadcrumb-step ${
                                        activeCrumb === "ajout" ? "active" : ""
                                    }`}
                                    onClick={() => handleCrumbClick("/frmNiveau", "ajout")}
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
                            <div className="niveau-form-card">
                                <h2 className="niveau-form-title">
                                    <span className="title-gradient">
                                      {isEditMode ? "Modification de Niveau" : "Ajout de Niveau"}
                                    </span>
                                </h2>
                                
                                {error && (
                                  <div className="error-message">
                                    {error}
                                  </div>
                                )}
                                
                                <form className="niveau-form" onSubmit={handleSubmit}>
                                    <div className="input-field">
                                    <input 
                                        type="text" 
                                        id="idNiveau" 
                                        className="niveau-input"
                                        autoComplete="off"
                                        placeholder=" "
                                        value={formData.idNiveau}
                                        onChange={handleInputChange}
                                        maxLength={5}
                                        readOnly={isEditMode}
                                    />
                                    <label htmlFor="idNiveau" className="niveau-label">ID Niveau</label>
                                    <span className="input-border"></span>
                                    </div>
                                    
                                    <div className="input-field">
                                    <input 
                                        type="text" 
                                        id="Niveau" 
                                        className="niveau-input"
                                        autoComplete="off"
                                        placeholder=" "
                                        value={formData.Niveau}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="Niveau" className="niveau-label">Niveau</label>
                                    <span className="input-border"></span>
                                    </div>
                                    
                                    <div className="form-actions">
                                    <button 
                                        type="button" 
                                        className="cancel-action"
                                        onClick={handleCancel}
                                    >
                                        <span className="action-text">Annuler</span>
                                    </button>
                                    
                                    <button type="submit" className="submit-action">
                                        <span className="action-text">
                                          {isEditMode ? "Modifier" : "Enregistrer"}
                                        </span>
                                    </button>
                                    </div>
                                </form>
                            </div>
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

export default FrmNiveau;