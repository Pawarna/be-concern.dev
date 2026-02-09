import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendError, sendSuccess } from "../utils/response";

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_ilahi_123';

export const login = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    try {
        const admin = await prisma.admin.findFirst({
            where: {
                username
            }
        });

        if (!admin || await bcrypt.compare(password, admin.password)){
            return sendError(res, "Username or Password wrong.", 401)
        }

        const token = jwt.sign({id: admin.id, username: admin.username}, JWT_SECRET, {
            expiresIn: '8h',
        })

        return sendSuccess(res, {token}, "Login success", 200);
        
    } catch (error) {
        sendError(res)
    }
}