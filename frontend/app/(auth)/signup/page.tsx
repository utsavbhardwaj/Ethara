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
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#f8f9ff' }}>
        <motion.div
          className="bg-white rounded-[2.5rem] p-12 max-w-md w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 rounded-3xl bg-[#1a1a2e] flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Zap size={36} className="text-white" />
          </div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
            <CheckCircle2 size={56} className="mx-auto mb-6 text-green-500" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4 tracking-tight" style={{ color: '#1a1a2e' }}>Check your inbox! 📬</h2>
          <p className="mb-4 text-lg text-gray-500 font-medium">
            We sent a verification link to:
          </p>
          <div className="inline-block px-6 py-3 rounded-2xl mb-8 text-indigo-600 font-bold bg-indigo-50 border border-indigo-100">
            {signedUpEmail}
          </div>
          <p className="text-sm mb-10 text-gray-400 leading-relaxed font-medium">
            Click the link in the email to verify your account and log in. <br />The link expires in 24 hours.
          </p>
          <div className="space-y-4">
            <button onClick={handleResend} disabled={resending} className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-[#1a1a2e] font-bold rounded-2xl border border-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {resending ? <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /> : <><RefreshCw size={18} /> Resend verification email</>}
            </button>
            <Link href="/login" className="block text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors py-2">
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#f8f9ff' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12 bg-white border-r border-gray-100">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-10"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
          <div className="absolute bottom-1/3 left-1/4 w-60 h-60 rounded-full blur-3xl opacity-5"
            style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
        </div>
        <div className="relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="w-20 h-20 rounded-3xl bg-[#1a1a2e] flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Zap size={36} className="text-white" />
            </div>
            <h1 className="text-4xl font-extrabold mb-4 tracking-tighter" style={{ color: '#1a1a2e' }}>Join FlowSphere</h1>
            <p className="text-lg max-w-sm mx-auto text-gray-500 font-medium">
              Create your free workspace and start managing projects like a pro.
            </p>
            <div className="mt-12 space-y-4">
              {[
                { icon: Shield, text: 'Role-based access control', color: '#6366f1' },
                { icon: Zap, text: 'Real-time collaboration', color: '#ec4899' },
                { icon: User, text: 'Unlimited team members', color: '#a855f7' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}10`, color: color }}>
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#1a1a2e' }}>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel */}
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

          <h2 className="text-4xl font-bold mb-3 tracking-tight" style={{ color: '#1a1a2e' }}>Create account</h2>
          <p className="mb-10 text-lg text-gray-500 font-medium">
            Free forever for small teams.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Full name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  {...register('name')} 
                  placeholder="John Smith" 
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium" 
                  id="name" 
                />
              </div>
              {errors.name && <p className="text-xs mt-2 font-bold text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  {...register('email')} 
                  type="email" 
                  placeholder="you@company.com" 
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium" 
                  id="signup-email" 
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
                  placeholder="At least 8 characters"
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-12 text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                  id="signup-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-2 font-bold text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold mb-3 text-gray-700">Account type</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'MEMBER', label: 'Member', desc: 'Work on tasks' },
                  { value: 'ADMIN', label: 'Admin', desc: 'Manage team' },
                ].map((opt) => (
                  <label key={opt.value} className="relative cursor-pointer group">
                    <input {...register('role')} type="radio" value={opt.value} className="sr-only peer" />
                    <div className="bg-white rounded-2xl p-4 text-center border border-gray-200 transition-all peer-checked:border-indigo-600 peer-checked:bg-indigo-50/30 peer-checked:ring-4 peer-checked:ring-indigo-500/10 group-hover:border-indigo-200">
                      <div className="font-bold text-gray-900 mb-0.5">{opt.label}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70" id="signup-submit">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create account <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <p className="text-center mt-10 text-gray-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
