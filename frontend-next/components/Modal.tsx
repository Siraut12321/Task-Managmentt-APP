'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, LogOut, LogIn, LucideIcon } from 'lucide-react';

type ModalVariant = 'delete' | 'logout' | 'login';

interface VariantConfig {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  btn: string;
}

const variants: Record<ModalVariant, VariantConfig> = {
  delete: { icon: AlertTriangle, iconBg: 'bg-red-500/20',    iconColor: 'text-red-400',     btn: 'bg-red-500 hover:bg-red-600' },
  logout: { icon: LogOut,        iconBg: 'bg-yellow-500/20', iconColor: 'text-yellow-400',  btn: 'bg-yellow-500 hover:bg-yellow-600' },
  login:  { icon: LogIn,         iconBg: 'bg-brand/20',      iconColor: 'text-brand-light', btn: 'bg-brand hover:bg-brand-dark' },
};

const defaults: Record<ModalVariant, { title: string; message: string; confirmLabel: string }> = {
  delete: { title: 'Delete Task',    message: 'Are you sure you want to delete this task? This action cannot be undone.', confirmLabel: 'Delete' },
  logout: { title: 'Logout',         message: 'Are you sure you want to logout?',                                         confirmLabel: 'Confirm Logout' },
  login:  { title: 'Login Required', message: 'Please login to continue.',                                                confirmLabel: 'Go to Login' },
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  variant?: ModalVariant;
  title?: string;
  message?: string;
  confirmLabel?: string;
}

const Modal = ({ isOpen, onClose, onConfirm, variant = 'delete', title, message, confirmLabel }: ModalProps) => {
  const v = variants[variant];
  const d = defaults[variant];
  const Icon = v.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-xl ${v.iconBg}`}>
                <Icon className={v.iconColor} size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">{title ?? d.title}</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">{message ?? d.message}</p>
            <div className="flex gap-3 justify-end">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className={`px-4 py-2 rounded-xl text-white text-sm font-medium transition-colors ${v.btn}`}
              >
                {confirmLabel ?? d.confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
