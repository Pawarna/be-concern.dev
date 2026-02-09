import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import { createPortofolio, getProtofolios } from '../controllers/portofolio.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getProtofolios);
router.post('/', authenticateToken, upload.single('image'), createPortofolio);

export default router;
