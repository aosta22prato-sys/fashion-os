import * as THREE from 'three';
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stage, 
  Bounds, 
  Float, 
  MeshDistortMaterial, 
  PerspectiveCamera,
  Environment,
  PresentationControls,
  ContactShadows,
  useGLTF,
  Html,
  Text,
  useProgress,
  useTexture
} from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Loader2, XCircle, Info, Zap, ShieldCheck, Box, RefreshCw, 
  Save, Trash2, History, Maximize2, Minimize2, RotateCw, 
  Columns, Camera, Play, Pause, Layers, Shirt, Sparkles, CheckCircle2, AlertCircle, Download
} from 'lucide-react';

interface ModelProps {
  url?: string;
  onExportDesign?: (image: string, metadata: any) => void;
}

interface SavedConfig {
  id: string;
  name: string;
  variantIndex: number;
  overrides: Record<string, any>;
  timestamp: number;
}

const PlaceholderModel = () => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh>
        <octahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color="#00b8d9"
          speed={3}
          distort={0.4}
          radius={1}
        />
      </mesh>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.2}
        color="white"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf"
      >
        NEURAL_RENDER_PRIMITIVE
      </Text>
    </Float>
  );
};

const MATERIAL_PRESETS = {
  BIO_PLASTIC: { name: 'Bio-Plastic', color: '#f0f0f0', metalness: 0.0, roughness: 0.9, opacity: 1, transparent: false, emissive: '#000000' },
  LIQUID_CHROME: { name: 'Liquid Chrome', color: '#ffffff', metalness: 1.0, roughness: 0.05, opacity: 1, transparent: false, emissive: '#111111' },
  VOXEL_GLASS: { name: 'Voxel Glass', color: '#00b8d9', metalness: 0.5, roughness: 0.1, opacity: 0.4, transparent: true, emissive: '#00b8d9' },
  FURNACE_COIL: { name: 'Furnace Coil', color: '#ff4400', metalness: 0.8, roughness: 0.4, opacity: 1, transparent: false, emissive: '#ff4400' }
};

const Model = ({ 
  url, 
  onSelect, 
  selectedPart, 
  onError, 
  variant,
  overrides,
  explodedAmount = 0,
  activePattern = null
}: { 
  url: string, 
  onSelect: (name: string, data: any) => void, 
  selectedPart: string | null, 
  onError: (err: any) => void, 
  variant: any,
  overrides: Record<string, any>,
  explodedAmount?: number,
  activePattern?: string | null
}) => {
  try {
    const { scene } = useGLTF(url);
    const texture = activePattern ? useTexture(activePattern) : null;

    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
    }
    
    useEffect(() => {
      scene.traverse((child) => {
        if ((child as any).isMesh) {
          const mesh = child as THREE.Mesh;
          const material = mesh.material as THREE.MeshStandardMaterial;

          if (material) {
            // Apply specific pattern if active
            if (activePattern && texture) {
              material.map = texture;
              material.needsUpdate = true;
            } else {
              material.map = null;
            }

            const partOverride = overrides[child.uuid];

            if (partOverride) {
              // Apply specific part override
              material.color.set(partOverride.color);
              material.metalness = partOverride.metalness;
              material.roughness = partOverride.roughness;
              material.opacity = partOverride.opacity;
              material.transparent = partOverride.transparent;
              if (material.emissive) {
                material.emissive.set(partOverride.emissive);
                material.emissiveIntensity = partOverride.emissive !== '#000000' ? 0.5 : 0;
              }
            } else if (variant.name !== 'ORIGIN_V01') {
              // Apply global variant
              material.color.set(variant.color);
              material.metalness = variant.metal;
              material.roughness = variant.rough;
              material.opacity = 1;
              material.transparent = false;
              if (material.emissive) {
                material.emissive.set(variant.emissive);
                material.emissiveIntensity = variant.name === 'ORIGIN_V01' ? 0 : 0.2;
              }
            } else {
              // Reset to original-ish look
              material.color.set('#ffffff');
              material.metalness = 0.2;
              material.roughness = 0.5;
              material.opacity = 1;
              material.transparent = false;
              if (material.emissive) {
                material.emissive.set('#000000');
                material.emissiveIntensity = 0;
              }
            }

            // Apply highlight if selected
            if (selectedPart === child.uuid) {
              if (material.emissive) {
                material.emissive.set('#00b8d9');
                material.emissiveIntensity = 0.8;
              }
            }
          }

          // Handle Explosion logic: push parts away from center
          const direction = child.position.clone().normalize();
          if (direction.length() === 0) direction.set(0, 1, 0); 
          if (!child.userData.originalPosition) {
            child.userData.originalPosition = child.position.clone();
          }
          child.position.copy(child.userData.originalPosition).add(direction.multiplyScalar(explodedAmount * 2));
        }
      });
    }, [scene, selectedPart, variant, overrides, explodedAmount, activePattern, texture]);

    return (
      <primitive 
        object={scene} 
        onPointerOver={(e: any) => { 
          e.stopPropagation();
          document.body.style.cursor = 'pointer'; 
        }}
        onPointerOut={(e: any) => { 
          e.stopPropagation();
          document.body.style.cursor = 'auto'; 
        }}
        onClick={(e: any) => {
          e.stopPropagation();
          const partName = e.object.name || 'Component';
          const metadata = {
             material: (e.object.material?.name) || 'Neural_Synthetic',
             complexity: Math.floor(Math.random() * 100) + '%',
             integrity: '99.8%',
             uuid: e.object.uuid,
             polyCount: (e.object.geometry?.attributes.position.count || 0).toLocaleString()
          };
          onSelect(partName, metadata);
        }}
      />
    );
  } catch (err) {
    onError(err);
    return null;
  }
};

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-6 min-w-[200px]">
        <div className="relative w-16 h-16">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-primary rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-mono font-bold text-primary">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Neural Reconstruction</span>
          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest italic animate-pulse">Syncing Voxel Map...</span>
        </div>
      </div>
    </Html>
  );
};

const CameraController = ({ preset }: { preset: [number, number, number] | null }) => {
  const { camera } = useThree();
  useEffect(() => {
    if (preset) {
      const startPos = camera.position.clone();
      const endPos = new THREE.Vector3(...preset).multiplyScalar(4);
      
      let start = 0;
      const duration = 1000;
      
      const animate = (time: number) => {
        if (!start) start = time;
        const progress = Math.min((time - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4); // Quart ease out
        camera.position.lerpVectors(startPos, endPos, ease);
        camera.lookAt(0, 0, 0);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [preset, camera]);
  return null;
};

export const NeuralModelViewer: React.FC<ModelProps> = ({ url, onExportDesign }) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<{ name: string, data: any } | null>(null);
  const [activeVariant, setActiveVariant] = useState(0);
  const [isCommiting, setIsCommiting] = useState(false);
  const [partOverrides, setPartOverrides] = useState<Record<string, any>>({});
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [configName, setConfigName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<[number, number, number] | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [activePattern, setActivePattern] = useState<string | null>(null);
  const [patternVariations, setPatternVariations] = useState<string[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleExport = () => {
    if (onExportDesign && canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onExportDesign(dataUrl, {
        variant: variants[activeVariant].name,
        pattern: activePattern
      });
    }
  };

  const synthesizePatterns = async () => {
    setIsSynthesizing(true);
    // Simulate Neural Synthesis of patterns
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newVariations = [
      'https://picsum.photos/seed/pattern1/512',
      'https://picsum.photos/seed/pattern2/512',
      'https://picsum.photos/seed/pattern3/512',
      'https://picsum.photos/seed/pattern4/512',
    ];
    setPatternVariations(newVariations);
    setActivePattern(newVariations[0]);
    setIsSynthesizing(false);
  };

  const variants = [
    { name: 'ORIGIN_V01', color: '#ffffff', metal: 0.1, rough: 0.8, emissive: '#000000' },
    { name: 'SYNTH_CORE', color: '#00b8d9', metal: 0.8, rough: 0.2, emissive: '#00b8d9' },
    { name: 'CHROME_FLOW', color: '#ff00ff', metal: 1.0, rough: 0.0, emissive: '#440044' }
  ];

  const handleCommit = () => {
    setIsCommiting(true);
    setTimeout(() => setIsCommiting(false), 1500);
  };

  const saveConfig = () => {
    if (!configName.trim()) return;
    const newConfig: SavedConfig = {
      id: Math.random().toString(36).substr(2, 9),
      name: configName.trim(),
      variantIndex: activeVariant,
      overrides: { ...partOverrides },
      timestamp: Date.now()
    };
    setSavedConfigs(prev => [newConfig, ...prev]);
    setConfigName('');
    setIsSaving(false);
  };

  const loadConfig = (config: SavedConfig) => {
    setActiveVariant(config.variantIndex);
    setPartOverrides(config.overrides);
  };

  const deleteConfig = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedConfigs(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="w-full h-full bg-zinc-950 rounded-3xl overflow-hidden border border-white/10 relative group cursor-crosshair">
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">
            {error ? 'SPATIAL_ERROR' : '3D_SPATIAL_GEN'}
          </span>
        </div>
        <p className="text-[8px] font-mono text-zinc-500 uppercase">
          {error ? 'Status: Reconstruction_Failed' : `Active_Bit_Profile: ${variants[activeVariant].name}`}
        </p>
      </div>

      {/* Interaction Bar - Top Center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 glass-dark px-4 py-2 rounded-full border border-white/10 items-center">
         <div className="flex gap-1 pr-3 border-r border-white/10">
            <button 
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className={`p-2 rounded-lg transition-all ${isAutoRotate ? 'text-primary bg-primary/10' : 'text-zinc-500 hover:text-white'}`}
              title="Auto Rotate"
            >
              {isAutoRotate ? <RotateCw size={14} className="animate-spin-slow" /> : <Play size={14} />}
            </button>
            <button 
              onClick={() => setIsExploded(!isExploded)}
              className={`p-2 rounded-lg transition-all ${isExploded ? 'text-primary bg-primary/10' : 'text-zinc-500 hover:text-white'}`}
              title="Exploded View"
            >
              <Columns size={14} />
            </button>
         </div>
         <div className="flex gap-1 pl-1">
            {[
              { label: 'P', pos: [1, 1, 1] as [number, number, number], title: 'Perspective' },
              { label: 'F', pos: [0, 0, 1] as [number, number, number], title: 'Front' },
              { label: 'S', pos: [1, 0, 0] as [number, number, number], title: 'Side' },
              { label: 'B', pos: [0, 0, -1] as [number, number, number], title: 'Back' }
            ].map(p => (
              <button
                key={p.label}
                onClick={() => setCameraPreset(p.pos)}
                className="w-8 h-8 rounded-lg text-[10px] font-black text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                title={p.title}
              >
                {p.label}
              </button>
            ))}
         </div>
      </div>

      {/* Pattern Matrix - Bottom Left */}
      <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-3">
        <div className="glass-dark p-4 rounded-3xl border border-white/5 w-64">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary">
                 <Layers size={14} />
                 <h3 className="text-[10px] font-black uppercase tracking-widest">Pattern Matrix</h3>
              </div>
              <button 
                onClick={synthesizePatterns}
                disabled={isSynthesizing}
                className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all disabled:opacity-50"
                title="Synthesize New Patterns"
              >
                <RefreshCw size={12} className={isSynthesizing ? 'animate-spin' : ''} />
              </button>
           </div>

           <div className="grid grid-cols-4 gap-2">
              <button 
                onClick={() => setActivePattern(null)}
                className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${!activePattern ? 'border-primary bg-primary/10' : 'border-white/5 hover:border-white/20'}`}
              >
                <XCircle size={14} className="text-zinc-500" />
              </button>
              {patternVariations.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActivePattern(p)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${activePattern === p ? 'border-primary scale-110 shadow-lg shadow-primary/20' : 'border-white/5 hover:border-white/20'}`}
                >
                  <img src={p} className="w-full h-full object-cover" alt={`Pattern ${i}`} />
                  {isSynthesizing && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 size={10} className="animate-spin text-primary" /></div>}
                </button>
              ))}
           </div>

           {isSynthesizing && (
             <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     className="h-full bg-primary"
                     animate={{ x: ['-100%', '100%'] }}
                     transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                   />
                </div>
                <span className="text-[8px] font-bold text-primary animate-pulse uppercase">Syncing...</span>
             </div>
           )}
        </div>
      </div>

      {/* Variant Selector & Saved Configs */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-3 items-end">
        <div className="glass-dark p-2 rounded-2xl border border-white/5 flex flex-col gap-1 w-20">
          <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest px-1 mb-1">Variants</p>
          {variants.map((v, i) => (
            <button
              key={v.name}
              onClick={() => setActiveVariant(i)}
              className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${
                activeVariant === i ? 'bg-primary text-black' : 'text-zinc-500 hover:text-white'
              }`}
            >
              V_0{i + 1}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 items-end">
          <button 
            onClick={() => setIsSaving(!isSaving)}
            className="w-10 h-10 glass-dark border border-white/5 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-primary transition-all group/save"
          >
            <Save size={16} className={isSaving ? 'text-primary' : ''} />
          </button>

          <AnimatePresence>
            {isSaving && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="glass-dark p-4 rounded-2xl border border-primary/30 w-48 shadow-2xl"
              >
                <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-2">Capture Matrix</p>
                <input 
                  type="text"
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  placeholder="Config name..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 mb-3"
                  onKeyDown={(e) => e.key === 'Enter' && saveConfig()}
                  autoFocus
                />
                <button 
                  onClick={saveConfig}
                  className="w-full py-2 bg-primary text-black text-[9px] font-black uppercase rounded-lg hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                  Save State
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {savedConfigs.length > 0 ? (
          <div className="glass-dark p-3 rounded-2xl border border-white/5 w-48 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3 px-1 text-zinc-500">
               <History size={10} />
               <p className="text-[8px] font-black uppercase tracking-widest">Archive</p>
            </div>
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
               {savedConfigs.map(config => (
                 <button
                   key={config.id}
                   onClick={() => loadConfig(config)}
                   className="group relative w-full p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-left"
                 >
                   <div className="flex justify-between items-center gap-2">
                     <span className="text-[9px] text-white font-bold uppercase truncate pr-4">{config.name}</span>
                     <button 
                       onClick={(e) => deleteConfig(config.id, e)}
                       className="p-1 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                     >
                       <Trash2 size={10} />
                     </button>
                   </div>
                   <div className="flex gap-1 mt-1">
                      <div className="w-1 h-1 rounded-full bg-primary/40" />
                      <span className="text-[6px] text-zinc-600 font-mono">
                        {new Date(config.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </div>
                 </button>
               ))}
            </div>
          </div>
        ) : (
           <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-full">
              <span className="text-[7px] font-mono text-zinc-700 uppercase italic">Archive Empty</span>
           </div>
        )}

        <button 
          onClick={handleCommit}
          disabled={isCommiting}
          className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase rounded-xl hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-2 w-full"
        >
          {isCommiting ? <RefreshCw size={10} className="animate-spin" /> : <ShieldCheck size={10} />}
          {isCommiting ? 'SYNCING' : 'COMMIT NODE'}
        </button>
      </div>

      <AnimatePresence>
        {selectedInfo && (
          <motion.div 
            initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
            className="absolute top-20 left-6 z-20 w-64 bg-zinc-900/80 border border-primary/30 rounded-3xl backdrop-blur-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h6 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Neural Node Affinity</h6>
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight truncate max-w-[140px]">{selectedInfo.name}</h4>
                </div>
                <button 
                  onClick={() => setSelectedInfo(null)} 
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors text-zinc-500 hover:text-white"
                >
                  <XCircle size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Material Presets Matrix */}
                <div className="pt-2 border-t border-white/5">
                   <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-3">Neural Preset Matrix</p>
                   <div className="grid grid-cols-2 gap-2">
                      {Object.entries(MATERIAL_PRESETS).map(([id, preset]) => (
                        <button
                          key={id}
                          onClick={() => {
                            setPartOverrides(prev => ({
                              ...prev,
                              [selectedInfo.data.uuid]: preset
                            }));
                          }}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all border ${
                            partOverrides[selectedInfo.data.uuid]?.name === preset.name 
                              ? 'bg-primary/10 border-primary/40' 
                              : 'bg-white/5 border-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div 
                            className="w-4 h-4 rounded-full shadow-inner" 
                            style={{ 
                              backgroundColor: preset.color, 
                              opacity: preset.opacity,
                              boxShadow: `0 0 10px ${preset.emissive !== '#000000' ? preset.emissive : 'transparent'}`
                            }} 
                          />
                          <span className="text-[7px] font-black uppercase text-center leading-none text-zinc-400">{preset.name}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          const newOverrides = { ...partOverrides };
                          delete newOverrides[selectedInfo.data.uuid];
                          setPartOverrides(newOverrides);
                        }}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all col-span-2"
                      >
                         <span className="text-[7px] font-black uppercase text-zinc-500">Reset to Global</span>
                      </button>
                   </div>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                  <Box size={14} className="text-zinc-500" />
                  <div className="flex-1">
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-0.5">Material Composition</p>
                    <p className="text-[10px] text-white font-mono font-bold uppercase truncate">{selectedInfo.data.material}</p>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                  <Zap size={14} className="text-primary" />
                  <div className="flex-1">
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-0.5">Fabric Complexity</p>
                    <p className="text-[10px] text-white font-mono font-bold">{selectedInfo.data.complexity}</p>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <div className="flex-1">
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-0.5">Structural Integrity</p>
                    <p className="text-[10px] text-emerald-500 font-mono font-bold italic">{selectedInfo.data.integrity}</p>
                  </div>
                </div>

                <div className="pt-2">
                   <div className="flex justify-between text-[8px] text-zinc-600 uppercase mb-1">
                      <span>Voxel Density</span>
                      <span>98%</span>
                   </div>
                   <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '98%' }}
                        className="h-full bg-primary"
                      />
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm p-12 text-center">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <XCircle className="text-red-500" size={24} />
            </div>
            <div>
              <h5 className="text-sm font-black text-white uppercase tracking-widest mb-1">Neural Fault</h5>
              <p className="text-[10px] font-mono text-zinc-500 uppercase leading-relaxed max-w-[200px]">
                Failed to reconstruct 3D asset from neural source nodes.
              </p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="px-6 py-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest transition-all"
            >
              Retry Sync
            </button>
          </div>
        </div>
      )}

      {!error && (
        <div className="absolute bottom-6 right-6 z-10">
          <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
            Neural Link: Active
          </div>
        </div>
      )}

      <Canvas 
        ref={canvasRef}
        shadows 
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<Loader />}>
          <color attach="background" args={['#09090b']} />
          <Environment preset="city" />
          
          <PresentationControls
            global
            snap
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <Stage intensity={0.5} environment="city" shadows="contact" adjustCamera={true}>
               {url ? (
                 <ErrorBoundary onError={(err) => setError(err.message)}>
                    <Model 
                      url={url} 
                      onSelect={(name, data) => setSelectedInfo({ name, data })}
                      selectedPart={selectedInfo?.data?.uuid || null}
                      onError={(err) => setError(err.message)}
                      variant={variants[activeVariant]}
                      overrides={partOverrides}
                      explodedAmount={isExploded ? 0.5 : 0}
                      activePattern={activePattern}
                    />
                 </ErrorBoundary>
               ) : (
                 <PlaceholderModel />
               )}
            </Stage>
          </PresentationControls>

          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            autoRotate={isAutoRotate}
            autoRotateSpeed={1}
            makeDefault
          />

          <CameraController preset={cameraPreset} />

          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4.5}
          />
        </Suspense>
      </Canvas>

      {/* Bridge to Try-on */}
      {onExportDesign && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="absolute bottom-10 right-10 z-30 flex items-center gap-3 px-8 py-4 bg-primary text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/40 hover:bg-white transition-all border-none"
        >
          <Shirt size={18} />
          <span>Project Design to Digital Human</span>
        </motion.button>
      )}
    </div>
  );
};

// Simple Error Boundary for Three.js
class ErrorBoundary extends React.Component<{ children: React.ReactNode, onError: (err: Error) => void }> {
  componentDidCatch(error: Error) {
    this.props.onError(error);
  }
  render() {
    return this.props.children;
  }
}
