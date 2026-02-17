import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import { sendError, sendSuccess } from '../utils/response';

export const index = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getCategories();
        return sendSuccess(res, categories);
    } catch (error) {
        return sendError(res)
    }
}

export const store = async (req: Request, res: Response) => {
    try {
        const {name} = req.body;
        const category = await categoryService.createCategory(name);
        return sendSuccess(res, category);
    } catch (error) {
        return sendError(res)
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await categoryService.updateCategory(Number(id), name);
        return sendSuccess(res, category);
    } catch (error) {
        return sendError(res)
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await categoryService.deleteCategory(Number(id));
        return sendSuccess(res, null, "Category deleted successfully");
    } catch (error) {
        return sendError(res)
    }

}