import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button
} from '@mui/material';
import NavBar from "../../../NavBar/NavBar";
import SidBar from '../../../SidBar/SidBar'
import "./FrmEtudiant.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { LuUserRoundPlus } from "react-icons/lu";
import { createEtudiant, getEtudiant, updateEtudiant, checkEtudiantExists, Etudiant, getAllNiveaux, Niveau } from "../../../services/etudiant_api";

const FrmEtudiant = () => {
    const navigate = useNavigate();
    const { matricule } = useParams();
    const [activeCrumb, setActiveCrumb] = useState("etudiant");
    const [isEditMode, setIsEditMode] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [originalData, setOriginalData] = useState<Etudiant | null>(null);
    const [niveaux, setNiveaux] = useState<Niveau[]>([]);
    
    const [formData, setFormData] = useState<Omit<Etudiant, 'Niveau'>>({
        Matricule: '',
        idNiveau: '',
        Nom: '',
        Prenom: '',
        Sexe: '',
        Telephone: '',
        Email: '',
        Etablissement: '',
        Naissance: new Date().toISOString().split('T')[0],
        Img: ''
    });

    useEffect(() => {
        const loadNiveaux = async () => {
            try {
                const niveauxData = await getAllNiveaux();
                setNiveaux(niveauxData);
            } catch (error) {
                toast.error("Erreur lors du chargement des niveaux");
            }
        };
        loadNiveaux();

        if (matricule) {
            const loadEtudiant = async () => {
                try {
                    const etudiant = await getEtudiant(matricule);
                    console.log('Données reçues:', etudiant); // Ajoutez ce log
                    
                    setOriginalData(etudiant);
                    
                    // Formatage des données avec gestion de l'image
                    const formattedData = {
                        ...etudiant,
                        Naissance: etudiant.Naissance.split('T')[0],
                        Img: etudiant.Img || '' // Assurez-vous que l'image est bien récupérée
                    };
                    
                    console.log('Données formatées:', formattedData); // Ajoutez ce log
                    setFormData(formattedData);
                    setIsEditMode(true);
                } catch (error) {
                    console.error("Erreur détaillée:", error);
                    toast.error("Erreur lors du chargement de l'étudiant");
                    navigate("/etudiant");
                }
            };
            loadEtudiant();
        }
    }, [matricule, navigate]);

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
            [id]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    Img: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateBirthDate = (dateString: string): boolean => {
        const birthDate = new Date(dateString);
        const currentYear = new Date().getFullYear();
        const birthYear = birthDate.getFullYear();
        
        // Vérifie si l'année de naissance est entre currentYear et currentYear - 10
        return birthYear >= currentYear - 10 && birthYear <= currentYear;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // Validation des champs obligatoires
            if (!formData.Matricule || !formData.idNiveau || !formData.Prenom || !formData.Sexe || !formData.Naissance) {
            toast.error("Tous les champs obligatoires doivent être remplis");
            return;
            }

            // Validation de la date de naissance
            const isRecentBirthDate = validateBirthDate(formData.Naissance);
            
            if (isEditMode) {
            setOpenConfirmDialog(true);
            } else {
            const exists = await checkEtudiantExists(formData.Matricule);
            if (exists) {
                toast.error("Ce matricule existe déjà");
                return;
            }
            await createEtudiant(formData);
            
            if (isRecentBirthDate) {
                toast.warning("Attention: L'étudiant semble très jeune (né entre 2015 et 2025). Vérifiez la date de naissance.", {
                autoClose: 8000 // Affiche pendant 8 secondes
                });
            } else {
                toast.success("Étudiant créé avec succès");
            }
            
            navigate("/etudiant");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
        }
    };

    const handleConfirmUpdate = async () => {
        try {
            await updateEtudiant(formData);
            
            const isRecentBirthDate = validateBirthDate(formData.Naissance);
            
            if (isRecentBirthDate) {
                toast.warning("Attention: L'étudiant semble très jeune (né entre 2015 et 2025). Vérifiez la date de naissance.", {
                    autoClose: 8000
                });
            }
            
            // Afficher la notification de succès
            toast.success("Modification réussie !", {
                onClose: () => {
                    // Redirection après la fermeture de la notification
                    navigate("/etudiant");
                },
                autoClose: 2000 // Ferme automatiquement après 2 secondes
            });
            
            setOpenConfirmDialog(false);
            
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erreur lors de la mise à jour");
            setOpenConfirmDialog(false);
        }
    };

    const handleCancelUpdate = () => {
        setOpenConfirmDialog(false);
    };

    const handleCancel = () => {
        navigate("/etudiant");
    };

    const getNiveauLabel = (idNiveau: string) => {
        const niveau = niveaux.find(n => n.idNiveau === idNiveau);
        return niveau ? niveau.Niveau : idNiveau;
    };



    // Fonction pour contact ===============================================

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, selectionStart } = e.target;
        
        // Si l'utilisateur essaie de supprimer le +261, on l'empêche
        if (value.length < 5 && value !== "+261") {
            setFormData(prev => ({
            ...prev,
            Telephone: "+261 "
            }));
            return;
        }
        
        // Si la valeur ne commence pas par +261, on la force
        if (!value.startsWith("+261 ")) {
            const numbers = value.replace(/\D/g, '').substring(3); // Enlève le +261 existant s'il y a
            const formatted = formatPhoneNumber(numbers);
            setFormData(prev => ({
            ...prev,
            Telephone: "+261 " + formatted
            }));
            return;
        }
        
        // Formatage normal
        const numbers = value.substring(5).replace(/\D/g, '');
        const formatted = formatPhoneNumber(numbers);
        
        // On conserve la position du curseur
        const newValue = "+261 " + formatted;
        setFormData(prev => ({
            ...prev,
            Telephone: newValue
        }));
        
        // On repositionne le curseur après un court délai
        setTimeout(() => {
            const input = e.target;
            const newPosition = calculateCursorPosition(selectionStart || 0, value, newValue);
            input.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    // Fonction pour calculer la nouvelle position du curseur
    const calculateCursorPosition = (oldPos: number, oldValue: string, newValue: string): number => {
    if (oldPos <= 5) return 5; // On garde le curseur après "+261 "
    
    // On compte les chiffres avant la position actuelle dans l'ancienne valeur
    const digitsBefore = countDigitsBefore(oldValue, oldPos);
    
    // On trouve la position correspondante dans la nouvelle valeur
    return findPositionByDigits(newValue, digitsBefore);
    };

    const countDigitsBefore = (str: string, pos: number): number => {
    let count = 0;
    for (let i = 5; i < pos && i < str.length; i++) {
        if (/\d/.test(str[i])) count++;
    }
    return count;
    };

    const findPositionByDigits = (str: string, digitCount: number): number => {
    let count = 0;
    for (let i = 5; i < str.length; i++) {
        if (/\d/.test(str[i])) {
        count++;
        if (count >= digitCount) return i + 1;
        }
    }
    return str.length;
    };

    const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { value, selectionStart, selectionEnd } = e.currentTarget;
        
        // Empêche la suppression du +261
        if (selectionStart <= 5 && (e.key === "Backspace" || e.key === "Delete")) {
            e.preventDefault();
            return;
        }
        
        // Si l'utilisateur veut supprimer un espace, on supprime le chiffre avant
        if (e.key === "Backspace" && selectionStart === selectionEnd) {
            const charBefore = value[selectionStart - 1];
            if (charBefore === ' ') {
            e.preventDefault();
            const newPos = selectionStart - 1;
            e.currentTarget.setSelectionRange(newPos, newPos);
            }
        }
        
        // Si l'utilisateur veut supprimer une sélection qui inclut +261
        if (selectionStart < 5 && selectionEnd > 5) {
            e.preventDefault();
        }
    };

    const formatPhoneNumber = (numbers: string): string => {
        let formatted = "";
        
        if (numbers.length > 0) {
            formatted += numbers.substring(0, 2); // 34
        }
        if (numbers.length > 2) {
            formatted += " " + numbers.substring(2, 4); // 34 00
        }
        if (numbers.length > 4) {
            formatted += " " + numbers.substring(4, 7); // 34 00 000
        }
        if (numbers.length > 7) {
            formatted += " " + numbers.substring(7, 9); // 34 00 000 00
        }
        
        return formatted;
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

                <div className="container-container">
                    <div className="breadcrumb-container">
                        <div>
                            <h3 className="h3-title">
                                {isEditMode ? "Modification d'étudiant" : "Ajout d'étudiants"}
                            </h3>
                        </div>
                        <nav className="breadcrumb-nav">
                            <ol className="breadcrumb-path">
                                <li
                                    className={`breadcrumb-step ${activeCrumb === "accueil" ? "active" : ""}`}
                                    onClick={() => handleCrumbClick("/dashbord", "accueil")}
                                >
                                    <a href="#" className="breadcrumb-link" onClick={(e) => e.preventDefault()}>
                                        <RiHomeLine className="breadcrumb-icon" />
                                        <span>Accueil</span>
                                    </a>
                                </li>
                                <li
                                    className={`breadcrumb-step ${activeCrumb === "accueil" ? "active" : ""}`}
                                    onClick={() => handleCrumbClick("/etudiant", "etudiant")}
                                >
                                    <a href="#" className="breadcrumb-link" onClick={(e) => e.preventDefault()}>
                                        <FaRegUser className="breadcrumb-icon" />
                                        <span>Étudiants</span>
                                    </a>
                                </li>
                                <li
                                    className={`breadcrumb-step ${activeCrumb === "etudiant" ? "active" : ""}`}
                                    onClick={() => handleCrumbClick("/frmEtudiant", " ")}
                                >
                                    <a href="#" className="breadcrumb-link" onClick={(e) => e.preventDefault()}>
                                        <LuUserRoundPlus className="breadcrumb-icon" />
                                        <span className="active-txt">
                                            {isEditMode ? "Modification" : "Ajout"}
                                        </span>
                                    </a>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <div className="detailFrm">
                        <div className="frm">
                            <div className="group-frm">
                                <h2 className="form-title">
                                    {isEditMode ? "Formulaire de Modification" : "Formulaire d'Enregistrement"}
                                </h2>
                                <form className="student-form" onSubmit={handleSubmit}>
                                    <div className="form-grid">
                                        <div className="form-column">
                                            <div className="input-group">
                                                <label htmlFor="Matricule">Matricule *</label>
                                                <input 
                                                    type="text" 
                                                    id="Matricule" 
                                                    placeholder="Entrez le matricule" 
                                                    className="form-input"
                                                    value={formData.Matricule}
                                                    onChange={handleInputChange}
                                                    disabled={isEditMode}
                                                />
                                            </div>
                                            
                                            <div className="input-group">
                                                <label htmlFor="Nom">Nom</label>
                                                <input 
                                                    type="text" 
                                                    id="Nom" 
                                                    placeholder="Entrez le nom" 
                                                    className="form-input"
                                                    value={formData.Nom}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            
                                            <div className="input-group">
                                                <label htmlFor="Prenom">Prénom *</label>
                                                <input 
                                                    type="text" 
                                                    id="Prenom" 
                                                    placeholder="Entrez le prénom" 
                                                    className="form-input"
                                                    value={formData.Prenom}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            
                                            <div className="input-group">
                                                <label htmlFor="Sexe">Sexe *</label>
                                                <select 
                                                    id="Sexe" 
                                                    className="form-input"
                                                    value={formData.Sexe}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Sélectionnez le sexe</option>
                                                    <option value="M">Masculin</option>
                                                    <option value="F">Féminin</option>
                                                </select>
                                            </div>

                                            <div className="input-group">
                                                <label htmlFor="Naissance">Date de naissance *</label>
                                                <input 
                                                    type="date" 
                                                    id="Naissance" 
                                                    className="form-input"
                                                    value={formData.Naissance}
                                                    onChange={handleInputChange}
                                                    max={new Date().toISOString().split('T')[0]} // Empêche de sélectionner une date future
                                                />
                                                {validateBirthDate(formData.Naissance) && (
                                                    <p className="birthdate-warning" style={{color: 'orange', fontSize: '0.8rem'}}>
                                                    Attention: Cet étudiant semble très jeune
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="form-column">
                                            <div className="input-group">
                                                <label htmlFor="Telephone">Contact</label>
                                                    <input 
                                                        type="tel" 
                                                        id="Telephone" 
                                                        placeholder="+261 00 00 000 00" 
                                                        className="form-input"
                                                        value={formData.Telephone}
                                                        onChange={handlePhoneChange}
                                                        onKeyDown={handlePhoneKeyDown}
                                                    />
                                                </div>

                                            <div className="input-group">
                                                <label htmlFor="Email">Email</label>
                                                <input 
                                                    type="email" 
                                                    id="Email" 
                                                    placeholder="Entrez l'email" 
                                                    className="form-input"
                                                    value={formData.Email}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            
                                            <div className="input-group">
                                                <label htmlFor="Etablissement">Établissement</label>
                                                <input 
                                                    type="text" 
                                                    id="Etablissement" 
                                                    placeholder="Entrez l'établissement" 
                                                    className="form-input"
                                                    value={formData.Etablissement}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            
                                            <div className="input-group">
                                                <label htmlFor="idNiveau">Niveau *</label>
                                                <select 
                                                    id="idNiveau" 
                                                    className="form-input"
                                                    value={formData.idNiveau}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="">Sélectionnez le niveau</option>
                                                    {niveaux.map((niveau) => (
                                                        <option key={niveau.idNiveau} value={niveau.idNiveau}>
                                                            {niveau.Niveau}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div className="input-group">
                                                <label htmlFor="Img">Image</label>
                                                <div className="image-upload">
                                                    <input 
                                                        type="file" 
                                                        id="Img" 
                                                        accept="image/*" 
                                                        className="file-input"
                                                        onChange={handleFileChange}
                                                    />
                                                    <label htmlFor="Img" className="upload-label">
                                                        <span className="upload-text">
                                                            {formData.Img ? "Changer l'image" : "Choisir une image"}
                                                        </span>
                                                    </label>
                                                </div>
                                                {formData.Img && (
                                                    <div className="image-preview">
                                                        <img 
                                                            src={formData.Img.startsWith('data:image') 
                                                                ? formData.Img 
                                                                : `data:image/jpeg;base64,${formData.Img}`}
                                                            alt="Preview" 
                                                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                                                            onError={(e) => {
                                                                console.error("Erreur de chargement de l'image:", formData.Img);
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="form-actions">
                                        <button 
                                            type="button" 
                                            className="cancel-btn"
                                            onClick={handleCancel}
                                        >
                                            Annuler
                                        </button>
                                        <button type="submit" className="submit-btn">
                                            {isEditMode ? "Modifier" : "Enregistrer"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

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
                                Êtes-vous sûr de vouloir modifier cet étudiant ?<br/>
                                <strong>Matricule:</strong> {originalData.Matricule}<br/>
                                <strong>Nom:</strong> {originalData.Nom || 'Non renseigné'} → {formData.Nom || 'Non renseigné'}<br/>
                                <strong>Prénom:</strong> {originalData.Prenom} → {formData.Prenom}<br/>
                                <strong>Niveau:</strong> {getNiveauLabel(originalData.idNiveau)} → {getNiveauLabel(formData.idNiveau)}<br/>
                                <strong>Sexe:</strong> {originalData.Sexe} → {formData.Sexe}
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

export default FrmEtudiant;