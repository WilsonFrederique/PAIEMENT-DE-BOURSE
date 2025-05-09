import React, { useEffect, useState } from 'react';
import './NavBar.css';
import Avatar from '../assets/images/avatar.png';

// import { ThemeContext } from '@emotion/react';

import { createContext } from 'react';

// Exportez le contexte pour pouvoir l'utiliser ailleurs
export const ThemeContext = createContext({
  darkMode: true,
  toggleTheme: () => {}
});

const NavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Charger l'état depuis localStorage au montage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState');
    const savedTheme = localStorage.getItem('theme');
    
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
                          <p>Bonjour, <b>Fred</b></p>
                          <small className="text-muted">Administrator</small>
                        </div>
                        <div className="profile-photo">
                          <img src={Avatar} alt="Profile" />
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