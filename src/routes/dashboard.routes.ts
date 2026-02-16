import Router from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
const router = Router();

// Route untuk mendapatkan statistik dashboard (hanya untuk admin)
router.get("/stats", authenticateToken, dashboardController.getDashboardStats);

export default router;