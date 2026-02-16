import { prisma } from '../lib/prisma';

export const getDashboardStatsService = async () => {
  // Jalankan 4 query sekaligus secara paralel
  const [totalArtikels, totalPublished, totalCategories, recentArticles] = await Promise.all([
    
    // 1. Hitung Total Semua Artikel
    prisma.artikel.count(),

    // 2. Hitung Artikel yang Published saja
    prisma.artikel.count({
      where: {
        status: 'PUBLISHED', // Pastikan sesuai enum di schema.prisma (biasanya UPPERCASE)
      },
    }),

    // 3. Hitung Total Kategori
    prisma.category.count(),

    // 4. Ambil 5 Artikel Terbaru untuk tabel
    prisma.artikel.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: {
          select: {
            name: true, // Ambil namanya saja biar payload ringan
          },
        },
        author: {
          select: {
            username: true, // Ambil nama penulis juga
          },
        },
      },
    }),
  ]);

  // Return data yang sudah rapi
  return {
    counts: {
      artikels: totalArtikels,
      published: totalPublished,
      categories: totalCategories,
    },
    recentArticles,
  };
};