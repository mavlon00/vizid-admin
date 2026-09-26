import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const navItems = [
    {
      name: 'Overview',
      path: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Products',
      path: '/products',
      icon: Package,
    },
    {
      name: 'Orders',
      path: '/orders',
      icon: ShoppingBag,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800/80 text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800/80">
        <NavLink to="/" className="flex items-center gap-3 group" onClick={onMobileClose}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="font-extrabold text-slate-100 text-lg tracking-wider font-sans">
              VIZID DECOR
            </div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-amber-400/90">
              <ShieldCheck className="w-3 h-3" /> Admin Dashboard
            </div>
          </div>
        </NavLink>
        <button
          onClick={onMobileClose}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400/80">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-950/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer link to public shop */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
        <a
          href="https://viziddecors.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/30 transition-all text-xs font-medium group"
        >
          <span className="flex items-center gap-2">
            <span>Public Storefront</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-full bg-slate-950 z-50 animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
