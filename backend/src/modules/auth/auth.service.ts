import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../../prisma/client';
import { generateToken } from '../../utils/jwt.utils';
import { AppError } from '../../middleware/error.middleware';
import { SignupDTO, LoginDTO } from './auth.dto';
import { emailService } from '../../utils/email.service';

export class AuthService {
  async signup(dto: SignupDTO) {
    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Generate email verification token (expires in 24h)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role || 'MEMBER',
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
        isEmailVerified: false,
      },
      select: {
        id: true, name: true, email: true, role: true,
        isEmailVerified: true, createdAt: true,
      },
    });

    // Send verification email (non-blocking – don't fail signup if email fails)
    emailService.sendVerificationEmail(user.email, user.name, verificationToken).catch((err) => {
      console.error('Failed to send verification email:', err.message);
    });

    return {
      message: 'Account created! Please check your email to verify your account.',
      user,
      requiresVerification: true,
    };
  }

  async verifyEmail(token: string) {
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new AppError('Invalid or expired verification link', 400);
    }

    if (user.emailVerificationExpiry && user.emailVerificationExpiry < new Date()) {
      throw new AppError('Verification link has expired. Please request a new one.', 400);
    }

    if (user.isEmailVerified) {
      throw new AppError('Email already verified', 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const jwtToken = generateToken({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      name: updatedUser.name,
    });

    // Send welcome email
    emailService.sendWelcomeEmail(updatedUser.email, updatedUser.name).catch(() => {});

    return { user: updatedUser, token: jwtToken };
  }

  async resendVerification(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('User not found', 404);
    if (user.isEmailVerified) throw new AppError('Email already verified', 400);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: verificationToken, emailVerificationExpiry: verificationExpiry },
    });

    await emailService.sendVerificationEmail(user.email, user.name, verificationToken);
    return { message: 'Verification email resent.' };
  }

  async login(dto: LoginDTO) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) throw new AppError('Invalid email or password', 401);

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new AppError('Invalid email or password', 401);

    if (!user.isEmailVerified) {
      throw new AppError('Please verify your email before logging in. Check your inbox.', 403);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const { password: _p, emailVerificationToken: _t, emailVerificationExpiry: _e, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, role: true,
        avatar: true, isEmailVerified: true, createdAt: true,
        _count: { select: { projectsCreated: true, tasksAssigned: true } },
      },
    });

    if (!user) throw new AppError('User not found', 404);
    return user;
  }
}

export const authService = new AuthService();
