import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import SidBar from '../../../SidBar/SidBar'
import "./DetailPaiment.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { FaCreditCard } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { getPaiement } from "../../../services/paiement_api";
import { formatDate, formatDateTime  } from "../../../services/paiement_api";

const DetailPaiment = () => {
    const { idPaiement } = useParams();
    const navigate = useNavigate();
    const [activeCrumb, setActiveCrumb] = useState("etudiant");
    const [paiement, setPaiement] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPaiement = async () => {
            try {
                if (!idPaiement) return;
                
                const paiementData = await getPaiement(parseInt(idPaiement));
                setPaiement(paiementData);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
                setLoading(false);
            }
        };

        fetchPaiement();
    }, [idPaiement]);

    const handleCrumbClick = (path: string, crumbName: string) => {
        setActiveCrumb(crumbName);
        navigate(path);
        localStorage.setItem(
            "activeSidebarItem",
            crumbName === "accueil" ? "acceuil" : crumbName
        );
    };

    const handleBackClick = () => {
        navigate("/payer");
    };

    const handleEditClick = () => {
        if (paiement) {
            navigate(`/payer/modifier/${paiement.idPaiement}`);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <SidBar />
                <div className="main">
                    <div className="Nav bar">
                        <NavBar />
                    </div>
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Chargement des détails du paiement...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <SidBar />
                <div className="main">
                    <div className="Nav bar">
                        <NavBar />
                    </div>
                    <div className="error-container">
                        <div className="error-message">
                            <p>Erreur: {error}</p>
                            <button 
                                className="modern-btn back-btn hover-effect"
                                onClick={handleBackClick}
                            >
                                <svg className="btn-icon" viewBox="0 0 24 24">
                                    <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                                </svg>
                                <span className="btn-text">Retour</span>
                                <span className="hover-circle"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!paiement) {
        return (
            <div className="container">
                <SidBar />
                <div className="main">
                    <div className="Nav bar">
                        <NavBar />
                    </div>
                    <div className="error-container">
                        <div className="error-message">
                            <p>Aucun paiement trouvé</p>
                            <button 
                                className="modern-btn back-btn hover-effect"
                                onClick={handleBackClick}
                            >
                                <svg className="btn-icon" viewBox="0 0 24 24">
                                    <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                                </svg>
                                <span className="btn-text">Retour</span>
                                <span className="hover-circle"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Calculer les mois couverts
    const getCoveredMonths = (date: string, nbMonths: number) => {
        const months = [];
        const paymentDate = new Date(date);
        
        for (let i = 0; i < nbMonths; i++) {
            const monthDate = new Date(paymentDate);
            monthDate.setMonth(paymentDate.getMonth() - i);
            
            const monthName = monthDate.toLocaleString('fr-FR', { month: 'long' });
            const year = monthDate.getFullYear();
            
            months.push(`${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`);
        }
        
        return months.reverse();
    };

    const coveredMonths = paiement.DateHeur 
        ? getCoveredMonths(paiement.DateHeur, paiement.NombreMois)
        : [];

    // Calculer le montant total
    const montantMensuel = paiement.montantMensuel || 35000;
    const equipement = paiement.equipement || 65000;
    const total = montantMensuel * paiement.NombreMois + equipement;

    return (
        <div className="container">
            <SidBar />
            <div className="main">
                <div className="Nav bar">
                    <NavBar />
                </div>

                <div className="container-container">
                    {/* Fil d'ariane */}
                    <div className="breadcrumb-container">
                        <div>
                            <h3 className="h3-title">Détail du paiement</h3>
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
                                        activeCrumb === "payer" ? "active" : ""
                                    }`}
                                    onClick={() => handleCrumbClick("/payer", "payer")}
                                >
                                    <a
                                        href="#"
                                        className="breadcrumb-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <FaCreditCard className="breadcrumb-icon" />
                                        <span>Paiements</span>
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
                                        <FaEye className="breadcrumb-icon" />
                                        <span className="active-txt">Détails</span>
                                    </a>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    {/* Table */}
                    <div className="detailDonnee">
                        <div className="frm">
                            <div className="payment-header">
                                <div className="title-wrapper">
                                    <h2 className="payment-title neon-text">Détail du paiement</h2>
                                    <div className="title-underline"></div>
                                </div>
                                <div className="payment-actions">
                                    <button 
                                        className="modern-btn back-btn hover-effect"
                                        onClick={handleBackClick}
                                    >
                                        <svg className="btn-icon" viewBox="0 0 24 24">
                                            <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                                        </svg>
                                        <span className="btn-text">Retour</span>
                                        <span className="hover-circle"></span>
                                    </button>
                                </div>
                            </div>

                            <div className="payment-grid">
                                {/* Section Étudiant */}
                                <div className="payment-section student-info floating-card">
                                    <div className="section-header">
                                        <h3 className="section-title t1">
                                            <span className="title-icon">👤</span>
                                            <span>Informations étudiant</span>
                                        </h3>
                                    </div>
                                    <div className="info-grid">
                                        <div className="info-item animated-item">
                                            <span className="info-label pulse-animation">Num compte:</span>
                                            <span className="info-value">{paiement.NumeroCompte || 'N/A'}</span>
                                        </div>
                                        <div className="info-item animated-item">
                                            <span className="info-label pulse-animation">Matricule:</span>
                                            <span className="info-value">{paiement.Matricule || 'N/A'}</span>
                                        </div>
                                        <div className="info-item full-width animated-item">
                                            <div className="student-avatar">
                                                <div className="avatar-container">
                                                    <img 
                                                        src={paiement.Img || "https://randomuser.me/api/portraits/women/44.jpg"} 
                                                        alt="Étudiant" 
                                                        className="avatar-img hover-zoom" 
                                                    />
                                                    <div className="avatar-ring"></div>
                                                </div>
                                                <div className="student-name">
                                                    <span className="info-value name-highlight">{paiement.Nom || 'N/A'}</span> &nbsp;
                                                    <span className="info-value name-highlight">{paiement.Prenom || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="info-item animated-item">
                                            <span className="info-label pulse-animation">Sexe:</span>
                                            <span className="info-value">{paiement.Sexe || 'N/A'}</span>
                                        </div>
                                        <div className="info-item animated-item">
                                            <span className="info-label pulse-animation">Naissance:</span>
                                            <span className="info-value">{paiement.Naissance ? formatDate(paiement.Naissance) : 'N/A'}</span>
                                        </div>
                                        <div className="info-item animated-item">
                                            <span className="info-label pulse-animation">Téléphone:</span>
                                            <span className="info-value click-to-call">{paiement.Telephone || 'N/A'}</span>
                                        </div>
                                        <div className="info-item animated-item">
                                            <span className="info-label pulse-animation">Email:</span>
                                            <span className="info-value click-to-email">{paiement.Email || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section Paiement */}
                                <div className="payment-section payment-info floating-card">
                                    <div className="section-header">
                                        <h3 className="section-title">
                                            <span className="title-icon">💳</span>
                                            <span>Détails du paiement</span>
                                        </h3>
                                    </div>
                                    <div className="info-grid">
                                        <div className="info-item animated-item">
                                            <span className="info-label pulse-animation">Niveau:</span>
                                            <span className="info-value">{paiement.Niveau || 'N/A'}</span>
                                        </div>
                                        <div className="info-item animated-item">
                                            <span className="info-label pulse-animation">Établissement:</span>
                                            <span className="info-value">{paiement.Etablissement || 'N/A'}</span>
                                        </div>
                                        <div className="info-item animated-item">
                                            <span className="info-label pulse-animation">Année universitaire:</span>
                                            <span className="info-value highlight shimmer-effect">{paiement.AnneeUniversitaire || 'N/A'}</span>
                                        </div>
                                        <div className="info-item animated-item">
                                            <span className="info-label pulse-animation">Date et heure:</span>
                                            <span className="info-value">
                                                {paiement.DateHeur ? formatDateTime(paiement.DateHeur) : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="info-item animated-item">
                                            <span className="info-label pulse-animation">Nombre de mois:</span>
                                            <span className="info-value highlight shimmer-effect">{paiement.NombreMois || '0'}</span>
                                        </div>
                                        <div className="info-item animated-item">
                                            <span className="info-label pulse-animation">Mois couverts:</span>
                                            <div className="month-tags">
                                                {coveredMonths.length > 0 ? (
                                                    coveredMonths.map((month, index) => (
                                                        <span key={index} className="month-tag">{month}</span>
                                                    ))
                                                ) : (
                                                    <span className="no-month">Aucun mois spécifié</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section Montant */}
                                <div className="payment-section amount-info floating-card">
                                    <div className="section-header">
                                        <h3 className="section-title">
                                            <span className="title-icon">💰</span>
                                            <span>Montant de la bourse</span>
                                        </h3>
                                    </div>
                                    <div className="amount-display">
                                        <div className="amount-item animated-item">
                                            <span className="amount-label pulse-animation">Montant mensuel:</span>
                                            <span className="amount-value money-display lun">{montantMensuel.toLocaleString('fr-FR')} Ar</span>
                                        </div>
                                        <div className="amount-item animated-item">
                                            <span className="amount-label pulse-animation">Équipement:</span>
                                            <span className="amount-value money-display lun">{equipement.toLocaleString('fr-FR')} Ar</span>
                                        </div>
                                        <div className="amount-item animated-item">
                                            <span className="amount-label pulse-animation">Total reçu:</span>
                                            <span className="amount-value total money-display shimmer-effect">{total.toLocaleString('fr-FR')} Ar</span>
                                        </div>
                                    </div>
                                    <div className="payment-status">
                                        <div className="status-container">
                                            <span className="status-badge completed floating">
                                                <span className="status-dot"></span>
                                                Complété
                                            </span>
                                            <span className="status-date">
                                                Payé le {paiement.DateHeur ? formatDate(paiement.DateHeur) : 'date inconnue'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="floating-dots">
                                {[...Array(20)].map((_, i) => <div key={i} className="dot"></div>)}
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

export default DetailPaiment;