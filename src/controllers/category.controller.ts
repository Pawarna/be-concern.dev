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