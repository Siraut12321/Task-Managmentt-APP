'use client';

import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { Task } from '@/types/task';

type ColumnType = 'new' | 'inProgress' | 'completed';

const columnConfig: Record<ColumnType, { label: string; dot: string; count: string; empty: string; emptyMsg: string }> = {
  new:        { label: 'New Tasks',   dot: 'bg-slate-400',  count: 'bg-slate-700 text-slate-300',      empty: '📋', emptyMsg: 'No tasks yet. Create your first task!' },
  inProgress: { label: 'In Progress', dot: 'bg-yellow-400', count: 'bg-yellow-500/20 text-yellow-400', empty: '⚡', emptyMsg: 'No tasks in progress.' },
  completed:  { label: 'Completed',   dot: 'bg-green-400',  count: 'bg-green-500/20 text-green-400',   empty: '🎉', emptyMsg: 'No completed tasks yet.' },
};

interface TaskColumnProps {
  type: ColumnType;
  index: number;
  tasks: Task[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDeleteRequest: (id: string) => void;
  onMoveToProgress: (task: Task) => void;
  onSchedule: (task: Task) => void;
  editTask?: Task | null;
  onSubmit?: (form: { title: string; priority: Task['priority']; dueDate: string }) => void;
  onCancel?: () => void;
}

const TaskColumn = ({ type, index, tasks, onToggle, onEdit, onDeleteRequest, onMoveToProgress, onSchedule, editTask, onSubmit, onCancel }: TaskColumnProps) => {
  const cfg = columnConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
      className="flex flex-col bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4"
      style={{ height: 'calc(100vh - 88px)' }}
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
          <h3 className="text-sm font-semibold text-slate-200">{cfg.label}</h3>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.count}`}>{tasks.length}</span>
      </div>

      {type === 'new' && onSubmit && (
        <div className="flex-shrink-0">
          <TaskForm onSubmit={onSubmit} editTask={editTask} onCancel={onCancel} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-0.5">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="text-3xl mb-2">{cfg.empty}</div>
              <p className="text-slate-500 text-sm">{cfg.emptyMsg}</p>
            </motion.div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDeleteRequest={onDeleteRequest}
                onMoveToProgress={onMoveToProgress}
                onSchedule={onSchedule}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TaskColumn;
