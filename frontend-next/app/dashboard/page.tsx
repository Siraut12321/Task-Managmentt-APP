'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Task } from '@/types/task';
import Sidebar from '@/components/Sidebar';
import TaskColumn from '@/components/TaskColumn';
import Modal from '@/components/Modal';
import Loader from '@/components/Loader';

const nextMonthDate = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
};

const CardSkeleton = () => (
  <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 mb-3 animate-pulse">
    <div className="h-3 bg-slate-700 rounded w-3/4 mb-3" />
    <div className="h-3 bg-slate-700 rounded w-1/2" />
  </div>
);

const ColumnSkeleton = () => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4" style={{ height: 'calc(100vh - 88px)' }}>
    <div className="h-4 bg-slate-700 rounded w-1/3 mb-4 animate-pulse" />
    {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
  </div>
);

export default function Dashboard() {
  const { user, authChecked, requireAuth, loginPrompt, setLoginPrompt } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'new' | 'inProgress' | 'completed'>('new');

  const fetchTasks = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      const { data } = await api.get<Task[]>('/tasks');
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authChecked) fetchTasks();
  }, [authChecked, fetchTasks]);

  const guarded = <T extends unknown[]>(fn: (...args: T) => void) => (...args: T) => {
    if (!requireAuth()) return;
    fn(...args);
  };

  const handleCreate = guarded(async (form: { title: string; priority: Task['priority']; dueDate: string }) => {
    try {
      const { data } = await api.post<Task>('/tasks', { ...form, status: 'new' });
      setTasks((prev) => [data, ...prev]);
      toast.success('Task created! 🎉');
    } catch {
      toast.error('Failed to create task');
    }
  });

  const handleUpdate = guarded(async (form: { title: string; priority: Task['priority']; dueDate: string }) => {
    if (!editTask) return;
    try {
      const { data } = await api.put<Task>(`/tasks/${editTask._id}`, form);
      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
      setEditTask(null);
      toast.success('Task updated!');
    } catch {
      toast.error('Failed to update task');
    }
  });

  const handleToggle = guarded(async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'new' : 'completed';
    try {
      const { data } = await api.put<Task>(`/tasks/${task._id}`, { completed: newStatus === 'completed', status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
      toast.success(data.status === 'completed' ? 'Task completed! 🎉' : 'Task reopened');
    } catch {
      toast.error('Failed to update task');
    }
  });

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${deleteId}`);
      setTasks((prev) => prev.filter((t) => t._id !== deleteId));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setDeleteId(null);
    }
  };

  const handleMoveToProgress = guarded(async (task: Task) => {
    try {
      const { data } = await api.put<Task>(`/tasks/${task._id}`, { status: 'inProgress', completed: false });
      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
      toast.success('Moved to In Progress ⚡');
    } catch {
      toast.error('Failed to move task');
    }
  });

  const handleSchedule = guarded(async (task: Task) => {
    try {
      const { data } = await api.put<Task>(`/tasks/${task._id}`, { dueDate: nextMonthDate(), scheduled: true, status: 'new' });
      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
      toast.success('Task scheduled for next month 📅');
    } catch {
      toast.error('Failed to schedule task');
    }
  });

  const newCol        = tasks.filter((t) => t.status === 'new');
  const inProgressCol = tasks.filter((t) => t.status === 'inProgress');
  const completedCol  = tasks.filter((t) => t.status === 'completed');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

  const tabs: { key: 'new' | 'inProgress' | 'completed'; label: string }[] = [
    { key: 'new', label: 'New' },
    { key: 'inProgress', label: 'In Progress' },
    { key: 'completed', label: 'Done' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f1a]">
      <Sidebar />

      <main className="flex-1 md:ml-64 flex flex-col overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 z-30 bg-slate-900/70 backdrop-blur-xl border-b border-slate-800 px-6 py-4 md:px-6 pl-16 md:pl-6 flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl font-bold text-white">
              Good {greeting}, {user?.name?.split(' ')[0] ?? 'there'} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {tasks.length} total · {completedCol.length} completed · {inProgressCol.length} in progress
            </p>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Mobile tab switcher */}
        <div className="md:hidden flex border-b border-slate-800 bg-slate-900/70 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'text-white border-b-2 border-brand'
                  : 'text-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden p-3 md:p-5">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full">
              {[0, 1, 2].map((i) => <ColumnSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full">
              <div className={activeTab === 'new' ? 'block' : 'hidden md:block'}>
                <TaskColumn
                  type="new" index={0}
                  tasks={newCol}
                  onToggle={handleToggle}
                  onEdit={guarded(setEditTask)}
                  onDeleteRequest={guarded((id: string) => setDeleteId(id))}
                  onMoveToProgress={handleMoveToProgress}
                  onSchedule={handleSchedule}
                  editTask={editTask}
                  onSubmit={editTask ? handleUpdate : handleCreate}
                  onCancel={() => setEditTask(null)}
                />
              </div>
              <div className={activeTab === 'inProgress' ? 'block' : 'hidden md:block'}>
                <TaskColumn
                  type="inProgress" index={1}
                  tasks={inProgressCol}
                  onToggle={handleToggle}
                  onEdit={guarded(setEditTask)}
                  onDeleteRequest={guarded((id: string) => setDeleteId(id))}
                  onMoveToProgress={handleMoveToProgress}
                  onSchedule={handleSchedule}
                />
              </div>
              <div className={activeTab === 'completed' ? 'block' : 'hidden md:block'}>
                <TaskColumn
                  type="completed" index={2}
                  tasks={completedCol}
                  onToggle={handleToggle}
                  onEdit={guarded(setEditTask)}
                  onDeleteRequest={guarded((id: string) => setDeleteId(id))}
                  onMoveToProgress={handleMoveToProgress}
                  onSchedule={handleSchedule}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} variant="delete" />
      <Modal
        isOpen={loginPrompt}
        onClose={() => setLoginPrompt(false)}
        onConfirm={() => { setLoginPrompt(false); router.push('/login'); }}
        variant="login"
      />
    </div>
  );
}
