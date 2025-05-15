import pool from "./db.config.js";
import bcrypt from 'bcryptjs';

async function insertDefaultAdmin() {
  try {
    // Vérifier si l'admin existe déjà
    const [existingAdmin] = await pool.query(
      "SELECT * FROM logins WHERE Email = 'admin@admin.com'"
    );

    if (existingAdmin.length > 0) {
      console.log("L'utilisateur Admin existe déjà.");
      return;
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash("Admin123!", 10);

    // Insérer l'admin par défaut
    const [result] = await pool.query(
      `INSERT INTO logins (Nom, Prenom, Telephone, Email, Roles, Passwd, Img) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        "Admin",                // Nom
        "System",               // Prenom
        "0000000000",           // Telephone
        "admin@admin.com",      // Email
        "superadmin",           // Roles
        hashedPassword,         // Passwd haché
        null                    // Img
      ]
    );

    console.log("Administrateur créé avec succès. ID:", result.insertId);
  } catch (error) {
    console.error("Erreur lors de la création de l'admin:", error.message);
    
    // Gestion spécifique des erreurs de duplication
    if (error.code === 'ER_DUP_ENTRY') {
      console.error("L'email admin@admin.com est déjà utilisé");
    }
  } finally {
    await pool.end();
  }
}

// Exécuter la fonction
insertDefaultAdmin();