import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';

export const authenticateToken = ( req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return sendError(res, "Unauthorize", 401);

    jwt.verify(token, process.env.JWT_SECRET || 'rahasia_ilahi_123', (err: any, user: any) => {
        if (err) return sendError(res, 'Token not valid', 403);
        (req as any).user = user;
        next();
    });
};