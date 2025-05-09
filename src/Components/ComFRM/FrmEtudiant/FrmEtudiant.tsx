import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import SidBar from '../../../SidBar/SidBar'
import "./FrmEtudiant.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { LuUserRoundPlus } from "react-icons/lu";

const FrmEtudiant = () => {
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
                            <h3 className="h3-title">Ajout d’étudiants</h3>
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
                    <div className="detailFrm">
                        <div className="frm">
                            <div className="group-frm">
                                <h2 className="form-title">Formulaire d'Enregistrement</h2>
                                <form className="student-form">
                                    <div className="form-grid">
                                    {/* Colonne gauche */}
                                    <div className="form-column">
                                        <div className="input-group">
                                        <label htmlFor="matricule">Matricule</label>
                                        <input 
                                            type="text" 
                                            id="matricule" 
                                            placeholder="Entrez le matricule" 
                                            className="form-input"
                                        />
                                        </div>
                                        
                                        <div className="input-group">
                                        <label htmlFor="nom">Nom</label>
                                        <input 
                                            type="text" 
                                            id="nom" 
                                            placeholder="Entrez le nom" 
                                            className="form-input"
                                        />
                                        </div>
                                        
                                        <div className="input-group">
                                            <label htmlFor="prenom">Prénom</label>
                                            <input 
                                                type="text" 
                                                id="prenom" 
                                                placeholder="Entrez le prénom" 
                                                className="form-input"
                                            />
                                        </div>
                                        
                                        <div className="input-group">
                                            <label htmlFor="sexe">Sexe</label>
                                            <select id="sexe" className="form-input">
                                                <option value="">Sélectionnez le sexe</option>
                                                <option value="M">Masculin</option>
                                                <option value="F">Féminin</option>
                                            </select>
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="prenom">Date de naissance</label>
                                            <input 
                                                type="date" 
                                                id="prenom" 
                                                placeholder="Entrez le prénom" 
                                                className="form-input"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Colonne droite */}
                                    <div className="form-column">
                                        <div className="input-group">
                                            <label htmlFor="contact">Contact</label>
                                            <input 
                                                type="tel" 
                                                id="contact" 
                                                placeholder="Entrez le contact" 
                                                className="form-input"
                                            />
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="contact">Email</label>
                                            <input 
                                                type="email" 
                                                id="contact" 
                                                placeholder="Entrez le contact" 
                                                className="form-input"
                                            />
                                        </div>
                                        
                                        <div className="input-group">
                                        <label htmlFor="etablissement">Établissement</label>
                                        <select id="etablissement" className="form-input">
                                            <option value="">Sélectionnez l'établissement</option>
                                            <option value="1">Université de Yaoundé I</option>
                                            <option value="2">Université de Douala</option>
                                            <option value="3">Université de Dschang</option>
                                        </select>
                                        </div>
                                        
                                        <div className="input-group">
                                        <label htmlFor="niveau">Niveau</label>
                                        <select id="niveau" className="form-input">
                                            <option value="">Sélectionnez le niveau</option>
                                            <option value="1">Licence 1</option>
                                            <option value="2">Licence 2</option>
                                            <option value="3">Licence 3</option>
                                            <option value="4">Master 1</option>
                                            <option value="5">Master 2</option>
                                        </select>
                                        </div>
                                        
                                        <div className="input-group">
                                        <label htmlFor="image">Image</label>
                                        <div className="image-upload">
                                            <input 
                                            type="file" 
                                            id="image" 
                                            accept="image/*" 
                                            className="file-input"
                                            />
                                            <label htmlFor="image" className="upload-label">
                                            <span className="upload-text">Choisir une image</span>
                                            </label>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                    
                                    <div className="form-actions">
                                    <button type="button" className="cancel-btn">
                                        Annuler
                                    </button>
                                    <button type="submit" className="submit-btn">
                                        Enregistrer
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

export default FrmEtudiant;
