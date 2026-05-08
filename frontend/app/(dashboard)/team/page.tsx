'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Mail, Shield, User, Crown } from 'lucide-react';
import { projectsService } from '@/services/api.service';
import { getInitials, formatDate } from '@/lib/utils';
import type { User as UserType } from '@/types';

export default function TeamPage() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const res = await projectsService.getAllUsers();
      return res.data.data as UserType[];
    },
  });

  const admins = users.filter((u) => u.role === 'ADMIN');
  const members = users.filter((u) => u.role === 'MEMBER');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Team</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{users.length} workspace members</p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 skeleton rounded-full" />
                <div>
                  <div className="h-4 skeleton rounded w-28 mb-2" />
                  <div className="h-3 skeleton rounded w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {admins.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Crown size={16} style={{ color: '#fbbf24' }} />
                <h2 className="font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Admins ({admins.length})
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {admins.map((u, i) => <MemberCard key={u.id} user={u} delay={i * 0.1} />)}
              </div>
            </div>
          )}
          {members.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User size={16} style={{ color: '#8b5cf6' }} />
                <h2 className="font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Members ({members.length})
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((u, i) => <MemberCard key={u.id} user={u} delay={i * 0.05} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function MemberCard({ user, delay = 0 }: { user: UserType; delay?: number }) {
  return (
    <motion.div
      className="glass rounded-2xl p-5 card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          {getInitials(user.name)}
        </div>
        <div className="min-w-0">
          <div className="font-semibold truncate">{user.name}</div>
          <div className="flex items-center gap-1 mt-0.5">
            {user.role === 'ADMIN' ? (
              <span className="text-xs flex items-center gap-1" style={{ color: '#fbbf24' }}>
                <Crown size={10} fill="currentColor" /> Admin
              </span>
            ) : (
              <span className="text-xs flex items-center gap-1" style={{ color: '#8b5cf6' }}>
                <User size={10} /> Member
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <Mail size={12} />
        <span className="truncate">{user.email}</span>
      </div>
    </motion.div>
  );
}
