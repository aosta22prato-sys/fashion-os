import React from 'react';
import { Search, Bell, User, Zap, Grid, Command } from 'lucide-react';
import { LuxuryTypography } from '../design-system/LuxuryTypography';
import { motion } from 'motion/react';

export const Topbar: React.FC = () => {
  return (
    <header className="h-24 px-12 border-b border-white/5 flex items-center justify-between sticky top-0 z-50 bg-black/80 backdrop-blur-xl">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Zap className="text-black" size={20} fill="currentColor" />
          </div>
          <div className="leading-none">
            <LuxuryTypography variant="h2" className="text-xl">F_OS</LuxuryTypography>
            <p className="text-[7px] font-black text-primary tracking-[0.4em] uppercase mt-1">SS26_KERNEL</p>
          </div>
        </div>

        <div className="h-10 px-6 bg-white/5 rounded-full border border-white/5 flex items-center gap-4 text-zinc-500 hover:border-white/20 transition-all cursor-pointer group">
          <Search size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest">Neural Search...</span>
          <div className="flex items-center gap-1 ml-12">
            <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 text-[8px] font-black font-mono">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 text-[8px] font-black font-mono">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 py-2 px-4 bg-primary/10 rounded-full border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[8px] font-black text-primary uppercase tracking-widest">GPU: Acceleration Active</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-3 rounded-full hover:bg-white/5 text-zinc-500 transition-colors relative">
            <Bell size={18} />
            <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-black" />
          </button>
          <div className="w-10 h-10 rounded-full border border-white/10 p-0.5">
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" 
              className="w-full h-full rounded-full bg-zinc-900" 
              alt="User"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
