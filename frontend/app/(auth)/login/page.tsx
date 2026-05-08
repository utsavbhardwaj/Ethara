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
    <div className="min-h-screen flex" style={{ background: '#f8f9ff' }}>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12 bg-white border-r border-gray-100">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-10"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full blur-3xl opacity-5"
            style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
        </div>
        <div className="relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="w-20 h-20 rounded-3xl bg-[#1a1a2e] flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Zap size={36} className="text-white" />
            </div>
            <h1 className="text-4xl font-extrabold mb-4 tracking-tighter" style={{ color: '#1a1a2e' }}>FlowSphere</h1>
            <p className="text-lg max-w-sm mx-auto text-gray-500 font-medium">
              The modern workspace for high-performing teams. Manage projects, tasks, and people — all in one place.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-4">
              {[
                { label: 'Tasks Completed', value: '500k+', color: '#6366f1' },
                { label: 'Active Teams', value: '10k+', color: '#ec4899' },
                { label: 'Uptime', value: '99.9%', color: '#06b6d4' },
                { label: 'Rating', value: '4.9 ★', color: '#f59e0b' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
                  <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#1a1a2e] flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight" style={{ color: '#1a1a2e' }}>FlowSphere</span>
          </div>

          <h2 className="text-4xl font-bold mb-3 tracking-tight" style={{ color: '#1a1a2e' }}>Welcome back</h2>
          <p className="mb-10 text-lg text-gray-500 font-medium">
            Sign in to your workspace
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Email address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@company.com"
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                  id="email"
                />
              </div>
              {errors.email && <p className="text-xs mt-2 font-bold text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-12 text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                  id="password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-2 font-bold text-red-500">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70" id="login-submit">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <p className="text-center mt-10 text-gray-500 font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-indigo-600 font-bold hover:underline">Sign up free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
