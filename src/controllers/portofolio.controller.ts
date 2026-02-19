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
        const { title, description, link, tags } = req.body;

        if (!req.file) {
            return sendError(res, "Gambar wajib diupload", 400)
        }

        const parsedTags = typeof tags === 'string' ? JSON.parse(tags): tags;

        const tagObjects = parsedTags.map((name: string) => ({name}));
        
        const portofolioData = {
            title,
            description,
            imageUrl: `/uploads/${req.file?.filename}`,
            link,
            tags: tagObjects
        }

        const portofolio = await protoService.createPortofolio(portofolioData);
        return sendSuccess(res, {...portofolio, imageUrl: formatImageUrl(req, portofolio.imageUrl)}, "Portofolio created successfully", 201);
    } catch (error) {
        console.error("Error creating portofolio:", error);
        return sendError(res, "Failed to create portofolio", 500, error);
    }
}

export const updatePortofolio = async (req: Request, res: Response) => {
    const {id} = req.params;
    const { title, description, link, tags } = req.body;

    try {

        const existPortofolio = await protoService.getPortofolioById(Number(id))
        if (!existPortofolio){
            return await sendError(res, "Portofolio not found", 404);
        }

        let updatedImageUrl = existPortofolio.imageUrl

        if (req.file){
            updatedImageUrl = `/uploads/${req.file.filename}`
        }

        const parsedTags = typeof tags === 'string' ? JSON.parse(tags): tags;

        const tagObjects = parsedTags.map((name: string) => ({name}));
        
        const portofolioData = {
            title,
            description,
            imageUrl: updatedImageUrl,
            link,
            tags: tagObjects
        }

        const portofolio = await protoService.updatePortofolio(Number(id), portofolioData);

        return sendSuccess(res, {...portofolio, imageUrl: formatImageUrl(req, portofolio.imageUrl)}, 'Portofolio berhasil diupdate' )
    } catch (error) {
        
    }
}

export const deleteProtofolio = async (req: Request, res: Response) => {
    const {id} = req.params;

    try {
        const portofolio = await protoService.getPortofolioById(Number(id));

        if (!portofolio){
            return sendError(res, `Portofolio ID ${id} tidak ditemukan`, 404)
        }

        await protoService.deleteProtofolio(Number(id));

        return sendSuccess(res, undefined, `Delete portofolio ID `)
    } catch (error) {
        console.error(error);
        sendError(res);
    }
}