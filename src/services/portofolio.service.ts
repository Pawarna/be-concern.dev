import {prisma} from "../lib/prisma";
import { Portofolio } from "../types";

const getAllPortofolios = async () => {
    return await prisma.portofolio.findMany({
        include: {
            tags: true
        }
    });
}

const createPortofolio = async (data: Omit<Portofolio, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await prisma.portofolio.create({
        data: {
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl,
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

export default {
    getAllPortofolios,
    createPortofolio
};
    