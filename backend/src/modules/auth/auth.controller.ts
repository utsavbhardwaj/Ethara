import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { signupSchema, loginSchema } from './auth.dto';
import { sendSuccess } from '../../utils/response.utils';
import { AppError } from '../../middleware/error.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = signupSchema.parse(req.body);
      const result = await authService.signup(dto);
      sendSuccess(res, result, result.message, 201);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = loginSchema.parse(req.body);
      const result = await authService.login(dto);
      sendSuccess(res, result, 'Logged in successfully');
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError('Not authenticated', 401);
      const user = await authService.getMe(req.user.id);
      sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') {
        throw new AppError('Verification token is required', 400);
      }
      const result = await authService.verifyEmail(token);
      sendSuccess(res, result, 'Email verified successfully!');
    } catch (err) {
      next(err);
    }
  }

  async resendVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) throw new AppError('Email is required', 400);
      const result = await authService.resendVerification(email);
      sendSuccess(res, result, result.message);
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
