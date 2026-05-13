import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

import { Language } from '../../../../types';
import { translations } from '../../../../services/translationService';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'trace';
  module: string;
  message: string;
}

interface AIConsoleProps {
  logs: LogEntry[];
  title?: string;
  className?: string;
  lang: Language;
}

export const AIConsole: React.FC<AIConsoleProps> = ({ logs, title, className = '', lang }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = translations[lang].common;
  const displayTitle = title || t.logStream;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={`flex flex-col bg-neutral-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl ${className}`}>
      <div className="px-8 py-5 bg-black/40 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Terminal size={14} className="text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            {displayTitle}
          </span>
        </div>
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-8 font-mono text-[11px] space-y-2 overflow-y-auto no-scrollbar max-h-[500px]"
      >
        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-6 group hover:bg-white/[0.03] py-1 px-3 -mx-3 rounded-lg transition-all border border-transparent hover:border-white/5 cursor-default">
            <span className="text-zinc-600 shrink-0 select-none">[{log.timestamp}]</span>
            <span className={`shrink-0 w-14 uppercase font-black tracking-widest ${
              log.level === 'error' ? 'text-rose-400' : 
              log.level === 'warn' ? 'text-amber-400' : 
              log.level === 'trace' ? 'text-zinc-500' : 
              'text-primary neon-cyan'
            }`}>
              {log.level}
            </span>
            <span className="text-zinc-500 shrink-0 font-bold uppercase">{log.module}</span>
            <span className="text-zinc-300 break-all leading-relaxed">{log.message}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="h-full flex items-center justify-center text-neutral-600 italic">
            {lang === 'zh' ? '正在等待神经桥接心跳...' : 'Waiting for neural bridge heartbeat...'}
          </div>
        )}
      </div>
      
      <div className="px-6 py-2 bg-card/20 border-t border-border flex justify-between">
        <span className="text-[8px] font-mono text-muted">{translations[lang].ops.state}: {t.sync.toUpperCase()}</span>
        <span className="text-[8px] font-mono text-muted">BUF: {Math.min(logs.length, 500)}/500</span>
      </div>
    </div>
  );
};
