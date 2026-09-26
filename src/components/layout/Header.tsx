import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Menu, LogOut, ExternalLink, ShieldCheck, User } from 'lucide-react';

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuOpen }) => {
  const { user, profile, logout } = useAuth();

  return (
    <header className="h-20 bg-slate-900/90 border-b border-slate-800/80 sticky top-0 z-20 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
      {/* Left side: Mobile menu toggle + Header Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Mode</span>
          </div>
        </div>
      </div>

      {/* Right side: Actions & User profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        <a
          href="https://viziddecors.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700/60 transition-all"
        >
          <span>Main Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-200 truncate max-w-[160px]">
              {user?.email || profile?.email || 'Admin'}
            </div>
            <div className="text-[10px] text-amber-400 font-medium">Administrator</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-100 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all ml-1"
          title="Sign out from Admin Panel"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
