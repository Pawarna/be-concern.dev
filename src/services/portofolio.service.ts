import {prisma} from "../lib/prisma";
import { Portofolio } from "../types";

const getAllPortofolios = async () => {
    return await prisma.portofolio.findMany({
        include: {
            tags: true
        }
    });
}

const getPortofolioById = async (id: number) => {
    return await prisma.portofolio.findFirst({
        where: {
            id
        },
        include: {
            tags: true
        }
    })
}
const createPortofolio = async (data: Omit<Portofolio, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await prisma.portofolio.create({
        data: {
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl,
            link: data.link,
            tags: {
                connectOrCreate: data.tags.map(tag => ({
                    where: { name: tag.name },
                    create: { name: tag.name }
                }))
            }
        },
        include: {
            tags: true
        }
    });
}

const deleteProtofolio = async (id: number) => {
    return await prisma.portofolio.delete({
        where: {
            id
        }
    })
}

const updatePortofolio = async (id: number, data: Omit<Portofolio, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await prisma.portofolio.update({
        where: {
            id
        },
        data: {
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl,
            link: data.link,
            tags: {
                connectOrCreate: data.tags.map(tag => ({
                    where: { name: tag.name },
                    create: { name: tag.name }
                }))
            }
        },
        include: {
            tags: true
        }
    })
}

export default {
    getAllPortofolios,
    getPortofolioById,
    createPortofolio,
    updatePortofolio,
    deleteProtofolio
};
    