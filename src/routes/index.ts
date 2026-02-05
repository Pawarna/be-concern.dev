import { Router } from 'express';

import portofolioRouter from './portofolio.routes'

const router = Router();

router.use('/portofolio', portofolioRouter);

export default router;