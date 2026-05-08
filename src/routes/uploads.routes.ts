import { Router } from 'express';
import { upload, uploadToSupabase } from '../middlewares/upload.middleware';
import { sendError, sendSuccess } from '../utils/response';

const router = Router();
const BUCKET_NAME = 'uploads';

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return sendError(res, 'No file uploaded', 400);
        }

        const url = await uploadToSupabase(req.file, BUCKET_NAME);

        return sendSuccess(res, { url }, "File uploaded successfully", 201);
    } catch (error: any) {
        console.error('Upload error:', error);
        return sendError(res, error.message || 'Internal Server Error', 500);
    }
});

export default router; 