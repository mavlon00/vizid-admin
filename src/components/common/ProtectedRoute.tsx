import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-md">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
          <div className="text-center">
            <h3 className="font-semibold text-slate-200 text-lg">Verifying Admin Access</h3>
            <p className="text-xs text-slate-400 mt-1">Please wait while we check your credentials...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
