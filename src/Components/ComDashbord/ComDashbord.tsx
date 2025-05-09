import React, { useState } from "react";
import NavBar from "../../NavBar/NavBar";
import "./ComDashbord.css";
import Pagination from "@mui/material/Pagination";
import A1 from "../../assets/images/a1.png";

import { GoMoveToTop } from "react-icons/go";

const ComDashboard = () => {
    // État pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Données factices pour les paiements
    const payments = [
        {
        id: 1,
        name: "Star Refrigerator",
        niveau: "L1",
        montant: "$1200",
        status: "delivered",
        },
        {
        id: 2,
        name: "John Doe",
        niveau: "L2",
        montant: "$800",
        status: "pending",
        },
        {
        id: 3,
        name: "Jane Smith",
        niveau: "L3",
        montant: "$1500",
        status: "delivered",
        },
        {
        id: 4,
        name: "Mike Johnson",
        niveau: "M1",
        montant: "$2000",
        status: "delivered",
        },
        {
        id: 5,
        name: "Sarah Williams",
        niveau: "M2",
        montant: "$900",
        status: "rejected",
        },
        {
        id: 6,
        name: "David Brown",
        niveau: "D1",
        montant: "$1800",
        status: "delivered",
        },
        {
        id: 7,
        name: "Emily Davis",
        niveau: "D2",
        montant: "$1300",
        status: "pending",
        },
        {
        id: 8,
        name: "Robert Wilson",
        niveau: "L1",
        montant: "$1100",
        status: "delivered",
        },
        {
        id: 9,
        name: "Jennifer Lee",
        niveau: "L2",
        montant: "$950",
        status: "delivered",
        },
        {
        id: 10,
        name: "Thomas Taylor",
        niveau: "L3",
        montant: "$1600",
        status: "rejected",
        },
    ];

    // Données factices pour les étudiants
    const students = [
        { id: 1, name: "Fred", country: "Malagasy", image: A1 },
        { id: 2, name: "Sarah", country: "Canada", image: A1 },
        { id: 3, name: "John", country: "USA", image: A1 },
        { id: 4, name: "Emma", country: "UK", image: A1 },
        { id: 5, name: "Lucas", country: "France", image: A1 },
        { id: 6, name: "Sophia", country: "Germany", image: A1 },
    ];

    // Calculs pour la pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPayments = payments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(payments.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Fonction pour déterminer la classe CSS du statut
    const getStatusClass = (status) => {
        switch (status) {
        case "delivered":
            return "status delivered";
        case "pending":
            return "status pending";
        case "rejected":
            return "status rejected";
        default:
            return "status";
        }
    };

return (
    <div className="container">
        <div className="main">
            {/* Nav Bar */}
            <div className="Nav bar">
            <NavBar />
            </div>

            <div className="container-container">
                {/* Card Box Section */}
                <div className="cardBox">
                    <div className="card">
                        <div>
                            <div className="numbers">504</div>
                            <div className="cardName">Étudiant</div>
                        </div>
                        <div className="iconBx">
                            <ion-icon name="person-outline"></ion-icon>
                        </div>
                    </div>

                    <div className="card">
                        <div>
                            <div className="numbers">300</div>
                            <div className="cardName">Payer</div>
                        </div>
                        <div className="iconBx">
                            <ion-icon name="card-outline"></ion-icon>
                        </div>
                    </div>

                    <div className="card">
                        <div>
                            <div className="numbers">$900000</div>
                            <div className="cardName">Montant</div>
                        </div>
                        <div className="iconBx">
                            <ion-icon name="cash-outline"></ion-icon>
                        </div>
                    </div>

                    <div className="card">
                        <div>
                            <div className="numbers">34</div>
                            <div className="cardName">Messages</div>
                        </div>
                        <div className="iconBx">
                            <ion-icon name="chatbubble-outline"></ion-icon>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="details">
                    {/* Recent Orders */}
                    <div className="recentOrders">
                        <div className="cardHeader">
                            <h2>Dernier paiement</h2>
                            <a href="#" className="btn">
                            View All
                            </a>
                        </div>

                        <table>
                            <thead>
                            <tr>
                                <td>Nom et Prénom</td>
                                <td>Niveau</td>
                                <td>Montant</td>
                                <td>Status</td>
                            </tr>
                            </thead>
                            <tbody>
                            {currentPayments.map((payment) => (
                                <tr key={payment.id}>
                                <td>{payment.name}</td>
                                <td>{payment.niveau}</td>
                                <td>{payment.montant}</td>
                                <td>
                                    <span className={getStatusClass(payment.status)}>
                                    {payment.status}
                                    </span>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="d-flex tableFooter">
                            <p className="color-txt">
                                Affichage de <b>{indexOfFirstItem + 1}</b> à{" "}
                                <b>{Math.min(indexOfLastItem, payments.length)}</b> sur{" "}
                                <b>{payments.length}</b> résultats
                            </p>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                    color: 'blue', // Couleur du texte
                                    },
                                    '& .MuiPaginationItem-page.Mui-selected': {
                                    backgroundColor: 'rgba(44, 15, 188, 0.91)', // Fond de la page sélectionnée
                                    color: 'white', // Texte de la page sélectionnée
                                    },
                                    '& .MuiPaginationItem-page:hover': {
                                    backgroundColor: 'rgba(55, 17, 248, 0.1)', // Fond au survol
                                    }
                                }}
                                showFirstButton
                                showLastButton
                            />
                        </div>
                    </div>

                    {/* Recent Customers */}
                    <div className="recentCustomers">
                        <div className="cardHeader">
                            <h2>Étudiant</h2>
                        </div>

                        <table>
                            <tbody>
                            {students.map((student) => (
                                <tr key={student.id}>
                                <td width="60px">
                                    <div className="imgBx">
                                    <img src={student.image} alt="Customer" />
                                    </div>
                                </td>
                                <td>
                                    <h4>
                                    {student.name} <br />
                                    <span>{student.country}</span>
                                    </h4>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
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

export default ComDashboard;
