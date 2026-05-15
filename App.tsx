import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OSShell } from './resources/js/fashion-os/OSShell';

export default function App() {
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    // Enterprise Boot Sequence Simulation
    const timer = setTimeout(() => setIsBooting(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen bg-black overflow-hidden selection:bg-primary selection:text-black">
      <AnimatePresence mode="wait">
        {isBooting ? (
          <motion.div 
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#050505] flex flex-col items-center justify-center gap-12"
          >
            <div className="relative">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 90, 180, 270, 360]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-2 border-primary/20 rounded-2xl flex items-center justify-center p-4"
              >
                <div className="w-full h-full border border-primary/40 rounded-lg animate-pulse" />
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary font-black italic text-xl tracking-tighter">F_OS</div>
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
               <div className="flex flex-col items-center">
                  <h1 className="text-sm font-black italic uppercase tracking-[0.4em] text-white">Fashion_Operating_System</h1>
                  <p className="text-[8px] font-black text-zinc-500 tracking-[0.2em] mt-2">v4.2 // SECURITY_BOOT_SEQUENCE</p>
               </div>
               
               <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mt-8">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
               </div>
               
               <div className="flex gap-4 mt-2">
                 {['KERNEL', 'NEURAL_MESH', 'VECTOR_DB', 'VRAM_OPT'].map((s, i) => (
                   <motion.span 
                     key={s}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: i * 0.4 }}
                     className="text-[6px] font-black text-zinc-600 uppercase tracking-widest"
                   >
                     {s}_LOADED
                   </motion.span>
                 ))}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="os"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            <OSShell onExit={() => setIsBooting(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
