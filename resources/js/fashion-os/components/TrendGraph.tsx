import React from 'react';
import { motion } from 'motion/react';

interface TrendGraphProps {
  data: { label: string; value: number }[];
  title?: string;
  className?: string;
}

export const TrendGraph: React.FC<TrendGraphProps> = ({ data, title, className = '' }) => {
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div className={`p-8 bg-neutral-900 border border-white/5 rounded-[2.5rem] ${className}`}>
      {title && <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">{title}</h4>}
      <div className="flex items-end gap-3 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
            <div className="relative w-full flex flex-col justify-end h-full">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${(d.value / max) * 100}%` }}
                className="w-full bg-emerald-500/20 group-hover:bg-emerald-500/40 rounded-t-lg border-t border-emerald-500/50 transition-colors"
                style={{ minHeight: '4px' }}
              />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-mono text-emerald-400">
                {d.value.toFixed(2)}
              </div>
            </div>
            <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-600 group-hover:text-zinc-400 truncate w-full text-center">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
