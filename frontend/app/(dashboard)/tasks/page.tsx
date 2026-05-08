'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckSquare, Filter, Search, Calendar, AlertCircle } from 'lucide-react';
import { tasksService } from '@/services/api.service';
import { useAuthStore } from '@/store/auth.store';
import { formatDate, isOverdue } from '@/lib/utils';
import type { Task } from '@/types';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['ALL', 'TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];
const PRIORITY_OPTIONS = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];

export default function TasksPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['all-tasks'],
    queryFn: async () => {
      const res = await tasksService.getAll();
      return res.data.data as Task[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task['status'] }) =>
      tasksService.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] });
      toast.success('Task updated');
    },
    onError: () => toast.error('Failed to update'),
  });

  const filtered = tasks.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const myTasks = filtered.filter((t) => t.assignedTo === user?.id);
  const allTasks = user?.role === 'ADMIN' ? filtered : myTasks;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">My Tasks</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{allTasks.length} tasks assigned to you</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..." className="input-dark pl-9 text-sm" style={{ width: '220px' }} id="task-search" />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          {STATUS_OPTIONS.map((s) => (
            <button key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${statusFilter === s
                ? 'border-violet-500/50 text-violet-400 bg-violet-500/10'
                : 'border-transparent hover:border-violet-500/30'}`}
              style={{ color: statusFilter === s ? '#c4b5fd' : 'var(--text-muted)' }}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-20 skeleton rounded-xl" />)}
        </div>
      ) : allTasks.length === 0 ? (
        <div className="text-center py-20">
          <CheckSquare size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Looks like your queue is empty.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allTasks.map((task, i) => (
            <motion.div
              key={task.id}
              className="glass rounded-xl p-4 flex items-center gap-4 card-hover"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {/* Status selector */}
              <select
                value={task.status}
                onChange={(e) => updateMutation.mutate({ id: task.id, status: e.target.value as Task['status'] })}
                className="text-xs rounded-lg border px-2 py-1 cursor-pointer"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border)',
                  color: task.status === 'COMPLETED' ? '#4ade80' : task.status === 'IN_PROGRESS' ? '#818cf8' : task.status === 'REVIEW' ? '#fbbf24' : 'var(--text-muted)',
                }}
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="REVIEW">REVIEW</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm" style={{ textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none', color: task.status === 'COMPLETED' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                  {task.title}
                </div>
                {task.project && (
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>📁 {task.project.title}</div>
                )}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  task.priority === 'HIGH' ? 'badge-high' : task.priority === 'MEDIUM' ? 'badge-medium' : 'badge-low'
                }`}>
                  {task.priority}
                </span>
                {task.dueDate && (
                  <span className="flex items-center gap-1 text-xs"
                    style={{ color: isOverdue(task.dueDate) && task.status !== 'COMPLETED' ? '#f87171' : 'var(--text-muted)' }}>
                    {isOverdue(task.dueDate) && task.status !== 'COMPLETED' && <AlertCircle size={12} />}
                    <Calendar size={11} />
                    {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
