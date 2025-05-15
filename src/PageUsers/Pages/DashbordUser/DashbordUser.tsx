import React, { useState, useEffect } from 'react';
import { useSidebar } from '../../SidBar/SidebarContext';
import { SidBar } from '../../SidBar/SidBar';
import NavBar from '../../NavBar/NavBar';

import { 
  FaCalendarAlt, 
  FaUserGraduate, 
  FaUniversity, 
  FaRegBell,
  FaRegCalendarAlt,
  FaFileAlt
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import '../../PageUsers.css';

interface Student {
  id: string;
  name: string;
  matricule: string;
  niveau: string;
  hasAccount: boolean;
  isBoursier: boolean;
  profilePic?: string;
}

interface Publication {
  id: string;
  title: string;
  content: string;
  date: string;
  isImportant: boolean;
  author: string;
  type: 'calendar' | 'document' | 'general';
}

const DashbordUser = () => {
  const [activeTab, setActiveTab] = useState<'boursiers' | 'nonBoursiers' | 'annonces'>('annonces');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState<'all' | 'hasAccount' | 'noAccount'>('all');
  const [students, setStudents] = useState<Student[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated data fetch
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStudents([
        { id: '1', name: 'Jean Dupont', matricule: 'ETU001', niveau: 'L1', hasAccount: true, isBoursier: true, profilePic: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { id: '2', name: 'Marie Lambert', matricule: 'ETU002', niveau: 'L2', hasAccount: true, isBoursier: true, profilePic: 'https://randomuser.me/api/portraits/women/44.jpg' },
        { id: '3', name: 'Pierre Durand', matricule: 'ETU003', niveau: 'L3', hasAccount: false, isBoursier: false, profilePic: 'https://randomuser.me/api/portraits/men/75.jpg' },
        { id: '4', name: 'Sophie Martin', matricule: 'ETU004', niveau: 'M1', hasAccount: true, isBoursier: false, profilePic: 'https://randomuser.me/api/portraits/women/65.jpg' },
        { id: '5', name: 'Lucie Petit', matricule: 'ETU005', niveau: 'M2', hasAccount: false, isBoursier: false, profilePic: 'https://randomuser.me/api/portraits/women/33.jpg' },
      ]);

      setPublications([
        { 
          id: '1', 
          title: 'Calendrier des bourses 2023-2024', 
          content: 'Les paiements des bourses pour le premier semestre commenceront le 15 octobre 2023. Veuillez vous assurer que vos informations bancaires sont à jour dans votre profil. Bonne journée', 
          date: '2023-09-20', 
          isImportant: true,
          author: 'Admin Bourses',
          type: 'calendar'
        },
        { 
          id: '2', 
          title: 'Documents requis pour renouvellement', 
          content: 'À partir de cette année, les documents suivants sont requis pour le renouvellement des dossiers de bourse : Relevé de notes, Attestation d\'inscription, et une copie de la pièce d\'identité.', 
          date: '2023-09-15', 
          isImportant: false,
          author: 'Service des Bourses',
          type: 'document'
        },
        { 
          id: '3', 
          title: 'Nouveau système de paiement', 
          content: 'Nous passons à un nouveau système de paiement électronique. Tous les bénéficiaires doivent mettre à jour leurs informations bancaires avant le 30 septembre.', 
          date: '2023-09-10', 
          isImportant: true,
          author: 'Direction Financière',
          type: 'general'
        },
      ]);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    console.log('User logged out');
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterOption === 'hasAccount') matchesFilter = student.hasAccount;
    if (filterOption === 'noAccount') matchesFilter = !student.hasAccount;
    
    return matchesSearch && matchesFilter;
  });

  const boursiers = filteredStudents.filter(student => student.isBoursier);
  const nonBoursiers = filteredStudents.filter(student => !student.isBoursier);

  const importantPublications = publications.filter(pub => pub.isImportant);
  const calendarPublications = publications.filter(pub => pub.type === 'calendar');
  const documentPublications = publications.filter(pub => pub.type === 'document');

  const getPublicationIcon = (type: string) => {
    switch(type) {
      case 'calendar': return <FaRegCalendarAlt className="publication-icon calendar" />;
      case 'document': return <FaFileAlt className="publication-icon document" />;
      default: return <FaRegBell className="publication-icon general" />;
    }
  };

  const { sidebarOpen } = useSidebar();

  return (
    <div className={`publications-app ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar */}
      <SidBar />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation */}
        <NavBar/>

        {/* Content */}
        <div className="content-wrapper">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Chargement des données...</p>
            </div>
          ) : (
            <>
                {/* TABLEAU DE BORD  */}
              {activeTab === 'annonces' && (
                <div className="announcements-section">
                  <div className="section-header">
                    <h2><MdDashboard /> Tableau de bord</h2>
                    {/* <button className="new-publication-btn">
                      + Nouvelle publication
                    </button> */}
                  </div>

                  {/* Card  */}
                  <div className="dashboard-stats">
                    <div className="stat-card">
                      <div className="stat-icon students">
                        <FaUserGraduate />
                      </div>
                      <div className="stat-info">
                        <h3>{students.filter(s => s.isBoursier).length}</h3>
                        <p>Étudiants boursiers</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon non-boursiers">
                        <FaUniversity />
                      </div>
                      <div className="stat-info">
                        <h3>{students.filter(s => !s.isBoursier).length}</h3>
                        <p>Non boursiers</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon publications">
                        <FaFileAlt />
                      </div>
                      <div className="stat-info">
                        <h3>{publications.length}</h3>
                        <p>Publications</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents administratifs */}
                  <div className="publications-categories">
                    <div className="category">
                      <h3><FaFileAlt /> Documents administratifs</h3>
                      {documentPublications.length > 0 ? (
                        <div className="announcements-grid">
                          {documentPublications.map(pub => (
                            <div key={pub.id} className="announcement-card">
                              <div className="card-header">
                                {getPublicationIcon(pub.type)}
                                <div className="card-title-wrapper">
                                  <h4>{pub.title}</h4>
                                  <span className="date">{new Date(pub.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                              </div>
                              <div className="card-content">
                                <p>{pub.content}</p>
                              </div>
                              <div className="card-footer">
                                <span className="author">Publié par: {pub.author}</span>
                                <button className="action-btn">Télécharger</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-data-sm">
                          <p>Aucune publication dans cette catégorie</p>
                          <button className="action-btn">Créer une publication</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="publications-categories">
                    <div className="category">
                      <h3><FaFileAlt /> Documents administratifs</h3>
                      {documentPublications.length > 0 ? (
                        <div className="announcements-grid">
                          {documentPublications.map(pub => (
                            <div key={pub.id} className="announcement-card">
                              <div className="card-header">
                                {getPublicationIcon(pub.type)}
                                <div className="card-title-wrapper">
                                  <h4>{pub.title}</h4>
                                  <span className="date">{new Date(pub.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                              </div>
                              <div className="card-content">
                                <p>{pub.content}</p>
                              </div>
                              <div className="card-footer">
                                <span className="author">Publié par: {pub.author}</span>
                                <button className="action-btn">Télécharger</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-data-sm">
                          <p>Aucune publication dans cette catégorie</p>
                          <button className="action-btn">Créer une publication</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Annonces importantes  */}
                  {importantPublications.length > 0 && (
                    <div className="important-announcements">
                      <h3>Annonces importantes <span className="badge">{importantPublications.length}</span></h3>
                      <div className="announcements-grid">
                        {importantPublications.map(pub => (
                          <div key={pub.id} className="announcement-card important">
                            <div className="card-header">
                              {getPublicationIcon(pub.type)}
                              <div className="card-title-wrapper">
                                <h4>{pub.title}</h4>
                                <span className="date">{new Date(pub.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                              </div>
                            </div>
                            <div className="card-content">
                              <p>{pub.content}</p>
                            </div>
                            <div className="card-footer">
                              <span className="author">Publié par: {pub.author}</span>
                              <div className="card-actions">
                                <button className="action-btn">Épingler</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {importantPublications.length > 0 && (
                    <div className="important-announcements">
                      <h3>Annonces importantes <span className="badge">{importantPublications.length}</span></h3>
                      <div className="announcements-grid">
                        {importantPublications.map(pub => (
                          <div key={pub.id} className="announcement-card important">
                            <div className="card-header">
                              {getPublicationIcon(pub.type)}
                              <div className="card-title-wrapper">
                                <h4>{pub.title}</h4>
                                <span className="date">{new Date(pub.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                              </div>
                            </div>
                            <div className="card-content">
                              <p>{pub.content}</p>
                            </div>
                            <div className="card-footer">
                              <span className="author">Publié par: {pub.author}</span>
                              <div className="card-actions">
                                <button className="action-btn">Épingler</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {importantPublications.length > 0 && (
                    <div className="important-announcements">
                      <h3>Annonces importantes <span className="badge">{importantPublications.length}</span></h3>
                      <div className="announcements-grid">
                        {importantPublications.map(pub => (
                          <div key={pub.id} className="announcement-card important">
                            <div className="card-header">
                              {getPublicationIcon(pub.type)}
                              <div className="card-title-wrapper">
                                <h4>{pub.title}</h4>
                                <span className="date">{new Date(pub.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                              </div>
                            </div>
                            <div className="card-content">
                              <p>{pub.content}</p>
                            </div>
                            <div className="card-footer">
                              <span className="author">Publié par: {pub.author}</span>
                              <div className="card-actions">
                                <button className="action-btn">Épingler</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashbordUser;