import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows, 
  Html, 
  useProgress,
  Stage,
  Bounds,
  Float
} from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  RotateCw, 
  Maximize2, 
  Layers, 
  Zap, 
  Box, 
  Cpu, 
  Layout, 
  MoreVertical,
  Activity,
  ChevronRight,
  ShieldCheck,
  Download,
  Settings,
  Share2
} from 'lucide-react';

// Loader Component
const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 w-64">
        <div className="h-0.5 w-full bg-white/10 overflow-hidden rounded-full">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[8px] font-black text-primary tracking-[0.3em] uppercase italic">
          Baking_Neural_Human_{Math.round(progress)}%
        </p>
      </div>
    </Html>
  );
};

// Mock Human Model (Placeholder for real GLTF)
const HumanMesh = ({ rotationY }: { rotationY: number }) => {
  const meshRef = useRef<any>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotationY;
    }
  });

  return (
    <mesh ref={meshRef}>
      <capsuleGeometry args={[0.5, 1.5, 4, 16]} />
      <meshStandardMaterial 
        color="#222" 
        roughness={0.1} 
        metalness={0.8}
        emissive="#00ff41"
        emissiveIntensity={0.05}
      />
    </mesh>
  );
};

export const DigitalHumanWorkspace: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [activeCam, setActiveCam] = useState('FRONT');
  const [isRendering, setIsRendering] = useState(false);
  const [envIntensity, setEnvIntensity] = useState(1);

  const cameraPresets = {
    FRONT: [0, 0, 5],
    DETAIL: [0, 1, 2],
    LOOK: [2, 1, 4],
    TOP: [0, 5, 0]
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-white p-4 gap-4 overflow-hidden select-none">
      {/* 3D Viewport Main */}
      <div className="flex-1 relative rounded-[40px] border border-white/5 bg-[#0a0a0a] overflow-hidden group">
        {/* HUD - Top Left */}
        <div className="absolute top-8 left-8 z-20 space-y-4">
          <div className="flex items-center gap-4 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 ring-1 ring-white/5">
            <Layout size={14} className="text-primary animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black italic tracking-widest text-primary uppercase">Workspace_V4.0</span>
              <span className="text-[7px] font-mono text-zinc-500">DIGITAL_HUMAN_ENGINE // PRO_EDITION</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 pl-2">
            {['CAM_FEED_01', 'POSE_SYNC_ENABLED', 'RTX_PATH_TRACING'].map(status => (
              <div key={status} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary/40 shadow-[0_0_5px_#00ff41]" />
                <p className="text-[8px] font-mono text-zinc-600">{status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* HUD - Top Right */}
        <div className="absolute top-8 right-8 z-20 flex gap-2">
          <button className="h-10 w-10 flex items-center justify-center rounded-full bg-black/60 border border-white/10 hover:border-primary/50 transition-all">
            <Settings size={14} />
          </button>
          <button className="h-10 bg-black/60 px-4 flex items-center gap-2 rounded-full border border-white/10 hover:border-primary/50 transition-all font-black text-[10px] uppercase italic">
            <Download size={14} />
            Export 4K
          </button>
        </div>

        {/* 3D Scene */}
        <div className="absolute inset-0">
          <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} />
            <Suspense fallback={<Loader />}>
              <Stage intensity={envIntensity} environment="studio" adjustCamera={false}>
                <Bounds fit clip observe>
                  <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                    <HumanMesh rotationY={rotation} />
                  </Float>
                </Bounds>
              </Stage>
              <Environment preset="city" />
              <ContactShadows opacity={0.4} scale={10} blur={2} far={4} color="#000" />
            </Suspense>
            <OrbitControls 
              enablePan={false}
              maxPolarAngle={Math.PI / 1.8}
              minDistance={2}
              maxDistance={10}
              makeDefault
            />
          </Canvas>
        </div>

        {/* Viewport Control Bar - Center Bottom */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-4 bg-black/80 backdrop-blur-3xl px-8 py-4 rounded-[2rem] border border-white/10 shadow-2xl">
            <div className="flex gap-2 mr-6 border-r border-white/10 pr-6">
              {Object.keys(cameraPresets).map((cam) => (
                <button
                  key={cam}
                  onClick={() => setActiveCam(cam)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                    activeCam === cam ? 'bg-primary text-black' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {cam}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Rotation</p>
              <input 
                type="range"
                min="-3.14"
                max="3.14"
                step="0.01"
                value={rotation}
                onChange={(e) => setRotation(parseFloat(e.target.value))}
                className="w-48 appearance-none bg-white/10 h-0.5 rounded-full accent-primary"
              />
              <p className="text-[10px] font-mono w-10">{Math.round((rotation * 180) / Math.PI)}°</p>
            </div>

            <div className="w-px h-8 bg-white/10 mx-2" />

            <button 
              onClick={() => setIsRendering(!isRendering)}
              className={`p-3 rounded-xl transition-all ${isRendering ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-white/5 text-zinc-500 border border-transparent'}`}
            >
              <Activity size={18} />
            </button>
          </div>
        </div>

        {/* Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-10" />
      </div>

      {/* Control Panel - Right Side */}
      <div className="w-full lg:w-80 flex flex-col gap-4 overflow-y-auto max-h-screen pr-2 custom-scrollbar">
        {/* Layer Manager */}
        <div className="p-8 rounded-[40px] bg-[#0a0a0a] border border-white/5 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Layers size={16} />
              <h3 className="text-xs font-black uppercase tracking-tighter italic">Layer Manager</h3>
            </div>
            <MoreVertical size={14} className="text-zinc-600 cursor-pointer" />
          </div>

          <div className="space-y-4">
            {[
              { id: 'OUTER', name: 'Shell Expansion Jacket', active: true },
              { id: 'TOP', name: 'Neural Mesh Tee', active: true },
              { id: 'BOTTOM', name: 'Graphene Trousers', active: false },
              { id: 'ACC', name: 'Lidar Visor', active: true }
            ].map(layer => (
              <div 
                key={layer.id}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  layer.active ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${layer.active ? 'bg-primary/10 text-primary' : 'bg-zinc-900 text-zinc-600'}`}>
                    <Box size={14} />
                  </div>
                  <div>
                    <p className="text-[7px] font-black text-zinc-500 uppercase">{layer.id}</p>
                    <p className="text-[10px] font-black">{layer.name}</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${layer.active ? 'border-primary bg-primary' : 'border-zinc-700'}`}>
                  {layer.active && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Texture Editor */}
        <div className="p-8 rounded-[40px] bg-[#0a0a0a] border border-white/5 space-y-8 flex-1">
          <div className="flex items-center gap-2 text-primary">
            <Cpu size={16} />
            <h3 className="text-xs font-black uppercase tracking-tighter italic">Neural Parameters</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black text-zinc-500 uppercase">Lighting Intensity</label>
                <span className="text-[10px] font-mono text-primary">{(envIntensity * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={envIntensity}
                onChange={(e) => setEnvIntensity(parseFloat(e.target.value))}
                className="w-full appearance-none bg-white/5 h-1 rounded-full accent-primary"
              />
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
               <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest italic">Simulation_Properties</p>
               <div className="grid grid-cols-2 gap-2">
                 <button className="p-3 bg-zinc-900 rounded-xl border border-white/5 text-[9px] font-black uppercase hover:bg-zinc-800 transition-all flex flex-col gap-2">
                    <Activity size={14} className="text-sky-400" />
                    Bones_On
                 </button>
                 <button className="p-3 bg-zinc-900 rounded-xl border border-white/5 text-[9px] font-black uppercase hover:bg-zinc-800 transition-all flex flex-col gap-2">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    Physics_Off
                 </button>
               </div>
            </div>

            <button className="w-full bg-white text-black py-4 rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest italic flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
              <Zap size={16} />
              SYNC_DESIGN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
