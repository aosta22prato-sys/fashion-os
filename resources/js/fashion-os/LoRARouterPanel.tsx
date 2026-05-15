import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Network, Cpu, Database, Zap, 
  Settings, RefreshCw, Layers, Box,
  Share2, Shield, Activity, HardDrive
} from 'lucide-react';

interface LoRANode {
  id: string;
  name: string;
  version: string;
  baseModel: string;
  weight: number;
  status: 'ACTIVE' | 'STANDBY' | 'LOADED';
}

const LORA_NODES: LoRANode[] = [
  { id: 'L-01', name: 'Cyber_Synth_v2', version: '2.1.0', baseModel: 'SDXL', weight: 0.85, status: 'ACTIVE' },
  { id: 'L-02', name: 'Silk_Ethereal', version: '1.4.5', baseModel: 'SDXL', weight: 0.42, status: 'LOADED' },
  { id: 'L-03', name: 'Brutalist_Stone', version: '3.0.1', baseModel: 'Flux.1', weight: 0.95, status: 'STANDBY' },
];

export const LoRARouterPanel: React.FC = () => {
  const [nodes, setNodes] = useState(LORA_NODES);

  return (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter outline-text italic">LoRA_Router_Matrix</h2>
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest italic">Multi-Model_Cross_Inference_Layer // NODE_L9</p>
         </div>
         <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 glass-dark border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-all">
               <Database size={14} />
               Registry
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-glow">
               <Zap size={14} />
               Deploy Model
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
         <div className="lg:col-span-2 space-y-6">
            <div className="glass-dark rounded-[48px] border border-white/5 p-8 space-y-8 h-full flex flex-col">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Network size={18} className="text-primary" />
                     <h3 className="text-[10px] font-black uppercase tracking-widest">Active_Router_Nodes</h3>
                  </div>
                  <div className="flex gap-2">
                     <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-[8px] font-black text-zinc-500">
                        Total_VRAM: 124GB / 512GB
                     </div>
                  </div>
               </div>

               <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
                  {nodes.map((node) => (
                    <div key={node.id} className="p-6 bg-white/5 rounded-[32px] border border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
                       <div className="flex items-center gap-6">
                          <div className={`p-4 rounded-2xl transition-all ${node.status === 'ACTIVE' ? 'bg-primary/20 text-primary border border-primary/20 shadow-glow' : 'bg-zinc-900 text-zinc-500 border border-white/5'}`}>
                             <Box size={20} />
                          </div>
                          <div>
                             <div className="flex items-center gap-3">
                                <h4 className="text-[12px] font-black text-white uppercase italic">{node.name}</h4>
                                <span className={`text-[7px] font-black px-2 py-0.5 rounded-full border ${node.status === 'ACTIVE' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/5 text-zinc-600'}`}>
                                   {node.status}
                                </span>
                             </div>
                             <p className="text-[8px] font-mono text-zinc-600 uppercase mt-1">ID: {node.id} // BASE: {node.baseModel} // v{node.version}</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-12">
                          <div className="w-32 space-y-2">
                             <div className="flex justify-between text-[8px] font-black uppercase italic">
                                <span className="text-zinc-500">Inference_Weight</span>
                                <span className="text-white">{(node.weight * 100).toFixed(0)}%</span>
                             </div>
                             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${node.weight * 100}%` }}
                                  className={`h-full ${node.status === 'ACTIVE' ? 'bg-primary' : 'bg-zinc-700'}`}
                                />
                             </div>
                          </div>
                          <button className="p-3 bg-zinc-900 border border-white/10 rounded-2xl text-zinc-500 hover:text-white transition-all">
                             <Settings size={14} />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="glass-dark rounded-[48px] border border-white/5 p-8 space-y-8">
               <div className="flex items-center gap-3 text-primary">
                  <Activity size={18} />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Router_Health</h3>
               </div>
               
               <div className="space-y-6">
                  {[
                    { label: 'Latency_MS', val: '4.2ms', status: 'Optimal' },
                    { label: 'Queue_Depth', val: '0', status: 'Idle' },
                    { label: 'Sync_Hash', val: '0x88A...FDC', status: 'Ver' }
                  ].map(stat => (
                    <div key={stat.label} className="flex justify-between items-center py-4 border-b border-white/5 leading-none">
                       <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                       <div className="text-right">
                          <p className="text-[11px] font-black text-white tabular-nums">{stat.val}</p>
                          <p className="text-[7px] font-black text-primary uppercase tracking-tighter mt-1">{stat.status}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="glass-dark rounded-[48px] border border-white/5 p-8 relative overflow-hidden group flex-1 min-h-[250px]">
               <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-all duration-700" />
               <div className="relative z-10 flex flex-col justify-between h-full gap-8">
                  <div className="space-y-4">
                     <Shield size={32} className="text-primary" />
                     <h4 className="text-xl font-black italic uppercase tracking-tighter italic">Deep_Link_Security</h4>
                     <p className="text-[9px] font-medium text-zinc-500 leading-relaxed uppercase">All cross-model inference traffic is encrypted via 1024-bit post-quantum signatures.</p>
                  </div>
                  <button className="w-full py-4 bg-white text-black rounded-3xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                     Verify Integrity
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
