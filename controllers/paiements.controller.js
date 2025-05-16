import pool from "../config/db.config.js";

// ➕ Créer un paiement
async function create(req, res) {
  try {
    const { idNumCompte, AnneeUniversitaire, NombreMois, DateHeur } = req.body;
    
    // Utiliser la date envoyée par le client ou la date actuelle si non fournie
    const datePaiement = DateHeur ? new Date(DateHeur) : new Date();

    // Validation des champs obligatoires
    if (!idNumCompte || !AnneeUniversitaire || NombreMois === undefined) {
      return res.status(400).json({
        error: "idNumCompte, AnneeUniversitaire et NombreMois sont obligatoires"
      });
    }

    // Validation du format de l'année universitaire
    const anneeRegex = /^\d{4}-\d{4}$/;
    if (!anneeRegex.test(AnneeUniversitaire)) {
      return res.status(400).json({
        error: "Format d'année universitaire invalide (doit être AAAA-AAAA)"
      });
    }

    // Validation du nombre de mois
    if (NombreMois < 1 || NombreMois > 12) {
      return res.status(400).json({
        error: "NombreMois doit être compris entre 1 et 12"
      });
    }

    const [result] = await pool.query(
      `INSERT INTO paiements (idNumCompte, AnneeUniversitaire, DateHeur, NombreMois) 
       VALUES (?, ?, ?, ?)`,
      [idNumCompte, AnneeUniversitaire, datePaiement, NombreMois]
    );

    return res.status(201).json({
      message: "Paiement enregistré avec succès",
      idPaiement: result.insertId,
      DateHeur: datePaiement,
      NombreMois
    });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: "Le numéro de compte spécifié n'existe pas" });
    }
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Un paiement existe déjà pour ces paramètres" });
    }
    console.error("Erreur lors de la création du paiement:", error);
    return res.status(500).json({ error: "Erreur serveur lors de la création du paiement" });
  }
}

async function updateOne(req, res) {
  try {
    const { AnneeUniversitaire, NombreMois, DateHeur } = req.body;
    const { idPaiement } = req.params;

    // Vérifier qu'au moins un champ est fourni
    if (!AnneeUniversitaire && NombreMois === undefined && !DateHeur) {
      return res.status(400).json({ 
        error: "Au moins un champ (AnneeUniversitaire, DateHeur ou NombreMois) est requis" 
      });
    }

    let query = "UPDATE paiements SET ";
    const params = [];
    const updates = [];

    if (AnneeUniversitaire) {
      // Validation du format de l'année universitaire
      const anneeRegex = /^\d{4}-\d{4}$/;
      if (!anneeRegex.test(AnneeUniversitaire)) {
        return res.status(400).json({
          error: "Format d'année universitaire invalide (doit être AAAA-AAAA)"
        });
      }
      updates.push("AnneeUniversitaire = ?");
      params.push(AnneeUniversitaire);
    }

    if (NombreMois !== undefined) {
      // Validation du nombre de mois (1-12)
      if (NombreMois < 1 || NombreMois > 12) {
        return res.status(400).json({
          error: "NombreMois doit être compris entre 1 et 12"
        });
      }
      updates.push("NombreMois = ?");
      params.push(NombreMois);
    }

    if (DateHeur) {
      const datePaiement = new Date(DateHeur);
      updates.push("DateHeur = ?");
      params.push(datePaiement);
    }

    query += updates.join(", ") + " WHERE idPaiement = ?";
    params.push(idPaiement);

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }

    // Récupérer le paiement mis à jour pour le retourner
    const [updatedPaiement] = await pool.query(
      "SELECT * FROM paiements WHERE idPaiement = ?",
      [idPaiement]
    );

    return res.status(200).json({
      message: "Paiement mis à jour avec succès",
      paiement: updatedPaiement[0]
    });
  } catch (error) {
    console.error("Erreur lors de la modification du paiement:", error);
    return res.status(500).json({ error: "Erreur serveur lors de la modification du paiement" });
  }
}

async function deleteOne(req, res) {
  try {
    const { idPaiement } = req.params;

    // Vérifier d'abord si le paiement existe
    const [paiement] = await pool.query(
      "SELECT * FROM paiements WHERE idPaiement = ?",
      [idPaiement]
    );

    if (paiement.length === 0) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }

    const [result] = await pool.query(
      "DELETE FROM paiements WHERE idPaiement = ?",
      [idPaiement]
    );

    return res.status(200).json({
      message: "Paiement supprimé avec succès",
      paiementSupprime: paiement[0]
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du paiement:", error);
    return res.status(500).json({ error: "Erreur serveur lors de la suppression du paiement" });
  }
}

async function getAll(req, res) {
  try {
    const [result] = await pool.query(`
      SELECT p.*, n.NumeroCompte, e.Matricule, e.Nom, e.Prenom
      FROM paiements p
      JOIN tablenumcomptes n ON p.idNumCompte = n.idNumCompte
      JOIN etudiants e ON n.Matricule = e.Matricule
      ORDER BY p.DateHeur DESC
    `);
    
    // Formater les dates pour l'affichage
    const paiementsFormates = result.map(paiement => ({
      ...paiement,
      DateHeur: paiement.DateHeur ? new Date(paiement.DateHeur).toISOString() : null
    }));

    return res.status(200).json(paiementsFormates);
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements:", error);
    return res.status(500).json({ error: "Erreur serveur lors de la récupération des paiements" });
  }
}

async function getOne(req, res) {
  try {
    const { idPaiement } = req.params;

    const [result] = await pool.query(`
      SELECT p.*, 
             n.NumeroCompte, 
             e.Matricule, e.Nom, e.Prenom, e.Sexe, e.Telephone, 
             e.Email, e.Etablissement, e.Naissance, e.Img, e.idNiveau,
             niv.Niveau,
             m.Montant as montantMensuel, m.Equipement
      FROM paiements p
      JOIN tablenumcomptes n ON p.idNumCompte = n.idNumCompte
      JOIN etudiants e ON n.Matricule = e.Matricule
      LEFT JOIN niveaux niv ON e.idNiveau = niv.idNiveau
      LEFT JOIN montants m ON e.idNiveau = m.idNiveau
      WHERE p.idPaiement = ?`,
      [idPaiement]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }

    // Formater les dates pour l'affichage
    const paiementFormate = {
      ...result[0],
      DateHeur: result[0].DateHeur ? new Date(result[0].DateHeur).toISOString() : null,
      Naissance: result[0].Naissance ? new Date(result[0].Naissance).toISOString().split('T')[0] : null
    };

    return res.status(200).json(paiementFormate);
  } catch (error) {
    console.error("Erreur lors de la récupération du paiement:", error);
    return res.status(500).json({ error: "Erreur serveur lors de la récupération du paiement" });
  }
}

async function getByNumCompte(req, res) {
  try {
    const { idNumCompte } = req.params;

    const [result] = await pool.query(`
      SELECT p.*, n.NumeroCompte, e.Matricule, e.Nom, e.Prenom
      FROM paiements p
      JOIN tablenumcomptes n ON p.idNumCompte = n.idNumCompte
      JOIN etudiants e ON n.Matricule = e.Matricule
      WHERE p.idNumCompte = ?
      ORDER BY p.DateHeur DESC`,
      [idNumCompte]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Aucun paiement trouvé pour ce numéro de compte" });
    }

    // Formater les dates pour l'affichage
    const paiementsFormates = result.map(paiement => ({
      ...paiement,
      DateHeur: paiement.DateHeur ? new Date(paiement.DateHeur).toISOString() : null
    }));

    return res.status(200).json(paiementsFormates);
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements par numéro de compte:", error);
    return res.status(500).json({ error: "Erreur serveur lors de la récupération des paiements par numéro de compte" });
  }
}

async function getByAnneeUniversitaire(req, res) {
  try {
    const { annee } = req.params;

    const [result] = await pool.query(`
      SELECT p.*, n.NumeroCompte, e.Matricule, e.Nom, e.Prenom
      FROM paiements p
      JOIN tablenumcomptes n ON p.idNumCompte = n.idNumCompte
      JOIN etudiants e ON n.Matricule = e.Matricule
      WHERE p.AnneeUniversitaire = ?
      ORDER BY p.DateHeur DESC`,
      [annee]
    );

    // Formater les dates pour l'affichage
    const paiementsFormates = result.map(paiement => ({
      ...paiement,
      DateHeur: paiement.DateHeur ? new Date(paiement.DateHeur).toISOString() : null
    }));

    return res.status(200).json(paiementsFormates);
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements par année universitaire:", error);
    return res.status(500).json({ error: "Erreur serveur lors de la récupération des paiements par année universitaire" });
  }
}

async function getDashboardStats(req, res) {
  try {
    // Requête pour le nombre total d'étudiants
    const [studentsResult] = await pool.query(
      "SELECT COUNT(*) AS totalStudents FROM etudiants"
    );

    // Requête pour les paiements groupés par année
    const [paymentsByYear] = await pool.query(
      "SELECT AnneeUniversitaire, COUNT(*) AS NombrePaiements FROM paiements GROUP BY AnneeUniversitaire"
    );

    // Requête pour le montant total
    const [totalAmountResult] = await pool.query(`
      SELECT 
          SUM(Montant) + SUM(Equipement) AS TotalGeneral
      FROM montants
    `);

    return res.status(200).json({
      totalStudents: studentsResult[0].totalStudents,
      totalPayments: paymentsByYear.reduce((acc, curr) => acc + curr.NombrePaiements, 0),
      totalAmount: totalAmountResult[0].TotalGeneral || 0, // Utilisez TotalGeneral ici
      paymentsByYear,
      totalMessages: 0
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

export default {
  create,
  updateOne,
  deleteOne,
  getAll,
  getOne,
  getByNumCompte,
  getByAnneeUniversitaire,
  getDashboardStats
};