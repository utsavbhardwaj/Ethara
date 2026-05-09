'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Zap } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuthStore();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found. Please use the link from your email.');
      return;
    }

    api
      .get(`/auth/verify-email?token=${token}`)
      .then((res) => {
        const { user, token: jwtToken } = res.data.data;
        // Auto-login after verification
        localStorage.setItem('flowsphere_token', jwtToken);
        setStatus('success');
        setMessage(`Welcome, ${user.name}! Your email has been verified.`);
        setTimeout(() => router.push('/dashboard'), 2500);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err?.response?.data?.message || 'Verification failed. The link may have expired.');
      });
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
      <motion.div
        className="glass-strong rounded-3xl p-10 max-w-md w-full text-center"
        style={{ border: '1px solid rgba(139, 92, 246, 0.3)' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Logo */}
        <div className="w-14 h-14 rounded-2xl animated-gradient flex items-center justify-center mx-auto mb-6">
          <Zap size={26} className="text-white" />
        </div>

        {status === 'loading' && (
          <>
            <Loader2 size={40} className="mx-auto mb-4 animate-spin" style={{ color: '#8b5cf6' }} />
            <h2 className="text-2xl font-bold mb-2">Verifying your email…</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Just a moment</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
              <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: '#4ade80' }} />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Email Verified! 🎉</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Redirecting to dashboard…</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={48} className="mx-auto mb-4" style={{ color: '#f87171' }} />
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{message}</p>
            <Link href="/login" className="btn-primary justify-center w-full">
              Back to Login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: '#8b5cf6' }} />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
