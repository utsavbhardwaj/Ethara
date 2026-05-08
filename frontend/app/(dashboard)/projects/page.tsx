'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderOpen, Search, Calendar, Users, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { projectsService } from '@/services/api.service';
import { useAuthStore } from '@/store/auth.store';
import { formatDate } from '@/lib/utils';
import type { Project } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  deadline: z.string().optional(),
  status: z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']).optional(),
});

type FormData = z.infer<typeof schema>;

const statusColors: Record<string, string> = {
  ACTIVE: '#4ade80',
  ON_HOLD: '#fbbf24',
  COMPLETED: '#818cf8',
  ARCHIVED: '#64748b',
};

function ProjectCard({ project, isAdmin, onDelete }: { project: Project; isAdmin: boolean; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const taskCount = project._count?.tasks || 0;
  const memberCount = project.members.length;

  return (
    <motion.div
      className="glass rounded-2xl p-5 card-hover relative group"
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {/* Status dot */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColors[project.status] || '#64748b' }} />
          <span className="text-xs font-medium" style={{ color: statusColors[project.status] }}>{project.status.replace('_', ' ')}</span>
        </div>
        {isAdmin && (
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="btn-ghost p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 glass rounded-xl shadow-xl z-10 min-w-32 overflow-hidden"
                style={{ border: '1px solid var(--border)' }}>
                <button className="btn-ghost w-full justify-start text-sm rounded-none px-4 py-2">
                  <Pencil size={14} /> Edit
                </button>
                <button onClick={() => { onDelete(project.id); setMenuOpen(false); }}
                  className="btn-ghost w-full justify-start text-sm rounded-none px-4 py-2" style={{ color: '#f87171' }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Link href={`/projects/${project.id}`}>
        <h3 className="font-semibold text-base mb-1 hover:text-violet-400 transition-colors">{project.title}</h3>
      </Link>
      {project.description && (
        <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <Users size={12} /> {memberCount}
          </span>
          <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            ✓ {taskCount} tasks
          </span>
        </div>
        {project.deadline && (
          <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <Calendar size={11} /> {formatDate(project.deadline)}
          </span>
        )}
      </div>

      {/* Member avatars */}
      <div className="flex items-center mt-3 gap-1">
        {project.members.slice(0, 4).map((m) => (
          <div key={m.id}
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white -ml-1 first:ml-0 border"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderColor: 'var(--bg-card)' }}
            title={m.user.name}>
            {m.user.name[0].toUpperCase()}
          </div>
        ))}
        {project.members.length > 4 && (
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold -ml-1 border"
            style={{ background: 'var(--bg-card-hover)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            +{project.members.length - 4}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: FormData) => projectsService.create({ ...data, deadline: data.deadline || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created!');
      onClose();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create project'),
  });

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        className="glass-strong rounded-2xl p-6 w-full max-w-md"
        style={{ border: '1px solid rgba(139, 92, 246, 0.3)' }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">New Project</h2>
          <button onClick={onClose} className="btn-ghost p-1"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Title *</label>
            <input {...register('title')} placeholder="Project name" className="input-dark" id="project-title" />
            {errors.title && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea {...register('description')} placeholder="What is this project about?" rows={3}
              className="input-dark resize-none" id="project-description" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Deadline</label>
            <input {...register('deadline')} type="date" className="input-dark" id="project-deadline" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Status</label>
            <select {...register('status')} className="input-dark" id="project-status">
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1 justify-center">
              {mutation.isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function ProjectsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await projectsService.getAll();
      return res.data.data as Project[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted');
    },
    onError: () => toast.error('Failed to delete project'),
  });

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Projects</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)} className="btn-primary" id="new-project-btn">
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="input-dark pl-10 max-w-sm"
          id="project-search"
        />
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <div className="h-4 skeleton rounded w-1/3 mb-3" />
              <div className="h-5 skeleton rounded w-2/3 mb-2" />
              <div className="h-4 skeleton rounded w-full mb-1" />
              <div className="h-4 skeleton rounded w-3/4 mb-4" />
              <div className="h-px skeleton rounded mb-3" />
              <div className="h-4 skeleton rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-xl font-semibold mb-2">No projects found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isAdmin ? 'Create your first project to get started.' : 'Ask an admin to add you to a project.'}
          </p>
        </div>
      ) : (
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" layout>
          <AnimatePresence>
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isAdmin={isAdmin}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>
    </div>
  );
}
