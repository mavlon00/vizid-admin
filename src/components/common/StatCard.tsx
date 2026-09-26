import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-amber-500/10',
  iconColor = 'text-amber-400',
  trend,
}) => {
  return (
    <div className="glass-card-hover rounded-2xl p-6 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-1 text-xs">
              <span
                className={`font-semibold ${
                  trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}
              </span>
              <span className="text-slate-400">vs last period</span>
            </div>
          )}
        </div>
        <div
          className={`p-3.5 rounded-2xl ${iconBg} ${iconColor} border border-white/10 backdrop-blur-md transition-transform group-hover:scale-110 duration-300 shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
