import { z } from 'zod';

export const createPortofolioSchema = z.object({
  body: z.object({
    title: z.string()
      .min(5, 'Judul minimal 5 karakter')
      .max(30, 'Judul maximal 30 karakter'),
      
    description: z.string()
      .min(5, 'Deskripsi minimal 5 karakter')
      .max(255, 'Deskripsi maximal 255 karakter'),
      
    link: z.string()
      .url('Format link harus berupa URL (https://...)')
      .optional()
      .or(z.literal('')), 

    tags: z.union([z.string(), z.array(z.string())])
      .optional()
      .transform((val) => {
        if (!val) return []; // Jika kosong, return array kosong
        return Array.isArray(val) ? val : [val]; // Pastikan selalu jadi array
      })
  })
});

export const updatePortofolioSchema = z.object({
  body: createPortofolioSchema.shape.body.partial()
})