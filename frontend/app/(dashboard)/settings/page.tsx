'use client';

import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { getInitials, formatDate } from '@/lib/utils';
import { User, Mail, Shield, Calendar, Zap } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your account and preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Card */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
            <User size={18} style={{ color: '#8b5cf6' }} /> Profile
          </h2>
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              {getInitials(user.name)}
            </div>
            <div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <Shield size={12} style={{ color: user.role === 'ADMIN' ? '#fbbf24' : '#8b5cf6' }} />
                <span className="text-xs font-medium" style={{ color: user.role === 'ADMIN' ? '#fbbf24' : '#8b5cf6' }}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <input defaultValue={user.name} className="input-dark" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input defaultValue={user.email} className="input-dark pl-10" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
            <Zap size={18} style={{ color: '#06b6d4' }} /> Account
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Account Type', value: user.role === 'ADMIN' ? '⚡ Administrator' : '👤 Member', color: user.role === 'ADMIN' ? '#fbbf24' : '#8b5cf6' },
              { label: 'Member Since', value: formatDate(user.createdAt), color: 'var(--text-primary)' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                <span className="font-medium text-sm" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          className="rounded-2xl p-6"
          style={{ border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.03)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-semibold text-lg mb-2" style={{ color: '#f87171' }}>Danger Zone</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="btn-danger text-sm" disabled>
            Delete Account
          </button>
        </motion.div>
      </div>
    </div>
  );
}
