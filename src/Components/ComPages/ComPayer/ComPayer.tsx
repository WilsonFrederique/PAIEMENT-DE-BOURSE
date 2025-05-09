import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import "./ComPayer.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Pagination from "@mui/material/Pagination";

interface Student {
  idpaye: string;
  matricule: string;
  anneeUniv: string;
  dateTime: string;
  nombreMois: string;
}

const ComPayer = () => {
  const navigate = useNavigate();
  const [activeCrumb, setActiveCrumb] = useState("etudiant");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Données factices des étudiants (15 exemples)
  const studentsData: Student[] = [
    {
      idpaye: '1',
      matricule: 'E202501',
      anneeUniv: '2024 - 2025',
      dateTime: '01/05/2025 - 10:30',
      nombreMois: '3'
    },
    {
      idpaye: '2',
      matricule: 'E202502',
      anneeUniv: '2024 - 2025',
      dateTime: '01/05/2025 - 10:30',
      nombreMois: '3'
    },
    {
      idpaye: '3',
      matricule: 'E202503',
      anneeUniv: '2024 - 2025',
      dateTime: '01/05/2025 - 10:30',
      nombreMois: '3'
    },
    {
      idpaye: '4',
      matricule: 'E202504',
      anneeUniv: '2024 - 2025',
      dateTime: '01/05/2025 - 10:30',
      nombreMois: '3'
    },
    {
      idpaye: '5',
      matricule: 'E202505',
      anneeUniv: '2024 - 2025',
      dateTime: '01/05/2025 - 10:30',
      nombreMois: '3'
    },
    {
      idpaye: '6',
      matricule: 'E202506',
      anneeUniv: '2024 - 2025',
      dateTime: '01/05/2025 - 10:30',
      nombreMois: '3'
    },
    {
      idpaye: '7',
      matricule: 'E202507',
      anneeUniv: '2024 - 2025',
      dateTime: '01/05/2025 - 10:30',
      nombreMois: '3'
    },
    {
      idpaye: '8',
      matricule: 'E202508',
      anneeUniv: '2024 - 2025',
      dateTime: '01/05/2025 - 10:30',
      nombreMois: '3'
    },
    {
      idpaye: '9',
      matricule: 'E202509',
      anneeUniv: '2024 - 2025',
      dateTime: '01/05/2025 - 10:30',
      nombreMois: '3'
    },
    {
      idpaye: '10',
      matricule: 'E202510',
      anneeUniv: '2024 - 2025',
      dateTime: '01/05/2025 - 10:30',
      nombreMois: '3'
    },
    {
      idpaye: '11',
      matricule: 'E202511',
      anneeUniv: '2024 - 2025',
      dateTime: '01/05/2025 - 10:30',
      nombreMois: '3'
    },
    {
      idpaye: '12',
      matricule: 'E202512',
      anneeUniv: '2024 - 2025',
      dateTime: '01/05/2025 - 10:30',
      nombreMois: '3'
    },
    {
      idpaye: '13',
      matricule: 'E202513',
      anneeUniv: '2024 - 2025',
      dateTime: '01/05/2025 - 10:30',
      nombreMois: '3'
    },
    {
      idpaye: '14',
      matricule: 'E202514',
      anneeUniv: '2024 - 2025',
      dateTime: '01/05/2025 - 10:30',
      nombreMois: '3'
    },
    {
      idpaye: '15',
      matricule: 'E202515',
      anneeUniv: '2024 - 2025',
      dateTime: '01/05/2025 - 10:30',
      nombreMois: '3'
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
              <h3 className="h3-title">Paiements</h3>
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
                  onClick={() => handleCrumbClick("/payer", "payer")}
                >
                  <a 
                    href="#" 
                    className="breadcrumb-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MdOutlinePayment className="breadcrumb-icon" />
                    <span className="active-txt">Paiements</span>
                  </a>
                </li>
              </ol>
            </nav>
          </div>

          {/* Table */}
          <div className="detailDonnee">
            <div className="recentOrders">
              <div className="title-table">
                <h3 className="h3-title-table">Liste des paiements</h3>
                <div className="action-title">
                  <a href="/frmPayer"><button><IoMdAdd /> Ajouter</button></a>
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
                      <th>ID</th>
                      <th>Numéro de compte</th>
                      <th>Année universitaire</th>
                      <th>Date et heure</th>
                      <th>Nombre de mois</th>
                      <th className="action">Action</th>
                    </tr>
                  </thead>
                  <tbody className="tbody-moderne">
                    {displayData.map((row, index) => (
                      <tr key={row?.matricule || `empty-${index}`} className="tr-moderne">
                        {row ? (
                          <>
                            <td>{row.idpaye}</td>
                            <td>{row.matricule}</td>
                            <td>{row.anneeUniv}</td>
                            <td>{row.dateTime}</td>
                            <td>{row.nombreMois}</td>
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

export default ComPayer;