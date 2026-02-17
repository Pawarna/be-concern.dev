import { prisma } from "../lib/prisma";
import slugify from "slugify";

export const createCategory = async (name: string) => {
    const slug = slugify(name, { lower: true });
    return await prisma.category.create({
        data: { name, slug}
    });
};

export const getCategories = async () => {
    return await prisma.category.findMany({
        include: {
            _count: {
                select: { artikels: true }
            }
        },
        orderBy: { name: 'asc' }
    });
};

export const updateCategory = async (id: number, name: string) => {
    const slug = slugify(name, { lower: true });
    return await prisma.category.update({
        where: { id },
        data: { name, slug }
    });
}

export const deleteCategory = async (id: number) => {
    return await prisma.category.delete({ where: {id} });
};