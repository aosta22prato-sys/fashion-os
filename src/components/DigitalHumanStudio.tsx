import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Shirt, Zap, Layers, Palette, 
  Camera, Sparkles, Download, RefreshCw,
  Box, MousePointer2, Wand2, Maximize2,
  Settings, Save, History, LayoutGrid
} from 'lucide-react';

interface Asset {
  id: string;
  type: 'TOP' | 'BOTTOM' | 'OUTER' | 'ACCESSORY';
  name: string;
  image: string;
  style: string;
}

interface HumanModel {
  id: string;
  name: string;
  image: string;
  pose: string;
}

const HUMAN_MODELS: HumanModel[] = [
  { id: 'h1', name: 'CYBER_EVE', image: 'https://picsum.photos/seed/h1/800/1200', pose: 'Editorial Stand' },
  { id: 'h2', name: 'NEO_ADAM', image: 'https://picsum.photos/seed/h2/800/1200', pose: 'Walking' },
  { id: 'h3', name: 'VOID_ZEN', image: 'https://picsum.photos/seed/h3/800/1200', pose: 'Sitting' },
];

const ASSETS: Asset[] = [
  { id: 'a1', type: 'TOP', name: 'Neural Mesh Tee', image: 'https://picsum.photos/seed/a1/400/400', style: 'Cyber' },
  { id: 'a2', type: 'TOP', name: 'Liquid Silk Blouse', image: 'https://picsum.photos/seed/a2/400/400', style: 'Luxury' },
  { id: 'a3', type: 'BOTTOM', name: 'Graphene Joggers', image: 'https://picsum.photos/seed/a3/400/400', style: 'Tech' },
  { id: 'a4', type: 'OUTER', name: 'Bio-Shell Parka', image: 'https://picsum.photos/seed/a4/400/400', style: 'Utility' },
  { id: 'a5', type: 'ACCESSORY', name: 'LED Visor', image: 'https://picsum.photos/seed/a5/400/400', style: 'Neon' },
  { id: 'a6', type: 'BOTTOM', name: 'Pleated Carbon Skirt', image: 'https://picsum.photos/seed/a6/400/400', style: 'Avant-garde' },
];

export const DigitalHumanStudio: React.FC = () => {
  const [selectedHuman, setSelectedHuman] = useState<HumanModel>(HUMAN_MODELS[0]);
  const [outfit, setOutfit] = useState<Record<string, Asset>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [stylePreset, setStylePreset] = useState('Editorial Studio');
  const [lighting, setLighting] = useState('Cinematic Rim');

  const toggleAsset = (asset: Asset) => {
    setOutfit(prev => {
      const next = { ...prev };
      if (next[asset.type]?.id === asset.id) {
        delete next[asset.type];
      } else {
        next[asset.type] = asset;
      }
      return next;
    });
    setResult(null);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const outfitDesc = Object.values(outfit).map(a => a.name).join(', ');
      const response = await fetch('/api/ai/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personImage: selectedHuman.image,
          prompt: `Styling Studio render: Digital Human ${selectedHuman.name} wearing ${outfitDesc}. Style: ${stylePreset}. Lighting: ${lighting}. 8K, Photorealistic, Unreal Engine 5 style.`,
          quality: '2K'
        })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.task.result_url);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[850px]">
      {/* Asset Closet - Left */}
      <div className="lg:w-1/4 flex flex-col gap-4 overflow-hidden">
        <div className="glass-dark p-6 rounded-3xl border border-white/5 flex-1 flex flex-col gap-6 overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary">
                <LayoutGrid size={16} />
                <h3 className="text-xs font-black uppercase tracking-widest italic outline-text">Neural Library</h3>
              </div>
            </div>
            
            <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {(['TOP', 'BOTTOM', 'OUTER', 'ACCESSORY'] as const).map(type => (
                <div key={type} className="space-y-3">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">{type}S</p>
                  <div className="grid grid-cols-2 gap-2">
                    {ASSETS.filter(a => a.type === type).map(asset => (
                      <button
                        key={asset.id}
                        onClick={() => toggleAsset(asset)}
                        className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                          outfit[type]?.id === asset.id ? 'border-primary shadow-lg shadow-primary/20' : 'border-white/5 hover:border-white/20'
                        }`}
                      >
                        <img src={asset.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={asset.name} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-[8px] font-bold text-white uppercase">{asset.name}</p>
                        </div>
                        {outfit[type]?.id === asset.id && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse shadow-glow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col gap-4">
         <div className="flex-1 relative glass-dark rounded-[40px] border border-white/10 overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white/[0.02] opacity-50 pointer-events-none" />
            
            {/* Viewport HUD */}
            <div className="absolute top-6 left-6 right-6 z-20 flex justify-between">
               <div className="space-y-1">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                     <Box size={14} className="text-primary animate-spin-slow" />
                     <p className="text-[10px] font-black text-white italic">STUDIO_ENVIRONMENT // 01</p>
                  </div>
                  <p className="text-[8px] text-zinc-500 font-mono pl-3">{selectedHuman.name}_{stylePreset.toUpperCase()}_SYNC</p>
               </div>
               <div className="flex gap-2">
                  <button className="p-2.5 rounded-full bg-black/60 border border-white/10 text-white hover:bg-primary hover:text-black transition-all">
                    <Maximize2 size={16} />
                  </button>
                  <button className="p-2.5 rounded-full bg-black/60 border border-white/10 text-white hover:bg-primary hover:text-black transition-all">
                    <Camera size={16} />
                  </button>
               </div>
            </div>

            {/* Avatar Display */}
            <div className="absolute inset-0 flex items-center justify-center">
               <AnimatePresence mode="wait">
                 {isGenerating ? (
                   <motion.div 
                     key="generating"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="flex flex-col items-center gap-6"
                   >
                     <div className="w-64 h-96 relative rounded-[3rem] border border-white/10 overflow-hidden bg-zinc-900/50">
                        <motion.div 
                          className="absolute inset-x-0 h-[2px] bg-primary z-20 shadow-[0_0_15px_#00ff41]"
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        />
                        <img src={selectedHuman.image} className="w-full h-full object-cover opacity-50 grayscale" alt="Baking" />
                     </div>
                     <div className="text-center space-y-2">
                        <p className="text-[10px] font-black text-primary animate-pulse">BAKING NEURAL MESHES...</p>
                        <div className="flex gap-1 justify-center">
                           {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />)}
                        </div>
                     </div>
                   </motion.div>
                 ) : result ? (
                   <motion.div 
                     key="result"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="w-full h-full p-12"
                   >
                     <img src={result} className="w-full h-full object-contain rounded-3xl shadow-2xl" alt="Render" />
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="base"
                     className="relative w-full h-full flex items-center justify-center p-12"
                   >
                     <img 
                       src={selectedHuman.image} 
                       className="h-full object-contain opacity-40 grayscale blur-[1px]" 
                       alt="Base Human" 
                     />
                     
                     {/* Overlay Slots */}
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="grid grid-cols-1 gap-4">
                           {Object.entries(outfit).map(([slot, asset]) => (
                             <motion.div 
                               initial={{ opacity: 0, x: -20 }}
                               animate={{ opacity: 1, x: 0 }}
                               key={slot}
                               className="glass-dark px-4 py-2 rounded-xl border border-primary/30 flex items-center gap-3"
                             >
                               <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                                 <img src={asset.image} className="w-full h-full object-cover" alt="" />
                               </div>
                               <div>
                                 <p className="text-[8px] font-bold text-zinc-500 uppercase">{slot}</p>
                                 <p className="text-[10px] font-black text-white">{asset.name}</p>
                               </div>
                             </motion.div>
                           ))}
                        </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6">
               <div className="flex gap-2 glass-dark p-2 rounded-2xl border border-white/10">
                  {HUMAN_MODELS.map(h => (
                    <button
                      key={h.id}
                      onClick={() => { setSelectedHuman(h); setResult(null); }}
                      className={`w-12 h-12 rounded-xl border-2 overflow-hidden transition-all ${
                        selectedHuman.id === h.id ? 'border-primary ring-4 ring-primary/20' : 'border-white/5 opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={h.image} className="w-full h-full object-cover" alt={h.name} />
                    </button>
                  ))}
                  <div className="w-px h-10 bg-white/10 mx-2 self-center" />
                  <button 
                    onClick={handleGenerate}
                    disabled={Object.keys(outfit).length === 0 || isGenerating}
                    className={`px-8 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${
                      Object.keys(outfit).length === 0 || isGenerating
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-primary text-black hover:scale-105 shadow-lg shadow-primary/30'
                    }`}
                  >
                    <Wand2 size={14} />
                    {isGenerating ? 'Rendering...' : 'Bake Final Image'}
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Control Panel - Right */}
      <div className="lg:w-64 space-y-4">
         <div className="glass-dark p-6 rounded-3xl border border-white/5 space-y-8">
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-primary">
                  <Palette size={16} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Environment</p>
               </div>
               <div className="space-y-4">
                  <div>
                    <label className="text-[8px] font-black text-zinc-500 uppercase mb-2 block">Atmosphere</label>
                    <div className="flex flex-wrap gap-2">
                       {['Cyberpunk', 'Minimalist', 'Editorial Studio', 'Neon Tokyo'].map(s => (
                         <button
                           key={s}
                           onClick={() => setStylePreset(s)}
                           className={`px-3 py-1.5 rounded-lg text-[9px] font-bold border transition-all ${
                             stylePreset === s ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 text-zinc-500 hover:text-white'
                           }`}
                         >
                           {s}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-zinc-500 uppercase mb-2 block">Lighting Rig</label>
                    <select 
                      value={lighting}
                      onChange={(e) => setLighting(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-primary"
                    >
                      <option>Cinematic Rim</option>
                      <option>Soft Day</option>
                      <option>High Contrast</option>
                      <option>Technicolor</option>
                    </select>
                  </div>
               </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
               <div className="flex items-center gap-2 text-primary">
                  <Settings size={16} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Post Processing</p>
               </div>
               <div className="space-y-4">
                  {[
                    { label: 'Neural Resolution', val: '4K Native' },
                    { label: 'Texture Upscale', val: '2.0x' },
                    { label: 'Ambient Depth', val: 'Enabled' }
                  ].map(s => (
                    <div key={s.label} className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5">
                      <span className="text-[8px] font-bold text-zinc-500">{s.label}</span>
                      <span className="text-[10px] font-black text-white">{s.val}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="flex gap-2">
               <button className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                  <Save size={14} />
                  <span className="text-[10px] font-bold uppercase">Save Look</span>
               </button>
               <button className="p-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all">
                  <Download size={14} />
               </button>
            </div>
         </div>

         {/* History Card */}
         <div className="glass-dark p-4 rounded-3xl border border-white/5">
            <div className="flex items-center gap-2 mb-3 text-zinc-500">
               <History size={12} />
               <p className="text-[10px] font-black uppercase tracking-widest">Recent Renders</p>
            </div>
            <div className="grid grid-cols-4 gap-1">
               {[1,2,3,4].map(i => (
                 <div key={i} className="aspect-square bg-white/5 rounded-lg border border-white/5 animate-pulse" />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
