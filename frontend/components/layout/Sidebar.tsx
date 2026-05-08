'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Zap, LayoutDashboard, FolderKanban, CheckSquare,
  Users, Settings, LogOut
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
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col bg-white border-r border-gray-100 z-50">
      {/* Header/Logo */}
      <div className="p-8 pb-10">
        <Link href="/dashboard" className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#1a1a2e] flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/10 transition-transform hover:scale-105">
            <Zap size={22} className="text-white fill-white" />
          </div>
          <div>
            <div className="font-black text-xl tracking-tighter text-[#1a1a2e]">FlowSphere</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Team Hub</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 group ${
                isActive 
                ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100/50' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User & Footer */}
      <div className="p-4 border-t border-gray-50 mt-auto bg-gray-50/50">
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-black text-white flex-shrink-0 shadow-md">
              {user ? getInitials(user.name) : '?'}
            </div>
            <div className="min-w-0">
              <div className="font-black text-sm text-[#1a1a2e] truncate">{user?.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${user?.role === 'ADMIN' ? 'bg-indigo-500' : 'bg-gray-400'}`} />
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                  {user?.role === 'ADMIN' ? 'Admin' : 'Member'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 w-full px-5 py-3.5 text-sm font-black text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
