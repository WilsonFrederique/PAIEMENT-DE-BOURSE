import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import SidBar from '../../../SidBar/SidBar'
import "./FrmMontant.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { LuUserRoundPlus } from "react-icons/lu";

const FrmMontant = () => {
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
                            <h3 className="h3-title">Ajout de montant</h3>
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
                                        activeCrumb === "montant" ? "active" : ""
                                    }`}
                                    onClick={() => handleCrumbClick("/frmMontant", " ")}
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

                    <div className="detailDonnee">
                        <div className="frm">
                            <h2 className="form-title">Formulaire Montant</h2>
                            <form className="modern-form">
                                <div className="form-group">
                                    <label htmlFor="idMontant" className="form-label">
                                    ID Montant
                                    </label>
                                    <input
                                    type="text"
                                    id="idMontant"
                                    className="form-input"
                                    placeholder="Entrez l'ID du montant"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="niveau" className="form-label">
                                    Niveau
                                    </label>
                                    <select id="niveau" className="form-input">
                                    <option value="">Sélectionnez un niveau</option>
                                    <option value="L1">Licence 1</option>
                                    <option value="L2">Licence 2</option>
                                    <option value="L3">Licence 3</option>
                                    <option value="M1">Master 1</option>
                                    <option value="M2">Master 2</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="montant" className="form-label">
                                    Montant (FCFA)
                                    </label>
                                    <input
                                    type="number"
                                    id="montant"
                                    className="form-input"
                                    placeholder="Entrez le montant"
                                    />
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

export default FrmMontant;
