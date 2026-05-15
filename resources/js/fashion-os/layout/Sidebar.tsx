import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Library, Eraser, User, 
  Settings, HelpCircle, ChevronRight,
  Plus, Search, Grid, TrendingUp
} from 'lucide-react';
import { LuxuryTypography } from '../design-system/LuxuryTypography';

const NAV_GROUPS = [
  {
    label: 'Core',
    items: [
      { id: 'home', label: 'Home Matrix', icon: Grid },
    ]
  },
  {
    label: 'Studio',
    items: [
      { id: 'try-on', label: 'Try-On Studio', icon: User },
      { id: 'design', label: 'Inspiration Studio', icon: Eraser },
      { id: 'collection', label: 'Collection AI', icon: Library },
    ]
  },
  {
    label: 'Insights',
    items: [
      { id: 'trends', label: 'Trend Matrix', icon: TrendingUp },
      { id: 'clusters', label: 'Style Clusters', icon: Grid },
    ]
  }
];

export const Sidebar: React.FC<{ activeTab: string, onSelect: (id: string) => void }> = ({ activeTab, onSelect }) => {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-8 top-1/2 -translate-y-1/2 z-[100] h-auto bg-black/40 backdrop-blur-3xl border border-white/5 p-4 rounded-[40px] flex flex-col gap-8 shadow-2xl"
    >
      <div className="flex flex-col gap-4">
        {NAV_GROUPS.flatMap(g => g.items).map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(item.id)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all relative group ${
              activeTab === item.id 
              ? 'bg-white text-black' 
              : 'text-zinc-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={22} className={activeTab === item.id ? 'text-black' : 'group-hover:text-primary'} />
            
            {/* Tooltip */}
            <div className="absolute left-20 px-4 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
               {item.label}
            </div>

            {activeTab === item.id && (
              <motion.div 
                layoutId="active-nav-glow"
                className="absolute inset-0 bg-white blur-xl opacity-20 -z-10 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
        <button className="w-14 h-14 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
          <Settings size={22} />
        </button>
      </div>
    </motion.aside>
  );
};
