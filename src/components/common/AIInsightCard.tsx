import React from 'react';
import { Sparkles, ArrowRight, Clock, AlertTriangle } from 'lucide-react';

interface AIInsightCardProps {
  badgeTitle?: string;
  headline: string;
  reasoning: string;
  actionText: string;
  onAction: () => void;
  accentColor?: 'emerald' | 'amber' | 'purple';
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  badgeTitle = '🤖 AI Priority',
  headline,
  reasoning,
  actionText,
  onAction,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-5 sm:p-6 shadow-sm border border-emerald-500/30">
      {/* Subtle ambient light glow */}
      <div className="absolute top-0 right-0 w-80 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {badgeTitle}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Real-time sync</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
            {headline}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {reasoning}
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0 self-start md:self-center">
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            {actionText}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
