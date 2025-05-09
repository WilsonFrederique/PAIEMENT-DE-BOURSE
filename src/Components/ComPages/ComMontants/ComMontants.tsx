import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../NavBar/NavBar";
import "./ComMontants.css";
import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { BiMoney } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Pagination from "@mui/material/Pagination";

interface Student {
  idmontant: string;
  niveau: string;
  montant: string;
  equipement: string;
}

const ComMontants = () => {
  const navigate = useNavigate();
  const [activeCrumb, setActiveCrumb] = useState("etudiant");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Données factices des étudiants (15 exemples)
  const studentsData: Student[] = [
    {
      idmontant: 'M00000001',
      niveau: 'L1',
      montant: '25.000 Ar',
      equipement: '6.5000 Ar'
    },
    {
      idmontant: 'M00000002',
      niveau: 'L2',
      montant: '29.000 Ar',
      equipement: '6.5000 Ar'
    },
    {
      idmontant: 'M00000003',
      niveau: 'L3',
      montant: '35.000 Ar',
      equipement: '6.5000 Ar'
    },
    {
      idmontant: 'M00000004',
      niveau: 'M1',
      montant: '40.000 Ar',
      equipement: '6.5000 Ar'
    },
    {
      idmontant: 'M00000005',
      niveau: 'M2',
      montant: '50.000 Ar',
      equipement: '6.5000 Ar'
    },
    {
      idmontant: 'M00000006',
      niveau: 'M3',
      montant: '60.000 Ar',
      equipement: '6.5000 Ar'
    },
    {
      idmontant: 'M00000007',
      niveau: 'M4',
      montant: '70.000 Ar',
      equipement: '6.5000 Ar'
    },
    {
      idmontant: 'M00000008',
      niveau: 'M5',
      montant: '100.000 Ar',
      equipement: '6.5000 Ar'
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
              <h3 className="h3-title">Montants</h3>
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
                  className={`breadcrumb-step ${activeCrumb === "montant" ? "active" : ""}`}
                  onClick={() => handleCrumbClick("/montant", "montant")}
                >
                  <a 
                    href="#" 
                    className="breadcrumb-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <BiMoney className="breadcrumb-icon" />
                    <span className="active-txt">Montants</span>
                  </a>
                </li>
              </ol>
            </nav>
          </div>

          {/* Table */}
          <div className="detailDonnee">
            <div className="recentOrders">
              <div className="title-table">
                <h3 className="h3-title-table">Liste des montants</h3>
                <div className="action-title">
                  <a href="/frmMontant"><button><IoMdAdd /> Ajouter</button></a>
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
              <div className="tableMontant">
                <table className="table-moderne">
                  <thead className="thead-moderne">
                    <tr className="tr-moderne">
                      <th>ID Montant</th>
                      <th>Niveau</th>
                      <th>Montant</th>
                      <th>équipements</th>
                      <th className="action">Action</th>
                    </tr>
                  </thead>
                  <tbody className="tbody-moderne">
                    {displayData.map((row, index) => (
                      <tr key={row?.idmontant || `empty-${index}`} className="tr-moderne">
                        {row ? (
                          <>
                            <td>{row.idmontant}</td>
                            <td>{row.niveau}</td>
                            <td>{row.montant}</td>
                            <td>{row.equipement}</td>
                            <td className="action-td">
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

export default ComMontants;