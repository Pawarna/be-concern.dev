import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import { sendError, sendSuccess } from '../utils/response';
import { formatImageUrl } from '../utils/urlHelper';

const router = Router();

router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return sendError(res, 'No file uploaded', 400);
    }

    const imageUrl = formatImageUrl(req, `/uploads/${req.file.filename}`);
    sendSuccess(res, { url: imageUrl }, "File uploaded successfully", 201);
});

export default router; 