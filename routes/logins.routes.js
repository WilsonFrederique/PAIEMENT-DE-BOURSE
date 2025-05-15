import express from "express";
import loginsController from "../controllers/logins.controller.js";

const router = express.Router();

// Routes d'authentification
router.post("/logins/register", loginsController.create);
router.post("/logins/login", loginsController.login);

// Routes pour la gestion des utilisateurs (protégées)
router.get("/logins/", loginsController.getAll);
router.get("/logins/:id", loginsController.getById);
router.put("/logins/:id", loginsController.update);
router.delete("/logins/:id", loginsController.remove);

// Route spéciale pour la mise à jour du mot de passe
router.put("/logins/:id/password", loginsController.updatePassword);

export default router;