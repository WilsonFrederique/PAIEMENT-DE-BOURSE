import React, { useState, useContext, useEffect } from "react";
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
import Etudiant from '../../../assets/images/Etudiant.avif';
import { ThemeContext } from "../../../NavBar/NavBar";
import { updateUser, updateUserPassword, User, setAuthToken } from "../../../services/login_api";

const ComParametres = () => {
  const navigate = useNavigate();
  const [activeCrumb, setActiveCrumb] = useState("etudiant");
  const [searchQuery, setSearchQuery] = useState("");
  const themeContext = useContext(ThemeContext);
  const [user, setUser] = useState<User | null>(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('informations');
  const [avatarImage, setAvatarImage] = useState(A2);
  const [formData, setFormData] = useState({
    Nom: '',
    Prenom: '',
    Email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Charger les données de l'utilisateur au montage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setFormData({
        Nom: userData.Nom || '',
        Prenom: userData.Prenom || '',
        Email: userData.Email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setAvatarImage(userData.Img || A2);
    }
  }, []);

  const handleCrumbClick = (path: string, crumbName: string) => {
    setActiveCrumb(crumbName);
    navigate(path);
    localStorage.setItem('activeSidebarItem', crumbName === "accueil" ? "acceuil" : crumbName);
  };

  const handleThemeChange = (isDark: boolean) => {
    if (themeContext.darkMode !== isDark) {
      themeContext.toggleTheme();
    }
  };

  const toggleEditProfileModal = () => {
    setIsEditProfileModalOpen(!isEditProfileModalOpen);
    setError('');
    setSuccess('');
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token || !user?.IDLogin) {
        throw new Error('Session invalide. Veuillez vous reconnecter.');
      }

      if (activeTab === 'informations') {
        // Mise à jour des informations de base
        const updatedData = {
          Nom: formData.Nom,
          Prenom: formData.Prenom,
          Email: formData.Email,
          Img: avatarImage === A2 ? null : avatarImage
        };

        const response = await updateUser(user.IDLogin, updatedData, token);
        
        if (response.success) {
          // Mettre à jour les données dans le localStorage
          const updatedUser = {
            ...user,
            ...updatedData,
            Img: updatedData.Img || null
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          setSuccess('Informations mises à jour avec succès');
          
          // Ajout du délai de 2.5 secondes
          await new Promise(resolve => setTimeout(resolve, 2500));
          window.location.reload(); // Actualisation de la page
        }
      } else if (activeTab === 'securite') {
        // Mise à jour du mot de passe
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('Les mots de passe ne correspondent pas');
        }

        const response = await updateUserPassword(
          user.IDLogin,
          formData.currentPassword,
          formData.newPassword,
          token
        );

        if (response.success) {
          setSuccess('Mot de passe mis à jour avec succès');
          // Réinitialiser les champs de mot de passe
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }));
          
          // Ajout du délai de 2.5 secondes
          await new Promise(resolve => setTimeout(resolve, 2500));
          window.location.reload(); // Actualisation de la page
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="main">
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
              {/* Recherche */}
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
                          <button 
                            className="security-btn password"
                            onClick={() => {
                              setActiveTab('securite');
                              toggleEditProfileModal();
                            }}
                          >
                            Changer mot de passe
                          </button>
                          <button className="security-btn logout">Déconnexion globale</button>
                        </div>
                      </div>
                    </div>

                    {/* Modal de modification de profil */}
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
                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}

                            {activeTab === 'informations' && (
                              <div className="form-section">
                                <div className="input-group">
                                  <label>Nom</label>
                                  <input 
                                    type="text" 
                                    name="Nom"
                                    value={formData.Nom}
                                    onChange={handleInputChange}
                                    className="modern-input"
                                  />
                                </div>
                                
                                <div className="input-group">
                                  <label>Prénom</label>
                                  <input 
                                    type="text" 
                                    name="Prenom"
                                    value={formData.Prenom}
                                    onChange={handleInputChange}
                                    className="modern-input"
                                  />
                                </div>
                                
                                <div className="input-group">
                                  <label>Email</label>
                                  <input 
                                    type="email" 
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleInputChange}
                                    className="modern-input"
                                  />
                                </div>
                                
                                <div className="input-group">
                                  <label>Rôle</label>
                                  <select className="modern-select" disabled>
                                    <option>{user?.Roles === 'admin' ? 'Administrateur' : 'Utilisateur'}</option>
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
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    placeholder="Entrez votre mot de passe actuel" 
                                    className="modern-input"
                                  />
                                </div>
                                <div className="input-group">
                                  <label>Nouveau mot de passe</label>
                                  <input 
                                    type="password" 
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    placeholder="Entrez votre nouveau mot de passe" 
                                    className="modern-input"
                                  />
                                </div>
                                <div className="input-group">
                                  <label>Confirmer le mot de passe</label>
                                  <input 
                                    type="password" 
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
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
                            <button 
                              className="cancel-btn" 
                              onClick={toggleEditProfileModal}
                              disabled={loading}
                            >
                              Annuler
                            </button>
                            <button 
                              className="save-changes-btn" 
                              onClick={handleSaveChanges}
                              disabled={loading}
                            >
                              {loading ? (
                                <div className="loading-animation">
                                  <div className="spinner"></div>
                                  Enregistrement...
                                </div>
                              ) : 'Enregistrer'}
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
                        <h4>Mon compte</h4>
                      </div>
                      <div className="setting-content">
                        <div className="account-info">
                          <div className="account-avatar">
                            <img src={user?.Img || A2} alt="Avatar" />
                          </div>
                          <div className="account-details">
                            <h5>{user?.Prenom || ''} {user?.Nom || ''}</h5>
                            <p>{user?.Email || ''}</p>
                            <p>Dernière connexion: Aujourd'hui, {new Date().toLocaleTimeString()}</p>
                          </div>
                        </div>

                        <button 
                          className="edit-profile-btn" 
                          onClick={() => {
                            setActiveTab('informations');
                            toggleEditProfileModal();
                          }}
                        >
                          Modifier le profil
                        </button>
                      </div>
                    </div>

                    {/* Carte Les User */}
                    <div className="setting-item user-setting">
                      <div className="setting-header">
                        <div className="setting-icon">
                          <FaGraduationCap />
                        </div>
                        <h4>Compte utilisateur</h4>
                      </div>
                      <div className="setting-content">
                        <div className="account-info">
                          <img className="img-niveau" src={Etudiant} alt="" />
                        </div>

                        <div className="security-actions">
                          <a className="a-niveau" href="/listesUsers" ><button className="security-btn user">Visiter les comptes utilisateurs</button></a>
                        </div>
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