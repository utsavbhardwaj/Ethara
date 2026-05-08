'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderOpen, Search, Calendar, Users, MoreHorizontal, Pencil, Trash2, X, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { projectsService } from '@/services/api.service';
import { useAuthStore } from '@/store/auth.store';
import { formatDate, getInitials } from '@/lib/utils';
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

function ProjectCard({ project, isAdmin, onDelete }: { project: Project; isAdmin: boolean; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const taskCount = project._count?.tasks || 0;
  const memberCount = project.members.length;

  return (
    <motion.div
      className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 relative group"
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="flex items-start justify-between mb-5">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${
          project.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 
          project.status === 'ON_HOLD' ? 'bg-amber-50 text-amber-600' : 
          'bg-gray-100 text-gray-600'
        }`}>
          {project.status.replace('_', ' ')}
        </span>
        {isAdmin && (
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="w-10 h-10 rounded-2xl hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors">
              <MoreHorizontal size={20} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-12 bg-white rounded-[1.5rem] shadow-2xl z-10 min-w-[180px] overflow-hidden border border-gray-100 p-2"
                >
                  <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                    <Pencil size={16} /> Edit Project
                  </button>
                  <button onClick={() => { onDelete(project.id); setMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 size={16} /> Delete Project
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Link href={`/projects/${project.id}`}>
        <h3 className="text-xl font-black text-[#1a1a2e] mb-2 hover:text-indigo-600 transition-colors tracking-tight line-clamp-1">{project.title}</h3>
      </Link>
      {project.description && (
        <p className="text-sm text-gray-500 font-medium mb-8 line-clamp-2 leading-relaxed min-h-[40px]">{project.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50 mb-8">
        <div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Team</span>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-indigo-500" />
            <span className="text-sm font-black text-[#1a1a2e]">{memberCount} Members</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Tasks</span>
          <div className="flex items-center gap-2">
            <CheckSquare size={16} className="text-emerald-500" />
            <span className="text-sm font-black text-[#1a1a2e]">{taskCount} Total</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2.5">
          {project.members.slice(0, 3).map((m) => (
            <div key={m.id}
              className="w-9 h-9 rounded-full border-[3px] border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm transition-transform hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              title={m.user.name}>
              {getInitials(m.user.name)}
            </div>
          ))}
          {project.members.length > 3 && (
            <div className="w-9 h-9 rounded-full border-[3px] border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500 shadow-sm">
              +{project.members.length - 3}
            </div>
          )}
        </div>
        {project.deadline && (
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl border border-gray-100/50">
            <Calendar size={14} className="text-gray-400" /> {formatDate(project.deadline)}
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
    <div className="fixed inset-0 bg-[#1a1a2e]/60 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-white"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
      >
        <div className="p-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-[#1a1a2e] tracking-tight mb-2">New Project</h2>
              <p className="text-sm text-gray-400 font-bold">Set up your team workspace in seconds.</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-2xl hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-all hover:rotate-90">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-3 text-gray-400">Project Title</label>
                <input 
                  {...register('title')} 
                  placeholder="e.g. Website Redesign" 
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-6 py-4 font-bold text-[#1a1a2e] outline-none focus:border-indigo-500 focus:bg-white focus:shadow-xl focus:shadow-indigo-500/5 transition-all" 
                  id="project-title" 
                />
                {errors.title && <p className="text-xs mt-3 font-black text-red-500 uppercase tracking-tight">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-3 text-gray-400">Description</label>
                <textarea 
                  {...register('description')} 
                  placeholder="Add some context about this project..." 
                  rows={3}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-6 py-4 font-bold text-[#1a1a2e] outline-none focus:border-indigo-500 focus:bg-white focus:shadow-xl focus:shadow-indigo-500/5 transition-all resize-none" 
                  id="project-description" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-3 text-gray-400">Deadline</label>
                  <input 
                    {...register('deadline')} 
                    type="date" 
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-6 py-4 font-bold text-[#1a1a2e] outline-none focus:border-indigo-500 focus:bg-white focus:shadow-xl focus:shadow-indigo-500/5 transition-all" 
                    id="project-deadline" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-3 text-gray-400">Initial Status</label>
                  <select 
                    {...register('status')} 
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-6 py-4 font-black text-[#1a1a2e] outline-none focus:border-indigo-500 focus:bg-white focus:shadow-xl focus:shadow-indigo-500/5 transition-all appearance-none cursor-pointer" 
                    id="project-status"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 py-5 bg-gray-50 hover:bg-gray-100 text-[#1a1a2e] font-black rounded-2xl transition-all border border-gray-100"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={mutation.isPending} 
                className="flex-1 py-5 bg-[#1a1a2e] hover:bg-[#2a2a4a] text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
              >
                {mutation.isPending ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
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
    <div className="pb-20">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-5xl font-black text-[#1a1a2e] tracking-tight mb-3">Workspaces</h1>
          <p className="text-lg text-gray-400 font-bold">{projects.length} active project{projects.length !== 1 ? 's' : ''} currently in progress.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowCreate(true)} 
            className="bg-[#1a1a2e] hover:bg-indigo-600 text-white font-black py-5 px-8 rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3" 
            id="new-project-btn"
          >
            <Plus size={24} /> New Project
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-14">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={24} />
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for projects, goals, or teammates..."
          className="w-full max-w-2xl bg-white border border-gray-100 rounded-[2rem] pl-16 pr-8 py-5 text-lg font-bold text-[#1a1a2e] shadow-sm outline-none focus:border-indigo-500 focus:shadow-2xl focus:shadow-indigo-500/5 transition-all"
          id="project-search"
        />
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 animate-pulse">
              <div className="h-5 bg-gray-50 rounded-xl w-1/4 mb-6" />
              <div className="h-8 bg-gray-50 rounded-xl w-3/4 mb-4" />
              <div className="h-4 bg-gray-50 rounded-lg w-full mb-2" />
              <div className="h-4 bg-gray-50 rounded-lg w-2/3 mb-10" />
              <div className="h-px bg-gray-50 mb-8" />
              <div className="flex justify-between items-center">
                <div className="w-16 h-8 bg-gray-50 rounded-full" />
                <div className="w-24 h-8 bg-gray-50 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-50 shadow-sm">
          <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 transition-transform hover:scale-110">
            <FolderOpen size={56} className="text-gray-300" />
          </div>
          <h3 className="text-3xl font-black text-[#1a1a2e] mb-3">No workspaces found</h3>
          <p className="text-gray-400 font-bold max-w-md mx-auto leading-relaxed">
            {isAdmin ? 'Start by launching your first project workspace to collaborate with your team.' : 'You haven\'t been assigned to any projects yet.'}
          </p>
          {isAdmin && (
            <button onClick={() => setShowCreate(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black mt-10 py-5 px-10 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all">
              Create New Workspace
            </button>
          )}
        </div>
      ) : (
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10" layout>
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
