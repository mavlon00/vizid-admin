import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../common/ToastContainer';

export const AdminLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#2C2C2C] flex font-sans">
      {/* Navigation Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header onMobileMenuOpen={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#FAF9F7]">
          <div className="max-w-7xl mx-auto space-y-8">
            <Outlet />
          </div>
        </main>

        <footer className="py-4 px-8 border-t border-[#E8E6E1] text-center text-xs text-[#666666] bg-white">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-[#2C2C2C]">Vizid Decor</span>. Admin Control Panel.
        </footer>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default AdminLayout;

