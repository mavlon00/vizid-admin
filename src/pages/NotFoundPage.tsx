import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37] mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-white font-serif">404 - Page Not Found</h1>
      <p className="text-xs text-stone-300 max-w-sm mt-2 font-sans">
        The admin route you are trying to access does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 px-5 py-2.5 rounded-xl btn-gold text-black font-bold text-xs flex items-center gap-2 transition-all shadow-lg"
      >
        <Home className="w-4 h-4" />
        <span>Return to Overview</span>
      </Link>
    </div>
  );
};
