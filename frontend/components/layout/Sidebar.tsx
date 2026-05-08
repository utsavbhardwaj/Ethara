'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Zap, LayoutDashboard, FolderKanban, CheckSquare,
  Users, Settings, LogOut, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/tasks', icon: CheckSquare, label: 'My Tasks' },
  { href: '/team', icon: Users, label: 'Team' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-60 flex flex-col glass-strong border-r z-40"
      style={{ borderColor: 'var(--border)' }}>
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl animated-gradient flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-base gradient-text">FlowSphere</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Team Workspace</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}>
                <item.icon size={17} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto"
                    initial={false}
                  >
                    <ChevronRight size={14} style={{ color: '#8b5cf6' }} />
                  </motion.div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="glass rounded-xl p-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              {user ? getInitials(user.name) : '?'}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate">{user?.name}</div>
              <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                {user?.role === 'ADMIN' ? '⚡ Admin' : '👤 Member'}
              </div>
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-ghost w-full justify-start text-sm" style={{ color: '#f87171' }}>
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
