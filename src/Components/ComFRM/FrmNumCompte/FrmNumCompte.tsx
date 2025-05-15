import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import SidBar from '../../../SidBar/SidBar'
import "./FrmNumCompte.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { PiCreditCardBold } from "react-icons/pi";
import { IoAddOutline } from "react-icons/io5";
import { 
  createNumCompte, 
  getNumCompte, 
  updateNumCompte, 
  getAllNumComptes,
  type NumCompte
} from "../../../services/tablenumcompte_api";
import { getAllEtudiants } from "../../../services/etudiant_api";
import type { Etudiant } from "../../../services/etudiant_api";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

interface FormData {
  idNumCompte?: number;
  Matricule: string;
  NumeroCompte: string;
  Nom?: string;
  Prenom?: string;
  Img?: string;
}

const FrmNumCompte = () => {
    const navigate = useNavigate();
    const { idNumCompte } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeCrumb, setActiveCrumb] = useState("compte");
    const [formData, setFormData] = useState<FormData>({
      Matricule: '',
      NumeroCompte: ''
    });
    const [originalData, setOriginalData] = useState<FormData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [existingNumComptes, setExistingNumComptes] = useState<NumCompte[]>([]);
    const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
    const [filteredEtudiants, setFilteredEtudiants] = useState<Etudiant[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isNumeroCompteExist, setIsNumeroCompteExist] = useState(false);

    // Fonction pour vérifier si le numéro de compte existe déjà
    const checkNumeroCompteExist = (numero: string): boolean => {
      if (!isEditMode) {
        return existingNumComptes.some(compte => compte.NumeroCompte === numero);
      } else {
        return existingNumComptes.some(
          compte => compte.NumeroCompte === numero && compte.idNumCompte !== formData.idNumCompte
        );
      }
    };

    // Fonction pour générer un numéro de compte unique
    const generateUniqueAccountNumber = async () => {
      try {
        const allAccounts = await getAllNumComptes();
        const existingNumbers = allAccounts.map(account => account.NumeroCompte);
        
        // Trouver le numéro maximum existant
        const maxNumber = existingNumbers.reduce((max, current) => {
          const num = parseInt(current, 10);
          return num > max ? num : max;
        }, 0);
        
        // Générer le prochain numéro (max + 1)
        const nextNumber = maxNumber + 1;
        return nextNumber.toString().padStart(8, '0');
      } catch (error) {
        console.error("Erreur génération numéro de compte", error);
        // Fallback si erreur
        return Math.floor(10000000 + Math.random() * 90000000).toString().substring(0, 8);
      }
    };

    // Charger les étudiants et les numéros de compte existants
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [etudiantsData, numComptesData] = await Promise.all([
            getAllEtudiants(),
            getAllNumComptes()
          ]);
          
          setEtudiants(etudiantsData);
          setExistingNumComptes(numComptesData);
          
          if (!idNumCompte) {
            const etudiantsSansCompte = etudiantsData.filter(etudiant => 
              !numComptesData.some(compte => compte.Matricule === etudiant.Matricule)
            );
            setFilteredEtudiants(etudiantsSansCompte);
          } else {
            setFilteredEtudiants(etudiantsData);
          }
          
        } catch (error) {
          console.error("Erreur chargement données :", error);
          toast.error("Erreur lors du chargement des données");
        }
      };
      fetchData();
    }, [idNumCompte]);

    // Charger les données du numéro de compte si en mode édition
    useEffect(() => {
      if (idNumCompte) {
        const fetchNumCompteData = async () => {
          try {
            const numCompteData = await getNumCompte(Number(idNumCompte));
            const etudiant = etudiants.find(e => e.Matricule === numCompteData.Matricule);
            
            setFormData({
              idNumCompte: numCompteData.idNumCompte,
              Matricule: numCompteData.Matricule,
              NumeroCompte: numCompteData.NumeroCompte,
              Nom: numCompteData.Nom,
              Prenom: numCompteData.Prenom,
              Img: etudiant?.Img
            });
            
            setOriginalData({
              idNumCompte: numCompteData.idNumCompte,
              Matricule: numCompteData.Matricule,
              NumeroCompte: numCompteData.NumeroCompte,
              Nom: numCompteData.Nom,
              Prenom: numCompteData.Prenom
            });
            
            setIsEditMode(true);
            
          } catch (error) {
            console.error("Erreur chargement numéro de compte :", error);
            toast.error("Erreur lors du chargement du numéro de compte");
          }
        };
        fetchNumCompteData();
      }
    }, [idNumCompte, etudiants]);

    // Vérifier si le numéro de compte existe déjà quand il change
    useEffect(() => {
      if (formData.NumeroCompte.length === 8) {
        const exists = checkNumeroCompteExist(formData.NumeroCompte);
        setIsNumeroCompteExist(exists);
        
        if (exists && isEditMode) {
          toast.warning("Ce numéro de compte est déjà utilisé", {
            icon: "⚠️",
            autoClose: 3000
          });
        }
      } else {
        setIsNumeroCompteExist(false);
      }
    }, [formData.NumeroCompte, existingNumComptes]);

    const handleCrumbClick = (path: string, crumbName: string) => {
        setActiveCrumb(crumbName);
        navigate(path);
        localStorage.setItem(
        "activeSidebarItem",
        crumbName === "accueil" ? "acceuil" : crumbName
        );
    };

    const handleStudentSelect = async (etudiant: Etudiant) => {
      const newAccountNumber = isEditMode ? formData.NumeroCompte : await generateUniqueAccountNumber();
      
      setFormData({
        ...formData,
        Matricule: etudiant.Matricule,
        Nom: etudiant.Nom,
        Prenom: etudiant.Prenom,
        Img: etudiant.Img,
        NumeroCompte: newAccountNumber
      });
      
      setShowDropdown(false);
      
      toast.info(`${etudiant.Nom} ${etudiant.Prenom} sélectionné`, {
        icon: "👤",
        autoClose: 1500
      });
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
      setIsSubmitting(true);

      // Validation
      if (!formData.Matricule || !formData.NumeroCompte) {
        toast.error("Tous les champs sont obligatoires", {
          icon: "⚠️"
        });
        setIsSubmitting(false);
        return;
      }

      if (formData.NumeroCompte.length !== 8) {
        toast.error("Le numéro de compte doit avoir exactement 8 caractères", {
          icon: "🔢"
        });
        setIsSubmitting(false);
        return;
      }

      if (isNumeroCompteExist) {
        toast.error("Ce numéro de compte est déjà utilisé", {
          icon: "❌"
        });
        setIsSubmitting(false);
        return;
      }

      if (isEditMode) {
        // Vérifier si des modifications ont été apportées
        if (originalData && formData.NumeroCompte === originalData.NumeroCompte) {
          toast.info("Aucune modification détectée", {
            icon: "ℹ️"
          });
          setIsSubmitting(false);
          return;
        }
        setOpenConfirmDialog(true);
      } else {
        await createNewNumCompte();
      }
      setIsSubmitting(false);
    };

    const createNewNumCompte = async () => {
      try {
        const createdAccount = await createNumCompte({
          Matricule: formData.Matricule,
          NumeroCompte: formData.NumeroCompte
        });

        toast.success(
          <div>
            <h4>Numéro de compte créé avec succès</h4>
            <div style={{ marginTop: '10px' }}>
              <p><strong>Matricule:</strong> {formData.Matricule}</p>
              <p><strong>Numéro de compte:</strong> {formData.NumeroCompte}</p>
              {formData.Nom && <p><strong>Étudiant:</strong> {formData.Nom} {formData.Prenom}</p>}
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
            onClose: () => navigate("/numeroCompte")
          }
        );

      } catch (err) {
        toast.error(
          <div>
            <h4>Erreur lors de la création</h4>
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

    const updateExistingNumCompte = async () => {
      try {
        if (!formData.idNumCompte) return;
        
        const updatedAccount = await updateNumCompte(formData.idNumCompte, {
          NumeroCompte: formData.NumeroCompte
        });

        toast.success(
          <div>
            <h4>Numéro de compte modifié avec succès</h4>
            <div style={{ marginTop: '10px' }}>
              <p><strong>Ancien numéro:</strong> {originalData?.NumeroCompte}</p>
              <p><strong>Nouveau numéro:</strong> {formData.NumeroCompte}</p>
              <p><strong>Matricule:</strong> {formData.Matricule}</p>
              {formData.Nom && <p><strong>Étudiant:</strong> {formData.Nom} {formData.Prenom}</p>}
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
            onClose: () => navigate("/numeroCompte")
          }
        );

      } catch (err) {
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
      setIsSubmitting(true);
      await updateExistingNumCompte();
      setIsSubmitting(false);
    };

    const handleCancelUpdate = () => {
      setOpenConfirmDialog(false);
    };

    const handleCancel = () => {
      navigate("/numeroCompte");
    };

    const isSubmitDisabled = () => {
      if (isSubmitting) return true;
      if (!formData.Matricule || !formData.NumeroCompte) return true;
      if (formData.NumeroCompte.length !== 8) return true;
      if (isEditMode && originalData && formData.NumeroCompte === originalData.NumeroCompte) return true;
      if (isNumeroCompteExist) return true;
      return false;
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
                                Êtes-vous sûr de vouloir modifier ce numéro de compte ?<br/>
                                <strong>Numéro de compte:</strong> {originalData.NumeroCompte} → {formData.NumeroCompte}<br/>
                                {formData.Nom && formData.Prenom && (
                                  <><strong>Étudiant:</strong> {formData.Nom} {formData.Prenom} (Matricule: {formData.Matricule})</>
                                )}
                            </span>
                        )}
                    </DialogTitle>
                    <DialogActions>
                        <Button className="cancel-btn" onClick={handleCancelUpdate}>
                            Annuler
                        </Button>
                        <Button 
                          className="confirm-btn" 
                          onClick={handleConfirmUpdate} 
                          autoFocus
                          disabled={isSubmitting || isNumeroCompteExist}
                        >
                            {isSubmitting ? "Modification en cours..." : "Confirmer"}
                        </Button>
                    </DialogActions>
                </Dialog>

                <div className="container-container">
                    <div className="breadcrumb-container">
                        <div>
                            <h3 className="h3-title">
                              {isEditMode ? "Modifier Numéro de Compte" : "Ajout Numéro de Compte"}
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
                                        activeCrumb === "numeroCompte" ? "active" : ""
                                    }`}
                                    onClick={() => handleCrumbClick("/numeroCompte", "numeroCompte")}
                                    >
                                    <a
                                        href="#"
                                        className="breadcrumb-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <PiCreditCardBold className="breadcrumb-icon" />
                                        <span>Numéros de compte</span>                                        
                                    </a>
                                </li>
                                <li
                                    className={`breadcrumb-step ${
                                        activeCrumb === "compte" ? "active" : ""
                                    }`}
                                    onClick={() => handleCrumbClick("/frmNumCompte", "compte")}
                                    >
                                    <a
                                        href="#"
                                        className="breadcrumb-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <IoAddOutline className="breadcrumb-icon" />
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
                                {isEditMode ? "Modification de Numéro de Compte" : "Ajout de Numéro de Compte"}
                            </h2>
                            
                            <form className="modern-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="Matricule" className="form-label">
                                        Matricule
                                    </label>
                                    
                                    <div className="custom-select">
                                        <div 
                                          className="select-header"
                                          onClick={() => !isEditMode && setShowDropdown(!showDropdown)}
                                        >
                                          {formData.Matricule ? (
                                            <div className="selected-option">
                                              {formData.Img && (
                                                <img 
                                                  src={formData.Img} 
                                                  alt=""
                                                  className="selected-image"
                                                />
                                              )}
                                              <span>{formData.Matricule} - {formData.Nom} {formData.Prenom}</span>
                                            </div>
                                          ) : (
                                            <span>Sélectionnez un étudiant</span>
                                          )}
                                          {!isEditMode && <span className="dropdown-icon">▼</span>}
                                        </div>
                                        
                                        {showDropdown && (
                                          <div className="dropdown-options">
                                            {filteredEtudiants.map(etudiant => (
                                              <div 
                                                key={etudiant.Matricule}
                                                className="dropdown-option"
                                                onClick={() => handleStudentSelect(etudiant)}
                                              >
                                                <img 
                                                  src={etudiant.Img || '/default-profile.png'} 
                                                  alt=""
                                                  className="option-image"
                                                />
                                                <div className="option-text">
                                                  <span className="matricule">{etudiant.Matricule}</span>
                                                  <span className="name">{etudiant.Nom} {etudiant.Prenom}</span>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="NumeroCompte" className="form-label">
                                    Numéro de compte
                                    </label>
                                    <input
                                        type="text"
                                        id="NumeroCompte"
                                        className={`form-input ${isNumeroCompteExist ? 'input-error' : ''}`}
                                        placeholder={isEditMode ? "Modifier le numéro de compte" : "Généré automatiquement"}
                                        value={formData.NumeroCompte}
                                        onChange={handleInputChange}
                                        maxLength={8}
                                        required
                                        readOnly={!isEditMode}
                                    />
                                    {isNumeroCompteExist && (
                                      <div className="error-message">
                                        Ce numéro de compte est déjà utilisé
                                      </div>
                                    )}
                                </div>
                                
                                <div className="form-actions">
                                    <button 
                                        type="button" 
                                        className="btn cancel-btn"
                                        onClick={handleCancel}
                                        disabled={isSubmitting}
                                    >
                                        Annuler
                                    </button>
                                    
                                    <button 
                                      type="submit" 
                                      className="btn submit-btn"
                                      disabled={isSubmitDisabled()}
                                    >
                                        {isSubmitting ? (
                                          <span>En cours...</span>
                                        ) : isEditMode ? (
                                          "Modifier"
                                        ) : (
                                          "Enregistrer"
                                        )}
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

export default FrmNumCompte;