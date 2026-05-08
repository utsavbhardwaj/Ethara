'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield, CheckCircle2, RefreshCw } from 'lucide-react';
import api from '@/lib/api';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must include uppercase')
    .regex(/[0-9]/, 'Must include a number'),
  role: z.enum(['ADMIN', 'MEMBER']),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'MEMBER' },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await api.post('/auth/signup', data);
      setSignedUpEmail(data.email);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!signedUpEmail) return;
    setResending(true);
    try {
      await api.post('/auth/resend-verification', { email: signedUpEmail });
      toast.success('Verification email resent!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  // ── Success state: check your email ──
  if (signedUpEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
        <motion.div
          className="glass-strong rounded-3xl p-10 max-w-md w-full text-center"
          style={{ border: '1px solid rgba(139, 92, 246, 0.3)' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl animated-gradient flex items-center justify-center mx-auto mb-5">
            <Zap size={30} className="text-white" />
          </div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
            <CheckCircle2 size={44} className="mx-auto mb-4" style={{ color: '#4ade80' }} />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Check your inbox! 📬</h2>
          <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
            We sent a verification link to:
          </p>
          <div className="inline-block px-4 py-2 rounded-xl mb-6 text-sm font-semibold"
            style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#c4b5fd', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            {signedUpEmail}
          </div>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Click the link in the email to verify your account and log in. The link expires in 24 hours.
          </p>
          <button onClick={handleResend} disabled={resending} className="btn-secondary w-full justify-center mb-3">
            {resending ? <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /> : <><RefreshCw size={14} /> Resend verification email</>}
          </button>
          <Link href="/login" className="btn-ghost w-full justify-center text-sm">
            Back to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
          <div className="absolute bottom-1/3 left-1/4 w-60 h-60 rounded-full blur-3xl opacity-15"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        </div>
        <div className="relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="w-20 h-20 rounded-2xl animated-gradient flex items-center justify-center mx-auto mb-6">
              <Zap size={36} className="text-white" />
            </div>
            <h1 className="text-4xl font-extrabold mb-4 gradient-text">Join FlowSphere</h1>
            <p className="text-lg max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Create your free workspace and start managing projects like a pro.
            </p>
            <div className="mt-10 space-y-3">
              {[
                { icon: Shield, text: 'Role-based access control' },
                { icon: Zap, text: 'Real-time collaboration' },
                { icon: User, text: 'Unlimited team members' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="glass rounded-xl p-3 flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
                    <Icon size={16} style={{ color: '#8b5cf6' }} />
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel */}
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

          <h2 className="text-3xl font-bold mb-2">Create your account</h2>
          <p className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Free forever for small teams
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input {...register('name')} placeholder="John Smith" className="input-dark pl-10" id="name" />
              </div>
              {errors.name && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input {...register('email')} type="email" placeholder="you@company.com" className="input-dark pl-10" id="signup-email" />
              </div>
              {errors.email && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 chars, 1 uppercase, 1 number"
                  className="input-dark pl-10 pr-10"
                  id="signup-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 btn-ghost p-0" style={{ color: 'var(--text-muted)' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Account type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'MEMBER', label: 'Member', desc: 'Work on projects' },
                  { value: 'ADMIN', label: 'Admin', desc: 'Manage everything' },
                ].map((opt) => (
                  <label key={opt.value} className="cursor-pointer">
                    <input {...register('role')} type="radio" value={opt.value} className="sr-only" />
                    <div className="glass rounded-xl p-3 text-center border-2 transition-all cursor-pointer hover:border-violet-500/50"
                      style={{ borderColor: 'var(--border)' }}>
                      <div className="font-semibold text-sm">{opt.label}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center py-3" id="signup-submit">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold" style={{ color: '#8b5cf6' }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
