import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import "./ComMessages.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import Pagination from "@mui/material/Pagination";
import A2 from '../../../assets/images/a2.png';

interface Message {
  id: number;
  sender: string;
  time: string;
  content: string;
  read: boolean;
}

const ComMessages = () => {
  const navigate = useNavigate();
  const [activeCrumb, setActiveCrumb] = useState("etudiant");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 5;

  // Génération de 25 messages exemple
  const allMessages: Message[] = [
    { id: 1, sender: "Jean Dupont", time: "10:30 AM", content: "Bonjour, j'aimerais savoir si le produit est toujours disponible en stock ?", read: true },
    { id: 2, sender: "Marie Lambert", time: "Hier", content: "Merci pour votre commande ! Elle sera expédiée demain matin.", read: false },
    { id: 3, sender: "Support Technique", time: "Lundi", content: "Votre ticket #4567 a été résolu. N'hésitez pas à nous contacter si vous avez d'autres questions.", read: true },
    { id: 4, sender: "Paul Martin", time: "15/05", content: "Je confirme avoir reçu le colis, merci pour le suivi.", read: true },
    { id: 5, sender: "Sophie Durand", time: "14/05", content: "Pourriez-vous m'envoyer la facture proforma ?", read: false },
    { id: 6, sender: "Service Client", time: "13/05", content: "Votre demande a bien été enregistrée sous le numéro #7890", read: true },
    { id: 7, sender: "Thomas Legrand", time: "12/05", content: "Nous avons bien noté votre réclamation et la traiterons dans les plus brefs délais.", read: true },
    { id: 8, sender: "Laura Petit", time: "11/05", content: "Votre abonnement a été renouvelé avec succès.", read: false },
    { id: 9, sender: "Service Comptabilité", time: "10/05", content: "Votre paiement a été reçu, merci.", read: true },
    { id: 10, sender: "Eric Moreau", time: "09/05", content: "Le rendez-vous a été confirmé pour jeudi à 14h.", read: true },
    { id: 11, sender: "Nathalie Blanc", time: "08/05", content: "Pourriez-vous me rappeler concernant ma demande ?", read: false },
    { id: 12, sender: "David Leroy", time: "07/05", content: "Nous vous informons d'une maintenance programmée ce weekend.", read: true },
    { id: 13, sender: "Service RH", time: "06/05", content: "Votre candidature a bien été reçue.", read: true },
    { id: 14, sender: "Claire Dubois", time: "05/05", content: "Merci pour votre retour, nous en prenons note.", read: false },
    { id: 15, sender: "Marc Chevalier", time: "04/05", content: "Votre compte a été mis à jour avec les nouvelles informations.", read: true },
    { id: 16, sender: "Service Technique", time: "03/05", content: "Le problème signalé a été résolu.", read: true },
    { id: 17, sender: "Elodie Roux", time: "02/05", content: "Voulez-vous que nous programmions un appel pour en discuter ?", read: false },
    { id: 18, sender: "Alexandre Noel", time: "01/05", content: "Nous vous remercions pour votre fidélité.", read: true },
    { id: 19, sender: "Service Marketing", time: "30/04", content: "Nouvelle offre spéciale réservée à nos meilleurs clients !", read: true },
    { id: 20, sender: "Céline Meyer", time: "29/04", content: "Votre demande de devis est en cours de traitement.", read: false },
    { id: 21, sender: "Julien Bernard", time: "28/04", content: "Confirmation de votre inscription à notre newsletter.", read: true },
    { id: 22, sender: "Service SAV", time: "27/04", content: "Votre produit a été expédié ce matin.", read: true },
    { id: 23, sender: "Sandrine Laurent", time: "26/04", content: "Nous avons bien noté votre disponibilité pour le 15 mai.", read: false },
    { id: 24, sender: "Pierre Garnier", time: "25/04", content: "Merci pour votre suggestion, nous l'étudions avec attention.", read: true },
    { id: 25, sender: "Direction Générale", time: "24/04", content: "Informations importantes concernant votre compte.", read: true }
  ];

  // Filtrage des messages selon la recherche
  const filteredMessages = allMessages.filter(message =>
    message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const handleCrumbClick = (path: string, crumbName: string) => {
    setActiveCrumb(crumbName);
    navigate(path);
    localStorage.setItem('activeSidebarItem', crumbName === "accueil" ? "acceuil" : crumbName);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              <h3 className="h3-title">Messages</h3>
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
                  className={`breadcrumb-step ${activeCrumb === "messages" ? "active" : ""}`}
                  onClick={() => handleCrumbClick("/message", "messages")}
                >
                  <a 
                    href="#" 
                    className="breadcrumb-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MdOutlinePayment className="breadcrumb-icon" />
                    <span className="active-txt">Messages</span>
                  </a>
                </li>
              </ol>
            </nav>
          </div>

          {/* Table */}
          <div className="detailDonnee">
            <div className="recentOrders">
              {/* Titre et Ajout  */}
              <div className="title-table">
                <h3 className="h3-title-table">Liste des messages ({filteredMessages.length})</h3>
                <div className="action-title">
                  <button><IoMdAdd /> Ajouter</button>
                </div>
              </div>

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
                      setCurrentPage(1); // Reset à la première page lors d'une nouvelle recherche
                    }}
                  />
                </div>
              </div>

              {/* Liste  */}
              <div className="placeListeMessage">
                <div className="message-list">
                  {currentMessages.length > 0 ? (
                    currentMessages.map(message => (
                      <div 
                        key={message.id} 
                        className={`message-card ${message.read ? '' : 'unread'}`}
                      >
                        <div className="message-header">
                          <img src={A2} alt="Avatar" className="message-avatar" />
                          <div className="message-sender">{message.sender}</div>
                          <div className="message-time">{message.time}</div>
                        </div>
                        <div className="message-content">
                          <p>{message.content}</p>
                        </div>
                        <div className={`message-status ensbl-statu-btn ${message.read ? 'read' : ''}`}>
                          <div className="statu-msg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d={message.read ? 
                                "M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" : 
                                "M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022z"} />
                            </svg>
                            {message.read ? 'Lu' : 'Non lu'}
                          </div>

                          <div className="reponse">
                            <button className="repondre">Répondre</button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">
                      Aucun message trouvé pour votre recherche.
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination */}
              {filteredMessages.length > messagesPerPage && (
                <div className="pagination-container">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: (theme) => theme.palette.mode === 'dark' ? '#f9f9f9' : '#333',
                      },
                      '& .MuiPaginationItem-page.Mui-selected': {
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1976d2' : 'blue',
                        color: 'white',
                      },
                      '& .MuiPaginationItem-page:hover': {
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(55, 17, 248, 0.1)',
                      },
                      '& .MuiPaginationItem-page.Mui-selected:hover': {
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1565c0' : '#0000cc',
                      }
                    }}
                    showFirstButton
                    showLastButton
                    shape="rounded"
                  />
                </div>
              )}
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

export default ComMessages;