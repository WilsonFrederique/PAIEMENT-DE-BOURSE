import pool from "../config/db.config.js";

// ➕ Créer un montant
async function create(req, res) {
  try {
    const { idMontant, idNiveau, Montant, Equipement } = req.body;

    // Validation des champs obligatoires
    if (!idMontant || !idNiveau || Montant === undefined || Equipement === undefined) {
      return res.status(400).json({
        error: "Tous les champs (idMontant, idNiveau, Montant, Equipement) sont obligatoires"
      });
    }

    // Validation de la longueur des IDs
    if (idMontant.length > 5 || idNiveau.length > 5) {
      return res.status(400).json({
        error: "Les IDs ne doivent pas dépasser 5 caractères"
      });
    }

    // Validation que Montant et Equipement sont des nombres
    if (isNaN(Montant) || isNaN(Equipement)) {
      return res.status(400).json({
        error: "Montant et Equipement doivent être des nombres"
      });
    }

    const [result] = await pool.query(
      `INSERT INTO montants (idMontant, idNiveau, Montant, Equipement) VALUES (?, ?, ?, ?)`,
      [idMontant, idNiveau, Montant, Equipement]
    );

    return res.status(201).json({
      message: "Montant ajouté avec succès",
      idMontant: idMontant
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Cet idMontant existe déjà" });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: "Le niveau spécifié n'existe pas" });
    }
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// ✏️ Modifier un montant
async function updateOne(req, res) {
  try {
    const { idNiveau, Montant, Equipement } = req.body;
    const { idMontant } = req.params;

    // Validation des champs
    if (!idNiveau || Montant === undefined || Equipement === undefined) {
      return res.status(400).json({
        error: "Tous les champs (idNiveau, Montant, Equipement) sont obligatoires"
      });
    }

    // Validation des types
    if (isNaN(Montant)) {
      return res.status(400).json({ error: "Montant doit être un nombre" });
    }
    if (isNaN(Equipement)) {
      return res.status(400).json({ error: "Equipement doit être un nombre" });
    }

    const [result] = await pool.query(
      `UPDATE montants 
       SET idNiveau = ?, Montant = ?, Equipement = ? 
       WHERE idMontant = ?`,
      [idNiveau, Montant, Equipement, idMontant]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Montant non trouvé" });
    }

    return res.status(200).json({
      message: "Montant mis à jour avec succès",
      idMontant: idMontant
    });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: "Le niveau spécifié n'existe pas" });
    }
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// ❌ Supprimer un montant
async function deleteOne(req, res) {
  try {
    const { idMontant } = req.params;

    const [result] = await pool.query(
      `DELETE FROM montants WHERE idMontant = ?`,
      [idMontant]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Montant non trouvé" });
    }

    return res.status(200).json({
      message: "Montant supprimé avec succès"
    });
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// 📄 Lister tous les montants
async function getAll(req, res) {
  try {
    const [result] = await pool.query(`
      SELECT m.*, n.Niveau 
      FROM montants m
      LEFT JOIN niveaux n ON m.idNiveau = n.idNiveau
      ORDER BY m.idMontant
    `);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// 🔍 Obtenir un seul montant
async function getOne(req, res) {
  try {
    const { idMontant } = req.params;

    const [result] = await pool.query(`
      SELECT m.*, n.Niveau 
      FROM montants m
      LEFT JOIN niveaux n ON m.idNiveau = n.idNiveau
      WHERE m.idMontant = ?`,
      [idMontant]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Montant non trouvé" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// 📦 Export des fonctions
export default {
  create,
  updateOne,
  deleteOne,
  getAll,
  getOne,
};