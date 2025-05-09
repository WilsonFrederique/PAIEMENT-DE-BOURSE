import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import SidBar from '../../../SidBar/SidBar'
import "./FrmPayer.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { LuUserRoundPlus } from "react-icons/lu";

const FrmPayer = () => {
    const navigate = useNavigate();
    const [activeCrumb, setActiveCrumb] = useState("etudiant");

    const handleCrumbClick = (path: string, crumbName: string) => {
        setActiveCrumb(crumbName);
        navigate(path);
        localStorage.setItem(
        "activeSidebarItem",
        crumbName === "accueil" ? "acceuil" : crumbName
        );
    };

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
                            <h3 className="h3-title">Ajout de paiement</h3>
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
                                    onClick={() => handleCrumbClick("/payer", "payer")}
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
                                        activeCrumb === "etudiant" ? "active" : ""
                                    }`}
                                    onClick={() => handleCrumbClick("/frmEtudiant", " ")}
                                    >
                                    <a
                                        href="#"
                                        className="breadcrumb-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <LuUserRoundPlus className="breadcrumb-icon" />
                                        <span className="active-txt">Ajout</span>
                                    </a>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    {/* Table */}
                    <div className="detailDonnee">
                        <div className="frm">
                            <h2 className="payment-form-title">Formulaire de Paiement</h2>
                            <form className="modern-payment-form">
                                <div className="form-row">
                                    <div className="form-group">
                                    <label htmlFor="matricule" className="form-label">
                                        Numéro de compte
                                    </label>
                                    <input
                                        type="text"
                                        id="matricule"
                                        className="form-input"
                                        placeholder="Entrez le numéro de compte"
                                    />
                                    </div>
                                    
                                    <div className="form-group">
                                    <label htmlFor="annee" className="form-label">
                                        Année universitaire
                                    </label>
                                    <select id="annee" className="form-input">
                                        <option value="">Sélectionnez une année</option>
                                        <option value="2023-2024">2023-2024</option>
                                        <option value="2024-2025">2024-2025</option>
                                        <option value="2025-2026">2025-2026</option>
                                    </select>
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                    <label htmlFor="date" className="form-label">
                                        Date et heure
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="date"
                                        className="form-input"
                                    />
                                    </div>
                                    
                                    <div className="form-group">
                                    <label htmlFor="mois" className="form-label">
                                        Nombre de mois
                                    </label>
                                    <input
                                        type="number"
                                        id="mois"
                                        className="form-input"
                                        min="1"
                                        max="12"
                                        placeholder="Nombre de mois payés"
                                    />
                                    </div>
                                </div>
                                
                                <div className="form-actions">
                                    <button type="button" className="btn cancel-btn">
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn submit-btn">
                                        Enregistrer
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
