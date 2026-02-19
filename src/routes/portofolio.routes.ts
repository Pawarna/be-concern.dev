import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import { createPortofolio, deleteProtofolio, getProtofolios, updatePortofolio } from '../controllers/portofolio.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { createPortofolioSchema, updatePortofolioSchema } from '../schemas/portofolio.schema'

const router = Router();

router.get('/', getProtofolios);
router.post('/', authenticateToken, upload.single('file'), validateRequest(createPortofolioSchema), createPortofolio);
router.delete('/:id', authenticateToken, deleteProtofolio);
router.put('/:id', authenticateToken, upload.single('file'), validateRequest(updatePortofolioSchema), updatePortofolio)

export default router;
