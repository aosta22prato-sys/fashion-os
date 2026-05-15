import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Wand2, Maximize2, MoreHorizontal, Layers, Palette, Cpu, Zap } from 'lucide-react';
import { LuxuryTypography } from '../../design-system/LuxuryTypography';
import { GlassCard } from '../../design-system/GlassCard';

export const PromptComposer: React.FC = () => {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <LuxuryTypography variant="label">Neural_Prompt_Engine</LuxuryTypography>
           <div className="flex gap-4">
              {['Vivid', 'Cinematic', 'Brutalist'].map(preset => (
                <button key={preset} className="px-4 py-1.5 rounded-full border border-white/5 bg-white/5 text-[8px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
                   {preset}
                </button>
              ))}
           </div>
        </div>
        <div className="relative group">
           <textarea 
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
             placeholder="Describe the aesthetic evolution... e.g., 'Liquid metal silk draping over architectural black structure, SS26 cyberpunk noir'"
             className="w-full h-48 bg-white/[0.02] border border-white/5 rounded-[32px] p-8 text-xl font-medium tracking-tight placeholder:text-zinc-700 outline-none focus:border-primary/40 transition-all resize-none italic"
           />
           <div className="absolute bottom-6 right-6 flex gap-4">
              <button className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-glow">
                 <Wand2 size={16} />
                 Generate Variants
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
         <GlassCard className="p-10 space-y-8">
            <div className="flex items-center gap-4 text-primary">
               <Layers size={20} />
               <LuxuryTypography variant="label" className="text-primary italic">Material_Overrides</LuxuryTypography>
            </div>
            <div className="flex flex-wrap gap-4">
               {['Neural_Knit', 'Bio_Latex', 'Void_Silk', 'Liquid_Alloy'].map(mat => (
                 <button key={mat} className="px-6 py-3 rounded-2xl bg-black border border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:border-primary/40 hover:text-white transition-all">
                    {mat}
                 </button>
               ))}
               <button className="p-3 rounded-2xl border border-white/5 text-zinc-600">
                  <Maximize2 size={14} />
               </button>
            </div>
         </GlassCard>

         <GlassCard className="p-10 space-y-8">
            <div className="flex items-center gap-4 text-blue-400">
               <Cpu size={20} />
               <LuxuryTypography variant="label" className="text-blue-400 italic">Inference_Parameters</LuxuryTypography>
            </div>
            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Guidance_Scale</span>
                  <span className="text-lg font-black italic">8.5</span>
               </div>
               <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-blue-400" />
               </div>
            </div>
         </GlassCard>
      </div>
    </div>
  );
};
