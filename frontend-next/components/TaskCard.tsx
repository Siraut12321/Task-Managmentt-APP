'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, CheckCircle2, Circle, Calendar, Flag, PlayCircle, Clock } from 'lucide-react';
import { Task } from '@/types/task';

const priorityConfig = {
  high:   { cls: 'bg-red-500/20 text-red-400 border-red-500/30',         dot: 'bg-red-400' },
  medium: { cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400' },
  low:    { cls: 'bg-green-500/20 text-green-400 border-green-500/30',    dot: 'bg-green-400' },
};

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDeleteRequest: (id: string) => void;
  onMoveToProgress: (task: Task) => void;
  onSchedule: (task: Task) => void;
}

const TaskCard = memo(({ task, onToggle, onEdit, onDeleteRequest, onMoveToProgress, onSchedule }: TaskCardProps) => {
  const p = priorityConfig[task.priority] ?? priorityConfig.medium;
  const isOverdue = task.dueDate && task.status !== 'completed' && new Date(task.dueDate) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: task.status === 'completed' ? 0.65 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.015, boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
      transition={{ duration: 0.2 }}
      className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-4 mb-3 cursor-default group"
    >
      <div className="flex items-start gap-3">
        <button onClick={() => onToggle(task)} className="mt-0.5 flex-shrink-0 text-slate-500 hover:text-brand transition-colors">
          {task.status === 'completed' ? <CheckCircle2 size={18} className="text-brand" /> : <Circle size={18} />}
        </button>
        <p className={`flex-1 text-sm font-medium leading-snug ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
          {task.title}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${p.cls}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
          <Flag size={10} />
          {task.priority}
        </span>

        {task.dueDate && (
          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border ${isOverdue ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-700/50 text-slate-400 border-slate-600/50'}`}>
            <Calendar size={11} />
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}

        {task.scheduled && task.status === 'new' && (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Clock size={11} /> Scheduled
          </span>
        )}

        {task.status === 'completed' && (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-brand/10 text-brand-light border border-brand/20">
            ✓ Done
          </span>
        )}
      </div>

      <div className="flex gap-1.5 mt-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-wrap">
        {task.status === 'new' && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onMoveToProgress(task)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs font-medium transition-colors border border-yellow-500/20"
          >
            <PlayCircle size={12} /> In Progress
          </motion.button>
        )}

        {task.status === 'new' && !task.scheduled && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onSchedule(task)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-medium transition-colors border border-purple-500/20"
          >
            <Calendar size={12} /> Schedule
          </motion.button>
        )}

        {task.status !== 'completed' && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-brand/20 hover:text-brand text-slate-400 transition-colors"
          >
            <Pencil size={13} />
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onDeleteRequest(task._id)}
          className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
        >
          <Trash2 size={13} />
        </motion.button>
      </div>
    </motion.div>
  );
});

TaskCard.displayName = 'TaskCard';
export default TaskCard;
