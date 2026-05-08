import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import { sendError, sendSuccess } from '../utils/response';

const router = Router();

router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return sendError(res, 'No file uploaded', 400);
    }

    sendSuccess(res, { url: req.file }, "File uploaded successfully", 201);
});

export default router; 