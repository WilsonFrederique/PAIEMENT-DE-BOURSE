import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SidBar.css';
import Avatar from '../assets/images/AvatarUser.png';
import Logo from '../assets/images/Logo.png';
import { setAuthToken } from '../services/login_api';

interface User {
  IDLogin?: number;
  Nom?: string;
  Prenom?: string;
  Telephone?: string;
  Email?: string;
  Roles?: string;
  Img?: string | null;
}

const SidBar = () => {
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Charger l'élément actif du sidebar
        const savedItem = localStorage.getItem('activeSidebarItem');
        if (savedItem) {
            setActiveItem(savedItem);
        }

        // Charger les informations de l'utilisateur
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleItemClick = (itemName: string) => {
        setActiveItem(itemName);
        localStorage.setItem('activeSidebarItem', itemName);
        
        // Navigation vers les routes correspondantes
        switch(itemName) {
            case 'logo':
                navigate('/');
                break;
            case 'acceuil':
                navigate('/dashbord');
                break;
            case 'etudiant':
                navigate('/etudiant');
                break;
            case 'niveau':
                navigate('/niveau');
                break;
            case 'compte':
                navigate('/numeroCompte');
                break;
            case 'montant':
                navigate('/montant');
                break;
            case 'payer':
                navigate('/payer');
                break;
            case 'messages':
                navigate('/message');
                break;
            case 'parametres':
                navigate('/parametre');
                break;
            default:
                navigate('/');
        }
    };

    // Fonction pour gérer la déconnexion
    const handleLogout = async () => {
        setIsLoggingOut(true);
        
        // Animation pendant 2.5 secondes
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Supprimer le token et les données utilisateur du localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Supprimer le token des headers axios
        setAuthToken(null);
        
        // Rediriger vers la page de login
        navigate('/');
    };

    // Fonction pour obtenir le nom complet de l'utilisateur
    const getUserName = () => {
        if (!user) return 'Administrateur';
        
        if (user.Prenom && user.Nom) {
            return `${user.Nom} ${user.Prenom}`;
        }
        return user.Prenom || user.Nom || 'Administrateur';
    };

    // Fonction pour obtenir le rôle formaté
    const getUserRole = () => {
        if (!user?.Roles) return 'Administrateur';
        
        switch(user.Roles.toLowerCase()) {
            case 'admin':
            case 'superadmin':
                return 'Administrateur';
            case 'user':
                return 'Utilisateur';
            default:
                return user.Roles;
        }
    };

    const items = [
        { 
            name: 'logo', 
            class: 'logo', 
            icon: 'school-outline', 
            title: 'PAIEMENT DE BOURSE', 
            isLogo: true,
            isSpecial: true
        },
        { name: 'acceuil', icon: 'home-outline', title: 'Tableau de bord' },
        { name: 'etudiant', icon: 'people-outline', title: 'Étudiants' },
        { name: 'compte', icon: 'card-outline', title: 'Numéro de compte' },
        { name: 'montant', icon: 'cash-outline', title: 'Montants' },
        { name: 'payer', icon: 'card-outline', title: 'Paiements' },
        { name: 'messages', icon: 'chatbubble-ellipses-outline', title: 'Messages', count: 26 },
        { name: 'parametres', icon: 'settings-outline', title: 'Paramètres' }
    ];

    return (
        <div className="navigation">
            <ul className='ul'>
                {items.map((item) => (
                    <li 
                        key={item.name}
                        className={`${item.class || ''} ${activeItem === item.name ? 'active' : ''} ${isHovered === item.name ? 'hovered' : ''} ${item.isSpecial ? 'special-logo' : ''}`}
                        onClick={() => handleItemClick(item.name)}
                        onMouseEnter={() => setIsHovered(item.name)}
                        onMouseLeave={() => setIsHovered(null)}
                    >
                        <a href="#" onClick={(e) => e.preventDefault()}>
                            <span className="icon">
                                {item.isLogo ? (
                                    <img src={Logo} alt="Logo" className="sidebar-logo" />
                                ) : (
                                    <ion-icon name={item.icon}></ion-icon>
                                )}
                            </span>
                            <span className="title">{item.title}</span>
                            {item.count && (
                                <span className="message-count">{item.count}</span>
                            )}
                        </a>
                    </li>
                ))}
            </ul>

            <div className='admin-logout-container'>
                <div className="admin-profile">
                    <div className="profile-photo">
                        <img 
                            src={user?.Img || Avatar} 
                            alt="Admin" 
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = Avatar;
                            }}
                        />
                    </div>
                    <div className="admin-info">
                        <p className="admin-name">{getUserName()}</p>
                        <p className="admin-role">{getUserRole()}</p>
                    </div>
                </div>
                <button 
                    className="logout-btn" 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                >
                    <ion-icon name="log-out-outline"></ion-icon>
                    <span>Déconnexion</span>
                    {isLoggingOut && <div className="spinner"></div>}
                </button>
            </div>
        </div>
    );
};

export default SidBar;