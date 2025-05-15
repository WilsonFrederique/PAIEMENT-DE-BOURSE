import React, { useState } from 'react';
import { useSidebar } from './SidebarContext';
import { 
  FaUserGraduate, 
  FaMoneyBillWave,
  FaUserTie,
  FaSignOutAlt,
  FaChevronDown,
  FaHome,
  FaUsers,
} from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { MdSettings } from 'react-icons/md';

// Définir un type pour les onglets
type TabType = 'boursiers' | 'nonBoursiers' | 'annonces' | 'parametre';
  
export const SidBar = () => {
  const { 
    sidebarOpen, 
    toggleSidebar,
    activeTab,
    setActiveTab 
  } = useSidebar();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const handleLogout = () => {
    console.log('User logged out');
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className={`publications-app ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="app-logo">
            <FaMoneyBillWave className="logo-icon" />
            <h3>Gestion Bourses</h3>
          </div>
          <button 
            className="sidebar-close-btn"
            onClick={toggleSidebar}
          >
            &times;
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h4 className="nav-section-title">Général</h4>
            <a 
              href="/dashbordUser" 
              onClick={() => handleTabChange('annonces')}
              className="nav-link"
            >
              <button 
                className={`nav-item ${activeTab === 'annonces' ? 'active' : ''}`}
              >
                <FaHome className="nav-icon" />
                <span>Tableau de bord</span>
                <IoIosArrowForward className="nav-arrow" />
              </button>
            </a>
          </div>
          
          <div className="nav-section">
            <h4 className="nav-section-title">Gestion Étudiants</h4>
            <a 
              href="/etudiantBoursier" 
              onClick={() => handleTabChange('boursiers')}
              className="nav-link"
            >
              <button 
                className={`nav-item ${activeTab === 'boursiers' ? 'active' : ''}`}
              >
                <FaUserGraduate className="nav-icon" />
                <span>Boursiers</span>
                <IoIosArrowForward className="nav-arrow" />
              </button>
            </a>
            <a 
              href="/etudiantNonBoursier" 
              onClick={() => handleTabChange('nonBoursiers')}
              className="nav-link"
            >
              <button 
                className={`nav-item ${activeTab === 'nonBoursiers' ? 'active' : ''}`}
              >
                <FaUsers className="nav-icon" />
                <span>Non Boursiers</span>
                <IoIosArrowForward className="nav-arrow" />
              </button>
            </a>
          </div>

          <div className="nav-section">
            <h4 className="nav-section-title">Utilisateur</h4>
            <a 
              href="#" 
              onClick={() => handleTabChange('parametre')}
              className="nav-link"
            >
              <button 
                className={`nav-item ${activeTab === 'parametre' ? 'active' : ''}`}
              >
                <MdSettings className="nav-icon" />
                <span>Paramètres</span>
                <IoIosArrowForward className="nav-arrow" />
              </button>
            </a>
          </div>
        </nav>
        
        <div className="sidebar-footer">
          <div 
            className="user-profile"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          >
            <div className="profile-pic">
              <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User" />
            </div>
            <div className="profile-info">
              <span className="username">John Doe</span>
              <span className="user-role">Administrateur</span>
            </div>
            <FaChevronDown className={`dropdown-icon ${userDropdownOpen ? 'open' : ''}`} />
            
            {userDropdownOpen && (
              <div className="user-dropdown">
                <button className="dropdown-item">
                  <FaUserTie className="dropdown-icon" />
                  <span>Profil</span>
                </button>
                <button 
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="dropdown-icon" />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};