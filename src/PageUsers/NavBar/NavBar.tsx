import React, { useState } from 'react';
import { useSidebar } from '../SidBar/SidebarContext';

import { 
    FaBell, 
    FaSearch, 
    FaUserGraduate, 
    FaUserTie,
    FaSignOutAlt,
    FaChevronDown,
    FaChevronRight,
    FaHome,
    FaUsers,
  } from 'react-icons/fa';

const NavBar = () => {
    const { sidebarOpen, toggleSidebar } = useSidebar();

    const [activeTab, setActiveTab] = useState<'boursiers' | 'nonBoursiers' | 'annonces'>('annonces');
    const [searchTerm, setSearchTerm] = useState('');
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        console.log('User logged out');
      };

    return (
        <div>
            <div className="top-nav">
                <div className="left-section">
                    <button 
                        className="menu-btn" 
                        onClick={toggleSidebar}
                    >
                        <div className={`hamburger ${sidebarOpen ? '' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                    
                    <button 
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span>Menu</span>
                        {mobileMenuOpen ? <FaChevronDown /> : <FaChevronRight />}
                    </button>                
                    
                    {mobileMenuOpen && (
                        <div className="mobile-menu">
                            <a href="/dashbordUser">
                                <button 
                                    className={`mobile-menu-item ${activeTab === 'annonces' ? 'active' : ''}`}
                                >
                                    <FaHome className="menu-icon" />
                                    <span>Tableau de bord</span>
                                </button>
                            </a>
                            
                            <a href="/etudiantBoursier">
                                <button 
                                    className={`mobile-menu-item ${activeTab === 'boursiers' ? 'active' : ''}`}
                                >
                                    <FaUserGraduate className="menu-icon" />
                                    <span>Boursiers</span>
                                </button>
                            </a>
                            
                            <a href="/etudiantNonBoursier">
                                <button 
                                    className={`mobile-menu-item ${activeTab === 'nonBoursiers' ? 'active' : ''}`}
                                >
                                    <FaUsers className="menu-icon" />
                                    <span>Non Boursiers</span>
                                </button>
                            </a>                        
                        </div>
                    )}
                    </div>
                    
                    <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher étudiants, publications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    </div>
                    
                    <div className="right-section">
                    <div className="notifications">
                        <FaBell className="notification-icon" />
                        <span className="notification-badge">3</span>
                    </div>
                    
                    <div 
                        className="user-profile-mobile"
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    >
                        <div className="profile-pic">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User" />
                        </div>
                        {userDropdownOpen && (
                        <div className="user-dropdown mobile">
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
    )
}

export default NavBar