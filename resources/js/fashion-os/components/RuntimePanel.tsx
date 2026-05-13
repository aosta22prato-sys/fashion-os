import React from 'react';
import { motion } from 'motion/react';

interface RuntimePanelProps {
  title: string;
  status?: 'online' | 'offline' | 'busy';
  children: React.ReactNode;
  className?: string;
}

export const RuntimePanel: React.FC<RuntimePanelProps> = ({ 
  title, 
  status = 'online', 
  children, 
  className = '' 
}) => {
  const statusColors = {
    online: "bg-emerald-500 shadow-[0_0_8px_#10b981]",
    offline: "bg-red-500 shadow-[0_0_8px_#ef4444]",
    busy: "bg-amber-500 shadow-[0_0_8px_#f59e0b]"
  };

  return (
    <div className={`p-6 bg-neutral-50 dark:bg-black/40 rounded-3xl border border-neutral-100 dark:border-white/5 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${statusColors[status]} ${status === 'online' ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-white/70">
            {title}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-1 h-3 bg-neutral-200 dark:bg-white/5 rounded-full" />
          ))}
        </div>
      </div>
      {children}
    </div>
  );
};
