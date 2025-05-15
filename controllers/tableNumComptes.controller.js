import pool from "../config/db.config.js";

// ➕ Créer un numéro de compte
async function create(req, res) {
  try {
    const { Matricule, NumeroCompte } = req.body;

    // Validation des champs obligatoires
    if (!Matricule || !NumeroCompte) {
      return res.status(400).json({
        error: "Matricule et NumeroCompte sont obligatoires"
      });
    }

    // Validation des longueurs
    if (Matricule.length > 10) {
      return res.status(400).json({ error: "Le matricule ne doit pas dépasser 10 caractères" });
    }
    if (NumeroCompte.length !== 8) {
      return res.status(400).json({ error: "Le numéro de compte doit avoir exactement 8 caractères" });
    }

    const [result] = await pool.query(
      `INSERT INTO tablenumcomptes (Matricule, NumeroCompte) VALUES (?, ?)`,
      [Matricule, NumeroCompte]
    );

    return res.status(201).json({
      message: "Numéro de compte ajouté avec succès",
      idNumCompte: result.insertId,
      NumeroCompte: NumeroCompte
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Ce numéro de compte existe déjà" });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: "L'étudiant spécifié n'existe pas" });
    }
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// ✏️ Modifier un numéro de compte
async function updateOne(req, res) {
  try {
    const { NumeroCompte } = req.body;
    const { idNumCompte } = req.params;

    // Validation du champ obligatoire
    if (!NumeroCompte) {
      return res.status(400).json({ error: "NumeroCompte est obligatoire" });
    }

    // Validation de la longueur
    if (NumeroCompte.length !== 8) {
      return res.status(400).json({ error: "Le numéro de compte doit avoir exactement 8 caractères" });
    }

    const [result] = await pool.query(
      `UPDATE tablenumcomptes SET NumeroCompte = ? WHERE idNumCompte = ?`,
      [NumeroCompte, idNumCompte]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Numéro de compte non trouvé" });
    }

    return res.status(200).json({
      message: "Numéro de compte mis à jour avec succès",
      idNumCompte: idNumCompte
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Ce numéro de compte existe déjà" });
    }
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// ❌ Supprimer un numéro de compte
async function deleteOne(req, res) {
  try {
    const { idNumCompte } = req.params;

    const [result] = await pool.query(
      `DELETE FROM tablenumcomptes WHERE idNumCompte = ?`,
      [idNumCompte]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Numéro de compte non trouvé" });
    }

    return res.status(200).json({
      message: "Numéro de compte supprimé avec succès"
    });
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

async function getAll(req, res) {
  try {
    const [result] = await pool.query(`
      SELECT n.*, e.Nom, e.Prenom, e.idNiveau, l.Niveau
      FROM tablenumcomptes n
      LEFT JOIN etudiants e ON n.Matricule = e.Matricule
      LEFT JOIN niveaux l ON e.idNiveau = l.idNiveau
      ORDER BY e.Nom, e.Prenom
    `);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// 🔍 Obtenir un seul numéro de compte
async function getOne(req, res) {
  try {
    const { idNumCompte } = req.params;

    const [result] = await pool.query(`
      SELECT n.*, e.Nom, e.Prenom 
      FROM tablenumcomptes n
      LEFT JOIN etudiants e ON n.Matricule = e.Matricule
      WHERE n.idNumCompte = ?`,
      [idNumCompte]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Numéro de compte non trouvé" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// 🔍 Obtenir par matricule
async function getByMatricule(req, res) {
  try {
    const { Matricule } = req.params;

    const [result] = await pool.query(`
      SELECT n.*, e.Nom, e.Prenom 
      FROM tablenumcomptes n
      LEFT JOIN etudiants e ON n.Matricule = e.Matricule
      WHERE n.Matricule = ?`,
      [Matricule]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Aucun numéro de compte trouvé pour ce matricule" });
    }

    return res.status(200).json(result);
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
  getByMatricule
};