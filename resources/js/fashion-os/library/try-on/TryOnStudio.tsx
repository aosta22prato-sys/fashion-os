import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Shirt, Camera, Zap, 
  Layers, Palette, Box, Activity,
  ChevronRight, Upload, Sparkles
} from 'lucide-react';
import { LuxuryTypography } from '../../design-system/LuxuryTypography';
import { DigitalHumanViewport } from './DigitalHumanViewport';
import { GlassCard } from '../../design-system/GlassCard';

export const TryOnStudio: React.FC = () => {
  const [activeAsset, setActiveAsset] = useState('TOP_01');
  const [selectedPart, setSelectedPart] = useState<{name: string, material: string, polyCount: string} | null>(null);

  return (
    <div className="p-12 lg:p-24 space-y-20">
      <header className="flex justify-between items-end">
        <div className="space-y-6">
           <LuxuryTypography variant="label">Try_On_Subsystem // NODE_T1</LuxuryTypography>
           <LuxuryTypography variant="h1" className="text-9xl lowercase italic font-normal tracking-[-0.04em]">Neural_Avatar</LuxuryTypography>
        </div>
        <div className="flex gap-6">
           <button className="flex items-center gap-4 px-10 py-5 glass-dark border border-white/10 rounded-full font-black text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
              <Upload size={16} />
              Upload Garment
           </button>
           <button className="flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-glow">
              <Camera size={16} />
              Capture Simulation
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Controls Sidebar */}
         <div className="lg:col-span-3 space-y-8">
            <GlassCard className="p-10 space-y-10">
               <div className="flex items-center gap-4 text-primary">
                  <Shirt size={20} />
                  <LuxuryTypography variant="label" className="text-primary italic">Garment_Selector</LuxuryTypography>
               </div>
               <div className="space-y-4">
                  {[
                    { id: 'TOP_01', label: 'NEURAL_SHELL', type: 'OUTERWEAR' },
                    { id: 'BOT_01', label: 'CARBON_DRAPE', type: 'BOTTOMS' },
                    { id: 'ACC_01', label: 'CYBER_HEART', type: 'ACCESSORY' }
                  ].map(asset => (
                    <button 
                      key={asset.id}
                      onClick={() => setActiveAsset(asset.id)}
                      className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all group ${
                        activeAsset === asset.id ? 'bg-white border-white' : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${activeAsset === asset.id ? 'text-black' : 'text-white'}`}>{asset.label}</span>
                        <span className={`text-[7px] font-bold uppercase tracking-[0.2em] ${activeAsset === asset.id ? 'text-zinc-600' : 'text-zinc-600'}`}>{asset.type}</span>
                      </div>
                      <ChevronRight size={14} className={activeAsset === asset.id ? 'text-black' : 'text-zinc-700'} />
                    </button>
                  ))}
               </div>
            </GlassCard>

            {selectedPart && (
               <GlassCard className="p-10 space-y-4">
                  <LuxuryTypography variant="label">Selected_Part</LuxuryTypography>
                  <LuxuryTypography variant="h2" className="text-xl">{selectedPart.name}</LuxuryTypography>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Material: {selectedPart.material}</div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">PolyCount: {selectedPart.polyCount}</div>
               </GlassCard>
            )}

            <div className="glass-dark border border-white/5 rounded-[48px] p-10 space-y-10">
               <div className="flex items-center gap-4 text-zinc-500">
                  <Palette size={20} />
                  <LuxuryTypography variant="label">Styling_Engine</LuxuryTypography>
               </div>
               <div className="space-y-8">
                  <div className="space-y-4">
                     <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Texture_Bake</span>
                     <div className="flex gap-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 p-1">
                             <div className="w-full h-full rounded-lg bg-gradient-to-br from-zinc-700 to-black" />
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Pose_Library</span>
                     <div className="grid grid-cols-2 gap-4">
                        {['Default', 'Runway', 'Editorial', 'Static'].map(p => (
                          <button key={p} className="px-4 py-3 rounded-2xl border border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all text-left">
                             {p}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* 3D Viewport */}
         <div className="lg:col-span-9">
            <DigitalHumanViewport onPartSelect={setSelectedPart} />
         </div>
      </div>
    </div>
  );
};
