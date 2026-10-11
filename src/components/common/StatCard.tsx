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
  iconBg = 'bg-[#D4AF37]/15',
  iconColor = 'text-[#D4AF37]',
  trend,
}) => {
  return (
    <div className="glass-card-hover rounded-2xl p-6 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">{title}</p>
          <h3 className="font-serif text-2xl lg:text-3xl font-bold text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-stone-400">{subtitle}</p>}
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
              <span className="text-stone-400">vs last period</span>
            </div>
          )}
        </div>
        <div
          className={`p-3.5 rounded-2xl ${iconBg} ${iconColor} border border-[#D4AF37]/25 transition-transform group-hover:scale-110 duration-300 shadow-md`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
