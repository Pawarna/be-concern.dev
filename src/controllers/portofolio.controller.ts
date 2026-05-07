import { Response, Request } from "express";
import protoService from "../services/portofolio.service";
import { uploadToSupabase } from "../middlewares/upload.middleware";
const BUCKET_NAME = "uploads";


import { sendSuccess, sendError } from "../utils/response";

export const getProtofolios = async (req: Request, res: Response) => {
    try {
        const data = await protoService.getAllPortofolios();
        
        return sendSuccess(res, data, "Portofolios fetched successfully");
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
            imageUrl: req.file? await uploadToSupabase(req.file, BUCKET_NAME) : "",
            link,
            tags: tagObjects
        }

        const portofolio = await protoService.createPortofolio(portofolioData);
        return sendSuccess(res, portofolio, "Portofolio created successfully", 201);
    } catch (error) {
        console.error("Error creating portofolio:", error);
        return sendError(res, "Failed to create portofolio", 500, error);
    }
}

export const updatePortofolio = async (req: Request, res: Response) => {
    const {id} = req.params;
    const { title, description, link, tags } = req.body;

    try {

        const existPortofolio = await protoService.getPortofolioById(String(id))
        if (!existPortofolio){
            return await sendError(res, "Portofolio not found", 404);
        }

        let updatedImageUrl = existPortofolio.imageUrl

        if (req.file){
            updatedImageUrl = await uploadToSupabase(req.file, BUCKET_NAME);
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

        const portofolio = await protoService.updatePortofolio(String(id), portofolioData);

        return sendSuccess(res, portofolio, 'Portofolio berhasil diupdate' )
    } catch (error) {
        console.error("Error updating portofolio:", error);
        return sendError(res, "Failed to update portofolio", 500, error);
    }
}

export const deleteProtofolio = async (req: Request, res: Response) => {
    const {id} = req.params;

    try {
        const portofolio = await protoService.getPortofolioById(String(id));

        if (!portofolio){
            return sendError(res, `Portofolio ID ${id} tidak ditemukan`, 404)
        }

        await protoService.deleteProtofolio(String(id));

        return sendSuccess(res, undefined, `Delete portofolio ID ${id} berhasil`, 200)
    } catch (error) {
        console.error(error);
        sendError(res);
    }
}