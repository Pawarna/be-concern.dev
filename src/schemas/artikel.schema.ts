
import { z } from 'zod';

export const createArtikelSchema = z.object({
    body: z.object({
        title: z.string()
            .min(1, "Judul wajib diisi")
            .min(5, "Judul minimal 5 karakter")
            .max(100, "Judul maksimal 100 karakter"),
        
        slug: z.string().optional(),
        
        content: z.string().transform((str, ctx) => {
            try {
                const parsed = JSON.parse(str);
                if (typeof parsed !== 'object' || parsed === null || parsed.type !== 'doc') {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Format konten bukan Tiptap JSON yang valid'
                    });
                    return z.NEVER;
                }
                return parsed;
            } catch (error) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Konten rusak (Invalid JSON)'
                });
                return z.NEVER;
            }
            
        }),

        thumbnail: z.string().optional(),

        status: z.enum(['DRAFT', 'PUBLISHED'], {
            error: () => ({ message: "Status harus DRAFT atau PUBLISHED" })
        }),

        categoryId: z.preprocess(
            (val) => (val === '' || val === '0' || val === null ? undefined : val),
            z.coerce.number().int().positive().optional()
        )
    })
});

export const getArtikelSchema = z.object({
    params: z.object({
        slug: z.string().min(1, "Slug diperlukan")
    })
})

export const updateArtikelSchema = z.object({
    params: z.object({
        id: z.coerce.number().min(1, "ID tidak valid")
    }),
    body: z.object({
        title: z.string().min(5).optional(),
        categoryId: z.preprocess(
            (val) => (val === "" || val === null ? undefined : val),
            z.coerce.number().optional()
        ),
        status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
        content: z.string().transform((str, ctx) => {
            try {
                const parsed = JSON.parse(str);
                return parsed;
            } catch (error) {
                ctx.addIssue({ code: 'custom', message: 'JSON rusak' });
                return z.NEVER;
            }
        }).optional(),
        slug: z.string().optional(),
    }),
});

export const patchStatusSchema = z.object({
    params: z.object({
        id: z.coerce.number().min(1, "ID tidak valid")
    }),
    body: z.object({
        status: z.enum(['DRAFT', 'PUBLISHED'], {
            error: () => ({ message: "Status harus DRAFT atau PUBLISHED" })
        })
    })
});

export type CreateArtikelDTO = z.infer<typeof createArtikelSchema>['body'];
export type UpdateArtikelDTO = z.infer<typeof updateArtikelSchema>['body'];