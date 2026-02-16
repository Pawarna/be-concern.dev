import { Router } from 'express';

import portofolioRouter from './portofolio.routes'
import uploadRouter from './uploads.routes';
import artikelRouter from './artikel.routes';
import categoryRouter from './category.routes';
import dashboardRouter from './dashboard.routes';

import { login } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use('/upload', authenticateToken, uploadRouter)

router.use('/portofolio', portofolioRouter);
router.use('/artikel', artikelRouter);
router.use('/category', categoryRouter)
router.use('/dashboard', dashboardRouter)

router.post('/login', login);

export default router;