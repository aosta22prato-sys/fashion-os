import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Palette, Layers, Zap, Info, 
  Settings, Save, RefreshCw, Box,
  Wind, Droplets, Sun, Archive
} from 'lucide-react';

interface Material {
  id: string;
  name: string;
  type: string;
  weight: string;
  transparency: number;
  elasticity: number;
  gloss: number;
  color: string;
}

export const MaterialEditor: React.FC = () => {
  const [material, setMaterial] = useState<Material>({
    id: 'MAT_01',
    name: 'Neural_Knit_v2',
    type: 'Synthetic_Blend',
    weight: '180gsm',
    transparency: 15,
    elasticity: 45,
    gloss: 10,
    color: '#1a1a1a'
  });

  const controls = [
    { label: 'Transparency', key: 'transparency' as const, icon: Sun },
    { label: 'Elasticity', key: 'elasticity' as const, icon: Wind },
    { label: 'Gloss Factor', key: 'gloss' as const, icon: Droplets },
  ];

  return (
    <div className="w-full h-full space-y-12">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter outline-text italic">Material_Editor</h2>
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest italic">Molecular_Property_Tuning // NODE_M1</p>
         </div>
         <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 glass-dark border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-all">
               <Archive size={14} />
               Library
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-glow">
               <Save size={14} />
               Save Profile
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Material Preview Card */}
         <div className="lg:col-span-2 glass-dark rounded-[64px] border border-white/5 p-12 overflow-hidden relative group h-full flex items-center justify-center min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
               <div className="aspect-square bg-zinc-900 border border-white/5 rounded-[48px] flex items-center justify-center relative overflow-hidden group-hover:border-primary/20 transition-all duration-700">
                  <div 
                    className="w-48 h-48 rounded-full blur-3xl opacity-30 animate-pulse"
                    style={{ backgroundColor: material.color }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center animate-spin-slow">
                        <Box size={40} className="text-primary opacity-50" />
                     </div>
                  </div>
                  <div className="absolute bottom-10 left-10 text-[8px] font-black text-zinc-600 uppercase tracking-widest italic font-mono">
                     Real_Time_PhysX_Simulation
                  </div>
               </div>

               <div className="space-y-10">
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-primary uppercase italic underline underline-offset-4 tracking-[0.2em]">Material_Manifest</p>
                     <h3 className="text-4xl font-black italic uppercase tracking-tighter italic">{material.name}</h3>
                     <div className="flex gap-4">
                        <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[8px] font-black uppercase tracking-widest text-zinc-500">{material.type}</span>
                        <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[8px] font-black uppercase tracking-widest text-zinc-500">{material.weight}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                     {controls.map(ctrl => (
                       <div key={ctrl.key} className="space-y-3">
                          <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                             <span className="text-zinc-600 flex items-center gap-2 uppercase italic"><ctrl.icon size={10} /> {ctrl.label}</span>
                             <span className="text-white tabular-nums">{material[ctrl.key]}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${material[ctrl.key]}%` }}
                               className="h-full bg-primary"
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Property Tuning Panel */}
         <div className="glass-dark rounded-[64px] border border-white/5 p-10 space-y-10 h-full">
            <div className="flex items-center gap-3">
               <Settings size={18} className="text-primary" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] font-mono italic">Parameter_Tuning</h4>
            </div>

            <div className="space-y-8">
               {controls.map(ctrl => (
                 <div key={ctrl.key} className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-zinc-500 italic">{ctrl.label}</span>
                       <span className="text-primary tabular-nums italic">{material[ctrl.key]}</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={material[ctrl.key]}
                      onChange={(e) => setMaterial(prev => ({ ...prev, [ctrl.key]: parseInt(e.target.value) }))}
                      className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                    />
                 </div>
               ))}

               <div className="space-y-4 pt-6 border-t border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Color_Registry</p>
                  <div className="flex gap-4">
                     {['#1a1a1a', '#00b8d9', '#ffffff', '#e2e2e2', '#333333'].map(c => (
                       <button 
                         key={c}
                         onClick={() => setMaterial(prev => ({ ...prev, color: c }))}
                         className={`w-10 h-10 rounded-xl border transition-all ${material.color === c ? 'border-primary ring-4 ring-primary/20 scale-110' : 'border-white/5 opacity-50 hover:opacity-100'}`}
                         style={{ backgroundColor: c }}
                       />
                     ))}
                  </div>
               </div>
            </div>

            <div className="pt-8 space-y-4">
               <button className="w-full py-4 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  <RefreshCw size={12} />
                  Reset Defaults
               </button>
               <button className="w-full py-4 bg-zinc-900 border border-white/5 rounded-3xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-zinc-800 transition-all shadow-glow">
                  Initialize Neural Bake
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
