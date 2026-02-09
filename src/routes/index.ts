import { Router } from 'express';

import portofolioRouter from './portofolio.routes'
import { login } from '../controllers/auth.controller';

const router = Router();

router.use('/portofolio', portofolioRouter);

router.post('/login', login);

export default router;