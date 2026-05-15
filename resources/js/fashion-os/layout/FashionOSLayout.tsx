import React, { useEffect, useRef } from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { CinematicBackground } from '../design-system/CinematicBackground';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';

import { FashionAssistant } from '../components/assistant/FashionAssistant';

interface FashionOSLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const FashionOSLayout: React.FC<FashionOSLayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange 
}) => {
  const lenisRef = useRef<Lenis>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="min-h-screen text-white relative flex flex-col bg-[#050505] selection:bg-primary selection:text-black">
      <CinematicBackground />
      <Topbar />
      
      <div className="flex flex-1 relative min-h-0">
        <Sidebar activeTab={activeTab} onSelect={onTabChange} />
        
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <div className="w-[450px] border-l border-white/5 sticky top-24 h-[calc(100vh-96px)] p-8">
           <div className="h-full glass-dark rounded-[48px] border border-white/5 p-10 overflow-hidden">
              <FashionAssistant />
           </div>
        </div>
      </div>

      {/* Dock */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]">
        <div className="glass-dark border border-white/10 rounded-full px-8 py-4 flex items-center gap-8 shadow-2xl">
          {['try-on', 'design', 'collection'].map((id) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                activeTab === id ? 'bg-primary text-black' : 'hover:bg-white/5 text-zinc-500'
              }`}
            >
              <div className="w-6 h-6 border-2 border-current rounded-lg" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
