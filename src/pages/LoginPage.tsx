import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, isLoading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#2C2C2C] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Ambient Decorative Accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#c9a96e]/15 via-[#8B6F47]/10 to-transparent blur-[140px] rounded-full pointer-events-none" />

      {/* Brand Login Card */}
      <div className="w-full max-w-md bg-white border border-[#E8E6E1] rounded-3xl p-8 sm:p-10 shadow-xl shadow-stone-200/80 relative z-10 my-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex flex-col items-center justify-center mb-3">
            <img
              src="/vizid.png"
              alt="Vizid - Live Luxury"
              className="h-12 w-auto object-contain"
            />
            <span className="text-[9px] tracking-[0.25em] font-light text-[#8B6F47] uppercase mt-0.5">
              .....live luxury
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-2 px-3.5 py-1 rounded-full bg-[#c9a96e]/15 border border-[#c9a96e]/40 text-[10px] font-bold uppercase tracking-widest text-[#8B6F47]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c9a96e]" />
            <span>Admin Control Panel</span>
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#2C2C2C] mt-4">
            Administrator Sign In
          </h2>
          <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">
            Enter your credentials to access store inventory & order management.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-[#4A4F4C] uppercase tracking-wider mb-2">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@viziddecors.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#4A4F4C] uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-[#c9a96e] hover:bg-[#8B6F47] text-white font-bold text-sm shadow-md shadow-[#c9a96e]/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#c9a96e] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Admin...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-[#666666]">
          Public Storefront:{' '}
          <a
            href="https://viziddecors.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c9a96e] font-semibold hover:underline"
          >
            viziddecors.com
          </a>
        </div>
      </div>
    </div>
  );
};

