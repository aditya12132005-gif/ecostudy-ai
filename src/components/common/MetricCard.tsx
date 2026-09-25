import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    text: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  onClick?: () => void;
  accentBorder?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-emerald-700',
  iconBg = 'bg-emerald-50',
  trend,
  onClick,
  accentBorder = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between ${
        accentBorder
          ? 'border-amber-300 ring-2 ring-amber-100/80 bg-amber-50/20'
          : 'border-slate-200/90 hover:border-emerald-300'
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      {/* Top Header: Label & Icon */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </span>
          <div className={`p-2 rounded-xl ${iconBg} ${iconColor} transition-transform group-hover:scale-105`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        {/* Big Number & Trend Pill */}
        <div className="mt-3 flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            {value}
          </span>
          {trend && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                trend.isNeutral
                  ? 'bg-slate-100 text-slate-700'
                  : trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {trend.text}
            </span>
          )}
        </div>
      </div>

      {/* Subtitle - clean, readable, no truncation */}
      <p className="mt-2.5 text-xs text-slate-500 font-medium leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
};
