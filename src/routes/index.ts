import { Router } from 'express';

import portofolioRouter from './portofolio.routes'
import uploadRouter from './uploads.routes';
import { login } from '../controllers/auth.controller';
import artikelRouter from './artikel.routes';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use('/upload', authenticateToken, uploadRouter)

router.use('/portofolio', portofolioRouter);
router.use('/artikel', artikelRouter)

router.post('/login', login);

export default router;