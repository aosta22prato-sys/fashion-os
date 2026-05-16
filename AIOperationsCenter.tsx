import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { FASHION_SOURCES } from './src/constants';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Cpu, Activity, Server, Network, Brain,
  Search, BarChart3, TrendingUp, Workflow, Link,
  CheckCircle2, AlertCircle, Terminal, Camera, Download,
  Maximize2, MessageSquare, ShieldAlert, Database,
  User, Power, RotateCw, Square, Play, HardDrive, 
  RefreshCw, Bot, XCircle, LineChart, ShieldCheck, Trash2,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { Registry, OpsDashboard, Language, Agent } from './types';

// ModaUI System Imports
import { QuantumButton } from './resources/js/fashion-os/components/QuantumButton';
import { NeuralCard } from './resources/js/fashion-os/components/NeuralCard';
import { RuntimePanel } from './resources/js/fashion-os/components/RuntimePanel';
import { AIConsole } from './resources/js/fashion-os/components/AIConsole';
import { FashionGrid } from './resources/js/fashion-os/components/FashionGrid';
import { AgentCard } from './resources/js/fashion-os/components/AgentCard';
import { TrendGraph } from './resources/js/fashion-os/components/TrendGraph';
import { NeuralTryOn } from './src/components/NeuralTryOn';
import { DigitalHumanStudio } from './src/components/DigitalHumanStudio';

import { translations } from './services/translationService';

interface AIOperationsCenterProps {
  lang: Language;
  preloadedDesign?: string | null;
  onDesignUsed?: () => void;
}

export const AIOperationsCenter: React.FC<AIOperationsCenterProps> = ({ 
  lang, 
  preloadedDesign,
  onDesignUsed 
}) => {
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [brain, setBrain] = useState<any>(null);
  const [memory, setMemory] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'matrix' | 'tryon' | 'studio' | 'agents' | 'memory' | 'logs'>('matrix');
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<any>(null);

  const filteredResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    const results: { type: string, name: string, id: string }[] = [];

    if (registry) {
      registry.agents.forEach(a => {
        if (a.name.toLowerCase().includes(q)) results.push({ type: 'Agent', name: a.name, id: a.id });
      });
      registry.models.forEach(m => {
        if (m.name.toLowerCase().includes(q)) results.push({ type: 'Model', name: m.name, id: m.id });
      });
    }
    if (memory) {
      memory.trends.forEach((t: any) => {
        if (t.topic.toLowerCase().includes(q)) results.push({ type: 'Trend', name: t.topic, id: t.topic });
      });
    }
    return results;
  }, [searchQuery, registry, memory]);

  const handleQuickScrape = async (source: any) => {
    setScrapeUrl(source.url);
    setSelectedSource(source);
    await executeAction(`Scrape ${source.url}`, `/api/fashion/scrape?url=${encodeURIComponent(source.url)}&category=${encodeURIComponent(source.category)}`);
  };

  const handleScrape = async () => {
    if (!scrapeUrl) return;
    await executeAction(`Scrape ${scrapeUrl}`, '/api/fashion/scrape?url=' + encodeURIComponent(scrapeUrl));
  };

  useEffect(() => {
    if (preloadedDesign) {
      setActiveTab('tryon');
    }
  }, [preloadedDesign]);

  const fetchBrain = useCallback(async () => {
    try {
      const res = await fetch('/api/system/brain');
      const data = await res.json();
      setBrain(data);
    } catch (e) {
      console.error("Brain sync failed", e);
    }
  }, []);

  const runCommand = async (command: string, args: any = {}) => {
    setIsExecuting(command);
    try {
      const res = await fetch('/api/system/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, args })
      });
      const data = await res.json();
      if (data.success) {
        fetchStats();
        fetchBrain();
      }
    } finally {
      setTimeout(() => setIsExecuting(null), 1000);
    }
  };

  const t = translations[lang].ops;

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
      setStats(healthData.health || healthData); 
      setMemory(mem);
    } catch (e) {
      console.error("Ops sync failed", e);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchBrain();
    const interval = setInterval(() => {
      fetchStats();
      fetchBrain();
    }, 5000);

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
    <div className="min-h-screen bg-background text-text p-6 font-sans">
      {/* Cinematic Header */}
      <div className="max-w-7xl mx-auto py-20 px-6 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">{t.director}</span>
            </div>
            <h2 className="text-8xl font-serif italic text-white uppercase tracking-tighter leading-[0.8] mb-8">
               Ops<br/><span className="not-italic font-black text-white/5 uppercase">{t.matrix}</span>
            </h2>
          </div>
          <div className="flex gap-4">
             <div className="relative">
                <input
                  type="text"
                  placeholder="Search system..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder:text-zinc-500 w-48"
                />
                {filteredResults.length > 0 && (
                   <div className="absolute top-12 left-0 w-64 bg-neutral-900 border border-white/10 rounded-2xl p-4 z-[200] max-h-64 overflow-y-auto">
                      {filteredResults.map(res => (
                         <div key={res.id} className="text-xs text-zinc-300 py-1 cursor-pointer hover:text-primary">
                            {res.name} <span className="text-[9px] text-zinc-600">[{res.type}]</span>
                         </div>
                      ))}
                   </div>
                )}
             </div>
             {['matrix', 'tryon', 'studio', 'agents', 'memory', 'logs'].map((tab) => (
               <QuantumButton
                 key={tab}
                 variant={activeTab === tab ? 'primary' : 'secondary'}
                 onClick={() => setActiveTab(tab as any)}
                 className="!rounded-full px-8"
               >
                 {(translations[lang].ops as any)[tab] || tab}
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
                {/* Workflow Hubs */}
                <div className="md:col-span-2 grid grid-cols-1 gap-8">
                  {/* Intelligence Hub */}
                  <NeuralCard 
                    title="Neural Intelligence"
                    subtitle="Trend Ingestion & Source Intelligence"
                    icon={<Brain className="text-primary" />}
                    className="!p-10"
                  >
                     <div className="relative group mb-6">
                         {isExecuting === `Scrape ${scrapeUrl}` && (
                             <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                             </div>
                         )}
                         <input 
                           placeholder="Paste source URL for trend ingestion..."
                           value={scrapeUrl}
                           onChange={(e) => setScrapeUrl(e.target.value)}
                           className={`w-full bg-neutral-800 dark:bg-neutral-800 border-none rounded-2xl py-4 text-xs italic font-serif text-white focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-600 shadow-inner ${isExecuting === `Scrape ${scrapeUrl}` ? 'px-10' : 'px-5'}`}
                         />
                         <button 
                            onClick={handleScrape}
                            disabled={isExecuting === `Scrape ${scrapeUrl}`}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary/20 text-primary hover:bg-primary hover:text-black rounded-xl transition-all"
                         >
                            {isExecuting === `Scrape ${scrapeUrl}` ? (
                              <RotateCw size={14} className="animate-spin" />
                            ) : (
                              <Workflow size={14} />
                            )}
                         </button>
                      </div>
                      <div className="space-y-4">
                        {['Luxury', 'Avant-Garde', 'Media'].map(category => (
                          <div key={category}>
                             <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-2">{category}</p>
                             <div className="grid grid-cols-2 gap-2">
                                {FASHION_SOURCES.filter(s => s.category === category).map(source => (
                                   <button
                                      key={source.url}
                                      onClick={() => handleQuickScrape(source)}
                                      className="px-3 py-2 bg-white/5 hover:bg-primary/20 rounded-xl text-[9px] font-bold text-zinc-300 hover:text-white transition-all text-left"
                                   >
                                      {source.name}
                                   </button>
                                ))}
                             </div>
                          </div>
                        ))}
                      </div>
                      
                      {selectedSource && (
                        <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                           <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Brand DNA: {selectedSource.name}</p>
                           <div className="text-[10px] text-zinc-400 space-y-2">
                              <p><span className="text-zinc-600">Aesthetic:</span> {selectedSource.dna.aesthetic}</p>
                              <p><span className="text-zinc-600">Colors:</span> {selectedSource.dna.colors.join(', ')}</p>
                              <p><span className="text-zinc-600">Materials:</span> {selectedSource.dna.materials.join(', ')}</p>
                           </div>
                        </div>
                      )}
                      
                      </div>
                  </NeuralCard>

                  {/* Studio & Try-On Access */}
                  <div className="grid grid-cols-2 gap-8">
                      <NeuralCard title="Design Studio" icon={<Cpu className="text-primary" />} className="!p-8 !justify-center">
                          <p className="text-xs text-zinc-400 mb-6 italic">Generative design & latent space exploration.</p>
                          <QuantumButton variant="primary" onClick={() => setActiveTab('studio')} className="w-full">Launch Studio</QuantumButton>
                      </NeuralCard>
                      <NeuralCard title="Neural Try-On" icon={<Camera className="text-primary" />} className="!p-8 !justify-center">
                          <p className="text-xs text-zinc-400 mb-6 italic">High-fidelity 3D fit simulation.</p>
                          <QuantumButton variant="primary" onClick={() => setActiveTab('tryon')} className="w-full">Launch Try-On</QuantumButton>
                      </NeuralCard>
                  </div>
                </div>

                {/* Workers Fabric & Runtime */}
                <div className="md:col-span-2 grid grid-cols-1 gap-8">
                  {/* Workers Fabric */}
                  <NeuralCard 
                    title={t.gpuFabric} 
                    subtitle={t.clusterSync} 
                    icon={<Activity className="text-primary animate-pulse" />}
                    className="!p-10"
                  >
                    <div className="space-y-4">
                      {registry?.workers.map(w => (
                        <div key={w.id} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black text-text uppercase">
                            <span>{w.id}</span>
                            <span className={w.status === 'busy' ? 'text-amber-500' : 'text-primary'}>{w.load}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${w.load}%` }}
                              className={`h-full transition-all duration-500 aurora-progress`} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </NeuralCard>
                  
                  {/* Runtime Controls */}
                  <NeuralCard 
                    title={t.runtimeControls} 
                    subtitle={t.highLevelAccess} 
                    icon={<ShieldAlert className="text-rose-500" />}
                    className="!p-10"
                  >
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'runtime.restart_worker', label: 'Restart' },
                            { id: 'runtime.clear_vram', label: 'Flush VRAM' },
                            { id: 'system.health_check', label: 'Health Check' },
                            { id: 'system.brain_cycle_trigger', label: 'Brain Cycle' }
                          ].map(cmd => (
                            <button
                              key={cmd.id}
                              onClick={() => runCommand(cmd.id)}
                              disabled={!!isExecuting}
                              className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-left"
                            >
                              <span className="text-[9px] font-black uppercase text-zinc-300">{cmd.label}</span>
                            </button>
                          ))}
                       </div>
                  </NeuralCard>
                </div>


                {/* Models Register */}
                <NeuralCard 
                   title={t.modelsTopology} 
                   subtitle={t.modelsInventory} 
                   icon={<Cpu className="text-primary" />}
                   className="!p-12 md:col-span-2"
                >
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    {registry?.models.map(m => (
                      <div key={m.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-primary/20 transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-xl bg-white/5 text-muted ${m.status === 'online' ? 'text-primary' : ''}`}>
                              {m.type === 'image' ? <Maximize2 size={16} /> : <MessageSquare size={16} />}
                            </div>
                            <span className={`text-[7px] font-black px-2 py-1 rounded-full uppercase ${m.status === 'online' ? 'bg-primary/10 text-primary' : 'bg-white/10 text-muted'}`}>
                              {m.status}
                            </span>
                          </div>
                          <h6 className="text-[11px] font-bold text-text uppercase mb-1">{m.name}</h6>
                          <p className="text-[7px] font-mono text-muted uppercase mb-6">{m.type.toUpperCase()}_{translations[lang].common.type === '类型' ? '引擎' : 'ENGINE'}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => executeAction(`Load ${m.name}`, `/api/models/${m.id}/load`)}
                            disabled={m.status === 'online' || !!isExecuting}
                            className={`flex-1 py-3 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all ${m.status === 'online' ? 'bg-zinc-800 text-zinc-600' : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'}`}
                          >
                            {t.load}
                          </button>
                          <button 
                            onClick={() => executeAction(`Unload ${m.name}`, `/api/models/${m.id}/unload`)}
                            disabled={m.status === 'idle' || !!isExecuting}
                            className={`flex-1 py-3 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all ${m.status === 'idle' ? 'bg-zinc-800 text-zinc-600' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20'}`}
                          >
                            {t.unload}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </NeuralCard>
              </div>

              {/* Central Controller */}
              <div className="lg:col-span-1 p-12 bg-primary rounded-[4rem] text-black space-y-12 shadow-[0_12px_24px_rgba(0,184,217,0.2)] h-fit sticky top-32">
                <div className="flex items-center gap-4">
                  <ShieldCheck size={28} />
                  <h3 className="text-3xl font-black uppercase tracking-tighter">{t.directorHub}</h3>
                </div>
                <p className="text-[13px] font-medium leading-relaxed">
                  {t.autonomous.replace('AURA_CORE', 'AURA_CORE')} {t.nodeTime}: {stats?.uptime ? Math.floor(stats.uptime) : 0}s.
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: t.oomFlush, icon: Trash2, endpoint: '/api/runtime/oom/flush', alert: true },
                    { label: t.recycleWorkers, icon: Network, endpoint: '/api/runtime/workers/restart' },
                    { label: t.kernelSyncPersist, icon: HardDrive, endpoint: '/api/memory/sync' },
                    { label: t.agentStatus, icon: Bot, endpoint: '/api/fashion/registry' }
                  ].map(btn => (
                    <button 
                      key={btn.label}
                      disabled={!!isExecuting}
                      onClick={() => executeAction(btn.label, btn.endpoint)}
                      className={`flex items-center justify-between p-6 rounded-3xl transition-all group overflow-hidden relative ${
                        btn.alert 
                        ? 'bg-black text-red-500 hover:bg-neutral-900 border border-red-500/20 shadow-[0_10px_30px_rgba(239,68,68,0.1)]' 
                        : 'bg-black text-text hover:bg-neutral-900 border border-white/5'
                      } active:scale-95`}
                    >
                      <div className="flex flex-col items-start text-left">
                        <span className="text-[10px] font-black uppercase tracking-widest">{btn.label}</span>
                        {btn.alert && <span className="text-[7px] font-mono uppercase mt-1 opacity-50 underline">{t.systemDirective} 0x1F</span>}
                      </div>
                      <btn.icon size={18} className={`transition-transform group-hover:rotate-12 ${btn.alert ? 'animate-pulse' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tryon' && (
            <motion.div 
              key="tryon"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <NeuralTryOn preloadedDesign={preloadedDesign} />
            </motion.div>
          )}

          {activeTab === 'studio' && (
            <motion.div 
              key="studio"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <DigitalHumanStudio />
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
              <FashionGrid columns={4}>
                <div className="col-span-1 lg:col-span-1 space-y-6">
                  <NeuralCard title="Brain Hub" subtitle="Core Cognitive State" glowColor="amber">
                    <div className="space-y-6">
                       <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-black text-zinc-500 uppercase">Trend Memory</span>
                          <span className="text-2xl font-black text-white">{brain?.trend_memory?.toLocaleString() || '0'} Nodes</span>
                       </div>
                       <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-black text-zinc-500 uppercase">Style Graph</span>
                          <span className="text-2xl font-black text-white">{brain?.style_graph_nodes?.toLocaleString() || '0'} Points</span>
                       </div>
                       <div className="w-full h-px bg-white/5" />
                       <div className="flex flex-col gap-2">
                          <span className="text-[8px] font-black text-zinc-500 uppercase">Top Trends</span>
                          <div className="flex flex-wrap gap-1">
                             {brain?.top_trends?.map((t: string) => (
                               <span key={t} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-bold">#{t}</span>
                             ))}
                          </div>
                       </div>
                       <QuantumButton variant="glow" onClick={() => runCommand('system.brain_cycle_trigger')} className="w-full">
                          Force Brain Cycle
                       </QuantumButton>
                    </div>
                  </NeuralCard>
                </div>

                <TrendGraph 
                  title={t.trendVelocity}
                  data={memory?.trends.map((t: any) => ({ label: t.topic, value: t.velocity })) || []}
                  className="md:col-span-2 h-full"
                />
                <NeuralCard title={t.hubSummary} subtitle={t.intelligenceState} glowColor="blue">
                   <div className="space-y-6">
                      <div className="p-4 bg-white/5 rounded-2xl flex justify-between">
                         <span className="text-[10px] font-black text-muted uppercase">{t.activeTrends}</span>
                         <span className="text-xl font-black text-text">{memory?.trends.length}</span>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl flex justify-between">
                         <span className="text-[10px] font-black text-muted uppercase">{t.syncState}</span>
                         <span className="text-xl font-black text-primary">{t.optimal}</span>
                      </div>
                      <QuantumButton variant="glow" className="w-full" onClick={() => executeAction('Global Sync', '/api/memory/sync')}>
                         {t.forceSync}
                      </QuantumButton>
                   </div>
                </NeuralCard>
              </FashionGrid>

              <FashionGrid columns={3}>
                {memory?.trends.map((t_item: any) => (
                  <NeuralCard key={t_item.id} title={t_item.topic} subtitle={`Region: ${t_item.region}`} glowColor="primary">
                    <div className="flex items-center gap-2 mb-6">
                      <div className={`w-2 h-2 rounded-full ${t_item.velocity > 0.8 ? 'bg-primary animate-ping' : 'bg-neutral-700'}`} />
                      <span className="text-[10px] font-mono text-text">{(t_item.velocity * 100).toFixed(0)}% VELOCITY</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {t_item.nodes.map((node: string) => (
                        <span key={node} className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-muted">
                          #{node}
                        </span>
                      ))}
                    </div>
                    <QuantumButton variant="primary" className="w-full">
                      {t.syncLoRA}
                    </QuantumButton>
                  </NeuralCard>
                ))}
              </FashionGrid>

              <NeuralCard title={t.brandMemory} icon={<Database className="text-primary" />} className="!p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
                  {Object.entries(memory?.brand_dna || {}).map(([brandName, data]: [string, any]) => (
                    <div key={brandName} className="p-10 bg-card rounded-[3rem] border border-border flex gap-10">
                       <div className="w-48 aspect-square bg-gradient-to-br from-neutral-800 to-black rounded-full border-4 border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-6xl font-serif italic text-white/10">{brandName[0]}</span>
                       </div>
                       <div className="flex-1 space-y-6">
                          <h5 className="text-2xl font-black uppercase">{brandName}</h5>
                          <div className="space-y-4 text-left">
                             <div>
                                <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">{translations[lang].common.coreAesthetic}</p>
                                <p className="text-[13px] text-text font-medium">{data.aesthetic}</p>
                              </div>
                             <div className="flex gap-2">
                                {data.colors.map((c: string) => (
                                  <div key={c} className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                                ))}
                             </div>
                             <div>
                                <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">{translations[lang].common.keyMaterials}</p>
                                <p className="text-[11px] text-muted font-mono italic">{data.materials.join(', ')}</p>
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
                  <AgentCard 
                    key={agent.id} 
                    agent={agent} 
                    onManage={() => executeAction(`Scale ${agent.name}`, '/api/fashion/registry')} 
                    lang={lang}
                  />
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
              <AIConsole logs={logs} className="h-full" lang={lang} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
