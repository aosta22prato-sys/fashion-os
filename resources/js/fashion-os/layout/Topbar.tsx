import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Zap, Grid, Command } from 'lucide-react';
import { LuxuryTypography } from '../design-system/LuxuryTypography';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';

export const Topbar: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 inset-x-0 h-20 px-6 md:px-12 flex items-center justify-between z-50 bg-black/50 backdrop-blur-3xl border-b border-white/5"
    >
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Zap className="text-black" size={16} fill="currentColor" />
          </div>
          <LuxuryTypography variant="h2" className="text-lg">MODAUI</LuxuryTypography>
        </div>

        <div className="hidden md:flex h-9 px-5 bg-white/5 rounded-full border border-white/5 flex items-center gap-3 text-zinc-500 hover:border-white/20 transition-all cursor-pointer group">
          <Search size={12} />
          <span className="text-[10px] font-medium uppercase tracking-widest">Search...</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2 rounded-full hover:bg-white/5 text-zinc-500 transition-colors">
          <Bell size={16} />
        </button>
        <div className="w-8 h-8 rounded-full border border-white/10 p-0.5">
          <img 
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" 
            className="w-full h-full rounded-full bg-zinc-900" 
            alt="User"
          />
        </div>
      </div>
    </motion.header>
  );
};
