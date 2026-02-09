import { Response, Request } from "express";
import protoService from "../services/portofolio.service";

import { sendSuccess, sendError } from "../utils/response";
import { formatImageUrl } from "../utils/urlHelper";

export const getProtofolios = async (req: Request, res: Response) => {
    try {
        const data = await protoService.getAllPortofolios();

        const dataWithFullUrl = data.map(item => ({
      ...item,
      imageUrl: item.imageUrl ? formatImageUrl(req, item.imageUrl) : null
    }));
        
        return sendSuccess(res, dataWithFullUrl, "Portofolios fetched successfully");
    } catch (error) {
        console.error("Error fetching portofolios:", error);
        return sendError(res, "Failed to fetch portofolios", 500, error);
    }
};

export const createPortofolio = async (req: Request, res: Response) => {
    try {
        const { title, description, tags } = req.body;

        if (!req.file) {
            return sendError(res, "Gambar wajib diupload", 400)
        }

        const parsedTags = typeof tags === 'string' ? JSON.parse(tags): tags;

        const tagObjects = parsedTags.map((name: string) => ({name}));
        
        const portofolioData = {
            title,
            description,
            imageUrl: `/uploads/${req.file?.filename}`,
            tags: tagObjects
        }

        const portofolio = await protoService.createPortofolio(portofolioData);
        return sendSuccess(res, {...portofolio, imageUrl: formatImageUrl(req, portofolio.imageUrl)}, "Portofolio created successfully", 201);
    } catch (error) {
        console.error("Error creating portofolio:", error);
        return sendError(res, "Failed to create portofolio", 500, error);
    }
}