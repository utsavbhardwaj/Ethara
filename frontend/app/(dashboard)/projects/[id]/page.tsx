'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, DragEndEvent, DragOverEvent, DragStartEvent,
  PointerSensor, useSensor, useSensors, closestCenter,
  DragOverlay
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Plus, Users, Calendar, MoreHorizontal, X,
  GripVertical, Pencil, Trash2, UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { projectsService, tasksService } from '@/services/api.service';
import { useAuthStore } from '@/store/auth.store';
import { formatDate, getInitials, isOverdue } from '@/lib/utils';
import type { Task, Project, User } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const COLUMNS: { id: Task['status']; label: string; color: string }[] = [
  { id: 'TODO', label: 'To Do', color: '#64748b' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: '#818cf8' },
  { id: 'REVIEW', label: 'Review', color: '#fbbf24' },
  { id: 'COMPLETED', label: 'Completed', color: '#4ade80' },
];

const taskSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().optional(),
  assignedTo: z.string().optional(),
});
type TaskFormData = z.infer<typeof taskSchema>;

function TaskCard({
  task,
  isAdmin,
  onDelete,
}: {
  task: Task;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass rounded-xl p-3 mb-2 cursor-grab active:cursor-grabbing group relative"
    >
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-sm leading-snug">{task.title}</p>
            {isAdmin && (
              <div className="relative flex-shrink-0">
                <button onClick={() => setMenuOpen(!menuOpen)} className="btn-ghost p-0 w-5 h-5 opacity-0 group-hover:opacity-100">
                  <MoreHorizontal size={12} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-5 glass rounded-xl shadow-xl z-20 min-w-28"
                    style={{ border: '1px solid var(--border)' }}>
                    <button onClick={() => { onDelete(task.id); setMenuOpen(false); }}
                      className="btn-ghost w-full justify-start text-xs rounded-none px-3 py-2" style={{ color: '#f87171' }}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              task.priority === 'HIGH' ? 'badge-high' : task.priority === 'MEDIUM' ? 'badge-medium' : 'badge-low'
            }`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="text-xs" style={{ color: isOverdue(task.dueDate) ? '#f87171' : 'var(--text-muted)' }}>
                📅 {formatDate(task.dueDate)}
              </span>
            )}
          </div>

          {task.assignee && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {getInitials(task.assignee.name)}
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{task.assignee.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddTaskModal({
  projectId,
  status,
  members,
  onClose,
}: {
  projectId: string;
  status: Task['status'];
  members: Project['members'];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>({ resolver: zodResolver(taskSchema) });

  const mutation = useMutation({
    mutationFn: (data: TaskFormData) =>
      tasksService.create({
        ...data,
        status,
        projectId,
        assignedTo: data.assignedTo || null,
        dueDate: data.dueDate || null,
      } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Task created!');
      onClose();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed'),
  });

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        className="glass-strong rounded-2xl p-6 w-full max-w-md"
        style={{ border: '1px solid rgba(139, 92, 246, 0.3)' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Add Task</h2>
          <button onClick={onClose} className="btn-ghost p-1"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Title *</label>
            <input {...register('title')} placeholder="Task title" className="input-dark" id="task-title" />
            {errors.title && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea {...register('description')} rows={2} placeholder="Optional details" className="input-dark resize-none" id="task-desc" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Priority</label>
              <select {...register('priority')} className="input-dark" id="task-priority">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Due Date</label>
              <input {...register('dueDate')} type="date" className="input-dark" id="task-due" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Assign to</label>
            <select {...register('assignedTo')} className="input-dark" id="task-assign">
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.userId} value={m.userId}>{m.user.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1 justify-center">
              {mutation.isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Add Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function AddMemberModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState('');

  const { data: users = [] } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const res = await projectsService.getAllUsers();
      return res.data.data as User[];
    },
  });

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await projectsService.getById(projectId);
      return res.data.data as Project;
    },
  });

  const existingMemberIds = project?.members.map((m) => m.userId) || [];
  const availableUsers = users.filter((u) => !existingMemberIds.includes(u.id));

  const mutation = useMutation({
    mutationFn: () => projectsService.addMember(projectId, selectedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Member added!');
      onClose();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed'),
  });

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        className="glass-strong rounded-2xl p-6 w-full max-w-sm"
        style={{ border: '1px solid rgba(139, 92, 246, 0.3)' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Add Member</h2>
          <button onClick={onClose} className="btn-ghost p-1"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="input-dark" id="member-select">
            <option value="">Select a user</option>
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button
              onClick={() => selectedUser && mutation.mutate()}
              disabled={!selectedUser || mutation.isPending}
              className="btn-primary flex-1 justify-center"
            >
              {mutation.isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Add'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const queryClient = useQueryClient();
  const [addTaskStatus, setAddTaskStatus] = useState<Task['status'] | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const res = await projectsService.getById(id);
      return res.data.data as Project;
    },
    enabled: !!id,
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: Task['status'] }) =>
      tasksService.update(taskId, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project', id] }),
    onError: () => toast.error('Failed to update task'),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => tasksService.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast.success('Task deleted');
    },
    onError: () => toast.error('Failed to delete task'),
  });

  const getTasksByStatus = (status: Task['status']) =>
    (project?.tasks || []).filter((t) => t.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    const task = project?.tasks?.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;
    const columnStatus = COLUMNS.find((c) => c.id === overId);

    if (columnStatus) {
      const task = project?.tasks?.find((t) => t.id === active.id);
      if (task && task.status !== columnStatus.id) {
        updateTaskMutation.mutate({ taskId: task.id, status: columnStatus.id });
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) return;
    const overId = over.id as string;
    const isColumn = COLUMNS.some((c) => c.id === overId);
    if (isColumn) return;
    // Could handle task-to-task reordering here
  };

  if (isLoading) {
    return (
      <div>
        <div className="h-8 skeleton rounded w-48 mb-6" />
        <div className="h-6 skeleton rounded w-96 mb-8" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass rounded-2xl p-4">
              <div className="h-5 skeleton rounded w-24 mb-4" />
              {[1, 2].map((j) => <div key={j} className="h-20 skeleton rounded-xl mb-2" />)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!project) return <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Project not found</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/projects" className="inline-flex items-center gap-2 btn-ghost text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={14} /> All Projects
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">{project.title}</h1>
            {project.description && (
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              {project.deadline && (
                <span className="flex items-center gap-1"><Calendar size={13} /> Due {formatDate(project.deadline)}</span>
              )}
              <span className="flex items-center gap-1"><Users size={13} /> {project.members.length} members</span>
            </div>
          </div>
          {isAdmin && (
            <button onClick={() => setShowAddMember(true)} className="btn-secondary text-sm">
              <UserPlus size={15} /> Add Member
            </button>
          )}
        </div>

        {/* Members row */}
        <div className="flex items-center gap-2 mt-4">
          {project.members.map((m) => (
            <div key={m.id} title={`${m.user.name} (${m.role})`}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderColor: 'var(--bg-primary)' }}>
              {getInitials(m.user.name)}
            </div>
          ))}
          {isAdmin && (
            <button onClick={() => setShowAddMember(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-dashed"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="grid grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const tasks = getTasksByStatus(col.id);
            return (
              <div key={col.id} className="flex flex-col">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                    <span className="font-semibold text-sm">{col.label}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                      {tasks.length}
                    </span>
                  </div>
                  <button onClick={() => setAddTaskStatus(col.id)} className="btn-ghost p-1 w-6 h-6" title="Add task">
                    <Plus size={14} />
                  </button>
                </div>

                {/* Drop zone */}
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy} id={col.id}>
                  <div
                    className="flex-1 rounded-2xl p-2 min-h-40 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)' }}
                    id={col.id}
                  >
                    {tasks.length === 0 ? (
                      <div className="flex items-center justify-center h-24 text-xs" style={{ color: 'var(--text-muted)' }}>
                        Drop tasks here
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          isAdmin={isAdmin}
                          onDelete={(taskId) => deleteTaskMutation.mutate(taskId)}
                        />
                      ))
                    )}

                    <button
                      onClick={() => setAddTaskStatus(col.id)}
                      className="w-full mt-1 btn-ghost text-xs justify-center py-2 rounded-lg border border-dashed"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                    >
                      <Plus size={12} /> Add task
                    </button>
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="glass rounded-xl p-3 shadow-xl rotate-2" style={{ border: '1px solid rgba(139,92,246,0.4)' }}>
              <p className="font-medium text-sm">{activeTask.title}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <AnimatePresence>
        {addTaskStatus && (
          <AddTaskModal
            projectId={id}
            status={addTaskStatus}
            members={project.members}
            onClose={() => setAddTaskStatus(null)}
          />
        )}
        {showAddMember && (
          <AddMemberModal projectId={id} onClose={() => setShowAddMember(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
