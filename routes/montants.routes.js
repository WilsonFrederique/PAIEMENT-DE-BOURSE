import express from "express";
import montantsController from "../controllers/montants.controller.js";

const router = express.Router();

router.get("/montants/", montantsController.getAll);
router.get("/montants/:idMontant", montantsController.getOne);
router.post("/montants/", montantsController.create);
router.put("/montants/:idMontant", montantsController.updateOne);
router.delete("/montants/:idMontant", montantsController.deleteOne);

export default router;