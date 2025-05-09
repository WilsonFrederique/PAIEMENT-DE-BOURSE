import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import SidBar from '../../../SidBar/SidBar'
import "./FrmNiveau.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { LuUserRoundPlus } from "react-icons/lu";

const FrmNiveau = () => {
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
                            <h3 className="h3-title">Ajout Niveau</h3>
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
                                        activeCrumb === "accueil" ? "active" : ""
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
                                        activeCrumb === "niveau" ? "active" : ""
                                    }`}
                                    onClick={() => handleCrumbClick("/frmNiveau", " ")}
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
                            <div className="niveau-form-card">
                                <h2 className="niveau-form-title">
                                    <span className="title-gradient">Ajout de Niveau</span>
                                </h2>
                                
                                <form className="niveau-form">
                                    <div className="input-field">
                                    <input 
                                        type="text" 
                                        id="idNiveau" 
                                        className="niveau-input"
                                        autoComplete="off"
                                        placeholder=" "
                                    />
                                    <label htmlFor="idNiveau" className="niveau-label">ID Niveau</label>
                                    <span className="input-border"></span>
                                    </div>
                                    
                                    <div className="input-field">
                                    <input 
                                        type="text" 
                                        id="niveau" 
                                        className="niveau-input"
                                        autoComplete="off"
                                        placeholder=" "
                                    />
                                    <label htmlFor="niveau" className="niveau-label">Niveau</label>
                                    <span className="input-border"></span>
                                    </div>
                                    
                                    <div className="form-actions">
                                    <button type="button" className="cancel-action">
                                        <span className="action-text">Annuler</span>
                                        <span className="action-icon">
                                        </span>
                                    </button>
                                    
                                    <button type="submit" className="submit-action">
                                        <span className="action-text">Enregistrer</span>
                                        <span className="action-icon">
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
