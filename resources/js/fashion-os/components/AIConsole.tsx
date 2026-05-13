import React, { useEffect, useRef } from 'react';

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
}

export const AIConsole: React.FC<AIConsoleProps> = ({ logs, title = "SYS_LOG_STREAM", className = '' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={`flex flex-col bg-neutral-900 rounded-[2rem] border border-neutral-800 overflow-hidden ${className}`}>
      <div className="px-6 py-3 bg-neutral-800/50 border-b border-neutral-800 flex justify-between items-center">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">
          {title}
        </span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/20" />
          <div className="w-2 h-2 rounded-full bg-amber-500/20" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-6 font-mono text-[10px] space-y-1.5 overflow-y-auto no-scrollbar max-h-[400px]"
      >
        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-4 group hover:bg-white/[0.02] py-0.5 px-2 -mx-2 rounded transition-colors">
            <span className="text-neutral-600 shrink-0">[{log.timestamp}]</span>
            <span className={`shrink-0 w-12 uppercase font-bold ${
              log.level === 'error' ? 'text-red-400' : 
              log.level === 'warn' ? 'text-amber-400' : 
              log.level === 'trace' ? 'text-blue-400' : 
              'text-emerald-400'
            }`}>
              {log.level}
            </span>
            <span className="text-neutral-500 shrink-0">{log.module}</span>
            <span className="text-neutral-300 break-all">{log.message}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="h-full flex items-center justify-center text-neutral-600 italic">
            Waiting for neural bridge heartbeat...
          </div>
        )}
      </div>
      
      <div className="px-6 py-2 bg-neutral-800/20 border-t border-neutral-800 flex justify-between">
        <span className="text-[8px] font-mono text-neutral-600">STATE: SYNCHRONIZED</span>
        <span className="text-[8px] font-mono text-neutral-600">BUF: {Math.min(logs.length, 500)}/500</span>
      </div>
    </div>
  );
};
