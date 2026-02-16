import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { sendError } from '../utils/response';

export const validateRequest = (schema: ZodObject<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });
            // assign coerced/parsed values back to req so handlers receive transformed types
            if (parsed.body) req.body = parsed.body;
            if (parsed.query) req.query = parsed.query as any;
            if (parsed.params) req.params = parsed.params as any;
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