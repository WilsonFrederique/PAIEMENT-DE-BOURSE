import pool from "../config/db.config.js";

// ➕ Créer un niveau
async function create(req, res) {
  try {
    const { idNiveau, Niveau } = req.body;

    if (!idNiveau || !Niveau) {
      return res.status(400).json({
        error: "idNiveau et Niveau sont obligatoires"
      });
    }

    // Validation de la longueur de idNiveau
    if (idNiveau.length > 5) {
      return res.status(400).json({
        error: "L'idNiveau ne doit pas dépasser 5 caractères"
      });
    }

    const [result] = await pool.query(
      `INSERT INTO niveaux (idNiveau, Niveau) VALUES (?, ?)`,
      [idNiveau, Niveau]
    );

    return res.status(201).json({
      message: "Niveau ajouté avec succès",
      idNiveau: idNiveau
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Cet idNiveau existe déjà" });
    }
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// ✏️ Modifier un niveau
async function updateOne(req, res) {
  try {
    const { Niveau } = req.body;
    const { idNiveau } = req.params;

    if (!Niveau) {
      return res.status(400).json({ error: "Le champ Niveau est obligatoire" });
    }

    const [result] = await pool.query(
      `UPDATE niveaux SET Niveau = ? WHERE idNiveau = ?`,
      [Niveau, idNiveau]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Niveau non trouvé" });
    }

    return res.status(200).json({
      message: "Niveau mis à jour avec succès",
      idNiveau: idNiveau
    });
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// ❌ Supprimer un niveau
async function deleteOne(req, res) {
  try {
    const { idNiveau } = req.params;

    const [result] = await pool.query(
      `DELETE FROM niveaux WHERE idNiveau = ?`,
      [idNiveau]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Niveau non trouvé" });
    }

    return res.status(200).json({
      message: "Niveau supprimé avec succès"
    });
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// 📄 Lister tous les niveaux
async function getAll(req, res) {
  try {
    const [result] = await pool.query(`SELECT * FROM niveaux ORDER BY idNiveau`);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// 🔍 Obtenir un seul niveau
async function getOne(req, res) {
  try {
    const { idNiveau } = req.params;

    const [result] = await pool.query(
      `SELECT * FROM niveaux WHERE idNiveau = ?`,
      [idNiveau]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Niveau non trouvé" });
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