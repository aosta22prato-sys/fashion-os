import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
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
  useProgress
} from '@react-three/drei';
import { motion } from 'motion/react';
import { Loader2, XCircle } from 'lucide-react';

interface ModelProps {
  url?: string;
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

const Model = ({ url, onSelect, selectedPart, onError }: { url: string, onSelect: (name: string, data: any) => void, selectedPart: string | null, onError: (err: any) => void }) => {
  try {
    const { scene } = useGLTF(url);
    
    React.useEffect(() => {
      scene.traverse((child) => {
        if ((child as any).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }, [scene]);

    return (
      <primitive 
        object={scene} 
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        onClick={(e: any) => {
          e.stopPropagation();
          const partName = e.object.name || 'Comp_' + e.object.uuid.slice(0, 4);
          const metadata = {
             material: (e.object.material?.name) || 'Neural_Synthetic',
             complexity: Math.floor(Math.random() * 100) + '%',
             integrity: '99.8%',
             uuid: e.object.uuid
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

export const NeuralModelViewer: React.FC<ModelProps> = ({ url }) => {
  const [error, setError] = React.useState<string | null>(null);
  const [selectedInfo, setSelectedInfo] = React.useState<{ name: string, data: any } | null>(null);

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
          {error ? 'Status: Reconstruction_Failed' : 'Buffer: Optic_Zero_v4'}
        </p>
      </div>

      {selectedInfo && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-20 left-6 z-20 w-48 glass-dark p-4 rounded-2xl border border-primary/20 backdrop-blur-xl"
        >
          <div className="flex justify-between items-start mb-3">
             <h6 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] truncate pr-2">{selectedInfo.name}</h6>
             <button onClick={() => setSelectedInfo(null)} className="text-zinc-500 hover:text-white transition-colors">
                <XCircle size={12} />
             </button>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-[8px] text-zinc-500 uppercase">Material</span>
                <span className="text-[8px] text-white font-mono uppercase truncate max-w-[80px]">{selectedInfo.data.material}</span>
             </div>
             <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-[8px] text-zinc-500 uppercase">Complexity</span>
                <span className="text-[8px] text-white font-mono">{selectedInfo.data.complexity}</span>
             </div>
             <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-[8px] text-zinc-500 uppercase">Integrity</span>
                <span className="text-[8px] text-emerald-500 font-mono italic">{selectedInfo.data.integrity}</span>
             </div>
          </div>
        </motion.div>
      )}

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

      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
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
                      selectedPart={selectedInfo?.name || null}
                      onError={(err) => setError(err.message)}
                    />
                 </ErrorBoundary>
               ) : (
                 <PlaceholderModel />
               )}
            </Stage>
          </PresentationControls>

          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4.5}
          />
        </Suspense>
      </Canvas>
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
