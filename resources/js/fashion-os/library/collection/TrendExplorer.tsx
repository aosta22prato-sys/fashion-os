import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, ArrowUpRight, BarChart3, Clock } from 'lucide-react';
import { LuxuryTypography } from '../../design-system/LuxuryTypography';
import { GlassCard } from '../../design-system/GlassCard';

export const TrendExplorer: React.FC = () => {
  return (
    <div className="p-20 space-y-16">
      <div className="flex justify-between items-end">
         <div className="space-y-4">
            <LuxuryTypography variant="label">Insight_Matrix // TREND_0xAF4</LuxuryTypography>
            <LuxuryTypography variant="h1" className="text-7xl lowercase italic">Trend_Explorer</LuxuryTypography>
         </div>
         <div className="flex gap-4">
            <button className="px-6 py-3 bg-white/5 border border-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">Export Report</button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <GlassCard className="p-10 space-y-8 col-span-2">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3 text-primary">
                  <BarChart3 size={20} />
                  <LuxuryTypography variant="label" className="text-primary">Engagement_Velocity</LuxuryTypography>
               </div>
               <div className="flex gap-2">
                  <span className="px-2 py-1 bg-primary/20 text-primary text-[8px] font-black rounded-md">+42.8%</span>
               </div>
            </div>
            
            {/* Simple Trend Graph Placeholder */}
            <div className="h-[300px] flex items-end gap-2 px-4">
               {[40, 70, 45, 90, 65, 85, 100, 75, 60, 95].map((h, i) => (
                 <motion.div 
                   key={i}
                   initial={{ height: 0 }}
                   animate={{ height: `${h}%` }}
                   transition={{ delay: i * 0.1, duration: 1 }}
                   className="flex-1 bg-gradient-to-t from-primary/20 to-primary rounded-t-lg relative group"
                 >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[8px] font-black">
                       {h}%_SYNC
                    </div>
                 </motion.div>
               ))}
            </div>
         </GlassCard>

         <div className="space-y-8">
            <GlassCard className="p-10 space-y-6">
               <LuxuryTypography variant="label">Rising_Aesthetics</LuxuryTypography>
               <div className="space-y-4">
                  {['Cyber_Brutalist', 'Neo_Silk', 'Liquid_Metal', 'Graphene_Knit'].map(a => (
                    <div key={a} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                       <span className="text-[10px] font-black uppercase tracking-widest">{a}</span>
                       <ArrowUpRight size={14} className="text-primary" />
                    </div>
                  ))}
               </div>
            </GlassCard>

            <div className="bg-primary p-12 rounded-[56px] space-y-6">
               <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                  <Clock className="text-primary" size={24} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-black italic uppercase text-black leading-none">Real_Time_Inference</h3>
                  <p className="text-[9px] font-black uppercase tracking-widest text-black/60">Node: MILAN_SS26</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
