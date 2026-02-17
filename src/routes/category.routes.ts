import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { categorySchema } from '../schemas/category.schema';

const router = Router();

router.get('/', categoryController.index);

router.post('/', authenticateToken, validateRequest(categorySchema), categoryController.store);
router.put('/:id', authenticateToken, validateRequest(categorySchema), categoryController.update);
router.delete('/:id', authenticateToken, categoryController.remove);

export default router;