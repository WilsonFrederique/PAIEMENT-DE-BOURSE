// controllers/dashboard.controller.js
import pool from "../config/db.config.js";

async function getStats(req, res) {
  try {
    // 1. Nombre total d'étudiants
    const [[{ totalStudents }]] = await pool.query(
      'SELECT COUNT(*) AS totalStudents FROM etudiants'
    );

    // 2. Nombre total de paiements (groupés par année universitaire)
    const [[{ totalPayments }]] = await pool.query(
      'SELECT COUNT(*) AS totalPayments FROM paiements'
    );

    // 3. Montant total (somme des montants de base + équipements)
    const [[{ totalAmount }]] = await pool.query(`
      SELECT 
        SUM(m.Montant) + SUM(m.Equipement) AS totalAmount
      FROM 
        montants m
    `);

    return res.status(200).json({
      totalStudents: Number(totalStudents),
      totalPayments: Number(totalPayments),
      totalAmount: Number(totalAmount) || 0,
      totalMessages: 0 // Pas de table messages
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return res.status(500).json({ 
      error: "Erreur serveur lors de la récupération des statistiques",
      details: error.message
    });
  }
}

export default {
  getStats
};