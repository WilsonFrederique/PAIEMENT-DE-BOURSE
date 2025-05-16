// src/components/ComDashboard/ComDashboard.tsx
import React, { useState, useEffect } from "react";
import NavBar from "../../NavBar/NavBar";
import "./ComDashbord.css";
import ComEtudiantsDashbord from "../ComPages/ComEtudiantsDashbord/ComEtudiantsDashbord";
import ComMessagesDashbord from "../ComPages/ComMessagesDashbord/ComMessagesDashbord";
import { GoMoveToTop } from "react-icons/go";
import { fetchDashboardStats, DashboardStats } from "../../services/dashboard_api";

const ComDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalPayments: 0,
    totalAmount: 0,
    totalMessages: 0,
    paymentsByYear: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques:", err);
        setError("Impossible de charger les statistiques. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Fonction pour formater les montants
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  // Fonction pour formater les nombres
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <div className="container">
      <div className="main">
        {/* Nav Bar */}
        <div className="Nav bar">
          <NavBar />
        </div>

        <div className="container-container">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Card Box Section */}
          <div className="cardBox">
            <div className="card">
              <div>
                <div className="numbers" data-testid="total-students">
                  {loading ? '...' : formatNumber(stats.totalStudents)}
                </div>
                <div className="cardName">Étudiants</div>
              </div>
              <div className="iconBx">
                <ion-icon name="person-outline"></ion-icon>
              </div>
            </div>

            <div className="card">
              <div>
                <div className="numbers" data-testid="total-payments">
                  {loading ? '...' : formatNumber(stats.totalPayments)}
                </div>
                <div className="cardName">Paiements</div>
              </div>
              <div className="iconBx">
                <ion-icon name="card-outline"></ion-icon>
              </div>
            </div>

            <div className="card">
              <div>
                <div className="numbers" data-testid="total-amount">
                    {loading ? '...' : `${formatAmount(stats.totalAmount)}`}
                </div>

                <div className="cardName">Montant total en Ar</div>
              </div>
              <div className="iconBx">
                <ion-icon name="cash-outline"></ion-icon>
              </div>
            </div>

            <div className="card">
              <div>
                <div className="numbers">
                  25
                </div>
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
              <ComEtudiantsDashbord />
            </div>

            {/* Recent Customers */}
            <div className="recentCustomers">
              <ComMessagesDashbord />                        
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