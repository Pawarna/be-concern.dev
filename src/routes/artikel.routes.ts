import { Router } from "express";
import * as artikelController from "../controllers/artikel.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { upload } from "../middlewares/upload.middleware";
import {
    getArtikelSchema,
    updateArtikelSchema,
    patchStatusSchema,
    createArtikelSchema
} from '../schemas/artikel.schema';

const router = Router();

// Public routes
router.get("/", artikelController.getPublicArtikels);
router.get("/slug/:slug", validateRequest(getArtikelSchema), artikelController.getbySlug);

// Admin routes (protected)
router.get("/admin", authenticateToken, artikelController.getAdminArtikels);
router.post("/", authenticateToken, upload.single('file'), validateRequest(createArtikelSchema), artikelController.create);
router.patch("/:id/status", authenticateToken, validateRequest(patchStatusSchema), artikelController.patchStatus);
router.put("/:id", authenticateToken, upload.single('file'), validateRequest(updateArtikelSchema), artikelController.update);
router.delete("/:id", authenticateToken, artikelController.remove);

export default router;
