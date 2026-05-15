import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  Palette, 
  Wand2, 
  Box, 
  Maximize2, 
  Scissors, 
  History, 
  Sparkles,
  MousePointer2,
  Brush,
  Eraser,
  Type,
  Plus,
  ChevronRight,
  Zap,
  LayoutGrid
} from 'lucide-react';

export const DesignStudio: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState('LAYER_01');
  const [layers, setLayers] = useState([
    { id: 'LAYER_04', name: 'Overlay_Mesh', type: 'EMISSIVE' },
    { id: 'LAYER_03', name: 'Pattern_Graphene', type: 'TEXTURE' },
    { id: 'LAYER_02', name: 'Base_Structure', type: 'GEOMETRY' },
    { id: 'LAYER_01', name: 'Neural_Skeleton', type: 'SYSTEM' }
  ]);

  return (
    <div className="h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
      {/* Tool Sidebar - Extreme Left */}
      <div className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-6 bg-black/40 backdrop-blur-xl">
        {[
          { icon: MousePointer2, id: 'select' },
          { icon: Brush, id: 'brush' },
          { icon: Scissors, id: 'vector' },
          { icon: Box, id: 'extrude' },
          { icon: Palette, id: 'fill' },
          { icon: Type, id: 'text' },
          { icon: Eraser, id: 'erase' }
        ].map(tool => (
          <button 
            key={tool.id}
            className="p-3 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all text-zinc-500 hover:text-white group"
          >
            <tool.icon size={20} className="group-active:scale-90 transition-transform" />
          </button>
        ))}
        <div className="mt-auto flex flex-col gap-4">
           <button className="p-3 rounded-2xl bg-primary text-black shadow-lg shadow-primary/20">
              <Sparkles size={20} />
           </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative flex flex-col">
         {/* Top Workspace Header */}
         <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3">
                  <LayoutGrid size={16} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Garment_Canvas_v8</span>
               </div>
               <div className="h-4 w-px bg-white/10" />
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-500">PROJECT: NEURAL_TRENCH_2026</span>
                  <ChevronRight size={10} className="text-zinc-700" />
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-zinc-800 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Collaborator" />
                    </div>
                  ))}
               </div>
               <button className="bg-white text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                  Publish_Studio
               </button>
            </div>
         </header>

         {/* The Canvas */}
         <div className="flex-1 bg-dot-grid relative overflow-hidden flex items-center justify-center">
            <div className="relative w-[600px] aspect-[3/4] bg-[#111] rounded-[4rem] border border-white/10 shadow-3xl overflow-hidden group">
               {/* Segmentation Visualizer Overlay */}
               <div className="absolute inset-0 z-10 opacity-30 group-hover:opacity-60 transition-opacity">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                     <path d="M20,20 L80,20 L85,80 L15,80 Z" fill="none" stroke="#00ff41" strokeWidth="0.5" strokeDasharray="2 2" />
                     <circle cx="50" cy="50" r="30" fill="none" stroke="#00ff41" strokeWidth="0.2" />
                  </svg>
               </div>

               <img 
                 src="https://picsum.photos/seed/fashion/800/1200" 
                 className="w-full h-full object-cover filter contrast-125 grayscale brightness-50"
                 alt="Garment Preview"
               />

               {/* Viewport HUD */}
               <div className="absolute bottom-10 left-10 z-20">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-black italic tracking-widest text-primary uppercase">Segment_Detection_Live</span>
                     <span className="text-[18px] font-black uppercase text-white shadow-text">CYBER_ORGANZA_MESH</span>
                  </div>
               </div>
               
               <div className="absolute top-10 right-10 z-20">
                  <div className="p-3 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10">
                     <Maximize2 size={16} className="text-zinc-400" />
                  </div>
               </div>
            </div>

            {/* Float HUD Controls */}
            <div className="absolute top-10 left-10 flex flex-col gap-4">
                <div className="p-6 rounded-[2rem] bg-black/60 backdrop-blur-3xl border border-white/10 space-y-4 shadow-2xl">
                   <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest italic">Simulation_State</p>
                   <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-black">PHYSICS_ENGINE_ACTIVE</span>
                   </div>
                </div>
            </div>
         </div>
      </div>

      {/* Right Property Inspector / Layer Stack */}
      <div className="w-80 border-l border-white/5 bg-black/40 backdrop-blur-xl flex flex-col">
         {/* Layers Section */}
         <div className="p-8 flex-1 space-y-8 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Layers size={16} className="text-primary" />
                  <h3 className="text-xs font-black uppercase italic tracking-tighter">Layers</h3>
               </div>
               <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
                  <Plus size={14} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
               {layers.map(layer => (
                 <div 
                   key={layer.id}
                   onClick={() => setActiveLayer(layer.id)}
                   className={`p-4 rounded-2xl border transition-all cursor-pointer group relative ${
                     activeLayer === layer.id ? 'bg-white text-black border-white' : 'bg-white/5 border-transparent text-zinc-500 hover:text-white hover:bg-white/10'
                   }`}
                 >
                    <div className="flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className={`text-[8px] font-black uppercase tracking-widest ${activeLayer === layer.id ? 'text-black/40' : 'text-zinc-600'}`}>{layer.type}</span>
                          <span className="text-[11px] font-black">{layer.name}</span>
                       </div>
                       <Zap size={12} className={activeLayer === layer.id ? 'text-zinc-900' : 'text-primary opacity-0 group-hover:opacity-100 transition-all'} />
                    </div>
                 </div>
               ))}
            </div>

            {/* Prompt Engine Panel */}
            <div className="pt-8 border-t border-white/10 space-y-6">
               <div className="flex items-center gap-3">
                  <Wand2 size={16} className="text-primary" />
                  <h3 className="text-xs font-black uppercase italic tracking-tighter">Neural Engine</h3>
               </div>

               <div className="space-y-4">
                  <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5 space-y-2">
                     <p className="text-[8px] font-black text-zinc-500 uppercase">Current_Prompt_Vector</p>
                     <p className="text-[10px] font-mono leading-relaxed text-zinc-300">
                        "Hyper-realistic architectural silk with procedural graphene lattices..."
                     </p>
                  </div>
                  <button className="w-full py-4 bg-primary text-black rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-all italic">
                     Regenerate_Artifact
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
