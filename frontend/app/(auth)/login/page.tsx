'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      setUnverifiedEmail(null);
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || 'Login failed';
      if (status === 403) {
        setUnverifiedEmail(data.email);
        toast.error('Please verify your email first.');
      } else {
        toast.error(message);
      }
    }
  };

  const handleResend = async () => {
    const email = unverifiedEmail || getValues('email');
    if (!email) return;
    setResending(true);
    try {
      await api.post('/auth/resend-verification', { email });
      toast.success('Verification email resent! Check your inbox.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full blur-3xl opacity-15"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
        </div>
        <div className="relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="w-20 h-20 rounded-2xl animated-gradient flex items-center justify-center mx-auto mb-6">
              <Zap size={36} className="text-white" />
            </div>
            <h1 className="text-4xl font-extrabold mb-4 gradient-text">FlowSphere</h1>
            <p className="text-lg max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
              The modern workspace for high-performing teams. Manage projects, tasks, and people — all in one place.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { label: 'Tasks Completed', value: '500k+' },
                { label: 'Active Teams', value: '10k+' },
                { label: 'Uptime', value: '99.9%' },
                { label: 'Rating', value: '4.9 ★' },
              ].map((s) => (
                <div key={s.label} className="glass rounded-xl p-4 text-center">
                  <div className="text-xl font-bold gradient-text">{s.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">FlowSphere</span>
          </div>

          <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
          <p className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Sign in to your workspace
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@company.com"
                  className="input-dark pl-10"
                  id="email"
                />
              </div>
              {errors.email && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-dark pl-10 pr-10"
                  id="password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 btn-ghost p-0"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3"
              id="login-submit"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.15)', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Demo:</strong> admin@flowsphere.dev / Admin@123
          </div>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold" style={{ color: '#8b5cf6' }}>
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
