import React from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Wand2, Maximize2, Share2, Layers } from 'lucide-react';
import { LuxuryTypography } from '../../design-system/LuxuryTypography';
import { GlassCard } from '../../design-system/GlassCard';

export const CampaignGenerator: React.FC = () => {
  return (
    <div className="p-20 space-y-20">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
           <LuxuryTypography variant="label">Media_Foundry // CAMPAIGN_0x02</LuxuryTypography>
           <LuxuryTypography variant="h1" className="text-7xl lowercase italic">Campaign_Generator</LuxuryTypography>
        </div>
        <button className="flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-glow">
           <Wand2 size={16} />
           Generate Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
         {/* Sidebar Controls */}
         <div className="space-y-8">
            <GlassCard className="p-10 space-y-10">
               <LuxuryTypography variant="label">Composition_Flow</LuxuryTypography>
               <div className="space-y-4">
                  {['Editorial', 'Streetwear Noir', 'High-Fashion Void', 'Cyber Brutalist'].map(style => (
                    <button key={style} className="w-full p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-left hover:border-primary/40 transition-all group">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white">{style}</span>
                    </button>
                  ))}
               </div>
            </GlassCard>

            <div className="p-10 glass-dark border border-white/5 rounded-[48px] space-y-8">
               <LuxuryTypography variant="label">Output_Specs</LuxuryTypography>
               <div className="grid grid-cols-2 gap-4">
                  {['4K_RAW', '16:9', 'ProRes', 'Social'].map(spec => (
                    <div key={spec} className="px-4 py-3 bg-zinc-900 border border-white/5 rounded-2xl text-[8px] font-black uppercase text-zinc-600 text-center">{spec}</div>
                  ))}
               </div>
            </div>
         </div>

         {/* Main Preview */}
         <div className="lg:col-span-3 space-y-12">
            <div className="aspect-video glass-dark border border-white/5 rounded-[64px] relative overflow-hidden group">
               <img src="https://images.unsplash.com/photo-1549439602-43ebcb232811?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
               
               <div className="absolute top-12 left-12 flex gap-4">
                 <div className="px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">Simulation_Live</span>
                 </div>
               </div>

               <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                  <div className="space-y-4">
                     <LuxuryTypography variant="h2" className="text-4xl italic">SS26_Void_Campaign</LuxuryTypography>
                     <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Node_ID: 0x8892 // RENDER_TIME: 14.2s</p>
                  </div>
                  <div className="flex gap-4">
                     <button className="p-5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white hover:text-black transition-all"><Maximize2 size={24} /></button>
                     <button className="p-5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white hover:text-black transition-all"><Share2 size={24} /></button>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
               {[1, 2, 3].map(i => (
                 <div key={i} className="aspect-square glass-dark border border-white/5 rounded-[32px] overflow-hidden opacity-40 hover:opacity-100 transition-all cursor-pointer">
                    <img src={`https://picsum.photos/seed/camp${i}/400/400`} className="w-full h-full object-cover grayscale" />
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
