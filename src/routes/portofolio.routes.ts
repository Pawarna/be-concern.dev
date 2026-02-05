import { Router } from 'express';

import { createPortofolio, getProtofolios } from '../controllers/portofolio.controller';

const router = Router();

router.get('/', getProtofolios);
router.post('/', createPortofolio);

export default router;
