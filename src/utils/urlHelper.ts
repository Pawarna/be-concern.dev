import { Request } from "express";

export const formatImageUrl = (req: Request, path: string | null) => {
    if(!path) return null;
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}${path}`;
};