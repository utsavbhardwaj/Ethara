'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
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
      className="glass rounded-2xl p-5 card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {subtitle && (
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${color}15`, color }}>
            {subtitle}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color }}>{value}</div>
      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="w-10 h-10 skeleton rounded-xl mb-4" />
      <div className="w-16 h-8 skeleton rounded mb-2" />
      <div className="w-24 h-4 skeleton rounded" />
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
        { name: 'TODO', count: data.todoTasks, color: '#64748b' },
        { name: 'In Progress', count: data.inProgressTasks, color: '#818cf8' },
        { name: 'Review', count: data.reviewTasks, color: '#fbbf24' },
        { name: 'Done', count: data.completedTasks, color: '#4ade80' },
      ]
    : [];

  const priorityData = data?.tasksByPriority?.map((p) => ({
    name: p.priority,
    value: p._count.priority,
  })) || [];

  return (
    <div>
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-1">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
          <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Here&apos;s what&apos;s happening across your workspace</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard icon={FolderOpen} label="Total Projects" value={data?.totalProjects || 0} color="#8b5cf6" delay={0.1} />
            <StatCard icon={BarChart3} label="Total Tasks" value={data?.totalTasks || 0} color="#6366f1" delay={0.15} />
            <StatCard icon={CheckCircle2} label="Completed" value={data?.completedTasks || 0} color="#4ade80" subtitle={`${data?.completionRate || 0}%`} delay={0.2} />
            <StatCard icon={AlertTriangle} label="Overdue" value={data?.overdueTasks || 0} color="#f87171" delay={0.25} />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Task Status Bar Chart */}
        <motion.div
          className="lg:col-span-2 glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} style={{ color: '#8b5cf6' }} />
            <h2 className="font-semibold">Task Overview</h2>
          </div>
          {isLoading ? (
            <div className="h-40 skeleton rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={taskChartData} barSize={32}>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#16161f', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', color: '#e2e8f0' }}
                  cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {taskChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
              <span>Completion rate</span>
              <span style={{ color: '#4ade80' }}>{data?.completionRate || 0}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #6366f1, #4ade80)' }}
                initial={{ width: 0 }}
                animate={{ width: `${data?.completionRate || 0}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Priority Pie Chart */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} style={{ color: '#06b6d4' }} />
            <h2 className="font-semibold">By Priority</h2>
          </div>
          {isLoading ? (
            <div className="h-32 skeleton rounded-xl" />
          ) : priorityData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={priorityData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                    {priorityData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#16161f', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', color: '#e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {priorityData.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
                    </div>
                    <span className="font-medium">{p.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-32 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>No tasks yet</div>
          )}
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Clock size={18} style={{ color: '#fbbf24' }} />
            <h2 className="font-semibold">My Upcoming Tasks</h2>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 skeleton rounded-xl" />)}
            </div>
          ) : data?.myTasks?.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 size={32} className="mx-auto mb-2" style={{ color: '#4ade80' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>All caught up! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data?.myTasks?.map((task) => (
                <div key={task.id} className="glass rounded-xl p-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{task.title}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {task.project?.title}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      task.priority === 'HIGH' ? 'badge-high' : task.priority === 'MEDIUM' ? 'badge-medium' : 'badge-low'
                    }`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs" style={{ color: isOverdue(task.dueDate) ? '#f87171' : 'var(--text-muted)' }}>
                        {isOverdue(task.dueDate) ? '⚠ ' : ''}{formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          className="glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Activity size={18} style={{ color: '#6366f1' }} />
            <h2 className="font-semibold">Recent Activity</h2>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 skeleton rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 skeleton rounded w-full mb-2" />
                    <div className="h-3 skeleton rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.recentActivity?.length === 0 ? (
            <div className="text-center py-8">
              <Activity size={32} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No activity yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {data?.recentActivity?.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    {getInitials(log.user.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{log.user.name}</span>{' '}
                      {log.action}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
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
