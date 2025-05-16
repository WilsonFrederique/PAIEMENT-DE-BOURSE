import React, { useEffect, useState } from 'react';
import './NavBar.css';
import Avatar from '../assets/images/AvatarUser.png';
import { createContext } from 'react';

export const ThemeContext = createContext({
  darkMode: true,
  toggleTheme: () => {}
});

interface User {
  IDLogin?: number;
  Nom?: string;
  Prenom?: string;
  Telephone?: string;
  Email?: string;
  Roles?: string;
  Img?: string | null;
}

const NavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Charger l'état depuis localStorage au montage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState');
    const savedTheme = localStorage.getItem('theme');
    const savedUser = localStorage.getItem('user');
    
    if (savedState) {
      const isOpen = JSON.parse(savedState);
      setSidebarOpen(isOpen);
      toggleClasses(isOpen);
    }
    
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      setDarkMode(isDark);
      toggleThemeClasses(isDark);
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fonction pour basculer les classes CSS
  const toggleClasses = (isOpen: boolean) => {
    const navigation = document.querySelector(".navigation");
    const main = document.querySelector(".main");
    
    if (navigation && main) {
      if (isOpen) {
        navigation.classList.add("active");
        main.classList.add("active");
      } else {
        navigation.classList.remove("active");
        main.classList.remove("active");
      }
    }
  };

  // Fonction pour basculer le thème
  const toggleThemeClasses = (isDark: boolean) => {
    document.body.classList.toggle('light', !isDark);
    document.body.classList.toggle('dark', isDark);
  };

  // Gérer le toggle de la sidebar
  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarState', JSON.stringify(newState));
    toggleClasses(newState);
  };

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    toggleThemeClasses(newDarkMode);
  };

  // Fonction pour obtenir le nom complet ou le prénom
  const getUserName = () => {
    if (!user) return 'Utilisateur';
    
    if (user.Prenom) {
      return `${user.Prenom}`;
    }
    return user.Prenom || 'Utilisateur';
  };

  // Fonction pour obtenir le rôle formaté
  const getUserRole = () => {
    if (!user?.Roles) return 'Utilisateur';
    
    switch(user.Roles.toLowerCase()) {
      case 'admin':
      case 'superadmin':
        return 'Administrateur';
      default:
        return 'Utilisateur';
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <div className="place-nav">
          <div className="topbar">
              <div className="toggle" onClick={toggleSidebar}>
                  <ion-icon name="menu-outline"></ion-icon>
              </div>

              <div className="search">
                <label>
                    <input type="text" placeholder="Rechercher..." />
                    <ion-icon name="search-outline"></ion-icon>
                </label>
              </div>

              <div className="right-container">
                <div className="right">
                    <div className="top">
                    <button id="menu-btn" onClick={toggleSidebar}>
                        <ion-icon name="menu-outline"></ion-icon>
                    </button>
                    <div className="theme-toggler" onClick={toggleTheme}>
                        <ion-icon className={`moon-icon mode ${darkMode ? 'active' : ''}`} name="moon-outline"></ion-icon>
                        <ion-icon className={`sun-icon mode ${!darkMode ? 'active' : ''}`} name="sunny-outline"></ion-icon>
                    </div>
                    <div className="profile">
                        <div className="info">
                          <p>Bonjour, <b>{getUserName()}</b></p>
                          <small className="text-muted">{getUserRole()}</small>
                        </div>
                        <div className="profile-photo">
                          <img 
                            src={user?.Img || Avatar} 
                            alt="Profile" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = Avatar;
                            }}
                          />
                        </div>
                    </div>
                    </div>
                </div>
              </div>
          </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default NavBar;