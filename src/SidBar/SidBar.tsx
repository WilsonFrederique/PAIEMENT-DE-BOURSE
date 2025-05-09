import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SidBar.css';
import Avatar from '../assets/images/avatar.png';
import Logo from '../assets/images/Logo.png';

const SidBar = () => {
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedItem = localStorage.getItem('activeSidebarItem');
        if (savedItem) {
            setActiveItem(savedItem);
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
        // { name: 'niveau', icon: 'school-outline', title: 'Niveau' },
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
                        <img src={Avatar} alt="Admin" />
                    </div>
                    <div className="admin-info">
                        <p className="admin-name">Walle Freed</p>
                        <p className="admin-role">Administrator</p>
                    </div>
                </div>
                <button className="logout-btn">
                    <ion-icon name="log-out-outline"></ion-icon>
                    <span>Déconnexion</span>
                </button>
            </div>
        </div>
    );
};

export default SidBar;