import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ExternalLink,
  X,
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
      name: 'Products Catalog',
      path: '/products',
      icon: Package,
    },
    {
      name: 'Orders Management',
      path: '/orders',
      icon: ShoppingBag,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full glass-sidebar text-slate-300">
      {/* Brand Header matching Main Site Branding */}
      <div className="flex items-center justify-between h-24 px-6 border-b border-white/10">
        <NavLink to="/" className="flex items-center gap-3 group" onClick={onMobileClose}>
          <div className="flex flex-col items-start justify-center">
            <img
              src="/vizid.png"
              alt="Vizid - Live Luxury"
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-[9px] tracking-[0.25em] font-light text-stone-300 uppercase -mt-0.5 group-hover:text-white transition-colors">
              .....live luxury
            </span>
          </div>
        </NavLink>
        <button
          onClick={onMobileClose}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400/80">
          Main Navigation
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
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-950/40 backdrop-blur-md font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
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
      <div className="p-4 border-t border-white/10 bg-slate-950/40 backdrop-blur-md">
        <a
          href="https://viziddecors.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/10 transition-all text-xs font-medium group"
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-full z-50 animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
