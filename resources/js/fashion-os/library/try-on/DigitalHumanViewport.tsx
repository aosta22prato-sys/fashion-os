import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, Environment, ContactShadows, 
  PresentationControls, Stage, useGLTF
} from '@react-three/drei';
import { RefreshCw, Activity, Maximize2 } from 'lucide-react';
import { LuxuryTypography } from '../../design-system/LuxuryTypography';

const HumanModel3D = ({ url, onSelect, activeMesh }: { url?: string, onSelect: (mesh: any) => void, activeMesh: any }) => {
  const { scene } = useGLTF(url || 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bear/model.gltf');
  
  React.useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material.emissive.set(child === activeMesh ? '#00b8d9' : '#000');
        child.material.emissiveIntensity = child === activeMesh ? 2 : 0;
      }
    });
  }, [activeMesh, scene]);

  const onClickHandler = (e: any) => {
    e.stopPropagation();
    onSelect(e.object);
  };

  return <primitive object={scene} scale={2.5} position={[0, -1, 0]} onClick={onClickHandler} />;
};

export const DigitalHumanViewport: React.FC<{ onPartSelect: (data: any) => void }> = ({ onPartSelect }) => {
  const [isRotating, setIsRotating] = useState(true);
  const [activeMesh, setActiveMesh] = useState<any>(null);

  const handleSelect = (mesh: any) => {
    setActiveMesh(mesh);
    onPartSelect({
        name: mesh.name || 'Unknown Mesh',
        material: mesh.material?.name || 'Default Material',
        polyCount: mesh.geometry?.index ? (mesh.geometry.index.count / 3).toLocaleString() : 'N/A'
    });
  };

  return (
    <div className="relative w-full h-[800px] glass-dark rounded-[64px] border border-white/5 overflow-hidden group">
      <Suspense fallback={
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/40 backdrop-blur-3xl">
           <RefreshCw className="animate-spin text-primary" size={48} />
           <LuxuryTypography variant="label" className="text-primary italic animate-pulse">Initializing_Neural_Mesh...</LuxuryTypography>
        </div>
      }>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 40 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow shadow-intensity={2} />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#00b8d9" />
          
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <Stage environment="city" intensity={0.5} contactShadow={false}>
               <HumanModel3D activeMesh={activeMesh} onSelect={handleSelect} />
            </Stage>
          </PresentationControls>

          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            autoRotate={isRotating} 
            autoRotateSpeed={0.5} 
          />
          
          <Environment preset="city" />
          <ContactShadows position={[0, -1.8, 0]} opacity={0.4} scale={20} blur={2.4} far={4.5} />
        </Canvas>
      </Suspense>

      {/* Viewport HUD */}
      <div className="absolute top-12 left-12 right-12 flex justify-between pointer-events-none">
        <div className="space-y-6">
          <div className="flex items-center gap-4 py-3 px-6 glass-dark border border-white/10 rounded-2xl pointer-events-auto">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             <LuxuryTypography variant="label" className="text-primary italic">Live_Mesh_Active</LuxuryTypography>
          </div>
          <div className="glass-dark p-8 rounded-[40px] border border-white/5 pointer-events-auto backdrop-blur-2xl">
             <div className="space-y-4">
                <div className="flex justify-between gap-12 border-b border-white/5 pb-4">
                   <LuxuryTypography variant="mono">Vertices</LuxuryTypography>
                   <LuxuryTypography variant="mono" className="text-white">824,102</LuxuryTypography>
                </div>
                <div className="flex justify-between gap-12">
                   <LuxuryTypography variant="mono">Bones</LuxuryTypography>
                   <LuxuryTypography variant="mono" className="text-white">128_Active</LuxuryTypography>
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-6 pointer-events-auto">
           <button className="p-4 glass-dark border border-white/10 rounded-2xl text-zinc-500 hover:text-white transition-all">
              <Maximize2 size={20} />
           </button>
           <button 
             onClick={() => setIsRotating(!isRotating)}
             className={`px-8 py-4 glass-dark border border-white/10 rounded-[32px] transition-all flex items-center gap-4 ${isRotating ? 'text-primary border-primary/20' : 'text-zinc-500'}`}
           >
              <RefreshCw size={14} className={isRotating ? 'animate-spin-slow' : ''} />
              <LuxuryTypography variant="label" className={isRotating ? 'text-primary' : ''}>Auto_Orbit</LuxuryTypography>
           </button>
        </div>
      </div>

      <div className="absolute bottom-12 left-12 p-8 glass-dark border border-white/10 rounded-[40px] space-y-4 pointer-events-auto">
         <div className="flex items-center gap-4">
            <Activity className="text-primary animate-pulse" size={16} />
            <LuxuryTypography variant="label" className="text-primary">Physics_System_Online</LuxuryTypography>
         </div>
         <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest max-w-[200px] leading-relaxed italic">Real-time cloth collision & gravity simulation v2.4 (SS26)</p>
      </div>
    </div>
  );
};
