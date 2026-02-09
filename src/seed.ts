import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from './generated/prisma/client'

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
})

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Sedang memulai seeding...')
  await prisma.admin.deleteMany();
  await prisma.portofolio.deleteMany();

  // Data portofolio yang mau di-input
  const portfolios = [
    {
      title: 'Dashboard Analitik Bisnis',
      description: 'Web app real-time monitoring dengan integrasi API & chart interaktif.',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
      tags: ['Vue', 'Tailwind', 'Express']
    },
    {
      title: 'Management System',
      description: 'Flutter cross-platform untuk owner & staff.',
      imageUrl: 'https://placehold.co/600x400',
      tags: ['TypeScript', 'Prisma', 'MySQL']
    },
    {
      title: 'Mobile Banking App',
      description: 'Antarmuka aplikasi mobile yang mengutamakan keamanan dan kemudahan transaksi pengguna.',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop',
      tags: ['React Native', 'Firebase', 'Redux']
    },
    {
      title: 'Portfolio Photographer',
      description: 'Website galeri foto minimalis dengan optimasi performa gambar dan animasi halus.',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
      tags: ['Vue', 'Framer Motion', 'Prisma']
    }
  ]

  for (const item of portfolios) {
    await prisma.portofolio.create({
      data: {
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        tags: {
          connectOrCreate: item.tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName }
          }))
        }
      },

    })
  }

  console.log('Seeding selesai!')

  const admin = {
    username: 'admin123',
    password: 'rahasia'
  }

  await prisma.admin.create({
    data: admin
  })


}



main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })