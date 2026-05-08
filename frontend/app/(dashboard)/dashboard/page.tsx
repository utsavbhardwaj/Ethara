'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BarChart3, CheckCircle2, Clock, AlertTriangle,
  FolderOpen, TrendingUp, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { dashboardService } from '@/services/api.service';
import { useAuthStore } from '@/store/auth.store';
import { formatRelativeTime, formatDate, isOverdue, getInitials } from '@/lib/utils';
import type { DashboardStats } from '@/types';

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  subtitle,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
  subtitle?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md shadow-indigo-500/5"
          style={{ background: `${color}10`, color }}>
          <Icon size={28} />
        </div>
        {subtitle && (
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-sm" style={{ background: `${color}10`, color }}>
            {subtitle}
          </span>
        )}
      </div>
      <div className="text-5xl font-black mb-2 text-[#1a1a2e] tracking-tighter">{value}</div>
      <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 animate-pulse">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl mb-6" />
      <div className="w-20 h-10 bg-gray-50 rounded-xl mb-2" />
      <div className="w-24 h-4 bg-gray-50 rounded-lg" />
    </div>
  );
}

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#22c55e'];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await dashboardService.getStats();
      return res.data.data as DashboardStats;
    },
  });

  const taskChartData = data
    ? [
        { name: 'TODO', count: data.todoTasks, color: '#94a3b8' },
        { name: 'In Progress', count: data.inProgressTasks, color: '#6366f1' },
        { name: 'Review', count: data.reviewTasks, color: '#f59e0b' },
        { name: 'Done', count: data.completedTasks, color: '#10b981' },
      ]
    : [];

  const priorityData = data?.tasksByPriority?.map((p) => ({
    name: p.priority,
    value: p._count.priority,
  })) || [];

  return (
    <div className="pb-20">
      {/* Header */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-black mb-3 tracking-tight text-[#1a1a2e]">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
          <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-lg text-gray-400 font-bold">Here&apos;s a quick glance at your team&apos;s pulse.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard icon={FolderOpen} label="Active Workspaces" value={data?.totalProjects || 0} color="#8b5cf6" delay={0.1} />
            <StatCard icon={BarChart3} label="Pending Deliverables" value={data?.totalTasks || 0} color="#6366f1" delay={0.15} />
            <StatCard icon={CheckCircle2} label="Milestone Success" value={`${data?.completionRate || 0}%`} color="#10b981" subtitle="On Track" delay={0.2} />
            <StatCard icon={AlertTriangle} label="Critical Alerts" value={data?.overdueTasks || 0} color="#f43f5e" delay={0.25} />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-10 mb-12">
        {/* Task Performance */}
        <motion.div
          className="lg:col-span-2 bg-white border border-gray-100 rounded-[3rem] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm shadow-indigo-100">
                <BarChart3 size={20} />
              </div>
              <h2 className="text-xl font-black text-[#1a1a2e]">Task Momentum</h2>
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">30-Day Velocity</div>
          </div>
          {isLoading ? (
            <div className="h-64 bg-gray-50 animate-pulse rounded-[2rem]" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={taskChartData} barSize={56}>
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 900 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 900 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid #f3f4f6', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', fontWeight: '900', padding: '16px' }}
                  cursor={{ fill: '#f9fafb' }}
                />
                <Bar dataKey="count" radius={[12, 12, 12, 12]}>
                  {taskChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          <div className="mt-10 pt-8 border-t border-gray-50">
            <div className="flex justify-between text-xs font-black mb-4">
              <span className="text-gray-400 uppercase tracking-widest">Workspace Completion Velocity</span>
              <span className="text-emerald-500">{data?.completionRate || 0}%</span>
            </div>
            <div className="h-4 rounded-full bg-gray-50 border border-gray-100 overflow-hidden p-1">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${data?.completionRate || 0}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Priority Flow */}
        <motion.div
          className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shadow-sm shadow-cyan-100">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-xl font-black text-[#1a1a2e]">Priority Flow</h2>
          </div>
          {isLoading ? (
            <div className="h-48 bg-gray-50 animate-pulse rounded-[2rem]" />
          ) : priorityData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={priorityData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={10} dataKey="value">
                    {priorityData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #f3f4f6', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-5 mt-10">
                {priorityData.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-sm font-black text-gray-500 group-hover:text-[#1a1a2e] transition-colors">{p.name}</span>
                    </div>
                    <span className="text-sm font-black text-[#1a1a2e]">{p.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm font-black text-gray-300 italic">No tasks currently tracked.</div>
          )}
        </motion.div>
      </div>

      {/* Focus & Stream */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Upcoming Focus */}
        <motion.div
          className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm shadow-amber-100">
                <Clock size={20} />
              </div>
              <h2 className="text-xl font-black text-[#1a1a2e]">Upcoming Focus</h2>
            </div>
            <Link href="/tasks" className="text-xs font-black text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">View All</Link>
          </div>
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-[2rem]" />)}
            </div>
          ) : data?.myTasks?.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 transition-transform hover:scale-110">
                <CheckCircle2 size={48} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-[#1a1a2e]">Clear schedule! 🎉</p>
              <p className="text-sm text-gray-400 font-bold mt-2">Take a moment to recharge.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {data?.myTasks?.map((task) => (
                <div key={task.id} className="bg-gray-50/50 rounded-[2rem] p-6 flex items-center justify-between gap-6 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group">
                  <div className="min-w-0">
                    <div className="font-black text-lg text-[#1a1a2e] truncate group-hover:text-indigo-600 transition-colors">{task.title}</div>
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-1.5">
                      {task.project?.title}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${
                      task.priority === 'HIGH' ? 'bg-red-50 text-red-600' : task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-gray-100">
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Action Stream */}
        <motion.div
          className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm shadow-indigo-100">
                <Activity size={20} />
              </div>
              <h2 className="text-xl font-black text-[#1a1a2e]">Action Stream</h2>
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live Tracking</div>
          </div>
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-50 animate-pulse rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-50 animate-pulse rounded-xl w-full mb-2" />
                    <div className="h-3 bg-gray-50 animate-pulse rounded-lg w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.recentActivity?.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 transition-transform hover:scale-110">
                <Activity size={48} className="text-gray-300" />
              </div>
              <p className="text-lg font-black text-gray-300 uppercase tracking-widest italic">Stream silent.</p>
            </div>
          ) : (
            <div className="space-y-8 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
              {data?.recentActivity?.map((log) => (
                <div key={log.id} className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl border-[3px] border-white flex items-center justify-center text-xs font-black text-white flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    {getInitials(log.user.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-gray-500 leading-snug group-hover:text-[#1a1a2e] transition-colors">
                      <span className="font-black text-[#1a1a2e]">{log.user.name}</span>{' '}
                      {log.action}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-indigo-400">
                      {formatRelativeTime(log.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
