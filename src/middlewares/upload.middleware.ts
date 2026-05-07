// uploadMiddleware.ts (atau nama file middleware-mu)
import multer from 'multer';
import path from 'path';
import { supabase } from '../lib/supabase'; // Sesuaikan path ini dengan lokasi supabase.ts kamu

// 1. UBAH KE MEMORY STORAGE
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya diperbolehkan mengupload gambar!'));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // Limit 2MB
});

// 2. FUNGSI UNTUK UPLOAD KE SUPABASE
export const uploadToSupabase = async (file: Express.Multer.File, bucketName: string) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = `${uniqueSuffix}${path.extname(file.originalname)}`;

    // Upload buffer dari RAM langsung ke Supabase
    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) {
        throw new Error(`Gagal upload ke Supabase: ${error.message}`);
    }

    // Ambil URL public gambar
    const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
};