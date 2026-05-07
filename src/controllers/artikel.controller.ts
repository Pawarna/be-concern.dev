import { Request, Response } from "express";

import { CreateArtikelDTO, UpdateArtikelDTO } from "../schemas/artikel.schema";
import * as artikelService from "../services/artikel.service";
import { sendSuccess, sendError } from "../utils/response";
import { uploadToSupabase } from "../middlewares/upload.middleware";

const BUCKET_NAME = "uploads";

export const create = async (req: Request, res: Response) => {
  try {
    const payload = req.body as CreateArtikelDTO;

    const thumbnail = req.file ? await uploadToSupabase(req.file, BUCKET_NAME) : "";

    const result = await artikelService.createArtikel({
      ...payload,
      thumbnail,
      slug: payload.slug || "",
      authorId: (req as any).user?.id || 1,
      status: payload.status || "DRAFT",
      categoryId: payload.categoryId ? payload.categoryId : null
    });
    
    return sendSuccess(res, {...result}, "Artikel berhasil dibuat", 201);
  } catch (error: any) {
     return res.status(500).json({
    message: "Internal Server Error",
    error: String(error),
  });
  }
};

export const getPublicArtikels = async (req: Request, res: Response) => {
  try {
    const { skip, take, search, sortBy, order } = req.query;
    const numericSkip = skip ? Number(skip) : undefined;
    const numericTake = take ? Number(take) : undefined;
    const artikels = await artikelService.getPublicArtikels({
      skip: numericSkip,
      take: numericTake,
      search: typeof search === "string" ? search : undefined,
      sortBy: typeof sortBy === "string" ? sortBy : "createdAt",
      order: order === "asc" || order === "desc" ? order : "desc",
    });
    // compute total count for the same filter
    const where: any = { status: "PUBLISHED" };
    if (typeof search === "string" && search) {
      where.OR = [{ title: { contains: search } }];
    }
    const total = await require("../lib/prisma").prisma.artikel.count({
      where,
    });
    const responsePayload = {
      items: artikels,
      meta: {
        total,
        skip: numericSkip,
        take: numericTake,
      },
    };

    

    return sendSuccess(res, responsePayload, undefined, 200);
  } catch (error: any) {
    return sendError(res);
  }
};

export const getAdminArtikels = async (req: Request, res: Response) => {
  try {
    const { skip, take, search, sortBy, order } = req.query;
    const authorId = (req as any).user?.id || 1;
    const numericSkip = skip ? Number(skip) : undefined;
    const numericTake = take ? Number(take) : undefined;
    const artikels = await artikelService.getAdminArtikels(authorId, {
      skip: numericSkip,
      take: numericTake,
      search: typeof search === "string" ? search : undefined,
      sortBy: typeof sortBy === "string" ? sortBy : "createdAt",
      order: order === "asc" || order === "desc" ? order : "desc",
    });
    // count total for this author and optional search
    const where: any = { authorId };
    if (typeof search === "string" && search) {
      where.OR = [{ title: { contains: search } }];
    }
    const total = await require("../lib/prisma").prisma.artikel.count({
      where,
    });
    const responsePayload = {
      items: artikels,
      meta: {
        total,
        skip: numericSkip,
        take: numericTake,
      },
    };


    return sendSuccess(res, responsePayload, undefined, 200);
  } catch (error: any) {
    return sendError(res);
  }
};


export const getbySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const artikel = await artikelService.getArtikelBySlug(slug as string);

    if (!artikel) {
      return sendError(res, "Artikel tidak ditemukan", 404);
    }


    return sendSuccess(res, artikel, undefined, 200);
  } catch (error: any) {
    return sendError(res, error.message, undefined);
  }
};

export const getbyId = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const artikel = await artikelService.getArtikelById(id);

    if (!artikel) {
      return sendError(res, "Artikel tidak ditemukan", 404);
    }

    return sendSuccess(res, artikel, undefined, 200);
  } catch (error: any) {
    return sendError(res, error.message, undefined);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const payload = req.body as UpdateArtikelDTO;

    const currentArtikel = await artikelService.getArtikelById(id);
    if (!currentArtikel) return sendError(res, "Not Found", 404);

    
    const result = await artikelService.updateArtikel(id, payload);


    return sendSuccess(res, result, "Artikel berhasil diupdate", 200);
  } catch (error: any) {
    console.error(error);
    return sendError(res, 'Internal Server Error', 500, { stack: error?.stack });
  }
};

export const patchStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    const existing = await artikelService.getArtikelById(id);
    if (!existing) {
      return sendError(res, "Artikel tidak ditemukan", 404);
    }

    const result = await artikelService.updateStatus(id, status);

    return sendSuccess(
      res,
      result,
      `Artikel berhasil diubah menjadi ${status}`,
      200,
    );
  } catch (error: any) {
    return sendError(res);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const artikel = await artikelService.getArtikelById(id);

    if (!artikel) {
      return sendError(res, "Artikel tidak ditemukan", 404);
    }


    await artikelService.deleteArtikel(id);

    return sendSuccess(res, null, "Artikel berhasil dihapus", 200);
  } catch (error: any) {
    return sendError(res);
  }
};
