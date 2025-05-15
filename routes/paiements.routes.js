import express from "express";
import paiementsController from "../controllers/paiements.controller.js";

const router = express.Router();

// Routes de base pour les paiements
router.get("/paiements/", paiementsController.getAll); 
router.get("/paiements/:idPaiement", paiementsController.getOne);
router.post("/paiements/", paiementsController.create); 
router.put("/paiements/:idPaiement", paiementsController.updateOne);
router.delete("/paiements/:idPaiement", paiementsController.deleteOne);

// Routes supplémentaires pour les filtres
router.get("/paiements/compte/:idNumCompte", paiementsController.getByNumCompte);
router.get("/paiements/annee/:annee", paiementsController.getByAnneeUniversitaire);

export default router;