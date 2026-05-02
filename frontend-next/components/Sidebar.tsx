'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, LogOut, CheckSquare, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Modal from './Modal';

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    setShowLogout(false);
    router.push('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'G';

  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand rounded-xl">
            <CheckSquare size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">TaskFlow</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white md:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-brand/20 text-brand-light border border-brand/30 cursor-default">
          <LayoutDashboard size={18} />
          <span className="text-sm font-medium">Dashboard</span>
        </div>
      </nav>

      <div className="px-4 pb-6">
        <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name ?? 'Guest'}</p>
              <p className="text-slate-400 text-xs truncate">{user?.email ?? 'Not logged in'}</p>
            </div>
          </div>
          {user ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowLogout(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-700/60 hover:bg-red-500/20 hover:text-red-400 text-slate-300 text-sm font-medium transition-all duration-200 border border-slate-600/50 hover:border-red-500/30"
            >
              <LogOut size={15} /> Logout
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/login')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-brand/20 hover:bg-brand/30 text-brand-light text-sm font-medium transition-all duration-200 border border-brand/30"
            >
              Login
            </motion.button>
          )}
        </div>
      </div>

      <Modal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogoutConfirm}
        variant="logout"
      />
    </>
  );
};

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300"
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex-col z-40"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 h-full w-72 bg-slate-900 border-r border-slate-800 flex flex-col z-50"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
