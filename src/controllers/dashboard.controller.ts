import { Request, Response } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { sendError, sendSuccess } from '../utils/response';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Panggil Service
    const stats = await dashboardService.getDashboardStatsService();

    // Kirim Response Sukses
    return sendSuccess(res, {
        totalArtikels: stats.counts.artikels,
        totalPublished: stats.counts.published,
        totalCategories: stats.counts.categories,
        recentArticles: stats.recentArticles,});

  } catch (error) {
    // Error Handling
    console.error('Dashboard Error:', error);
    return sendError(res);
    }
};