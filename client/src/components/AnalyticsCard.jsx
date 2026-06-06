import React from 'react';
import GlassCard from './GlassCard';

const AnalyticsCard = ({ title, value, icon, change, changeType = 'increase', description, delay = '' }) => {
  return (
    <GlassCard className="flex items-start justify-between border-slate-800 animate-scroll-up" delay={delay}>
      <div className="space-y-3">
        <span className="text-slate-400 text-sm font-medium tracking-wide uppercase">{title}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight font-outfit">{value}</span>
          {change && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              changeType === 'increase' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {change}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <div className="p-3 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 border border-indigo-500/20 text-indigo-400">
        {icon}
      </div>
    </GlassCard>
  );
};

export default AnalyticsCard;
