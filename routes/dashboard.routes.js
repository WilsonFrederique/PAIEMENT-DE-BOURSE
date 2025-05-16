import express from "express";
import dashboardController from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/stats", dashboardController.getStats);

export default router;