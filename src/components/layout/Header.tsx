import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Menu, LogOut, ExternalLink, ShieldCheck, User } from 'lucide-react';

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuOpen }) => {
  const { user, profile, logout } = useAuth();

  return (
    <header className="h-20 glass-header sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
      {/* Left side: Mobile menu toggle + Header Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Logo View */}
        <div className="flex flex-col lg:hidden">
          <img src="/vizid.png" alt="Vizid" className="h-7 w-auto object-contain brightness-0 invert" />
          <span className="text-[8px] tracking-[0.2em] font-light text-stone-300 uppercase -mt-0.5">
            .....live luxury
          </span>
        </div>

        {/* Header Title (Desktop & Tablet) */}
        <div className="hidden lg:flex items-center gap-3">
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-white">
            Vizid Decor – Admin Control Panel
          </h1>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9a96e]/20 border border-[#c9a96e]/40 text-[#c9a96e] text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Admin</span>
          </div>
        </div>
      </div>

      {/* Right side: Actions & User profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        <a
          href="https://viziddecors.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#c9a96e] bg-[#c9a96e]/10 hover:bg-[#c9a96e]/20 border border-[#c9a96e]/30 transition-all backdrop-blur-md shadow-sm"
        >
          <span>Public Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#3D423F]">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#c9a96e] shrink-0 shadow-inner">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-stone-200 truncate max-w-[160px]">
              {user?.email || profile?.email || 'Admin User'}
            </div>
            <div className="text-[10px] text-[#c9a96e] font-medium tracking-wide uppercase">
              Administrator
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-100 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all backdrop-blur-md ml-1"
          title="Sign out from Admin Panel"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

