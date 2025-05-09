import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import "./ComEtudiants.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Pagination from "@mui/material/Pagination";

interface Student {
  matricule: string;
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: string;
  contact: string;
  mail: string;
  etablissement: string;
  niveau: string;
}

const ComEtudiants = () => {
  const navigate = useNavigate();
  const [activeCrumb, setActiveCrumb] = useState("etudiant");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Données factices des étudiants (15 exemples)
  const studentsData: Student[] = [
    {
      matricule: 'E202501',
      nom: 'Mensah',
      prenom: 'David',
      sexe: 'Masculin',
      dateNaissance: '2000-03-12',
      contact: '+228 90123456',
      mail: 'mensah.david@example.com',
      etablissement: 'Université de Lomé',
      niveau: 'L1'
    },
    {
      matricule: 'E202502',
      nom: 'Akou',
      prenom: 'Linda',
      sexe: 'Féminin',
      dateNaissance: '1999-11-05',
      contact: '+228 90234567',
      mail: 'linda.akou@example.com',
      etablissement: 'Institut National Polytechnique',
      niveau: 'L1'
    },
    {
      matricule: 'E202503',
      nom: 'Kodjo',
      prenom: 'Samuel',
      sexe: 'Masculin',
      dateNaissance: '2001-07-22',
      contact: '+228 90345678',
      mail: 'samuel.kodjo@example.com',
      etablissement: 'École Supérieure de Commerce',
      niveau: 'L1'
    },
    {
      matricule: 'E202504',
      nom: 'Gbeassor',
      prenom: 'Afi',
      sexe: 'Féminin',
      dateNaissance: '2000-05-18',
      contact: '+228 90456789',
      mail: 'afi.gbeassor@example.com',
      etablissement: 'Université de Kara',
      niveau: 'L1'
    },
    {
      matricule: 'E202505',
      nom: 'Agbeko',
      prenom: 'Koffi',
      sexe: 'Masculin',
      dateNaissance: '1999-09-30',
      contact: '+228 90567890',
      mail: 'koffi.agbeko@example.com',
      etablissement: 'Université de Lomé',
      niveau: 'L1'
    },
    {
      matricule: 'E202506',
      nom: 'Doe',
      prenom: 'John',
      sexe: 'Masculin',
      dateNaissance: '2000-01-15',
      contact: '+228 90678901',
      mail: 'john.doe@example.com',
      etablissement: 'Institut National Polytechnique',
      niveau: 'L1'
    },
    {
      matricule: 'E202507',
      nom: 'Smith',
      prenom: 'Jane',
      sexe: 'Féminin',
      dateNaissance: '2001-02-20',
      contact: '+228 90789012',
      mail: 'jane.smith@example.com',
      etablissement: 'École Supérieure de Commerce',
      niveau: 'L1'
    },
    {
      matricule: 'E202508',
      nom: 'Johnson',
      prenom: 'Mike',
      sexe: 'Masculin',
      dateNaissance: '1999-12-10',
      contact: '+228 90890123',
      mail: 'mike.johnson@example.com',
      etablissement: 'Université de Kara',
      niveau: 'L1'
    },
    {
      matricule: 'E202509',
      nom: 'Williams',
      prenom: 'Sarah',
      sexe: 'Féminin',
      dateNaissance: '2000-08-25',
      contact: '+228 90901234',
      mail: 'sarah.williams@example.com',
      etablissement: 'Université de Lomé',
      niveau: 'L1'
    },
    {
      matricule: 'E202510',
      nom: 'Brown',
      prenom: 'David',
      sexe: 'Masculin',
      dateNaissance: '2001-04-05',
      contact: '+228 90012345',
      mail: 'david.brown@example.com',
      etablissement: 'Institut National Polytechnique',
      niveau: 'L1'
    },
    {
      matricule: 'E202511',
      nom: 'Davis',
      prenom: 'Emily',
      sexe: 'Féminin',
      dateNaissance: '1999-07-15',
      contact: '+228 90123456',
      mail: 'emily.davis@example.com',
      etablissement: 'École Supérieure de Commerce',
      niveau: 'L1'
    },
    {
      matricule: 'E202512',
      nom: 'Wilson',
      prenom: 'Robert',
      sexe: 'Masculin',
      dateNaissance: '2000-10-30',
      contact: '+228 90234567',
      mail: 'robert.wilson@example.com',
      etablissement: 'Université de Kara',
      niveau: 'L1'
    },
    {
      matricule: 'E202513',
      nom: 'Lee',
      prenom: 'Jennifer',
      sexe: 'Féminin',
      dateNaissance: '2001-03-22',
      contact: '+228 90345678',
      mail: 'jennifer.lee@example.com',
      etablissement: 'Université de Lomé',
      niveau: 'L1'
    },
    {
      matricule: 'E202514',
      nom: 'Taylor',
      prenom: 'Thomas',
      sexe: 'Masculin',
      dateNaissance: '1999-06-18',
      contact: '+228 90456789',
      mail: 'thomas.taylor@example.com',
      etablissement: 'Institut National Polytechnique',
      niveau: 'L1'
    },
    {
      matricule: 'E202515',
      nom: 'Anderson',
      prenom: 'Jessica',
      sexe: 'Féminin',
      dateNaissance: '2000-09-08',
      contact: '+228 90567890',
      mail: 'jessica.anderson@example.com',
      etablissement: 'École Supérieure de Commerce',
      niveau: 'L1'
    }
  ];

  const handleCrumbClick = (path: string, crumbName: string) => {
    setActiveCrumb(crumbName);
    navigate(path);
    localStorage.setItem('activeSidebarItem', crumbName === "accueil" ? "acceuil" : crumbName);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const filteredStudents = studentsData.filter(student =>
    Object.values(student).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

  // Créer un tableau avec toujours 10 éléments
  const displayData = [...currentStudents];
  while (displayData.length < itemsPerPage) {
    displayData.push(null);
  }

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
              <h3 className="h3-title">Étudiants</h3>
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
                  className={`breadcrumb-step ${activeCrumb === "etudiant" ? "active" : ""}`}
                  onClick={() => handleCrumbClick("/etudiant", "etudiant")}
                >
                  <a 
                    href="#" 
                    className="breadcrumb-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <CiUser className="breadcrumb-icon" />
                    <span className="active-txt">Étudiants</span>
                  </a>
                </li>
              </ol>
            </nav>
          </div>

          {/* Table */}
          <div className="detailDonnee">
            <div className="recentOrders">
              <div className="title-table">
                <h3 className="h3-title-table">Liste des étudiants</h3>
                <div className="action-title">
                  <a href="/frmEtudiant"><button><IoMdAdd />Ajouter</button></a>
                </div>
              </div>
              <div className="search-table">
                <div>
                  <IoSearchOutline />
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="table">
                <table className="table-moderne">
                  <thead className="thead-moderne">
                    <tr className="tr-moderne">
                      <th>Matricule</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Sexe</th>
                      {/* <th>Date de naissance</th> */}
                      <th>Contact</th>
                      {/* <th>Mail</th> */}
                      <th>Établissement</th>
                      <th>Niveau</th>
                      <th className="action">Action</th>
                    </tr>
                  </thead>
                  <tbody className="tbody-moderne">
                    {displayData.map((row, index) => (
                      <tr key={row?.matricule || `empty-${index}`} className="tr-moderne">
                        {row ? (
                          <>
                            <td>{row.matricule}</td>
                            <td>{row.nom}</td>
                            <td>{row.prenom}</td>
                            <td>{row.sexe}</td>
                            {/* <td>{row.dateNaissance}</td> */}
                            <td>{row.contact}</td>
                            {/* <td>{row.mail}</td> */}
                            <td>{row.etablissement}</td>
                            <td>{row.niveau}</td>
                            <td className="action-td">
                              <button className="btn-detail"><FaRegEye /></button>
                              <button className="btn-edit"><FaEdit /></button>
                              <button className="btn-delete"><MdDeleteOutline /></button>
                            </td>
                          </>
                        ) : (
                          // Ligne vide
                          <>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            {/* <td>&nbsp;</td> */}
                            <td>&nbsp;</td>
                            {/* <td>&nbsp;</td> */}
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination-container">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'blue',
                    },
                    '& .MuiPaginationItem-page.Mui-selected': {
                      backgroundColor: 'rgba(44, 15, 188, 0.91)',
                      color: 'white',
                    },
                    '& .MuiPaginationItem-page:hover': {
                      backgroundColor: 'rgba(55, 17, 248, 0.1)',
                    }
                  }}
                  showFirstButton
                  showLastButton
                />
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

export default ComEtudiants;