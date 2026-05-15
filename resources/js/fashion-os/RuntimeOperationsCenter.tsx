import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Database, 
  Terminal, 
  Zap, 
  Activity, 
  ShieldCheck, 
  RefreshCw, 
  AlertCircle,
  HardDrive,
  Network,
  Binary,
  Layers,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface Metric {
  id: string;
  label: string;
  value: string;
  usage: number;
  status: 'OPTIMAL' | 'PENDING' | 'CRITICAL';
}

export const RuntimeOperationsCenter: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([
    { id: 'gpu', label: 'GPU ACCELERATION', value: 'RTX 4090 v2', usage: 42, status: 'OPTIMAL' },
    { id: 'vram', label: 'VIDEO MEMORY', value: '18.4GB / 24GB', usage: 76, status: 'OPTIMAL' },
    { id: 'queue', label: 'QUEUE BACKLOG', value: '12 TASKS', usage: 15, status: 'PENDING' },
    { id: 'nodes', label: 'ACTIVE WORKERS', value: '4 NODES', usage: 90, status: 'CRITICAL' },
  ]);

  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Kernel initialized in 12ms',
    '[NETWORK] Qdrant connection handshake: SUCCESS',
    '[RUNTIME] SDXL-Core-v3 loaded into VRAM',
    '[MODELS] LoRA Router redirecting: cyberpunk_v2',
    '[SECURITY] E2E Encryption active on node_0xAF'
  ]);

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => ({
        ...m,
        usage: Math.min(100, Math.max(0, m.usage + (Math.random() * 10 - 5)))
      })));
      
      const newLog = `[IO] Packet received: ${Math.random().toString(16).slice(2, 10)}`;
      setLogs(l => [newLog, ...l.slice(0, 7)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 select-none font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 w-fit">
              <Zap size={14} className="text-primary" />
              <span className="text-[10px] font-black italic tracking-[0.2em] uppercase text-primary">Runtime_Secure_Node</span>
            </div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter outline-text mb-2">Operations Center</h1>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest pl-2">System Version 9.4.0-Stable // Cluster ID: 0x8FA2_DELTA</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col items-end">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Global Health</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black italic">98.4%</span>
                <Activity size={24} className="text-primary animate-pulse" />
              </div>
            </div>
            <button className="bg-primary text-black px-8 py-4 rounded-[2rem] font-black text-[12px] uppercase transition-all hover:scale-105 shadow-lg shadow-primary/20 flex items-center gap-3">
              <RefreshCw size={16} />
              Reboot Runtime
            </button>
          </div>
        </header>

        {/* Technical Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map(metric => (
            <div key={metric.id} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[40px] space-y-6 group hover:border-white/20 transition-all">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${metric.status === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                  {metric.id === 'gpu' ? <Cpu size={20} /> : metric.id === 'vram' ? <HardDrive size={20} /> : metric.id === 'queue' ? <Binary size={20} /> : <Network size={20} />}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-zinc-500 uppercase">{metric.label}</span>
                  <span className="text-[14px] font-black italic">{metric.value}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${metric.status === 'CRITICAL' ? 'bg-red-500' : 'bg-primary'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.usage}%` }}
                    transition={{ type: 'spring', damping: 20 }}
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-zinc-600">
                  <span>LOAD_CAPACITY</span>
                  <span>{Math.round(metric.usage)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Deep Infrastructure Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Real-time Logs Console */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-[40px] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Terminal size={16} className="text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-widest italic">System_Logs_Shell</h3>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />)}
              </div>
            </div>
            <div ref={logContainerRef} className="p-8 font-mono text-[10px] space-y-4 flex-1 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-4 group cursor-default">
                  <span className="text-zinc-700 w-12 shrink-0">{`13:02:${(10-i).toString().padStart(2, '0')}`}</span>
                  <span className={log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('SUCCESS') ? 'text-sky-400' : 'text-zinc-400 group-hover:text-white transition-colors'}>
                    {log}
                  </span>
                </div>
              ))}
              <div className="pt-4 flex items-center gap-2">
                <span className="text-primary">_</span>
                <div className="w-2 h-4 bg-primary animate-pulse" />
              </div>
            </div>
          </div>

          {/* Model Registry & Active Models */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 space-y-8">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-primary">
                  <Database size={16} />
                  <h3 className="text-[10px] font-black uppercase tracking-widest italic">Model Registry</h3>
                </div>
                <RefreshCw size={14} className="text-zinc-600 hover:text-white cursor-pointer transition-all" />
             </div>

             <div className="space-y-6">
                {[
                  { name: 'SDXL_Turbo_v2', type: 'CORE', healthy: true },
                  { name: 'LoRA_CyberDesign', type: 'LAYER', healthy: true },
                  { name: 'QWEN_VL_Vision', type: 'AGENT', healthy: true },
                  { name: 'Segment_Anything_Pro', type: 'PROC', healthy: false }
                ].map(model => (
                  <div key={model.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-1.5 h-1.5 rounded-full ${model.healthy ? 'bg-primary shadow-[0_0_8px_#00ff41]' : 'bg-red-500 animate-pulse'}`} />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-tighter transition-all group-hover:translate-x-1">{model.name}</p>
                        <p className="text-[8px] font-mono text-zinc-500">{model.type}</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-zinc-800 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                ))}
             </div>

             <div className="pt-12">
                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 relative overflow-hidden group hover:bg-primary/10 transition-all cursor-pointer">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-all">
                    <ShieldCheck size={80} />
                  </div>
                  <div className="relative z-10 space-y-2">
                    <p className="text-[8px] font-black text-primary uppercase">Security Status</p>
                    <p className="text-[14px] font-black italic">PROBABILITY_SAFE_CORE</p>
                    <p className="text-[10px] font-mono text-emerald-500">ENCRYPTION: AES_256_GCM</p>
                  </div>
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};
