import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import SidBar from '../../../SidBar/SidBar'
import "./FrmNumCompte.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { PiCreditCardBold } from "react-icons/pi";
import { IoAddOutline } from "react-icons/io5";

const FrmNumCompte = () => {
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
                            <h3 className="h3-title">Ajout du numéro de compte</h3>
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
                                    onClick={() => handleCrumbClick("/numeroCompte", "compte")}
                                    >
                                    <a
                                        href="#"
                                        className="breadcrumb-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <PiCreditCardBold className="breadcrumb-icon" />
                                        <span>Numéro de compte</span>
                                    </a>
                                </li>
                                <li
                                    className={`breadcrumb-step ${
                                        activeCrumb === "niveau" ? "active" : ""
                                    }`}
                                    onClick={() => handleCrumbClick("/frmNumCompte", " ")}
                                    >
                                    <a
                                        href="#"
                                        className="breadcrumb-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <IoAddOutline className="breadcrumb-icon" />
                                        <span className="active-txt">Ajout</span>
                                    </a>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    {/* Table */}
                    <div className="detailDonnee">
                        <div className="frm">
                                <h2 className="niveau-form-title">
                                    <span className="title-gradient">Ajout du numéro de compte</span>
                                </h2>

                                <form className="">
                                    <div className="form-group">
                                        <label htmlFor="matricule">Matricule</label>
                                        <input type="text" id="matricule" name="matricule" placeholder="Entrer le matricule" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="label" htmlFor="numeroCompte">Numéro de compte</label>
                                        <input type="text" id="numeroCompte" name="numeroCompte" placeholder="Entrer le numéro de compte" required />
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="btn-submit">Ajouter</button>
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
