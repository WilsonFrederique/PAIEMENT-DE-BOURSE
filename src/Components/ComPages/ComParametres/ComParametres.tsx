import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import "./ComParametres.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import A2 from '../../../assets/images/avatar.png';
import Niveau from '../../../assets/images/niveau1.jpg';

import { ThemeContext } from "../../../NavBar/NavBar";

const ComParametres = () => {
  const navigate = useNavigate();
  const [activeCrumb, setActiveCrumb] = useState("etudiant");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Utilisez le contexte du thème
  const themeContext = useContext(ThemeContext);

  const handleCrumbClick = (path: string, crumbName: string) => {
    setActiveCrumb(crumbName);
    navigate(path);
    localStorage.setItem('activeSidebarItem', crumbName === "accueil" ? "acceuil" : crumbName);
  };

  // Fonction pour changer le thème
  const handleThemeChange = (isDark: boolean) => {
    if (themeContext.darkMode !== isDark) {
      themeContext.toggleTheme();
    }
  };

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const toggleEditProfileModal = () => {
    setIsEditProfileModalOpen(!isEditProfileModalOpen);
  };

  const [activeTab, setActiveTab] = useState('informations'); // 'informations', 'securite', 'notifications'

  const [avatarImage, setAvatarImage] = useState(A2); // Initialise avec l'image par défaut
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container">
      <div className="main">
        {/* Nav Bar */}
        <div className="Nav bar">
          <NavBar />
        </div>

        <div className="container-container">
          {/* Fil d'ariane */}
          <div className="breadcrumb-container">
            <div>
              <h3 className="h3-title">Paramètres</h3>
            </div>
            <nav className="breadcrumb-nav">
              <ol className="breadcrumb-path">
                <li 
                  className={`breadcrumb-step ${activeCrumb === "accueil" ? "active" : ""}`}
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
                  className={`breadcrumb-step ${activeCrumb === "parametres" ? "active" : ""}`}
                  onClick={() => handleCrumbClick("/parametre", "parametres")}
                >
                  <a 
                    href="#" 
                    className="breadcrumb-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <IoSettingsOutline className="breadcrumb-icon" />
                    <span className="active-txt">Paramètres</span>
                  </a>
                </li>
              </ol>
            </nav>
          </div>

          {/* Table */}
          <div className="detailDonnee">
            <div className="recentOrders">

              {/* Recherche  */}
              <div className="search-table">
                <div>
                  <IoSearchOutline />
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="placeListeMessage">
                <div className="settings-card">
                  <h3 className="settings-title">
                    <IoSettingsOutline className="settings-icon" />
                    Paramètres du système
                  </h3>
                  
                  <div className="settings-grid">
                    {/* Carte Thème */}
                    <div className="setting-item theme-setting">
                      <div className="setting-header">
                        <div className="setting-icon">
                          <i className="bx bxs-palette"></i>
                        </div>
                        <h4>Apparence</h4>
                      </div>
                      <div className="setting-content">
                        <p>Personnalisez le thème de l'application</p>
                        <div className="theme-options">
                          <button 
                            className={`theme-option light ${!themeContext.darkMode ? 'active' : ''}`}
                            onClick={() => handleThemeChange(false)}
                          >
                            Clair
                          </button>
                          <button 
                            className={`theme-option dark ${themeContext.darkMode ? 'active' : ''}`}
                            onClick={() => handleThemeChange(true)}
                          >
                            Sombre
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Carte Notifications */}
                    <div className="setting-item notification-setting">
                      <div className="setting-header">
                        <div className="setting-icon">
                          <i className="bx bxs-bell"></i>
                        </div>
                        <h4>Notifications</h4>
                      </div>
                      <div className="setting-content">
                        <p>Configurez vos préférences de notification</p>
                        <div className="toggle-group">
                          <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                            <span className="toggle-label">Notifications par email</span>
                          </label>
                          <label className="toggle-switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                            <span className="toggle-label">Notifications push</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Carte Sécurité */}
                    <div className="setting-item security-setting">
                      <div className="setting-header">
                        <div className="setting-icon">
                          <i className="bx bxs-lock-alt"></i>
                        </div>
                        <h4>Sécurité</h4>
                      </div>
                      <div className="setting-content">
                        <p>Options de sécurité et confidentialité</p>
                        <div className="security-actions">
                          <button className="security-btn password">Changer mot de passe</button>
                          <button className="security-btn logout">Déconnexion globale</button>
                        </div>
                      </div>
                    </div>

                    {/* Place Pour Changer complte  */}
                    {isEditProfileModalOpen && (
                      <div className="modal-overlay" onClick={toggleEditProfileModal}>
                        <div 
                          className={`modern-profile-modal ${themeContext.darkMode ? 'dark' : 'light'}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="modal-header">
                            <div className="header-content">
                              <div className="avatar-container">
                                <img src={avatarImage} alt="Avatar" className="modal-avatar" />
                                <label className="avatar-edit-label">
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="avatar-input" 
                                    onChange={handleAvatarChange}
                                  />
                                  <span className="edit-icon">📷</span>
                                </label>
                              </div>
                              <h3>Paramètres du profil</h3>
                            </div>
                            <button className="close-modal-btn" onClick={toggleEditProfileModal}>
                              &times;
                            </button>
                          </div>

                          <div className="modal-tabs">
                            <button 
                              className={`tab-btn ${activeTab === 'informations' ? 'active' : ''}`}
                              onClick={() => setActiveTab('informations')}
                            >
                              Informations
                            </button>
                            <button 
                              className={`tab-btn ${activeTab === 'securite' ? 'active' : ''}`}
                              onClick={() => setActiveTab('securite')}
                            >
                              Sécurité
                            </button>
                            <button 
                              className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                              onClick={() => setActiveTab('notifications')}
                            >
                              Notifications
                            </button>
                          </div>

                          <div className="modal-body">
                            {activeTab === 'informations' && (
                              <div className="form-section">
                                <div className="input-group">
                                  <label>Nom complet</label>
                                  <input 
                                    type="text" 
                                    defaultValue="Walle Fred" 
                                    className="modern-input"
                                  />
                                </div>
                                
                                <div className="input-group">
                                  <label>Email</label>
                                  <input 
                                    type="email" 
                                    defaultValue="wallefred@gmail.com" 
                                    className="modern-input"
                                  />
                                </div>
                                
                                <div className="input-group">
                                  <label>Rôle</label>
                                  <select className="modern-select">
                                    <option>Administrateur</option>
                                    <option>Éditeur</option>
                                    <option>Utilisateur</option>
                                  </select>
                                </div>
                              </div>
                            )}

                            {activeTab === 'securite' && (
                              <div className="password-section">
                                <h4>Changer le mot de passe</h4>
                                <div className="input-group">
                                  <label>Mot de passe actuel</label>
                                  <input 
                                    type="password" 
                                    placeholder="Entrez votre mot de passe actuel" 
                                    className="modern-input"
                                  />
                                </div>
                                <div className="input-group">
                                  <label>Nouveau mot de passe</label>
                                  <input 
                                    type="password" 
                                    placeholder="Entrez votre nouveau mot de passe" 
                                    className="modern-input"
                                  />
                                </div>
                                <div className="input-group">
                                  <label>Confirmer le mot de passe</label>
                                  <input 
                                    type="password" 
                                    placeholder="Confirmez votre nouveau mot de passe" 
                                    className="modern-input"
                                  />
                                </div>
                              </div>
                            )}

                            {activeTab === 'notifications' && (
                              <div className="notifications-section">
                                <h4>Préférences de notification</h4>
                                <div className="toggle-group">
                                  <label className="toggle-switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                    <span className="toggle-label">Notifications par email</span>
                                  </label>
                                  <label className="toggle-switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                    <span className="toggle-label">Notifications push</span>
                                  </label>
                                  <label className="toggle-switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                    <span className="toggle-label">Notifications SMS</span>
                                  </label>
                                </div>
                                <div className="input-group">
                                  <label>Heure de notification préférée</label>
                                  <select className="modern-select">
                                    <option>08:00 - 12:00</option>
                                    <option>12:00 - 16:00</option>
                                    <option>16:00 - 20:00</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="modal-footer">
                            <button className="cancel-btn" onClick={toggleEditProfileModal}>
                              Annuler
                            </button>
                            <button className="save-changes-btn">
                              Enregistrer
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Carte Compte */}
                    <div className="setting-item account-setting">
                      <div className="setting-header">
                        <div className="setting-icon">
                          <i className="bx bxs-user"></i>
                        </div>
                        <h4>Compte</h4>
                      </div>
                      <div className="setting-content">
                        <div className="account-info">
                          <div className="account-avatar">
                            <img src={A2} alt="Avatar" />
                          </div>
                          <div className="account-details">
                            <h5>Walle Fred</h5>
                            <p>wallefred@gmail.com</p>
                            <p>Dernière connexion: Aujourd'hui, 14:30</p>
                          </div>
                        </div>
                        {/* <button className="edit-profile-btn" onClick={toggleEditProfileModal}>
                          <span className="btn-icon">✏️</span>
                          <span>Modifier le profil</span>
                        </button> */}

                        <button className="edit-profile-btn" onClick={toggleEditProfileModal}>
                          Modifier le profil
                        </button>

                      </div>
                    </div>

                    {/* Carte Niveau */}
                    <div className="setting-item niveau-setting">
                      <div className="setting-header">
                        <div className="setting-icon">
                          <FaGraduationCap />
                        </div>
                        <h4>Niveau Disponible</h4>
                      </div>
                      <div className="setting-content">
                        <div className="account-info">
                          <img className="img-niveau" src={Niveau} alt="" />
                        </div>

                        <div className="security-actions">
                          <a className="a-niveau" href="/niveau"><button className="security-btn niveau">Visiter les niveaux disponibles</button></a>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="footer-text">
            <p>&copy; 2025 Gestion des paiements de bourses des étudiants | Tous droits réservés.</p>
          </div>
          <div className="footer-iconTop">
            <a onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <GoMoveToTop />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ComParametres;