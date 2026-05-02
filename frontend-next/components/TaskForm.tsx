'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Task } from '@/types/task';

const inputCls = 'w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-all';

interface TaskFormData {
  title: string;
  priority: Task['priority'];
  dueDate: string;
}

interface TaskFormProps {
  onSubmit: (form: TaskFormData) => void;
  editTask?: Task | null;
  onCancel?: () => void;
}

const TaskForm = ({ onSubmit, editTask, onCancel }: TaskFormProps) => {
  const [form, setForm] = useState<TaskFormData>({ title: '', priority: 'medium', dueDate: '' });

  useEffect(() => {
    if (editTask) {
      setForm({ title: editTask.title, priority: editTask.priority, dueDate: editTask.dueDate ? editTask.dueDate.slice(0, 10) : '' });
    } else {
      setForm({ title: '', priority: 'medium', dueDate: '' });
    }
  }, [editTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    if (!editTask) setForm({ title: '', priority: 'medium', dueDate: '' });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 mb-4 space-y-3"
    >
      <input
        className={inputCls}
        placeholder="Task title..."
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <div className="flex gap-2">
        <select
          className={`${inputCls} flex-1`}
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value as Task['priority'] })}
        >
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
        <input
          className={`${inputCls} flex-1`}
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <motion.button
          type="submit"
          whileTap={{ scale: 0.96 }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus size={16} />
          {editTask ? 'Update Task' : 'Add Task'}
        </motion.button>
        {editTask && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onCancel}
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-xl transition-colors flex items-center gap-1"
          >
            <X size={15} /> Cancel
          </motion.button>
        )}
      </div>
    </motion.form>
  );
};

export default TaskForm;
