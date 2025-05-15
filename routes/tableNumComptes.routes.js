import express from "express";
import tableNumComptesController from "../controllers/tableNumComptes.controller.js";

const router = express.Router();

// Routes de base pour les numéros de compte
router.get("/tablenumcomptes/", tableNumComptesController.getAll);
router.get("/tablenumcomptes/:idNumCompte", tableNumComptesController.getOne);
router.post("/tablenumcomptes/", tableNumComptesController.create);
router.put("/tablenumcomptes/:idNumCompte", tableNumComptesController.updateOne);
router.delete("/tablenumcomptes/:idNumCompte", tableNumComptesController.deleteOne);

// Route supplémentaire pour la recherche par matricule
router.get("/tablenumcomptes/matricule/:Matricule", tableNumComptesController.getByMatricule);

export default router;