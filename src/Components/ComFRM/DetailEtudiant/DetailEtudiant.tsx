import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import SidBar from '../../../SidBar/SidBar'
import "./DetailEtudiant.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { RiArrowGoBackLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getEtudiant, Etudiant } from "../../../services/etudiant_api";

const DetailEtudiant = () => {
    const navigate = useNavigate();
    const { matricule } = useParams();
    const [activeCrumb, setActiveCrumb] = useState("etudiant");
    const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
    const [loading, setLoading] = useState(true);

    // Fonction pour calculer l'âge
    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        
        return age;
    };

    // Charger les données de l'étudiant
    useEffect(() => {
        const fetchEtudiant = async () => {
            if (!matricule) return;
            
            try {
                const data = await getEtudiant(matricule);
                setEtudiant(data);
            } catch (error) {
                console.error("Erreur lors du chargement de l'étudiant:", error);
                toast.error("Erreur lors du chargement des données de l'étudiant");
                navigate("/etudiant");
            } finally {
                setLoading(false);
            }
        };

        fetchEtudiant();
    }, [matricule, navigate]);

    const handleCrumbClick = (path: string, crumbName: string) => {
        setActiveCrumb(crumbName);
        navigate(path);
        localStorage.setItem(
            "activeSidebarItem",
            crumbName === "accueil" ? "acceuil" : crumbName
        );
    };

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    if (!etudiant) {
        return <div className="error">Étudiant non trouvé</div>;
    }

    return (
        <div className="container">
            <ToastContainer position="top-right" autoClose={5000} />
            <SidBar />
            <div className="main">
                <div className="Nav bar">
                    <NavBar />
                </div>

                <div className="container-container">
                    {/* Fil d'ariane */}
                    <div className="breadcrumb-container">
                        <div>
                            <h3 className="h3-title">Détails</h3>
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
                                        activeCrumb === "accueil" ? "active" : ""
                                    }`}
                                    onClick={() => handleCrumbClick("/etudiant", "etudiant")}
                                >
                                    <a
                                        href="#"
                                        className="breadcrumb-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <FaRegUser className="breadcrumb-icon" />
                                        <span>Étudiants</span>
                                    </a>
                                </li>
                                <li
                                    className={`breadcrumb-step ${
                                        activeCrumb === "etudiant" ? "active" : ""
                                    }`}
                                    onClick={() => handleCrumbClick(" ", " ")}
                                >
                                    <a
                                        href="#"
                                        className="breadcrumb-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <FaRegEye className="breadcrumb-icon" />
                                        <span className="active-txt">Détails</span>
                                    </a>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <div className="detailDonnee">
                        <div className="frm">
                            <div className="detailEleve">
                                <div className="detail-header">
                                    <h2 className="detail-title">Détails de l'Étudiant</h2>
                                    <div className="detail-actions">
                                        <button 
                                            className="action-btn edit-btn"
                                            onClick={() => navigate(`/modifierEtudiant/${etudiant.Matricule}`)}
                                        >
                                            <FaEdit /> Modifier
                                        </button>
                                        <button className="action-btn back-btn" onClick={() => navigate(-1)}>
                                            <RiArrowGoBackLine /> Retour
                                        </button>
                                    </div>
                                </div>

                                <div className="detail-grid">
                                    {/* Colonne 1 */}
                                    <div className="detail-column">
                                        <div className="detail-card">
                                            <div className="detail-image-container">
                                                <div className="detail-image-placeholder">
                                                    {etudiant.Img ? (
                                                        <img 
                                                            src={etudiant.Img.startsWith('data:image') 
                                                                ? etudiant.Img 
                                                                : `data:image/jpeg;base64,${etudiant.Img}`} 
                                                            alt="Photo de l'étudiant" 
                                                            onError={(e) => {
                                                                e.currentTarget.onerror = null;
                                                                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a777e3'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="avatar-fallback">
                                                            {etudiant.Prenom.charAt(0)}{etudiant.Nom?.charAt(0) || ''}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="detail-info-group">
                                                <h3 className="info-label">Matricule</h3>
                                                <p className="info-value">{etudiant.Matricule}</p>
                                            </div>
                                        </div>

                                        <div className="detail-info-group">
                                            <h3 className="info-label">Nom</h3>
                                            <p className="info-value">{etudiant.Nom || '-'}</p>
                                        </div>

                                        <div className="detail-info-group">
                                            <h3 className="info-label">Prénom</h3>
                                            <p className="info-value">{etudiant.Prenom}</p>
                                        </div>

                                        <div className="detail-info-group">
                                            <h3 className="info-label">Sexe</h3>
                                            <p className="info-value">
                                                {etudiant.Sexe === 'M' ? 'Masculin' : 'Féminin'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Colonne 2 */}
                                    <div className="detail-column d">
                                        <div className="detail-info-group">
                                            <h3 className="info-label">Date de Naissance</h3>
                                            <p className="info-value">
                                                {new Date(etudiant.Naissance).toLocaleDateString('fr-FR')} 
                                                ({calculateAge(etudiant.Naissance)} ans)
                                            </p>
                                        </div>

                                        <div className="detail-info-group">
                                            <h3 className="info-label">Contact</h3>
                                            <p className="info-value">{etudiant.Telephone || '-'}</p>
                                        </div>

                                        <div className="detail-info-group">
                                            <h3 className="info-label">Email</h3>
                                            <p className="info-value">{etudiant.Email || '-'}</p>
                                        </div>

                                        <div className="detail-info-group">
                                            <h3 className="info-label">Établissement</h3>
                                            <p className="info-value">{etudiant.Etablissement || '-'}</p>
                                        </div>

                                        <div className="detail-info-group">
                                            <h3 className="info-label">Niveau</h3>
                                            <p className="info-value">{etudiant.Niveau || '-'}</p>
                                        </div>

                                        <div className="detail-info-group">
                                            <h3 className="info-label">Statu</h3>
                                            <p className="info-value">....................</p>
                                        </div>
                                    </div>
                                </div>
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

export default DetailEtudiant;