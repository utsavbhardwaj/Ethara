import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/signup', (req, res, next) => authController.signup(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.get('/verify-email', (req, res, next) => authController.verifyEmail(req, res, next));
router.post('/resend-verification', (req, res, next) => authController.resendVerification(req, res, next));
router.get('/me', authenticate, (req, res, next) => authController.getMe(req as any, res, next));

export default router;
