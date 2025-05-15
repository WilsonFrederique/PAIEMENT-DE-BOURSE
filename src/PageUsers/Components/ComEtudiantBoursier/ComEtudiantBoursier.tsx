import React, { useState, useEffect } from 'react';
import { useSidebar } from '../../SidBar/SidebarContext';
import '../../PageUsers.css';
import { FaUserGraduate } from 'react-icons/fa';

interface Student {
  id: string;
  name: string;
  matricule: string;
  niveau: string;
  hasAccount: boolean;
  isBoursier: boolean;
  profilePic?: string;
}

const ComEtudiantBoursier = () => {
  const { activeTab } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState<'all' | 'hasAccount' | 'noAccount'>('all');
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated data fetch
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStudents([
        { 
          id: '1', 
          name: 'Jean Dupont', 
          matricule: 'ETU001', 
          niveau: 'L1', 
          hasAccount: true, 
          isBoursier: true, 
          profilePic: 'https://randomuser.me/api/portraits/men/32.jpg' 
        },
        { 
          id: '2', 
          name: 'Marie Lambert', 
          matricule: 'ETU002', 
          niveau: 'L2', 
          hasAccount: true, 
          isBoursier: true, 
          profilePic: 'https://randomuser.me/api/portraits/women/44.jpg' 
        },
        { 
          id: '3', 
          name: 'Pierre Durand', 
          matricule: 'ETU003', 
          niveau: 'L3', 
          hasAccount: true, 
          isBoursier: true, 
          profilePic: 'https://randomuser.me/api/portraits/men/75.jpg' 
        },
        { 
          id: '4', 
          name: 'Sophie Martin', 
          matricule: 'ETU004', 
          niveau: 'M1', 
          hasAccount: true, 
          isBoursier: true, 
          profilePic: 'https://randomuser.me/api/portraits/women/65.jpg' 
        },
        { 
          id: '5', 
          name: 'Lucie Petit', 
          matricule: 'ETU005', 
          niveau: 'M2', 
          hasAccount: true, 
          isBoursier: true, 
          profilePic: 'https://randomuser.me/api/portraits/women/33.jpg' 
        },
      ]);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterOption === 'hasAccount') matchesFilter = student.hasAccount;
    if (filterOption === 'noAccount') matchesFilter = !student.hasAccount;
    
    return matchesSearch && matchesFilter && student.isBoursier;
  });

  const handleRefresh = () => {
    // Simuler un rechargement des données
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="content-wrapper">
      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement des données...</p>
        </div>
      ) : (
        <div className="students-section">
          <div className="section-header">
            <h2><FaUserGraduate /> Étudiants Boursiers</h2>
            <div className="section-actions">
              <div className="search-filter-container">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Rechercher étudiants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <button className="export-btn">
                Exporter la liste
              </button>
            </div>
          </div>
          
          {filteredStudents.length > 0 ? (
            <div className="students-grid">
              {filteredStudents.map(student => (
                <div key={student.id} className="student-card">
                  <div className="student-avatar">
                    <img src={student.profilePic} alt={student.name} />
                    <span className={`account-status ${student.hasAccount ? 'active' : 'inactive'}`}>
                      {student.hasAccount ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="student-info">
                    <h3>{student.name}</h3>
                    <div className="student-meta">
                      <span className="matricule">{student.matricule}</span>
                      <span className="niveau">{student.niveau}</span>
                    </div>
                    <div className="student-actions">
                      <button className="action-btn view">Voir profil</button>
                      <button className="action-btn message">Envoyer message</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <img src="https://cdn.dribbble.com/users/2382015/screenshots/6065978/media/8b4662f8023e4e2295f865106b5d3a7e.gif" alt="No data" />
              <p>Aucun étudiant boursier trouvé</p>
              <button 
                className="refresh-btn"
                onClick={handleRefresh}
              >
                Actualiser la liste
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComEtudiantBoursier;