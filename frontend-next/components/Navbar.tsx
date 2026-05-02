'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-slate-900 border-b border-slate-800">
      <Link href="/dashboard" className="text-white font-bold text-lg">TaskFlow</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-slate-400 text-sm">Hi, {user.name}</span>
            <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="text-sm text-brand hover:text-brand-light transition-colors">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
