import { Response, Request } from "express";
import protoService from "../services/portofolio.service";

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
        const data = req.body;
        const portofolio = await protoService.createPortofolio(data);
        return sendSuccess(res, portofolio, "Portofolio created successfully", 201);
    } catch (error) {
        console.error("Error creating portofolio:", error);
        return sendError(res, "Failed to create portofolio", 500, error);
    }
}