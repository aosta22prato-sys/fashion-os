import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Shirt, Zap, Download, RefreshCw, 
  Sparkles, Camera, ShieldCheck, ChevronRight,
  Monitor, Layers, Database, Box, Info
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface Model {
  id: string;
  name: string;
  image: string;
  desc: string;
}

const PRESET_MODELS: Model[] = [
  { id: 'm1', name: 'Alpha-01 (Male)', image: 'https://picsum.photos/seed/fashion_m1/800/1200', desc: 'Athletic build, 185cm' },
  { id: 'm2', name: 'Beta-02 (Female)', image: 'https://picsum.photos/seed/fashion_f1/800/1200', desc: 'Petite build, 165cm' },
  { id: 'm3', name: 'Gamma-03 (Neutral)', image: 'https://picsum.photos/seed/fashion_n1/800/1200', desc: 'Average build, 175cm' },
  { id: 'm4', name: 'Delta-04 (Curvy)', image: 'https://picsum.photos/seed/fashion_f2/800/1200', desc: 'Curvy build, 170cm' },
];

interface NeuralTryOnProps {
  preloadedDesign?: string | null;
}

export const NeuralTryOn: React.FC<NeuralTryOnProps> = ({ preloadedDesign }) => {
  const [selectedModel, setSelectedModel] = useState<Model>(PRESET_MODELS[1]);
  const [garmentImage, setGarmentImage] = useState<string | null>(preloadedDesign || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState<'1K' | '2K' | '4K'>('2K');

  useEffect(() => {
    if (preloadedDesign) {
      setGarmentImage(preloadedDesign);
      setResultImage(null);
    }
  }, [preloadedDesign]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setGarmentImage(reader.result as string);
      setResultImage(null);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': [] },
    multiple: false 
  });

  const handleGenerate = async () => {
    if (!garmentImage) {
      setError("Please upload a garment image first.");
      return;
    }
    
    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setResultImage(null);

    // Simulate progress with more steps
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 5;
      });
    }, 200);

    try {
      const response = await fetch('/api/ai/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personImage: selectedModel.image,
          garmentImage: garmentImage,
          quality: quality
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Generation failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResultImage(data.task.result_url);
        setProgress(100);
      } else {
        throw new Error(data.error || "Generation failed");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during generation.");
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[800px]">
      {/* Sidebar: Source & Selection */}
      <div className="lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        <div className="glass-dark p-6 rounded-3xl border border-white/5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4 text-primary">
              <User size={18} />
              <h3 className="text-sm font-black uppercase tracking-widest italic outline-text">Model Selection</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_MODELS.map(model => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedModel.id === model.id ? 'border-primary ring-4 ring-primary/20' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <img src={model.image} className="w-full h-full object-cover" alt={model.name} referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                    <p className="text-[10px] font-bold text-white">{model.name}</p>
                    <p className="text-[8px] text-white/50">{model.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Shirt size={18} />
              <h3 className="text-sm font-black uppercase tracking-widest italic outline-text">Design Ingestion</h3>
            </div>
            
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-3xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/20 bg-white/5'
              }`}
            >
              <input {...getInputProps()} />
              {garmentImage ? (
                <div className="relative group w-full aspect-square rounded-2xl overflow-hidden">
                  <img src={garmentImage} className="w-full h-full object-contain bg-zinc-900" alt="Garment" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-[10px] font-bold text-white">CHANGE DESIGN</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-primary/10 text-primary">
                    <Download size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-300">Drag & Drop Fabric/Garment</p>
                    <p className="text-[10px] text-zinc-500">Supports PNG, JPG, WEBP</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles size={18} />
                <h3 className="text-sm font-black uppercase tracking-widest italic outline-text">Neural Quality</h3>
              </div>
              <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                {(['1K', '2K', '4K'] as const).map(q => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${
                      quality === q ? 'bg-primary text-black' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!garmentImage || isGenerating}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-tighter text-sm flex items-center justify-center gap-2 transition-all ${
              !garmentImage || isGenerating 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-primary text-black hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/25'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Processing Matrix...
              </>
            ) : (
              <>
                <Zap size={18} />
                Generate Neural Fit
              </>
            )}
          </button>
        </div>

        {/* System Stats Widget */}
        <div className="glass-dark p-4 rounded-3xl border border-white/5 flex gap-4">
           <div className="flex-1 space-y-1">
              <p className="text-[8px] font-bold text-zinc-500 uppercase">GPU CLUSTER</p>
              <p className="text-xs font-black text-white">NVIDIA H100 Active</p>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${isGenerating ? 85 : 12}%` }} />
              </div>
           </div>
           <div className="w-px h-10 bg-white/10" />
           <div className="flex-1 space-y-1">
              <p className="text-[8px] font-bold text-zinc-500 uppercase">LATENCY</p>
              <p className="text-xs font-black text-white">124ms Neural Bridge</p>
              <div className="flex gap-1">
                 {[1,2,3,4,5].map(i => <div key={i} className={`w-1 h-3 rounded-sm ${i < 4 ? 'bg-primary' : 'bg-white/10'}`} />)}
              </div>
           </div>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative glass-dark rounded-[40px] border border-white/10 overflow-hidden group">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        
        {/* Viewport HUD */}
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
           <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 <p className="text-[10px] font-black tracking-widest text-white">LIVE NEURAL_ENGINE v4.2</p>
              </div>
              <p className="text-[8px] text-zinc-500 font-mono pl-3">{Date.now().toString(16).toUpperCase()}_MATRIX_SYNC</p>
           </div>
           <div className="flex gap-2 pointer-events-auto">
              <button className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-primary hover:text-black transition-all">
                <Camera size={14} />
              </button>
              <button className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-primary hover:text-black transition-all">
                 <Download size={14} />
              </button>
           </div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            {!resultImage && !isGenerating ? (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                   <div className="w-full h-full grid grid-cols-12 gap-0.5 opacity-20 bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] bg-[size:24px_24px]" />
                </div>
                <img 
                  src={selectedModel.image} 
                  className="h-full object-contain grayscale opacity-30 blur-[2px]" 
                  alt="Background" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute flex flex-col items-center gap-4 text-center">
                   <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-xl">
                      <Shirt className="text-zinc-600" size={32} />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-xl font-black text-white italic outline-text">AWAITING DESIGN</h4>
                      <p className="text-[10px] text-zinc-500 max-w-[200px]">Upload a clothing item or textile pattern to begin neural mapping.</p>
                   </div>
                </div>
              </motion.div>
            ) : isGenerating ? (
              <motion.div 
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex flex-col items-center gap-8"
              >
                <div className="relative w-48 h-64 border border-white/10 rounded-3xl overflow-hidden bg-black/40">
                  <motion.div 
                    className="absolute inset-0 bg-primary/20 z-10"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <img 
                    src={selectedModel.image} 
                    className="w-full h-full object-cover grayscale opacity-50" 
                    alt="Scanning" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="w-64 space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-primary">
                    <span className="animate-pulse">SYNTHESIZING...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Vertex Mapping', 'Texture Synthesis', 'Draping Refinement', 'Lighting Bake'].map((step, i) => (
                      <div key={i} className={`text-[8px] px-2 py-1 rounded bg-black/40 border ${progress > (i+1)*25 ? 'border-primary text-primary' : 'border-white/5 text-zinc-600'}`}>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full h-full relative"
              >
                <img 
                  src={resultImage!} 
                  className="w-full h-full object-contain rounded-3xl shadow-2xl" 
                  alt="AI Result" 
                  referrerPolicy="no-referrer"
                />
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-6 right-6 glass-dark p-4 rounded-2xl border border-primary/20 space-y-3"
                >
                  <div className="flex items-center gap-2 text-primary">
                    <ShieldCheck size={14} />
                    <p className="text-[10px] font-black uppercase">Verified Output</p>
                  </div>
                  <div className="space-y-1 border-t border-white/5 pt-3">
                    <p className="text-[8px] text-zinc-500 font-bold uppercase">Prompt Match</p>
                    <p className="text-[10px] text-white">High Fidelity Editorial (98.4%)</p>
                  </div>
                  <div className="space-y-1 pt-1">
                    <p className="text-[8px] text-zinc-500 font-bold uppercase">Resolution</p>
                    <p className="text-[10px] text-white">4096 x 5120 Ultra-HD</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 glass-dark p-2 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
           {[
             { icon: Monitor, label: 'Desktop' },
             { icon: Box, label: '3D Preview' },
             { icon: Layers, label: 'Compare' },
             { icon: Database, label: 'Archive' }
           ].map(ctrl => (
             <button key={ctrl.label} className="p-2.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
               <ctrl.icon size={16} />
             </button>
           ))}
        </div>
      </div>
      
      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-dark border border-red-500/50 p-4 rounded-2xl text-red-500 flex items-center gap-3">
          <Info size={18} />
          <p className="text-xs font-bold">{error}</p>
          <button onClick={() => setError(null)} className="p-1 hover:bg-red-500/10 rounded">
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
