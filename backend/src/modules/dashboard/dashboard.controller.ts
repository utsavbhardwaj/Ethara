import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { dashboardService } from './dashboard.service';
import { sendSuccess } from '../../utils/response.utils';
import { AppError } from '../../middleware/error.middleware';

export class DashboardController {
  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError('Not authenticated', 401);
      const stats = await dashboardService.getStats(req.user.id, req.user.role);
      sendSuccess(res, stats);
    } catch (err) { next(err); }
  }
}

export const dashboardController = new DashboardController();
