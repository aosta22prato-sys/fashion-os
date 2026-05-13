import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Cpu, Activity, Server, Network, Brain,
  Search, BarChart3, TrendingUp, Workflow, Link,
  CheckCircle2, AlertCircle, Terminal, Camera, Download,
  Maximize2, MessageSquare, ShieldAlert, Database,
  User, Power, RotateCw, Square, Play, HardDrive, 
  RefreshCw, Bot, XCircle, LineChart, ShieldCheck, Trash2
} from 'lucide-react';
import { Registry, OpsDashboard, Language, Agent } from './types';

// ModaUI System Imports
import { QuantumButton } from './resources/js/fashion-os/components/QuantumButton';
import { NeuralCard } from './resources/js/fashion-os/components/NeuralCard';
import { RuntimePanel } from './resources/js/fashion-os/components/RuntimePanel';
import { AIConsole } from './resources/js/fashion-os/components/AIConsole';
import { FashionGrid } from './resources/js/fashion-os/components/FashionGrid';

export const AIOperationsCenter: React.FC<{ lang: Language }> = ({ lang }) => {
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [memory, setMemory] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'matrix' | 'agents' | 'memory' | 'logs'>('matrix');
  const [isExecuting, setIsExecuting] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const [regRes, healthRes, memRes] = await Promise.all([
        fetch('/api/fashion/registry'),
        fetch('/api/fashion/runtime/health'),
        fetch('/api/fashion/memory')
      ]);
      const reg = await regRes.json();
      const healthData = await healthRes.json();
      const mem = await memRes.json();
      
      setRegistry(reg);
      // Handle the new nested health structure
      setStats(healthData.health || healthData); 
      setMemory(mem);
    } catch (e) {
      console.error("Ops sync failed", e);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);

    const eventSource = new EventSource('/api/fashion/runtime/stream');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'log') {
        const logObj = data.log || { 
          timestamp: new Date().toLocaleTimeString(), 
          level: data.level || 'info', 
          module: 'SYS', 
          message: data.message 
        };
        setLogs(prev => [...prev, logObj].slice(-100));
      }
    };

    return () => {
      clearInterval(interval);
      eventSource.close();
    };
  }, [fetchStats]);

  const executeAction = async (action: string, endpoint: string) => {
    setIsExecuting(action);
    const startLog = { timestamp: new Date().toLocaleTimeString(), level: 'info', module: 'ACTION', message: `Initializing ${action} directive...` };
    setLogs(prev => [...prev, startLog]);
    
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        const successLog = { timestamp: new Date().toLocaleTimeString(), level: 'info', module: 'SUCCESS', message: data.message };
        setLogs(prev => [...prev, successLog]);
      }
    } catch (e) {
      const errorLog = { timestamp: new Date().toLocaleTimeString(), level: 'error', module: 'FATAL', message: `Action ${action} aborted by system kernel` };
      setLogs(prev => [...prev, errorLog]);
    } finally {
      setTimeout(() => setIsExecuting(null), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      {/* Cinematic Header */}
      <div className="max-w-7xl mx-auto py-20 px-6 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">AI Director Runtime Layer</span>
            </div>
            <h2 className="text-8xl font-serif italic text-white uppercase tracking-tighter leading-[0.8] mb-8">
               Ops<br/><span className="not-italic font-black text-white/5 uppercase">Matrix</span>
            </h2>
          </div>
          <div className="flex gap-4">
            {['matrix', 'agents', 'memory', 'logs'].map((tab) => (
              <QuantumButton
                key={tab}
                variant={activeTab === tab ? 'primary' : 'secondary'}
                onClick={() => setActiveTab(tab as any)}
                className="!rounded-full px-8"
              >
                {tab}
              </QuantumButton>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'matrix' && (
            <motion.div 
              key="matrix"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-8"
            >
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Workers Fabric */}
                <NeuralCard 
                  title="Distributed GPU Fabric" 
                  subtitle="Cluster Synchronization" 
                  icon={<Activity className="text-emerald-500 animate-pulse" />}
                  className="!p-12 md:col-span-1"
                >
                  <div className="space-y-8">
                    {registry?.workers.map(w => (
                      <div key={w.id} className="space-y-2">
                        <div className="flex justify-between text-[13px] font-bold text-white uppercase">
                          <span>{w.name}</span>
                          <span className={w.status === 'busy' ? 'text-orange-500' : 'text-emerald-500'}>{w.load}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${w.load}%` }}
                            className={`h-full ${w.status === 'busy' ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                          />
                        </div>
                        <div className="flex justify-between text-[8px] font-mono text-zinc-600 uppercase">
                          <span>{w.type} / {(w.gpu_memory / 1024).toFixed(1)}GB BATCH-READY</span>
                          <span>{w.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </NeuralCard>

                {/* Queue Intelligence */}
                <NeuralCard 
                  title="Queue Intelligence" 
                  subtitle="Active Neural Requests" 
                  icon={<TrendingUp className="text-blue-500" />}
                  glowColor="blue"
                  className="!p-12 flex flex-col justify-between"
                >
                  <div className="py-10">
                    <div className="text-7xl font-black text-white">{stats?.queue_depth || 0}</div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase mt-4">Task Backlog in Cluster</p>
                  </div>
                  <div className="flex gap-2">
                    <QuantumButton 
                      variant="secondary" 
                      className="flex-1"
                      onClick={() => executeAction('Queue Prioritization', '/api/queue/prioritize')}
                    >
                      Prioritize
                    </QuantumButton>
                    <QuantumButton 
                      variant="secondary" 
                      className="flex-1"
                      onClick={() => executeAction('Cache Flush', '/api/memory/flush')}
                    >
                      Flush Cache
                    </QuantumButton>
                  </div>
                </NeuralCard>

                {/* Runtime Controls */}
                <NeuralCard 
                  title="System Runtime Precision Controls" 
                  subtitle="High Level Access Required" 
                  icon={<ShieldAlert className="text-red-500" />}
                  glowColor="amber"
                  className="!p-12 md:col-span-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <RuntimePanel title="GPU Watchdog Monitor" status={stats?.gpu_runtime ? 'online' : 'offline'}>
                      <p className="text-[11px] text-zinc-500 leading-relaxed italic mb-6">
                        Monitors latent-space temperature and heartbeat. Manual sync required if latency &gt; 250ms.
                      </p>
                      <QuantumButton 
                        variant="glow"
                        className="w-full !bg-red-500/10 hover:!bg-red-500/20 !text-red-500 border border-red-500/20"
                        onClick={() => executeAction('GPU Watchdog Sync', '/api/runtime/watchdog/sync')}
                      >
                        <ShieldAlert size={16} />
                        Trigger Watchdog
                      </QuantumButton>
                    </RuntimePanel>

                    <RuntimePanel title="Kernel Synchronization" status="online">
                      <p className="text-[11px] text-zinc-500 leading-relaxed italic mb-6">
                        Full kernel re-synchronization. Flushes all ephemeral VRAM and recycles Director Agent.
                      </p>
                      <QuantumButton 
                        variant="secondary"
                        className="w-full"
                        onClick={() => executeAction('Full Runtime Restart', '/api/runtime/restart')}
                      >
                        <RotateCw size={16} />
                        Execute Restart
                      </QuantumButton>
                    </RuntimePanel>
                  </div>
                </NeuralCard>

                {/* Models Register */}
                <NeuralCard 
                   title="Model Neural Topology" 
                   subtitle="Model Inventory & Registry" 
                   icon={<Cpu className="text-emerald-500" />}
                   className="!p-12 md:col-span-2"
                >
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    {registry?.models.map(m => (
                      <div key={m.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all">
                        <div className="flex justify-between items-start mb-6">
                          <div className={`p-3 rounded-xl bg-white/5 text-zinc-500 ${m.status === 'online' ? 'text-emerald-500' : ''}`}>
                            {m.type === 'image' ? <Maximize2 size={16} /> : <MessageSquare size={16} />}
                          </div>
                          <span className={`text-[7px] font-black px-2 py-1 rounded-full uppercase ${m.status === 'online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/10 text-zinc-500'}`}>
                            {m.status}
                          </span>
                        </div>
                        <h6 className="text-[11px] font-bold text-white uppercase mb-1">{m.name}</h6>
                        <p className="text-[7px] font-mono text-zinc-500 uppercase">{m.type.toUpperCase()}_ENGINE</p>
                      </div>
                    ))}
                  </div>
                </NeuralCard>
              </div>

              {/* Central Controller */}
              <div className="lg:col-span-1 p-12 bg-emerald-500 rounded-[4rem] text-black space-y-12 shadow-[0_40px_80px_rgba(16,185,129,0.3)] h-fit sticky top-32">
                <div className="flex items-center gap-4">
                  <ShieldCheck size={28} />
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Director Hub</h3>
                </div>
                <p className="text-[13px] font-medium leading-relaxed">
                  System AURA_CORE is autonomous. Matrix nodes synchronized at {stats?.uptime ? Math.floor(stats.uptime) : 0}s node-time.
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: 'OOM Flush Sequence', icon: Trash2, endpoint: '/api/runtime/oom/flush' },
                    { label: 'Recycle Workers', icon: Network, endpoint: '/api/runtime/workers/restart' },
                    { label: 'Persistent Kernel Sync', icon: HardDrive, endpoint: '/api/memory/sync' },
                    { label: 'Agent System Status', icon: Bot, endpoint: '/api/fashion/registry' }
                  ].map(btn => (
                    <button 
                      key={btn.label}
                      disabled={!!isExecuting}
                      onClick={() => executeAction(btn.label, btn.endpoint)}
                      className="flex items-center justify-between p-6 bg-black text-white rounded-3xl hover:scale-105 transition-all group"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{btn.label}</span>
                      <btn.icon size={18} className="group-hover:rotate-12 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'memory' && (
            <motion.div 
              key="memory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <FashionGrid columns={3}>
                {memory?.trends.map((t: any) => (
                  <NeuralCard key={t.id} title={t.topic} subtitle={`Region: ${t.region}`} glowColor="emerald">
                    <div className="flex items-center gap-2 mb-6">
                      <div className={`w-2 h-2 rounded-full ${t.velocity > 0.8 ? 'bg-emerald-500 animate-ping' : 'bg-neutral-700'}`} />
                      <span className="text-[10px] font-mono text-white">{(t.velocity * 100).toFixed(0)}% VELOCITY</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {t.nodes.map((node: string) => (
                        <span key={node} className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-400">
                          #{node}
                        </span>
                      ))}
                    </div>
                    <QuantumButton variant="primary" className="w-full">
                      Sync to LoRA Train
                    </QuantumButton>
                  </NeuralCard>
                ))}
              </FashionGrid>

              <NeuralCard title="Shared Brand Memory" icon={<Database className="text-emerald-500" />} className="!p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
                  {Object.entries(memory?.brand_dna || {}).map(([name, data]: [string, any]) => (
                    <div key={name} className="p-10 bg-black/40 rounded-[3rem] border border-white/5 flex gap-10">
                       <div className="w-48 aspect-square bg-gradient-to-br from-zinc-800 to-black rounded-full border-4 border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-6xl font-serif italic text-white/10">{name[0]}</span>
                       </div>
                       <div className="flex-1 space-y-6">
                          <h5 className="text-2xl font-black uppercase">{name}</h5>
                          <div className="space-y-4">
                             <div>
                                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Core Aesthetic</p>
                                <p className="text-[13px] text-white font-medium">{data.aesthetic}</p>
                              </div>
                             <div className="flex gap-2">
                                {data.colors.map((c: string) => (
                                  <div key={c} className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                                ))}
                             </div>
                             <div>
                                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Key Materials</p>
                                <p className="text-[11px] text-zinc-400 font-mono italic">{data.materials.join(', ')}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </NeuralCard>
            </motion.div>
          )}

          {activeTab === 'agents' && (
            <motion.div 
              key="agents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FashionGrid columns={3}>
                {registry?.agents.map(agent => (
                  <NeuralCard 
                    key={agent.id} 
                    title={agent.name} 
                    subtitle={`${agent.role} Orchestrator`} 
                    icon={agent.role === 'Director' ? <Bot className="text-emerald-500" /> : <LineChart className="text-blue-500" />}
                  >
                    <div className="flex justify-between items-center mb-10">
                      <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {agent.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-10 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Access Level</span>
                        <span className="text-[11px] font-black text-white uppercase">{agent.permission}</span>
                      </div>
                      <button className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline transition-all">Manage Node</button>
                    </div>
                  </NeuralCard>
                ))}
              </FashionGrid>
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div 
              key="logs"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-[700px]"
            >
              <AIConsole logs={logs} className="h-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
