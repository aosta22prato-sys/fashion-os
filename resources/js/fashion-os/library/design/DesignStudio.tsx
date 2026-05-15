import React from 'react';
import { LuxuryTypography } from '../../design-system/LuxuryTypography';
import { PromptComposer } from './PromptComposer';
import { GlassCard } from '../../design-system/GlassCard';
import { motion } from 'motion/react';
import { Image as ImageIcon, Layout, Box, Sparkles, Wand2 } from 'lucide-react';

export const DesignStudio: React.FC = () => {
  return (
    <div className="p-12 lg:p-24 space-y-24 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
           <LuxuryTypography variant="label" className="text-primary italic animate-pulse tracking-[0.5em]">Neural_Inspiration_Engine // LOADED</LuxuryTypography>
           <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-transparent" />
        </div>
        <div className="flex flex-col items-center text-center space-y-8">
           <LuxuryTypography variant="h1" className="text-[12rem] leading-[0.8] mix-blend-difference font-normal lowercase italic tracking-[-0.05em]">
              Design_Studio
           </LuxuryTypography>
           <p className="max-w-2xl text-zinc-500 text-lg font-medium leading-relaxed uppercase tracking-wider">
              Transform conceptual DNA into high-fidelity fashion assets using our cross-model neural fabric.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-white/5">
         {/* Main Interface */}
         <div className="lg:col-span-8 space-y-12">
            <PromptComposer />
            
            <div className="grid grid-cols-2 gap-8 pt-12">
               {[
                 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80',
                 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80'
               ].map((img, i) => (
                 <div key={i} className="group relative aspect-[4/5] rounded-[48px] overflow-hidden border border-white/5">
                    <img src={img} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <button className="absolute bottom-10 right-10 p-5 bg-white text-black rounded-full scale-0 group-hover:scale-100 transition-transform duration-500">
                       <Wand2 size={24} />
                    </button>
                    <div className="absolute bottom-10 left-10">
                       <LuxuryTypography variant="label" className="text-white">Variant_0{i + 1}</LuxuryTypography>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Sidebar Actions */}
         <div className="lg:col-span-4 space-y-8">
            <GlassCard className="p-10 space-y-10 group">
               <div className="flex items-center gap-4 text-zinc-400">
                  <Layout size={20} />
                  <LuxuryTypography variant="label">Workspace_Actions</LuxuryTypography>
               </div>
               <div className="space-y-4">
                  {[
                    { icon: Sparkles, color: 'text-primary', label: 'Create Moodboard' },
                    { icon: ImageIcon, color: 'text-blue-400', label: 'Generate Campaign' },
                    { icon: Box, color: 'text-purple-400', label: 'Export 3D Mesh' },
                  ].map(action => (
                    <button key={action.label} className="w-full flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all group/btn">
                       <div className="flex items-center gap-6">
                          <action.icon className={`${action.color} transition-transform group-hover/btn:scale-110`} size={20} />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{action.label}</span>
                       </div>
                       <div className="w-2 h-2 rounded-full bg-zinc-800 group-hover/btn:bg-primary" />
                    </button>
                  ))}
               </div>
            </GlassCard>

            <div className="glass-dark border border-white/5 rounded-[48px] p-10 space-y-10">
               <LuxuryTypography variant="label">Historical_Inference</LuxuryTypography>
               <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden hover:border-primary/40 transition-all cursor-pointer">
                       <img src={`https://picsum.photos/seed/hist${i}/300/300`} className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-all" />
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
