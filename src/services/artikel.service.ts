import { prisma } from '../lib/prisma';
import type * as Prisma from '../generated/prisma/models';

import slugify from 'slugify';

// Helper Function: Membuat Slug Unik
const generateSlug = async (title: string): Promise<string> => {
  // 1. Bersihkan string (lowercase, ganti spasi jadi strip, hapus karakter aneh)
  let slug = slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
    replacement: '-'
  });

  // 2. Cek apakah slug sudah ada di database
  let uniqueSlug = slug;
  let count = 1;

  while (await prisma.artikel.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return uniqueSlug;
};

/**
 * 1. CREATE ARTIKEL
 * Menggunakan 'UncheckedCreateInput' agar bisa langsung input authorId & categoryId
 */
export const createArtikel = async (data: Prisma.ArtikelUncheckedCreateInput) => {
  // Generate slug otomatis dari title
  const slug = await generateSlug(data.title);

  return await prisma.artikel.create({
    data: {
      ...data,
      slug,
      status: data.status || 'DRAFT',
      categoryId: data.categoryId ?? null
    },
    include: {
      author: {
        select: { username: true } // Ambil info author tanpa password
      },
      category: true
    }
  });
};

/**
 * 2. GET ALL ARTIKELS (Dengan Pagination, Sorting, & Search)
 */
export const getPublicArtikels = async (params: {
  skip?: number;
  take?: number;
  search?: string; // Fitur pencarian judul
  sortBy?: string;
  order?: 'asc' | 'desc';
}) => {
  const { skip, take, search, sortBy = 'createdAt', order = 'desc' } = params;

  return await prisma.artikel.findMany({
    skip,
    take,
    where: {
      status: 'PUBLISHED',
      ...(search && {
        OR: [
          { title: { contains: search } }
        ]
      })
    },
    include: {
      author: {
        select: { username: true }
      },
      category: true
    },
    orderBy: {
      [sortBy]: order
    }
  });
};

export const getAdminArtikels = async (authorId: number, params: {
  skip?: number;
  take?: number;
  search?: string; // Fitur pencarian judul
  sortBy?: string;
  order?: 'asc' | 'desc';
}) => {
  const { skip, take, search, sortBy = 'createdAt', order = 'desc' } = params;

  return await prisma.artikel.findMany({
    skip,
    take,
    where: {
      authorId,
      ...(search && {
        OR: [
          { title: { contains: search } }
        ]
      })
    },
    include: {
      author: {
        select: { username: true }
      },
      category: true
    },
    orderBy: {
      [sortBy]: order
    }
  });
};

/**
 * 3. GET ARTIKEL BY SLUG (Untuk Halaman Detail/Baca)
 */
export const getArtikelBySlug = async (slug: string) => {
  return await prisma.artikel.findUnique({
    where: { slug },
    include: {
      author: {
        select: { username: true }
      },
      category: true
    }
  });
};

/**
 * Mendapatkan detail artikel berdasarkan ID
 * Berguna untuk pengecekan internal di Controller (Update/Delete)
 */
export const getArtikelById = async (id: number) => {
  return await prisma.artikel.findUnique({
    where: { 
      id 
    },
    include: {
      author: {
        select: { 
          username: true // Pastikan field ini sesuai dengan model Admin Anda
        }
      },
      category: true
    }
  });
};

/**
 * 4. UPDATE ARTIKEL
 */
export const updateArtikel = async (id: number, data: Prisma.ArtikelUncheckedUpdateInput) => {
  const existing = await prisma.artikel.findUnique({where: {id}});
  if (!existing) throw new Error('Artikel tidak ditemukan');

  // Di sini saya buat slug ikut berubah jika title dikirim.
  let newSlug = data.slug;
  if (data.title && typeof data.title === 'string' && !data.slug) {
     // Cek dulu apakah slug perlu diganti (logic opsional)
     newSlug = await generateSlug(data.title);
  }

  return await prisma.artikel.update({
    where: { id },
    data: {
      ...data,
      ...(newSlug && { slug: newSlug }), // Update slug hanya jika ada judul baru
      updatedAt: new Date()
    },
    include: {
      category: true
    }
  });
};


/**
 * 5. DELETE ARTIKEL
 */
export const deleteArtikel = async (id: number) => {
  return await prisma.artikel.delete({
    where: { id }
  });
};

export const updateStatus = async (id: number, status: 'DRAFT' | 'PUBLISHED') => {
  return await prisma.artikel.update({
    where: { id },
    data: { status },

  });
}

/**
 * Menghitung total artikel untuk publik (Hanya PUBLISHED)
 */
export const countPublicArtikels = async (search?: string) => {
  return await prisma.artikel.count({
    where: {
      status: 'PUBLISHED',
      ...(search && {
        OR: [{ title: { contains: search } }]
      })
    }
  });
};

/**
 * Menghitung total artikel milik Admin tertentu
 */
export const countAdminArtikels = async (authorId: number, search?: string) => {
  return await prisma.artikel.count({
    where: {
      authorId,
      ...(search && {
        OR: [{ title: { contains: search } }]
      })
    }
  });
};