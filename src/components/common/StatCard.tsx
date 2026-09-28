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
  iconBg = 'bg-[#c9a96e]/15',
  iconColor = 'text-[#c9a96e]',
  trend,
}) => {
  return (
    <div className="glass-card-hover rounded-2xl p-6 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#666666]">{title}</p>
          <h3 className="font-serif text-2xl lg:text-3xl font-bold text-[#2C2C2C] tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-[#666666]">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-1 text-xs">
              <span
                className={`font-semibold ${
                  trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}
              </span>
              <span className="text-[#666666]">vs last period</span>
            </div>
          )}
        </div>
        <div
          className={`p-3.5 rounded-2xl ${iconBg} ${iconColor} border border-[#c9a96e]/20 transition-transform group-hover:scale-110 duration-300 shadow-sm`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

