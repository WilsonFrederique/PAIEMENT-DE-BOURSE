import express from "express";
import etudiantsController from "../controllers/etudiants.controller.js";

const router = express.Router();

router.get("/etudiants/", etudiantsController.getAllEtudiants);
router.get("/niveaux/", etudiantsController.getAllNiveaux);
router.get("/etudiants/:Matricule", etudiantsController.getOne); 
router.get("/mineurs/liste", etudiantsController.getMineurs);
router.post("/etudiants/", etudiantsController.create);
router.put("/etudiants/:Matricule", etudiantsController.updateOne);
router.delete("/etudiants/:Matricule", etudiantsController.deleteOne);

export default router;