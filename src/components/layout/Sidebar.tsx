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
    <div className="flex flex-col h-full glass-sidebar text-stone-200">
      {/* Brand Header matching Main Site Branding */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-[#3D423F] bg-[#2C2C2C]">
        <NavLink to="/" className="flex items-center gap-3 group" onClick={onMobileClose}>
          <div className="flex flex-col items-start justify-center">
            <img
              src="/vizid.png"
              alt="Vizid - Live Luxury"
              className="h-8 w-auto object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-[9px] tracking-[0.25em] font-light text-stone-400 uppercase -mt-0.5 group-hover:text-stone-200 transition-colors">
              .....live luxury
            </span>
          </div>
        </NavLink>
        <button
          onClick={onMobileClose}
          className="lg:hidden p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-widest text-[#c9a96e]">
          Admin Navigation
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
                    ? 'bg-[#c9a96e] text-white font-semibold shadow-md shadow-[#c9a96e]/20 border border-[#c9a96e]'
                    : 'text-stone-300 hover:text-white hover:bg-white/5 border border-transparent'
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
      <div className="p-4 border-t border-[#3D423F] bg-[#2C2C2C]">
        <a
          href="https://viziddecors.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 text-stone-300 hover:text-white hover:border-[#c9a96e]/50 hover:bg-[#c9a96e]/15 transition-all text-xs font-medium group"
        >
          <span className="flex items-center gap-2">
            <span>Public Storefront</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-[#c9a96e] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
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

