import { Request, Response } from "express";
import path from "node:path";
import fs from "fs";

import { CreateArtikelDTO, UpdateArtikelDTO } from "../schemas/artikel.schema";
import * as artikelService from "../services/artikel.service";
import { sendSuccess, sendError } from "../utils/response";
import { formatImageUrl } from "../utils/urlHelper";

export const create = async (req: Request, res: Response) => {
  try {
    const payload = req.body as CreateArtikelDTO;

    const thumbnail = req.file ? `/uploads/${req.file.filename}` : "";

    const result = await artikelService.createArtikel({
      ...payload,
      thumbnail,
      slug: payload.slug || "",
      authorId: (req as any).user?.id || 1,
      status: payload.status || "DRAFT",
      categoryId: payload.categoryId ? Number(payload.categoryId) : null
    });

    const formattedCreatedThumb = formatImageUrl(req, result.thumbnail);
    if (formattedCreatedThumb) result.thumbnail = formattedCreatedThumb;

    return sendSuccess(res, {...result}, "Artikel berhasil dibuat", 201);
  } catch (error: any) {
    return sendError(res);
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

    // format thumbnail to full url
    responsePayload.items = responsePayload.items.map((artikel) => {
      const formatted = artikel.thumbnail ? formatImageUrl(req, artikel.thumbnail) : null;
      return {
        ...artikel,
        thumbnail: formatted,
      } as any;
    });

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
    const artikels = await artikelService.getAdminArtikels(Number(authorId), {
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

    // format thumbnail to full url
    responsePayload.items = responsePayload.items.map((artikel) => {
      const formatted = artikel.thumbnail ? formatImageUrl(req, artikel.thumbnail) : null;
      return {
        ...artikel,
        thumbnail: formatted,
      } as any;
    });

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

    if (artikel.thumbnail) {
      const formatted = formatImageUrl(req, artikel.thumbnail);
      if (formatted) artikel.thumbnail = formatted;
    }

    return sendSuccess(res, artikel, undefined, 200);
  } catch (error: any) {
    return sendError(res, error.message, undefined);
  }
};

export const getbyId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const artikel = await artikelService.getArtikelById(id);

    if (!artikel) {
      return sendError(res, "Artikel tidak ditemukan", 404);
    }

    if (artikel.thumbnail) {
      const formatted = formatImageUrl(req, artikel.thumbnail);
      if (formatted) artikel.thumbnail = formatted;
    }

    return sendSuccess(res, artikel, undefined, 200);
  } catch (error: any) {
    return sendError(res, error.message, undefined);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payload = req.body as UpdateArtikelDTO;

    const currentArtikel = await artikelService.getArtikelById(id);
    if (!currentArtikel) return sendError(res, "Not Found", 404);

    let thumbnailPath = currentArtikel.thumbnail;
    if (req.file) {
      thumbnailPath = `/uploads/${req.file.filename}`;

      if (currentArtikel.thumbnail) {
        const oldPath = path.join(
          __dirname,
          "../../uploads",
          currentArtikel.thumbnail,
        );
        try {
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (err) {
          console.error('Failed to remove old thumbnail:', err);
        }
      }
    }

    const result = await artikelService.updateArtikel(id, {
      ...payload,
      thumbnail: thumbnailPath,
    });

    const formattedUpdatedThumb = formatImageUrl(req, result.thumbnail);
    if (formattedUpdatedThumb) result.thumbnail = formattedUpdatedThumb;

    return sendSuccess(res, result, "Artikel berhasil diupdate", 200);
  } catch (error: any) {
    console.error(error);
    return sendError(res, 'Internal Server Error', 500, { stack: error?.stack });
  }
};

export const patchStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const existing = await artikelService.getArtikelById(id);
    if (!existing) {
      return sendError(res, "Artikel tidak ditemukan", 404);
    }

    const result = await artikelService.updateStatus(id, status);

    const formattedPatchedThumb = formatImageUrl(req, result.thumbnail);
    if (formattedPatchedThumb) result.thumbnail = formattedPatchedThumb;

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
    const id = Number(req.params.id);

    const artikel = await artikelService.getArtikelById(id);

    if (!artikel) {
      return sendError(res, "Artikel tidak ditemukan", 404);
    }

    if (artikel.thumbnail) {
      const thumbnailPath = path.join(
        __dirname,
        "../../uploads",
        artikel.thumbnail,
      );
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    await artikelService.deleteArtikel(id);

    return sendSuccess(res, null, "Artikel berhasil dihapus", 200);
  } catch (error: any) {
    return sendError(res);
  }
};
