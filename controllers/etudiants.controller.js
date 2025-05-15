import pool from "../config/db.config.js";

// ➕ Créer un étudiant
async function create(req, res) {
  try {
    const { 
      Matricule, 
      idNiveau, 
      Nom, 
      Prenom, 
      Sexe, 
      Telephone, 
      Email, 
      Etablissement, 
      Naissance, 
      Img 
    } = req.body;

    // Validation des champs obligatoires
    if (!Matricule || !idNiveau || !Prenom || !Sexe || !Naissance) {
      return res.status(400).json({
        error: "Matricule, idNiveau, Prenom, Sexe et Naissance sont obligatoires"
      });
    }

    // Validation des longueurs
    if (Matricule.length > 10) {
      return res.status(400).json({ error: "Le matricule ne doit pas dépasser 10 caractères" });
    }
    if (idNiveau.length > 5) {
      return res.status(400).json({ error: "L'idNiveau ne doit pas dépasser 5 caractères" });
    }

    // Validation du format de date
    if (Naissance && isNaN(new Date(Naissance).getTime())) {
      return res.status(400).json({ error: "Format de date invalide" });
    }

    const [result] = await pool.query(
      `INSERT INTO etudiants 
       (Matricule, idNiveau, Nom, Prenom, Sexe, Telephone, Email, Etablissement, Naissance, Img) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [Matricule, idNiveau, Nom, Prenom, Sexe, Telephone, Email, Etablissement, Naissance, Img]
    );

    return res.status(201).json({
      message: "Étudiant créé avec succès",
      Matricule: Matricule
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Ce matricule existe déjà" });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: "Le niveau spécifié n'existe pas" });
    }
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// ✏️ Modifier un étudiant
async function updateOne(req, res) {
  try {
    const { 
      idNiveau, 
      Nom, 
      Prenom, 
      Sexe, 
      Telephone, 
      Email, 
      Etablissement, 
      Naissance, 
      Img 
    } = req.body;
    
    const { Matricule } = req.params;

    // Validation des champs obligatoires
    if (!idNiveau || !Prenom || !Sexe || !Naissance) {
      return res.status(400).json({
        error: "idNiveau, Prenom, Sexe et Naissance sont obligatoires"
      });
    }

    // Validation du format de date
    if (Naissance && isNaN(new Date(Naissance).getTime())) {
      return res.status(400).json({ error: "Format de date invalide" });
    }

    const [result] = await pool.query(
      `UPDATE etudiants 
       SET idNiveau = ?, Nom = ?, Prenom = ?, Sexe = ?, Telephone = ?, 
           Email = ?, Etablissement = ?, Naissance = ?, Img = ?
       WHERE Matricule = ?`,
      [idNiveau, Nom, Prenom, Sexe, Telephone, Email, Etablissement, Naissance, Img, Matricule]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    return res.status(200).json({
      message: "Étudiant mis à jour avec succès",
      Matricule: Matricule
    });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: "Le niveau spécifié n'existe pas" });
    }
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// ❌ Supprimer un étudiant
async function deleteOne(req, res) {
  try {
    const { Matricule } = req.params;

    const [result] = await pool.query(
      `DELETE FROM etudiants WHERE Matricule = ?`,
      [Matricule]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    return res.status(200).json({
      message: "Étudiant supprimé avec succès"
    });
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// 📄 Lister tous les étudiants
async function getAllEtudiants(req, res) {
  try {
    const [result] = await pool.query(`
      SELECT e.*, n.Niveau 
      FROM etudiants e
      LEFT JOIN niveaux n ON e.idNiveau = n.idNiveau
      ORDER BY e.Nom, e.Prenom
    `);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// 📄 Lister tous les niveaux
async function getAllNiveaux(req, res) {
  try {
    const [result] = await pool.query(`
      SELECT * FROM niveaux
      ORDER BY idNiveau
    `);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

// 🔍 Obtenir un seul étudiant
async function getOne(req, res) {
  try {
    const { Matricule } = req.params;

    const [result] = await pool.query(`
      SELECT e.*, n.Niveau 
      FROM etudiants e
      LEFT JOIN niveaux n ON e.idNiveau = n.idNiveau
      WHERE e.Matricule = ?`,
      [Matricule]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    console.log('Image dans la base:', result[0].Img); // Ajoutez ce log
    return res.status(200).json(result[0]);
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}

export default {
  create,
  updateOne,
  deleteOne,
  getAllEtudiants,
  getAllNiveaux,
  getOne,
};