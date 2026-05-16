import React, { useState } from 'react';
import { LuxuryTypography } from '../../design-system/LuxuryTypography';
import { CollectionMasonryGrid } from './CollectionMasonryGrid';
import { Search, SlidersHorizontal, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { fashionItemService } from '@/services/fashionItemService';

export const CollectionHome: React.FC = () => {
  const [isCollecting, setIsCollecting] = useState(false);

  const handleCollectLatest = async () => {
    setIsCollecting(true);
    // Simulate collection call
    await fashionItemService.getItems(10);
    setTimeout(() => setIsCollecting(false), 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#050505]">
      {/* Hero Header */}
      <div className="p-20 space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-6">
            <LuxuryTypography variant="label">AI_Collection_Library // V4.2</LuxuryTypography>
            <LuxuryTypography variant="h1" className="text-8xl lowercase italic font-normal">Neural_Discovery</LuxuryTypography>
          </div>
          <div className="flex gap-4">
            <button
                onClick={handleCollectLatest}
                className={`px-8 py-4 rounded-full border transition-all flex items-center gap-4 ${
                    isCollecting ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-primary border-primary text-black hover:bg-primary/90'
                }`}
            >
              <RefreshCw className={isCollecting ? 'animate-spin' : ''} size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                  {isCollecting ? 'Collecting...' : 'Collect Latest Styles'}
              </span>
            </button>
             {[
               { label: 'All Collections', count: '412', active: true },
               { label: 'SS26 Trend', count: '84', active: false },
               { label: 'Neural Mesh', count: '12', active: false },
             ].map(cat => (
               <button 
                 key={cat.label}
                 className={`px-8 py-4 rounded-full border transition-all flex items-center gap-4 ${
                   cat.active ? 'bg-primary border-primary text-black' : 'border-white/10 text-zinc-500 hover:border-white/20'
                 }`}
               >
                 <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                 <span className="text-[8px] font-black opacity-50">{cat.count}</span>
               </button>
             ))}
          </div>
        </div>

        {/* Enhanced Filter Bar */}
        <div className="flex items-center gap-12 pt-12 border-t border-white/5">
           <div className="flex-1 flex gap-8">
              {['Aesthetic', 'Material', 'Season', 'Color'].map(filter => (
                <button key={filter} className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-widest italic">{filter}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-primary transition-colors" />
                </button>
              ))}
           </div>
           
           <div className="flex items-center gap-8">
             <div className="flex items-center gap-3 text-primary border-r border-white/10 pr-8">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest italic animate-pulse">Semantic Search Active</span>
             </div>
             <button className="flex items-center gap-3 px-6 py-3 glass-dark border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all">
                <Filter size={14} />
                Advanced Filters
             </button>
           </div>
        </div>
      </div>

      {/* Masonry Content */}
      <div className="flex-1">
        <CollectionMasonryGrid />
      </div>

      {/* Floating Action Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-12 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl z-50 group"
      >
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <Search className="text-black" size={32} />
      </motion.button>
    </div>
  );
};
