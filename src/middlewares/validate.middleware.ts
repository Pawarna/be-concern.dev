import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { sendError } from '../utils/response';

export const validateRequest = (schema: ZodObject<any>) => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return sendError(res, "Validation Error", 400, error.issues.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                })),
                );
            }
            return sendError(res, "Internal Server Error", 500);
        }
    };