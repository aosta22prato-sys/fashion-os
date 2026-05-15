import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Shirt, Zap, Layers, Palette, 
  Camera, Sparkles, Download, RefreshCw,
  Box, MousePointer2, Wand2, Maximize2,
  Settings, Save, History, LayoutGrid, Database,
  XCircle, Info
} from 'lucide-react';

interface Asset {
  id: string;
  type: 'TOP' | 'BOTTOM' | 'OUTER' | 'ACCESSORY';
  name: string;
  image: string;
  style: string;
  sku: string;
  material: string;
  weight: string;
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
  { id: 'a1', type: 'TOP', name: 'Neural Mesh Tee', image: 'https://picsum.photos/seed/a1/400/400', style: 'Cyber', sku: 'SKU-NMT-01', material: 'Neural Graphene', weight: '120g' },
  { id: 'a2', type: 'TOP', name: 'Liquid Silk Blouse', image: 'https://picsum.photos/seed/a2/400/400', style: 'Luxury', sku: 'SKU-LSB-05', material: 'Bio-Silk', weight: '95g' },
  { id: 'a3', type: 'BOTTOM', name: 'Graphene Joggers', image: 'https://picsum.photos/seed/a3/400/400', style: 'Tech', sku: 'SKU-GRJ-12', material: 'Nano-Stretch', weight: '340g' },
  { id: 'a4', type: 'OUTER', name: 'Bio-Shell Parka', image: 'https://picsum.photos/seed/a4/400/400', style: 'Utility', sku: 'SKU-BSP-09', material: 'Recycled Polymer', weight: '880g' },
  { id: 'a5', type: 'ACCESSORY', name: 'LED Visor', image: 'https://picsum.photos/seed/a5/400/400', style: 'Neon', sku: 'SKU-LEV-02', material: 'Polycarbonate', weight: '45g' },
  { id: 'a6', type: 'BOTTOM', name: 'Pleated Carbon Skirt', image: 'https://picsum.photos/seed/a6/400/400', style: 'Avant-garde', sku: 'SKU-PCS-14', material: 'Carbon Bio-Fibre', weight: '210g' },
  { id: 'a7', type: 'BOTTOM', name: 'Void Trousers', image: 'https://picsum.photos/seed/a7/400/400', style: 'Minimal', sku: 'SKU-VTR-22', material: 'Dark Matter Weave', weight: '290g' },
  { id: 'a8', type: 'OUTER', name: 'Reflective Trench', image: 'https://picsum.photos/seed/a8/400/400', style: 'Visibility', sku: 'SKU-RTR-03', material: 'Lidar-Reactive Fabric', weight: '920g' },
];

export const DigitalHumanStudio: React.FC = () => {
  const [selectedHuman, setSelectedHuman] = useState<HumanModel>(HUMAN_MODELS[0]);
  const [outfit, setOutfit] = useState<Record<string, Asset>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBakingWalk, setIsBakingWalk] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [stylePreset, setStylePreset] = useState('Editorial Studio');
  const [visualTheme, setVisualTheme] = useState<'WHITE' | 'BLACK'>('BLACK');
  const [lighting, setLighting] = useState('Cinematic Rim');
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [selectedGarment, setSelectedGarment] = useState<Asset | null>(null);

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

  const handleWalkCycle = () => {
    setIsBakingWalk(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsBakingWalk(false), 500);
          return 100;
        }
        return p + 2;
      });
    }, 50);
  };

  const handleSubmitToERP = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmitting(false);
    alert("SKU Configuration & Fabric Usage Synced to PLM/ERP System.");
  };

  const themeClasses = visualTheme === 'BLACK' 
    ? 'bg-[#0a0a0a] text-white' 
    : 'bg-[#f4f4f4] text-black';

  return (
    <div className={`flex flex-col lg:flex-row gap-6 h-[850px] p-6 transition-colors duration-700 ${themeClasses} rounded-[40px] overflow-hidden border border-white/5`}>
      {/* Asset Closet - Left */}
      <div className="lg:w-1/4 flex flex-col gap-4 overflow-hidden">
        <div className={`p-6 rounded-3xl border flex-1 flex flex-col gap-6 overflow-hidden ${visualTheme === 'BLACK' ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <LayoutGrid size={16} />
              <h3 className="text-xs font-black uppercase tracking-widest italic">Neural Library</h3>
            </div>
            <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
              <button 
                onClick={() => setVisualTheme('WHITE')} 
                className={`w-4 h-4 rounded-full border border-white/10 ${visualTheme === 'WHITE' ? 'bg-white' : 'bg-white/20'}`}
              />
              <button 
                onClick={() => setVisualTheme('BLACK')} 
                className={`w-4 h-4 rounded-full border border-white/10 ${visualTheme === 'BLACK' ? 'bg-white' : 'bg-white/20 opacity-30'}`}
              />
            </div>
          </div>

          <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {(['TOP', 'BOTTOM', 'OUTER', 'ACCESSORY'] as const).map(type => (
              <div key={type} className="space-y-3">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">{type}S</p>
                <div className="grid grid-cols-2 gap-2">
                  {ASSETS.filter(a => a.type === type).map(asset => (
                    <div key={asset.id} className="relative group">
                      <button
                        onClick={() => toggleAsset(asset)}
                        className={`w-full relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                          outfit[type]?.id === asset.id ? 'border-primary' : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        <img src={asset.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={asset.name} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                          <p className="text-[8px] font-black text-white uppercase tracking-tighter">{asset.name}</p>
                        </div>
                        {outfit[type]?.id === asset.id && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow-glow" />
                        )}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedGarment(asset); }}
                        className="absolute -bottom-1 -right-1 bg-zinc-900 border border-white/20 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-black text-white z-10"
                      >
                        <Info size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col gap-4">
         <div className={`flex-1 relative rounded-[40px] border overflow-hidden group ${visualTheme === 'BLACK' ? 'bg-[#111] border-white/10' : 'bg-white border-black/5'}`}>
            <div className={`absolute inset-0 opacity-5 pointer-events-none ${visualTheme === 'BLACK' ? 'bg-grid-white/[1]' : 'bg-grid-black/[1]'}`} />
            
            {/* Viewport HUD */}
            <div className="absolute top-6 left-6 right-6 z-20 flex justify-between">
               <div className="space-y-1">
                  <div className={`flex items-center gap-2 backdrop-blur-md px-3 py-1.5 rounded-full border ${visualTheme === 'BLACK' ? 'bg-black/60 border-white/10' : 'bg-white/60 border-black/10'}`}>
                     <Box size={14} className="text-primary animate-spin-slow" />
                     <p className={`text-[10px] font-black italic ${visualTheme === 'BLACK' ? 'text-white' : 'text-black'}`}>STUDIO_ENVIRONMENT // 01</p>
                  </div>
                  <p className="text-[8px] text-zinc-500 font-mono pl-3">{selectedHuman.name}_{stylePreset.toUpperCase()}_SYNC</p>
               </div>
               <div className="flex gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[8px] font-black uppercase ${visualTheme === 'BLACK' ? 'bg-black/60 border-white/10 text-zinc-400' : 'bg-white/60 border-black/10 text-zinc-600'}`}>
                    <Database size={10} className="text-primary" />
                    ERP: Connected
                  </div>
               </div>
            </div>

            {/* Avatar Display */}
            <div className="absolute inset-0 flex items-center justify-center">
               <AnimatePresence mode="wait">
                 {isBakingWalk ? (
                   <motion.div key="walk" className="flex flex-col items-center gap-8">
                      <div className="w-80 h-96 relative border-2 border-primary/20 rounded-[3rem] overflow-hidden bg-black/40">
                         <div className="absolute inset-0 flex items-center justify-center">
                            <RefreshCw className="text-primary/20 animate-spin" size={120} />
                         </div>
                         <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-primary animate-pulse">SYNTHESIZING GAIT...</div>
                      </div>
                      <div className="w-64 space-y-2">
                        <div className="flex justify-between text-[8px] font-black text-primary">
                          <span>BONE_MESH_CALCULATION</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                   </motion.div>
                 ) : isGenerating ? (
                   <motion.div 
                     key="generating"
                     className="flex flex-col items-center gap-6"
                   >
                     <div className="w-64 h-96 relative rounded-[3rem] border border-white/10 overflow-hidden bg-zinc-900/50 shadow-2xl">
                        <motion.div 
                          className="absolute inset-x-0 h-[2px] bg-primary z-20 shadow-[0_0_15px_#00ff41]"
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        />
                        <img src={selectedHuman.image} className="w-full h-full object-cover opacity-50 grayscale" alt="Baking" />
                     </div>
                     <p className="text-[10px] font-black text-primary animate-pulse tracking-[0.3em]">NEURAL_MAP_IN_PROGRESS</p>
                   </motion.div>
                 ) : result ? (
                   <motion.div key="result" className="w-full h-full p-12">
                     <img 
                       src={result} 
                       className="w-full h-full object-contain rounded-3xl" 
                       style={{ transform: `rotateY(${rotation}deg)` }}
                       alt="Render" 
                     />
                   </motion.div>
                 ) : (
                   <motion.div key="base" className="relative w-full h-full flex items-center justify-center p-12">
                     <img 
                       src={selectedHuman.image} 
                       className={`h-full object-contain transition-transform duration-500 ${visualTheme === 'BLACK' ? 'opacity-40 grayscale blur-[1px]' : 'opacity-80 grayscale-0'}`} 
                       style={{ transform: `rotateY(${rotation}deg)` }}
                       alt="Base" 
                     />
                     <div className="absolute inset-x-0 bottom-20 flex justify-center gap-4">
                        {Object.entries(outfit).map(([slot, asset]) => (
                          <div key={slot} className={`px-4 py-2 rounded-xl border flex items-center gap-3 backdrop-blur-xl ${visualTheme === 'BLACK' ? 'bg-black/60 border-primary/30' : 'bg-white/80 border-primary/60'}`}>
                             <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                               <img src={asset.image} className="w-full h-full object-cover" alt="" />
                             </div>
                             <div>
                               <p className="text-[8px] font-bold text-zinc-500 uppercase">{slot}</p>
                               <p className={`text-[10px] font-black ${visualTheme === 'BLACK' ? 'text-white' : 'text-black'}`}>{asset.name}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Viewport Rotation Control */}
            <div className="absolute bottom-32 left-10 w-48 space-y-2 z-30">
               <div className="flex justify-between items-center">
                  <p className="text-[8px] font-black text-zinc-500 uppercase">Rotation Axis</p>
                  <button 
                    onClick={() => setRotation(0)}
                    className="text-[8px] font-black text-primary uppercase hover:underline"
                  >
                    Reset
                  </button>
               </div>
               <input 
                 type="range" 
                 min="-180" 
                 max="180" 
                 value={rotation} 
                 onChange={(e) => setRotation(parseInt(e.target.value))}
                 className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
               />
               <p className="text-[8px] font-mono text-zinc-600 text-right">{rotation}°</p>
            </div>

            {/* Bottom Actions Cluster */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
               <div className={`p-2 rounded-2xl border flex gap-2 backdrop-blur-2xl ${visualTheme === 'BLACK' ? 'bg-black/60 border-white/5' : 'bg-white/80 border-black/5'}`}>
                  {HUMAN_MODELS.map(h => (
                    <button
                      key={h.id}
                      onClick={() => { setSelectedHuman(h); setResult(null); }}
                      className={`w-12 h-12 rounded-xl border-2 overflow-hidden transition-all ${
                        selectedHuman.id === h.id ? 'border-primary ring-4 ring-primary/20' : 'border-white/5 opacity-50'
                      }`}
                    >
                      <img src={h.image} className="w-full h-full object-cover" alt={h.name} />
                    </button>
                  ))}
                  <div className="w-px h-10 bg-white/10 mx-2 self-center" />
                  <button 
                    onClick={handleGenerate}
                    className="px-8 bg-primary text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                  >
                    Generate High-Distortion Wrap
                  </button>
                  <button 
                    onClick={handleWalkCycle}
                    className={`px-8 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${visualTheme === 'BLACK' ? 'border-white/10 text-white hover:bg-white/5' : 'border-black/10 text-black hover:bg-black/5'}`}
                  >
                    Preview Walk Cycle
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Control Panel - Right */}
      <div className="lg:w-64 space-y-4">
         <div className={`p-6 rounded-3xl border space-y-8 flex-1 ${visualTheme === 'BLACK' ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-primary">
                  <Palette size={16} />
                  <p className="text-[10px] font-black uppercase tracking-widest italic">Atmosphere</p>
               </div>
               <div className="grid grid-cols-2 gap-2">
                 {['Tokyo_Neon', 'Milan_Soft', 'Brutalist_Grey', 'Minimal_Zen'].map(s => (
                   <button
                     key={s}
                     onClick={() => setStylePreset(s)}
                     className={`px-3 py-2 rounded-xl text-[8px] font-black uppercase border transition-all ${
                       stylePreset === s ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 text-zinc-500'
                     }`}
                   >
                     {s}
                   </button>
                 ))}
               </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Settings size={14} />
                  <p className="text-[8px] font-black uppercase tracking-widest">PLM Config</p>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-zinc-500">Fabric Estimation</span>
                      <span>1.42m²</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-zinc-500">Node Latency</span>
                      <span className="text-primary">12ms</span>
                   </div>
                </div>
                <button 
                  onClick={handleSubmitToERP}
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${visualTheme === 'BLACK' ? 'bg-white text-black' : 'bg-black text-white'}`}
                >
                  {isSubmitting ? <RefreshCw className="animate-spin" size={12} /> : <Zap size={12} />}
                  Submit to Production
                </button>
            </div>
         </div>
      </div>

      {/* Garment Details Modal */}
      <AnimatePresence>
        {selectedGarment && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedGarment(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-2xl rounded-[40px] overflow-hidden border ${visualTheme === 'BLACK' ? 'bg-[#111] border-white/10' : 'bg-white border-black/10'}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/2 aspect-square bg-zinc-900">
                  <img src={selectedGarment.image} className="w-full h-full object-cover" alt={selectedGarment.name} />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">{selectedGarment.type}</p>
                        <h2 className="text-2xl font-black italic uppercase leading-none">{selectedGarment.name}</h2>
                      </div>
                      <button 
                        onClick={() => setSelectedGarment(null)}
                        className="p-2 hover:bg-white/5 rounded-full transition-all"
                      >
                        <XCircle size={20} className="text-zinc-500" />
                      </button>
                    </div>

                    <div className="space-y-4 mb-8">
                       {[
                         { label: 'SKU_REFERENCE', val: selectedGarment.sku },
                         { label: 'MATERIAL_COMP', val: selectedGarment.material },
                         { label: 'UNIT_WEIGHT', val: selectedGarment.weight },
                         { label: 'STYLE_CAT', val: selectedGarment.style },
                         { label: 'PLM_STATUS', val: 'Verified_Production' }
                       ].map(row => (
                         <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/5">
                           <span className="text-[8px] font-bold text-zinc-500 uppercase">{row.label}</span>
                           <span className="text-[10px] font-black tabular-nums">{row.val}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => { toggleAsset(selectedGarment); setSelectedGarment(null); }}
                      className="flex-1 py-4 bg-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all"
                    >
                      Apply to Model
                    </button>
                    <button 
                      onClick={() => { handleSubmitToERP(); setSelectedGarment(null); }}
                      className={`px-6 rounded-2xl border transition-all hover:bg-white/5 ${visualTheme === 'BLACK' ? 'border-white/10' : 'border-black/10'}`}
                    >
                      <Database size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
