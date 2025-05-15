import pool from "../config/db.config.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';

// Configuration JWT
const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// ➕ Créer un nouvel utilisateur
async function create(req, res) {
  try {
    const { Nom, Prenom, Telephone, Email, Roles, Passwd, Img } = req.body;

    // Validation des champs obligatoires
    if (!Telephone || !Email || !Passwd) {
      return res.status(400).json({
        success: false,
        message: "Telephone, Email et Passwd sont obligatoires"
      });
    }

    // Validation du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return res.status(400).json({
        success: false,
        message: "Format d'email invalide"
      });
    }

    // Validation du rôle
    const rolesValides = ['admin', 'user', 'superadmin'];
    if (!rolesValides.includes(Roles)) {
      return res.status(400).json({
        success: false,
        message: "Rôle invalide. Les rôles valides sont: admin, user, superadmin"
      });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(Passwd, 10);

    const [result] = await pool.query(
      `INSERT INTO logins (Nom, Prenom, Telephone, Email, Roles, Passwd, Img) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [Nom, Prenom, Telephone, Email, Roles, hashedPassword, Img]
    );

    return res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      data: {
        IDLogin: result.insertId,
        Nom,
        Prenom,
        Email,
        Roles
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé"
      });
    }
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création de l'utilisateur",
      error: error.message
    });
  }
}

// 🔑 Connexion utilisateur
async function login(req, res) {
  try {
    const { Email, Passwd } = req.body;

    if (!Email || !Passwd) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe sont requis"
      });
    }

    // Recherche de l'utilisateur
    const [users] = await pool.query(
      "SELECT * FROM logins WHERE Email = ?",
      [Email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    const user = users[0];

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(Passwd, user.Passwd);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    // Création du token JWT
    const token = jwt.sign(
      { 
        id: user.IDLogin, 
        email: user.Email, 
        role: user.Roles 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Ne pas renvoyer le mot de passe dans la réponse
    delete user.Passwd;

    return res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      user
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la connexion",
      error: error.message
    });
  }
}

// 📄 Lister tous les utilisateurs (pour admin)
async function getAll(req, res) {
  try {
    const [users] = await pool.query(`
      SELECT IDLogin, Nom, Prenom, Telephone, Email, Roles, Img
      FROM logins
      ORDER BY Nom, Prenom
    `);

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des utilisateurs",
      error: error.message
    });
  }
}

// 🔍 Obtenir un utilisateur par ID
async function getById(req, res) {
  try {
    const { id } = req.params;

    const [users] = await pool.query(`
      SELECT IDLogin, Nom, Prenom, Telephone, Email, Roles, Img
      FROM logins
      WHERE IDLogin = ?
    `, [id]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    return res.status(200).json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération de l'utilisateur",
      error: error.message
    });
  }
}

// ✏️ Mettre à jour un utilisateur
async function update(req, res) {
  try {
    const { id } = req.params;
    const { Nom, Prenom, Telephone, Email, Roles, Img } = req.body;

    // Vérifier qu'au moins un champ est fourni
    if (!Nom && !Prenom && !Telephone && !Email && !Roles && !Img) {
      return res.status(400).json({
        success: false,
        message: "Au moins un champ à mettre à jour est requis"
      });
    }

    let query = "UPDATE logins SET ";
    const params = [];
    const updates = [];

    if (Nom) {
      updates.push("Nom = ?");
      params.push(Nom);
    }
    if (Prenom) {
      updates.push("Prenom = ?");
      params.push(Prenom);
    }
    if (Telephone) {
      updates.push("Telephone = ?");
      params.push(Telephone);
    }
    if (Email) {
      // Validation du format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(Email)) {
        return res.status(400).json({
          success: false,
          message: "Format d'email invalide"
        });
      }
      updates.push("Email = ?");
      params.push(Email);
    }
    if (Roles) {
      // Validation du rôle
      const rolesValides = ['admin', 'user', 'superadmin'];
      if (!rolesValides.includes(Roles)) {
        return res.status(400).json({
          success: false,
          message: "Rôle invalide. Les rôles valides sont: admin, user, superadmin"
        });
      }
      updates.push("Roles = ?");
      params.push(Roles);
    }
    if (Img) {
      updates.push("Img = ?");
      params.push(Img);
    }

    query += updates.join(", ") + " WHERE IDLogin = ?";
    params.push(id);

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour avec succès"
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé"
      });
    }
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour de l'utilisateur",
      error: error.message
    });
  }
}

// ❌ Supprimer un utilisateur
async function remove(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM logins WHERE IDLogin = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Utilisateur supprimé avec succès"
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression de l'utilisateur",
      error: error.message
    });
  }
}

// 🔄 Mettre à jour le mot de passe
async function updatePassword(req, res) {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe actuel et le nouveau mot de passe sont requis"
      });
    }

    // Récupérer l'utilisateur et son mot de passe actuel
    const [users] = await pool.query(
      "SELECT Passwd FROM logins WHERE IDLogin = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    const user = users[0];

    // Vérifier le mot de passe actuel
    const isMatch = await bcrypt.compare(currentPassword, user.Passwd);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Mot de passe actuel incorrect"
      });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await pool.query(
      "UPDATE logins SET Passwd = ? WHERE IDLogin = ?",
      [hashedPassword, id]
    );

    return res.status(200).json({
      success: true,
      message: "Mot de passe mis à jour avec succès"
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour du mot de passe",
      error: error.message
    });
  }
}

export default {
  create,
  login,
  getAll,
  getById,
  update,
  remove,
  updatePassword
};