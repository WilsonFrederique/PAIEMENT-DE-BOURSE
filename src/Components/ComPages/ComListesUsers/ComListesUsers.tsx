import React, { useState, useEffect } from "react";
import './ComListesUsers.css';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GoMoveToTop } from "react-icons/go";
import { RiHomeLine } from "react-icons/ri";
import { BiMoney } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline, MdClose } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

import { getAllUsers, deleteUser, registerUser } from "../../../services/login_api";
import type { User } from "../../../services/login_api";

import NavBar from "../../../NavBar/NavBar";
import Avatar from '../../../assets/images/AvatarUser.png';

const ComListesUsers = () => {
  const navigate = useNavigate();
  const [activeCrumb, setActiveCrumb] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    Nom: '',
    Prenom: '',
    Telephone: '',
    Email: '',
    Roles: 'user',
    Passwd: '',
    Img: ''
  });
  const itemsPerPage = 5;

  // Charger les utilisateurs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token d\'authentification manquant');
        }
        
        const data = await getAllUsers(token);
        setUsers(data);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);
        toast.error("Erreur lors du chargement des utilisateurs");
        if (error instanceof Error && error.message.includes('authentification')) {
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      await registerUser(formData, token);
      toast.success("Utilisateur créé avec succès");
      setOpenAddModal(false);
      // Recharger la liste
      const data = await getAllUsers(token);
      setUsers(data);
      // Reset form
      setFormData({
        Nom: '',
        Prenom: '',
        Telephone: '',
        Email: '',
        Roles: 'user',
        Passwd: '',
        Img: ''
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création");
    }
  };


  // Gestion de la suppression
  const handleDeleteClick = (idUser: number) => {
    setUserIdToDelete(idUser);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!userIdToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }
      
      await deleteUser(userIdToDelete, token);
      toast.success("Utilisateur supprimé avec succès");
      // Recharger la liste après suppression
      const data = await getAllUsers(token);
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression");
    } finally {
      setOpenDeleteDialog(false);
      setUserIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setUserIdToDelete(null);
  };

  const handleCrumbClick = (path: string, crumbName: string) => {
    setActiveCrumb(crumbName);
    navigate(path);
    localStorage.setItem('activeSidebarItem', crumbName === "accueil" ? "acceuil" : crumbName);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Filtrage des données
  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        classes={{ paper: 'delete-confirmation-dialog' }}
      >
        <DialogTitle id="alert-dialog-title">
          <div className="dialog-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          Êtes-vous sûr de vouloir supprimer cet utilisateur ?
        </DialogTitle>
        <DialogActions>
          <Button className="cancel-btn" onClick={handleCancelDelete}>
            Annuler
          </Button>
          <Button className="confirm-btn" onClick={handleConfirmDelete} autoFocus>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <div className="main">
        <div className="Nav bar">
          <NavBar />
        </div>

        <div className="container-container">
          <div className="breadcrumb-container">
            <div>
              <h3 className="h3-title">Utilisateurs</h3>
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
                  className={`breadcrumb-step ${activeCrumb === "parametres" ? "active" : ""}`}
                  onClick={() => handleCrumbClick("/parametre", "parametres")}
                >
                  <a 
                    href="#" 
                    className="breadcrumb-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <RiHomeLine className="breadcrumb-icon" />
                    <span>Paramètres</span>
                  </a>
                </li>
                <li 
                  className={`breadcrumb-step ${activeCrumb === "users" ? "active" : ""}`}
                  onClick={() => handleCrumbClick("/listesUsers", "users")}
                >
                  <a 
                    href="#" 
                    className="breadcrumb-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <BiMoney className="breadcrumb-icon" />
                    <span className="active-txt">Utilisateurs</span>
                  </a>
                </li>
              </ol>
            </nav>
          </div>

          {/* Page pour Ajout nouveau en Forme Modal  */}
          {openAddModal && (
            <div className="modal-overlay">
              <div className="add-user-modal">
                <div className="modal-header">
                  <h2>Ajouter un nouvel utilisateur</h2>
                  <button 
                    className="close-btn"
                    onClick={() => setOpenAddModal(false)}
                  >
                    <MdClose size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="user-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nom</label>
                      <input
                        type="text"
                        name="Nom"
                        value={formData.Nom}
                        onChange={handleInputChange}
                        className="modern-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Prénom</label>
                      <input
                        type="text"
                        name="Prenom"
                        value={formData.Prenom}
                        onChange={handleInputChange}
                        className="modern-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Téléphone</label>
                      <input
                        type="tel"
                        name="Telephone"
                        value={formData.Telephone}
                        onChange={handleInputChange}
                        required
                        className="modern-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleInputChange}
                        required
                        className="modern-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Rôle</label>
                      <select
                        name="Roles"
                        value={formData.Roles}
                        onChange={handleInputChange}
                        required
                        className="modern-select"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Mot de passe</label>
                      <input
                        type="password"
                        name="Passwd"
                        value={formData.Passwd}
                        onChange={handleInputChange}
                        required
                        className="modern-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setOpenAddModal(false)}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="submit-btn"
                    >
                      Créer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="detailDonnee">
            <div className="recentOrders">
              <div className="title-table">
                <h3 className="h3-title-table">Liste des utilisateurs</h3>
                <div className="action-title">
                  <button 
                    onClick={() => setOpenAddModal(true)}
                    className="add-user-btn"
                  >
                    <IoMdAdd />
                    <span></span>
                  </button>
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
              <div className="">
                <table className="table-moderne">
                  <thead className="thead-moderne">
                    <tr className="tr-moderne">
                      <th>Image</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Téléphone</th>
                      <th>Email</th>
                      <th>Rôle</th>
                      <th className="passwrd">Mot de passe</th>
                      <th className="action">Action</th>
                    </tr>
                  </thead>
                  <tbody className="tbody-moderne">
                    {currentUsers.map((user) => (
                      <tr key={user.IDLogin} className="tr-moderne">
                        <td>
                          <img 
                            className="avatar-user" 
                            src={user.Img ? `${import.meta.env.VITE_API_URL || "http://localhost:4040/api"}/${user.Img}` : Avatar} 
                            alt={`${user.Nom} ${user.Prenom}`}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = Avatar;
                            }}
                          />
                        </td>
                        <td>{user.Nom || '-'}</td>
                        <td>{user.Prenom || '-'}</td>
                        <td>{user.Telephone || '-'}</td>
                        <td>{user.Email}</td>
                        <td>{user.Roles || '-'}</td>
                        <td className="passwrd">
                          ********
                        </td>
                        <td className="action-td">
                          {/* <a 
                            href={`/modifierUser/${user.IDLogin}`}
                            className="btn-edit"
                          >
                            <FaEdit />
                          </a> */}
                          <button 
                            className="btn-delete" 
                            onClick={() => handleDeleteClick(user.IDLogin!)}
                          >
                            <MdDeleteOutline />
                          </button>
                        </td>
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

export default ComListesUsers;