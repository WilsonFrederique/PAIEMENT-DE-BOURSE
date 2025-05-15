import express from "express";
import niveauxController from "../controllers/niveaux.controller.js";

const router = express.Router();

router.get("/niveaux/", niveauxController.getAll);
router.get("/niveaux/:idNiveau", niveauxController.getOne);
router.post("/niveaux/", niveauxController.create);
router.put("/niveaux/:idNiveau", niveauxController.updateOne);
router.delete("/niveaux/:idNiveau", niveauxController.deleteOne);

export default router;