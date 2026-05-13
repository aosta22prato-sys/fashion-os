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

export const AIOperationsCenter: React.FC<{ lang: Language }> = ({ lang }) => {
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [memory, setMemory] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'matrix' | 'agents' | 'memory' | 'logs'>('matrix');
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const fetchStats = useCallback(async () => {
    try {
      const [regRes, healthRes, memRes] = await Promise.all([
        fetch('/api/fashion/registry'),
        fetch('/api/fashion/runtime/health'),
        fetch('/api/fashion/memory')
      ]);
      const reg = await regRes.json();
      const health = await healthRes.json();
      const mem = await memRes.json();
      setRegistry(reg);
      setStats(health);
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
        setLogs(prev => [`[${data.level || 'INFO'}] ${data.message}`, ...prev].slice(0, 100));
      }
    };

    return () => {
      clearInterval(interval);
      eventSource.close();
    };
  }, [fetchStats]);

  const executeAction = async (action: string, endpoint: string) => {
    setIsExecuting(action);
    setLogs(prev => [`[ACTION] Initializing ${action} directive...`, ...prev]);
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setLogs(prev => [`[SUCCESS] ${data.message}`, ...prev]);
      }
    } catch (e) {
      setLogs(prev => [`[FATAL] Action ${action} aborted by system kernel`, ...prev]);
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
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
              >
                {tab}
              </button>
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
              {/* Telemetry Panels */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Workers Fabric */}
                <div className="p-12 bg-neutral-900/50 border border-white/5 rounded-[4rem] space-y-10 group hover:border-emerald-500/20 transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Distributed GPU Fabric</h4>
                    <Activity size={18} className="text-emerald-500 animate-pulse" />
                  </div>
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
                </div>

                {/* Queue Intelligence */}
                <div className="p-12 bg-neutral-900/50 border border-white/5 rounded-[4rem] flex flex-col justify-between group hover:border-blue-500/20 transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Queue Intelligence</h4>
                    <TrendingUp size={18} className="text-blue-500" />
                  </div>
                  <div className="py-10">
                    <div className="text-7xl font-black text-white">{stats?.queue_depth || 0}</div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase mt-4">Active Neural Requests in Process</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => executeAction('Queue Prioritization', '/api/queue/prioritize')}
                      className="flex-1 py-4 bg-white/5 rounded-2xl text-[9px] font-black uppercase hover:bg-white/10 transition-all"
                    >
                      Prioritize
                    </button>
                    <button 
                      onClick={() => executeAction('Cache Flush', '/api/memory/flush')}
                      className="flex-1 py-4 bg-white/5 rounded-2xl text-[9px] font-black uppercase hover:bg-white/10 transition-all"
                    >
                      Flush Cache
                    </button>
                  </div>
                </div>

                {/* Runtime Controls */}
                <div className="md:col-span-2 p-12 bg-neutral-900/50 border border-white/5 rounded-[4rem] group hover:border-red-500/20 transition-all">
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-4">
                      <ShieldAlert size={18} className="text-red-500" />
                      <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">System Runtime Precision Controls</h4>
                    </div>
                    <span className="text-[8px] font-black text-red-500/50 uppercase tracking-widest px-3 py-1 bg-red-500/10 rounded-full">High Level Access</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-black/40 rounded-3xl border border-white/5 space-y-6">
                      <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                        The GPU Watchdog monitors latent-space temperature and heartbeat. Trigger a manual sync if inference latency exceeds 250ms per token.
                      </p>
                      <button 
                        onClick={() => executeAction('GPU Watchdog Sync', '/api/runtime/watchdog/sync')}
                        className="w-full py-6 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                      >
                        <ShieldAlert size={16} />
                        Trigger GPU Watchdog Sync
                      </button>
                    </div>
                    <div className="p-8 bg-black/40 rounded-3xl border border-white/5 space-y-6">
                      <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                        Full kernel re-synchronization. This will flush all ephemeral VRAM and recycle the Fashion Director Agent.
                      </p>
                      <button 
                        onClick={() => executeAction('Full Runtime Restart', '/api/runtime/restart')}
                        className="w-full py-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                      >
                        <RotateCw size={16} />
                        Execute Core Restart
                      </button>
                    </div>
                  </div>
                </div>

                {/* Models Register */}
                <div className="md:col-span-2 p-12 bg-neutral-900/30 border border-white/5 rounded-[4rem]">
                  <div className="flex items-center gap-4 mb-10">
                    <Cpu size={20} className="text-emerald-500" />
                    <h3 className="text-3xl font-serif italic text-white uppercase tracking-tighter">Model Neural Topology</h3>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
                </div>
              </div>

              {/* Central Controller */}
              <div className="lg:col-span-1 p-12 bg-emerald-500 rounded-[4rem] text-black space-y-12 shadow-[0_40px_80px_rgba(16,185,129,0.3)]">
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
                    { label: 'Watchdog Sync', icon: ShieldAlert, endpoint: '/api/runtime/watchdog/sync' },
                    { label: 'Recycle Workers', icon: Network, endpoint: '/api/runtime/workers/restart' },
                    { label: 'Persistent Kernel Sync', icon: HardDrive, endpoint: '/api/memory/sync' }
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
              {/* Regional Trend Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {memory?.trends.map((t: any) => (
                  <div key={t.id} className="p-12 bg-neutral-900 border border-white/5 rounded-[4rem] flex flex-col justify-between group hover:border-emerald-500/20 transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Region: {t.region}</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${t.velocity > 0.8 ? 'bg-emerald-500 animate-ping' : 'bg-zinc-700'}`} />
                          <span className="text-[10px] font-mono text-white">{(t.velocity * 100).toFixed(0)}% VELOCITY</span>
                        </div>
                      </div>
                      <h4 className="text-4xl font-serif italic text-white uppercase tracking-tighter mb-4">{t.topic}</h4>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {t.nodes.map((node: string) => (
                          <span key={node} className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-400">
                            #{node}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="w-full py-4 bg-white text-black rounded-3xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">
                      Sync to LoRA Train
                    </button>
                  </div>
                ))}
              </div>

              {/* Brand DNA Hub */}
              <div className="p-12 bg-neutral-900/40 border border-white/5 rounded-[4rem]">
                 <div className="flex items-center gap-6 mb-12">
                   <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500"><Database size={24} /></div>
                   <h3 className="text-4xl font-black uppercase tracking-tighter">Shared Brand Memory</h3>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {Object.entries(memory?.brand_dna || {}).map(([name, data]: [string, any]) => (
                      <div key={name} className="p-10 bg-black/40 rounded-[3rem] border border-white/5 flex gap-10">
                         <div className="w-48 aspect-square bg-gradient-to-br from-zinc-800 to-black rounded-full border-4 border-white/10 flex items-center justify-center">
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
              </div>
            </motion.div>
          )}

          {activeTab === 'agents' && (
            <motion.div 
              key="agents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {registry?.agents.map(agent => (
                <div key={agent.id} className="p-12 bg-neutral-900 border border-white/5 rounded-[4rem] group hover:border-emerald-500/20 transition-all">
                  <div className="flex justify-between items-start mb-10">
                    <div className={`p-6 rounded-3xl ${agent.role === 'Director' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-zinc-500'}`}>
                      {agent.role === 'Director' ? <Bot size={32} /> : agent.role === 'Trend' ? <LineChart size={32} /> : <Activity size={32} />}
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 block mb-2">Matrix Alpha</span>
                      <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {agent.status}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-3xl font-serif italic text-white uppercase tracking-tighter mb-2">{agent.name}</h4>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-10">{agent.role} Orchestrator</p>
                  <div className="flex items-center justify-between pt-10 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Access Level</span>
                      <span className="text-[11px] font-black text-white uppercase">{agent.permission}</span>
                    </div>
                    <button className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline transition-all">Manage Node</button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div 
              key="logs"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-[700px] bg-neutral-950 border border-white/5 rounded-[4rem] overflow-hidden flex flex-col"
            >
              <div className="p-8 bg-black/60 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Terminal size={20} className="text-emerald-400" />
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Neural Operations Stream</span>
                </div>
                <button onClick={() => setLogs([])} className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Clear Matrix</button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 space-y-3 font-mono custom-scrollbar bg-neutral-950">
                {logs.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-700">
                    <Activity size={40} className="mb-6 opacity-20" />
                    <p className="text-[10px] uppercase tracking-[0.5em]">Awaiting Data Stream...</p>
                  </div>
                )}
                {logs.map((log, i) => (
                  <div key={i} className="text-[13px] tracking-tight flex gap-6 group hover:bg-white/5 p-1 transition-colors">
                    <span className="text-zinc-800 shrink-0 select-none">[{i+1}]</span>
                    <span className={`
                      ${log.includes('[AI]') ? 'text-cyan-400' : 
                        log.includes('[ACTION]') ? 'text-white font-bold' :
                        log.includes('[SUCCESS]') ? 'text-emerald-400' :
                        log.includes('[FATAL]') ? 'text-red-500' :
                        'text-emerald-500/60'}
                    `}>
                      {log}
                    </span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
