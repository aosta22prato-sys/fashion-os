/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import { 
  Search, Camera, MessageSquare, X, ChevronRight, Zap, Sparkles, Upload, Filter,
  ArrowRight, TrendingUp, Tag, Maximize2, Minimize2, Volume2, VolumeX, Share2,
  Download, Check, Send, Twitter, Facebook, Link, LayoutGrid, Palette, Settings,
  User, Globe, Library, Activity, Server, ChevronLeft, MapPin, Cpu, TrendingDown,
  Shirt, CheckCircle2, Trash2, ZoomIn, History, Timer, Box, Layers, RefreshCw,
  Radio, Database, Network, ChevronDown, List, Code, HardDrive, Terminal, Plus,
  Shield, Lock, Copy, MoreHorizontal, Monitor, Layout, Rocket, ShieldCheck, FileText,
  Bot, Power
} from 'lucide-react';

import { AIOperationsCenter } from './AIOperationsCenter';
import { NeuralModelViewer } from './src/components/NeuralModelViewer';
import { AppState, FashionItem, ChatMessage, Theme, Language, UserRole } from './types';
import { MOCK_FASHION_GALLERY, FASHION_CATEGORIES, TRENDING_MOODBOARD, fileToBase64, optimizeImage } from './utils';
import { appBus } from './services/appBus';
import { 
  getFashionAssistantResponse, 
  generateTextImage, 
  getRuntimeHealth,
  getSystemRegistry,
  getGenerationHistory
} from './services/geminiService';
import { ModaTranslator, translations, getBrowserLanguage } from './services/translationService';
import { auth } from './services/firebase';
import { onAuthStateChanged, signInAnonymously, User as FirebaseUser } from 'firebase/auth';
import { fashionItemService } from './services/fashionItemService';

const FashionItemCard: React.FC<{ 
  item: FashionItem; 
  idx: number; 
  lang: Language; 
  onClick: () => void;
}> = ({ item, idx, lang, onClick }) => {
  const [displayTitle, setDisplayTitle] = useState(item.style);

  useEffect(() => {
    let active = true;
    const translate = async () => {
      const translated = await ModaTranslator.fetchAITranslation(item.style, lang);
      if (active) setDisplayTitle(translated);
    };
    translate();
    return () => { active = false; };
  }, [item.style, lang]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
       <div className="aspect-[3/4] relative overflow-hidden rounded-[3rem] border border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.2)] transition-all">
          <SafeImage src={item.imageUrl} alt={item.style} lang={lang} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 dark-suppress" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          <div className="absolute top-8 left-8 right-8 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-20px] group-hover:translate-y-0">
             <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-[10px] font-black uppercase text-white tracking-widest neon-purple">
                #{item.category}
             </div>
             <div className="p-4 bg-primary rounded-full text-black shadow-[0_0_20px_rgba(0,184,217,0.5)] hover:scale-110 transition-all dark:bg-primary">
                <Zap size={20} className="fill-current" />
             </div>
          </div>

          <div className="absolute bottom-10 left-10 right-10 opacity-0 group-hover:opacity-100 transition-all translate-y-20 group-hover:translate-y-0 duration-700">
                             <h3 className="text-3xl font-serif italic text-white mb-6 leading-tight zh:text-3xl zh:font-bold en:text-2xl en:font-normal en:tracking-tight en:break-words line-clamp-2 elastic-text">
                                {displayTitle}
                             </h3>
                             <div className="grid grid-cols-2 gap-3 en:grid-cols-1">
                                <button className="px-3 py-4 bg-primary text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,184,217,0.3)]">
                                   {translations[lang].gallery.remix}
                                </button>
                                <button className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center justify-center">
                                   <Download size={18} />
                                </button>
                             </div>
          </div>
       </div>
       <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
             <span className="text-[10px] font-black uppercase tracking-widest neon-cyan">{translations[lang].common.neuralMatch}_88%</span>
             <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-white/10" />
          </div>
          <div className="flex justify-between items-end">
             <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-sm font-serif italic text-zinc-400 uppercase tracking-tighter mb-1">{translations[lang].gallery.globalArtifact}</h4>
                <p className="font-bold dark:text-white leading-none zh:text-2xl en:text-xl en:tracking-tight en:break-words truncate elastic-text">
                   {displayTitle}
                </p>
             </div>
             <div className="text-right flex-shrink-0">
                <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{translations[lang].gallery.liquidity}</h4>
                <p className="text-xl font-mono font-bold text-primary leading-none neon-cyan">
                   {ModaTranslator.formatCurrency(item.price || 299, lang)}
                </p>
             </div>
          </div>
       </div>
    </motion.div>
  );
};

// --- Types & Constants ---

const API = import.meta.env.VITE_API_BASE || '';

enum TaskStatus {
  QUEUED = 'queued',
  LOADING_MODEL = 'loading_model',
  GENERATING = 'generating',
  SAVING = 'saving',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PROCESSING = 'processing' // keeping for backward compatibility
}

interface FashionTask {
  id: string;
  type: string;
  status: TaskStatus;
  progress: number;
  result_url?: string;
  metadata?: any;
  created_at: number;
}

// --- Custom Hooks ---

const useTaskSystem = () => {
  const [tasks, setTasks] = useState<FashionTask[]>([]);
  const [activeTasksCount, setActiveTasksCount] = useState(0);

  const createTask = async (type: string, payload: any) => {
    try {
      const isTryOn = type === 'TRY_ON';
      const endpoint = isTryOn ? `${API}/api/fashion/tryon` : `${API}/api/fashion/generate`;
      
      let body;
      let headers: any = {};

      if (isTryOn) {
        const formData = new FormData();
        // Convert base64 to Blob if needed, or assume it might already be handled
        // If the payload from LabSection is base64, we need to convert it
        const personBlob = await (await fetch(payload.person_image)).blob();
        const garmentBlob = await (await fetch(payload.garment_image)).blob();
        formData.append('person_image', personBlob);
        formData.append('garment_image', garmentBlob);
        body = formData;
        // No Content-Type header needed for FormData, fetch adds it with boundary
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(payload);
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body
      });
      const data = await res.json();
      return data.generation_id || data.task_id;
    } catch (e) {
      console.error("Kernel Task creation failed", e);
      return null;
    }
  };

  // SSE Lifecycle Integration
  useEffect(() => {
    let eventSource: EventSource | null = null;

    const setupSSE = () => {
      try {
        eventSource = new EventSource(`${API}/api/fashion/runtime/stream`);
        
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'task_update') {
            setTasks(prev => {
              const index = prev.findIndex(t => t.id === data.task.id);
              if (index === -1) return [data.task, ...prev];
              const next = [...prev];
              next[index] = data.task;
              return next;
            });
          }
        };

        eventSource.onerror = (err) => {
          console.warn("SSE link unstable, attempting failover to polling", err);
          eventSource?.close();
        };
      } catch (e) {
        console.error("Critical stream failure", e);
      }
    };

    setupSSE();
    return () => eventSource?.close();
  }, []);

  // Polling Fallback (Legacy / Robustness)
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      const pendingTasks = tasks.filter(t => t.status !== TaskStatus.COMPLETED && t.status !== TaskStatus.FAILED);
      if (pendingTasks.length === 0) return;

      const updatedTasks = [...tasks];
      let hasChanges = false;

      for (let i = 0; i < updatedTasks.length; i++) {
        const task = updatedTasks[i];
        if (task.status === TaskStatus.COMPLETED || task.status === TaskStatus.FAILED) continue;

        try {
          const res = await fetch(`${API}/api/fashion/tasks/${task.id}`);
          if (res.ok) {
            const remoteTask = await res.json();
            if (JSON.stringify(remoteTask) !== JSON.stringify(task)) {
              updatedTasks[i] = remoteTask;
              hasChanges = true;
            }
          }
        } catch (e) {
          console.error(`Polling task ${task.id} failed`, e);
        }
      }

      if (hasChanges) {
        setTasks(updatedTasks);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [tasks]);

  useEffect(() => {
    setActiveTasksCount(tasks.filter(t => t.status !== TaskStatus.COMPLETED && t.status !== TaskStatus.FAILED).length);
  }, [tasks]);

  const addLocalTask = (id: string, type: string) => {
    setTasks(prev => [{
      id,
      type,
      status: TaskStatus.QUEUED,
      progress: 0,
      created_at: Date.now()
    }, ...prev]);
  };

  return { tasks, activeTasksCount, createTask, addLocalTask };
};

// --- Components ---

const TaskNotification: React.FC<{ task: FashionTask }> = ({ task }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 w-72 mb-3 shadow-2xl"
  >
     <div className="relative w-10 h-10 flex-shrink-0">
       <div className={`absolute inset-0 rounded-full border-2 border-white/5 ${task.status === TaskStatus.PROCESSING ? 'border-t-primary animate-spin' : ''}`} />
       <div className="absolute inset-0 flex items-center justify-center">
          {task.status === TaskStatus.COMPLETED ? <CheckCircle2 className="text-primary" size={20} /> : <Zap size={18} className="text-primary/50" />}
       </div>
    </div>
    <div className="flex-1 overflow-hidden">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{task.type}</span>
        <span className="text-[10px] font-mono text-primary">{task.progress}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
         <motion.div 
           className="h-full aurora-progress"
           initial={{ width: 0 }}
           animate={{ width: `${task.progress}%` }}
         />
      </div>
    </div>
  </motion.div>
);

const FashionOSConsole: React.FC<{ 
  health: any; 
  status: 'online' | 'offline' | 'busy' | string; 
  t: any; 
  registry?: any;
  globalQueue?: { id: string, progress: number, status: string } | null;
  lang: Language;
}> = ({ health, status, t, registry, globalQueue, lang }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[500] pointer-events-none">
      {/* Mini Status Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="mx-auto max-w-4xl bg-black/80 backdrop-blur-3xl border-t border-x border-white/10 rounded-t-[2rem] px-8 py-3 flex items-center justify-between pointer-events-auto cursor-pointer group shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
             <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-primary animate-pulse' : 'bg-red-500'}`} />
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70">
               {translations[lang].common.sysStatus}: <span className={status === 'online' ? 'text-primary' : 'text-red-500'}>{(translations[lang].common as any)[status] || status}</span>
             </span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="hidden md:flex items-center gap-6">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{translations[lang].common.gpu}: {health?.gpu_runtime ? translations[lang].common.armed : translations[lang].common.offline}</span>
            
            {globalQueue && (
              <div className="flex items-center gap-3 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                <Rocket size={10} className="text-primary animate-pulse" />
                <span className="text-[8px] font-black text-primary uppercase tracking-widest">{globalQueue.status}</span>
                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full aurora-progress transition-all duration-300" style={{ width: `${globalQueue.progress}%` }} />
                </div>
              </div>
            )}

            <span className="flex items-center gap-1.5 text-[9px] font-mono text-primary/80">
              <Cpu size={10} /> {health?.gpu_stats?.raw || translations[lang].common.idle}
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-mono text-purple-400/80">
              <Server size={10} /> {health?.workers?.active || 0} {translations[lang].common.workers}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1 text-[8px] font-mono text-white/30 uppercase">
              <Database size={10} className={health?.redis ? 'text-primary' : 'text-red-500'} /> {translations[lang].common.redis}
           </div>
           <button className="p-2 hover:bg-white/10 rounded-full transition-all text-white/50 group-hover:text-white">
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                <ChevronDown size={14} />
              </motion.div>
           </button>
        </div>
      </motion.div>

      {/* Detailed Console Tray */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mx-auto max-w-4xl bg-black/95 backdrop-blur-3xl border-x border-white/10 overflow-hidden pointer-events-auto shadow-2xl"
          >
            <div className="p-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Ollama Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <Radio size={12} className={health?.python_runtime ? 'text-primary' : 'text-red-500'} />
                  {translations[lang].ops.orchestrator}
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-serif italic text-white leading-tight">Qwen2.5:7b</p>
                  <p className="text-[9px] font-mono text-zinc-500 uppercase">{translations[lang].ops.state}: {translations[lang].common.active}</p>
                </div>
              </div>

              {/* GPU Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <Zap size={12} className="text-yellow-500" />
                  {translations[lang].ops.gpuFabric}
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-serif italic text-white leading-tight truncate">{health?.gpu_stats?.raw || 'N/A'}</p>
                  <div className="flex items-center gap-3">
                     <span className="text-[9px] font-mono text-primary">{translations[lang].common.online}</span>
                  </div>
                </div>
              </div>

              {/* Infrastructure Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <Database size={12} className="text-blue-500" />
                  {translations[lang].ops.clusterSync}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-white flex justify-between">
                    {translations[lang].common.redis} <span className={health?.redis ? "text-primary uppercase" : "text-red-500 uppercase"}>{health?.redis ? translations[lang].common.online : translations[lang].common.offline}</span>
                  </p>
                  <p className="text-[10px] font-medium text-white flex justify-between">
                    {translations[lang].common.workers} <span className="text-primary uppercase">{health?.workers?.active} {translations[lang].common.ready}</span>
                  </p>
                </div>
              </div>

              {/* Registry Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <Network size={12} className="text-purple-500" />
                  {translations[lang].ops.matrix}
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-serif italic text-white leading-none">{translations[lang].ops.optimal}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 underline decoration-purple-500 underline-offset-4">{translations[lang].common.streamReady}</p>
                </div>
              </div>
            </div>

            {/* Model Registry List */}
            {registry && (
               <div className="px-10 pb-10">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                     <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30 mb-2">
                        <List size={12} /> {translations[lang].ops.modelsInventory}
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {registry.models?.map((m: any) => (
                           <div key={m.id} className="p-3 bg-black/40 rounded-xl border border-white/5">
                              <p className="text-[10px] font-black text-white uppercase truncate">{m.id}</p>
                              <p className="text-[8px] text-zinc-500 mt-1 uppercase tracking-widest">{m.type}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            <div className="bg-white/5 py-4 px-10 flex justify-between items-center border-t border-white/10">
               <div className="flex items-center gap-4 text-[8px] font-mono text-zinc-500">
                  <span>{translations[lang].common.proto}: {translations[lang].system.protoV2}</span>
                  <span>{translations[lang].common.build}: {translations[lang].system.buildProduction}</span>
                  <span>{translations[lang].common.node}: {translations[lang].system.nodeLocal}</span>
               </div>
               <div className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/50 animate-pulse">
                  {translations[lang].system.kernelAuthorized}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SafeImage: React.FC<{ 
  src: string; 
  alt: string; 
  className?: string;
  onLoad?: () => void;
  lang: Language;
}> = ({ src, alt, className, onLoad, lang }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden group/img ${className}`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
          <div className="shimmer-dark absolute inset-0" />
          <div className="w-8 h-8 border-[1px] border-zinc-200 border-t-zinc-800 dark:border-zinc-800 dark:border-t-white rounded-full animate-spin z-10" />
        </div>
      )}
      {hasError ? (
        <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-900 flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-800 p-4 text-center">
          <Camera size={24} className="mb-2 opacity-30" />
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] leading-tight opacity-50">{translations[lang].system.archiveIntegrityFailure}</span>
        </div>
      ) : (
        <motion.img 
          src={src} 
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.8 }}
          className={`${className} object-cover dark:brightness-95 hover:dark:brightness-100 transition-all duration-500`}
          onLoad={() => {
            setIsLoading(false);
            onLoad?.();
          }}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
};



const SuperShareHub: React.FC<{ 
  data: any; 
  onClose: () => void; 
  onPush: (target: string, data: any) => void;
  lang: Language;
}> = ({ data, onClose, onPush, lang }) => {
  const [permission, setPermission] = useState<'public' | 'private' | 'team'>('team');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShare = async (target: string) => {
    setIsProcessing(true);
    // Simulate background worker compression/upload
    setTimeout(() => {
      onPush(target, data);
      setIsProcessing(false);
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1200] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        className="bg-zinc-50 dark:bg-zinc-950 w-full max-w-4xl rounded-[4rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_120px_rgba(0,0,0,0.8)] border border-white/5"
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Preview */}
        <div className="md:w-2/5 relative bg-zinc-100 dark:bg-black group overflow-hidden border-r border-white/5">
           <img 
             src={data.url || data.imageUrl || (data.moodboard && data.moodboard[0]?.url)} 
             className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-1000" 
             alt="Hub Preview" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
           <div className="absolute bottom-12 left-12">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block underline">{translations[lang].system.hubReady}</span>
              <h2 className="text-4xl font-serif italic text-white leading-tight uppercase tracking-tighter">
                Quantum<br/>Distribution Hub
              </h2>
              <div className="mt-8 flex gap-3">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00b8d9]" />
                 <span className="text-[8px] font-black text-primary uppercase tracking-widest leading-none">{translations[lang].hub.syncActive}</span>
              </div>
           </div>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 p-12 space-y-10 overflow-y-auto no-scrollbar">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">{translations[lang].hub.crossModule}</p>
                 <h3 className="text-2xl dark:text-white font-serif italic">{translations[lang].hub.manifestNeural}</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 glass border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all"
              >
                 <X size={20} />
              </button>
           </div>

           {/* Permission Matrix */}
           <div className="grid grid-cols-3 gap-3 p-2 bg-zinc-100 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/10">
              {[
                { id: 'public', label: translations[lang].hub.global, icon: Globe },
                { id: 'team', label: translations[lang].hub.team, icon: Shield },
                { id: 'private', label: translations[lang].hub.encrypted, icon: Lock }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setPermission(opt.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${permission === opt.id ? 'bg-black dark:bg-white text-white dark:text-black shadow-xl' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
                >
                  <opt.icon size={12} />
                  {opt.label}
                </button>
              ))}
           </div>

           {/* Distribution Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                disabled={isProcessing}
                onClick={() => handleShare('archival')}
                className="p-8 bg-zinc-100 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10 flex flex-col items-start gap-4 hover:border-primary/30 hover:bg-primary/5 group transition-all text-left"
              >
                 <Library size={24} className="text-primary" />
                 <div>
                    <h5 className="text-[11px] font-black dark:text-white uppercase tracking-widest mb-1">{translations[lang].hub.pushArchival}</h5>
                    <p className="text-[9px] text-zinc-500 uppercase font-mono">{translations[lang].hub.syncStyle}</p>
                 </div>
              </button>

              <button 
                disabled={isProcessing}
                onClick={() => handleShare('synthesis')}
                className="p-8 bg-zinc-100 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10 flex flex-col items-start gap-4 hover:border-purple-500/30 hover:bg-purple-500/5 group transition-all text-left"
              >
                 <Zap size={24} className="text-purple-500" />
                 <div>
                    <h5 className="text-[11px] font-black dark:text-white uppercase tracking-widest mb-1">{translations[lang].hub.injectSynthesis}</h5>
                    <p className="text-[9px] text-zinc-500 uppercase font-mono">{translations[lang].hub.mapPrompt}</p>
                 </div>
              </button>

              <button 
                disabled={isProcessing}
                onClick={() => handleShare('laboratory')}
                className="p-8 bg-zinc-100 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10 flex flex-col items-start gap-4 hover:border-blue-500/30 hover:bg-blue-500/5 group transition-all text-left"
              >
                 <Box size={24} className="text-blue-500" />
                 <div>
                    <h5 className="text-[11px] font-black dark:text-white uppercase tracking-widest mb-1">{translations[lang].hub.loadLab}</h5>
                    <p className="text-[9px] text-zinc-500 uppercase font-mono">{translations[lang].hub.preCache}</p>
                 </div>
              </button>

              <button 
                disabled={isProcessing}
                onClick={() => {
                  const items = data.moodboard || [data];
                  const ids = items.map((i: any) => i.id).join(',');
                  const url = `${window.location.origin}${window.location.pathname}?mb=${btoa(ids)}&tk=${Math.random().toString(36).substr(2, 9)}`;
                  navigator.clipboard.writeText(url);
                  handleShare('link');
                }}
                className="p-8 bg-zinc-100 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10 flex flex-col items-start gap-4 hover:border-yellow-500/30 hover:bg-yellow-500/5 group transition-all text-left"
              >
                 <Share2 size={24} className="text-yellow-500" />
                 <div>
                    <h5 className="text-[11px] font-black dark:text-white uppercase tracking-widest mb-1">{translations[lang].hub.neuralCollab}</h5>
                    <p className="text-[9px] text-zinc-500 uppercase font-mono">{translations[lang].hub.generateLink}</p>
                 </div>
              </button>
           </div>

           {isProcessing && (
              <div className="pt-4 space-y-3">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-primary">
                    <span>{translations[lang].hub.compressing}</span>
                    <span>72%</span>
                 </div>
                 <div className="h-1 bg-zinc-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full aurora-progress" 
                      initial={{ width: 0 }}
                      animate={{ width: '72%' }}
                    />
                 </div>
              </div>
           )}
        </div>
      </motion.div>
    </motion.div>
  );
};




// --- Main App ---

export default function App() {
  const [lang, setLang] = useState<Language>('zh');
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<"gallery" | "moodboard" | "settings" | "operations">("gallery");
  const [health, setHealth] = useState<any>(null);
  const [healthStatus, setHealthStatus] = useState<'online' | 'offline' | 'reconnecting'>('reconnecting');
  const [registry, setRegistry] = useState<any>(null);
  const [history, setHistory] = useState<FashionTask[]>([]);
  const { tasks, activeTasksCount, createTask, addLocalTask } = useTaskSystem();

  // Combine local tasks and historical generations
  const allGenerations = useMemo(() => {
    const combined = [...tasks];
    history.forEach(h => {
      if (!combined.find(t => t.id === h.id)) {
        combined.push(h);
      }
    });
    return combined.sort((a, b) => b.created_at - a.created_at);
  }, [tasks, history]);

  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: translations[lang].interaction.initMsg,
    moodboard: TRENDING_MOODBOARD,
    suggestions: translations[lang].interaction.suggestions
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('moda-theme');
      return saved === Theme.DARK ? Theme.DARK : Theme.LIGHT;
    }
    return Theme.LIGHT;
  });

  const [sharedMoodboard, setSharedMoodboard] = useState<any[] | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Deep Linking System
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mbParam = params.get('mb');
    if (mbParam) {
      try {
        const decoded = atob(mbParam);
        const ids = decoded.split(',');
        // Filter from trending or mock gallery
        const items = TRENDING_MOODBOARD.filter(item => ids.includes(item.id));
        if (items.length > 0) {
          setSharedMoodboard(items);
          setActiveTab('moodboard');
          setNotification("Neural moodboard synchronized from shared link.");
        }
      } catch (e) {
        console.error("Link corruption detected", e);
      }
    }
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('moda-theme', theme);
  }, [theme, lang]);

  // Poll Health, Registry & History
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthData, registryData, historyData] = await Promise.all([
          getRuntimeHealth(),
          getSystemRegistry(),
          getGenerationHistory()
        ]);
        
        if (healthData) {
          // The new response is { success: true, online: true, health: { ... } }
          setHealth(healthData.health);
          setHealthStatus(healthData.online ? 'online' : 'offline');
        }
        
        if (registryData) {
          setRegistry(registryData);
        }

        if (historyData?.success && historyData.data) {
          const normalizedHistory: FashionTask[] = historyData.data.map((item: any) => ({
            id: String(item.id),
            type: 'synthesis',
            status: item.status as TaskStatus,
            progress: item.status === 'completed' ? 100 : 0,
            result_url: item.image_url,
            metadata: { 
              prompt: item.prompt,
              // Fallbacks if not present in history yet
              model: item.model || 'SDXL',
              style: item.style || 'Editorial'
            },
            created_at: item.created_at ? new Date(item.created_at).getTime() : Date.now()
          }));
          setHistory(normalizedHistory);
        }
      } catch (e) {
        console.error("OS Data fetch failed", e);
        setHealthStatus('offline');
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 4000); // 4s heartbeats
    return () => clearInterval(interval);
  }, []);

  const handleAssistantAction = async (input: string) => {
    if (!input.trim()) return;
    setAssistantMessages(prev => [...prev, { role: 'user', content: input }]);
    setIsTyping(true);

    try {
      const response = await getFashionAssistantResponse(
        [...assistantMessages, { role: 'user', content: input }],
        { role: userRole, lang }
      );
      
      setAssistantMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.reply,
        suggestions: response.suggestions,
        moodboard: response.moodboard,
        generation_actions: response.generation_actions
      }]);

      // Process Director Actions
      if (response.action) {
         if (response.action.type === 'GENERATE') {
            setActiveTab('gallery'); // or a dedicated view
         }
      }

      // Process automatic generation tasks if included in the neural response
      if (response.generation_actions && response.generation_actions.length > 0) {
        for (const action of response.generation_actions) {
          const taskId = await createTask(action.type, action.params);
          if (taskId) addLocalTask(taskId, action.type);
        }
      }
    } catch (e) {
      console.error("Neural pathway blocked", e);
      setAssistantMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I've encountered a system bridge failure. Please check the local GPU Runtime status." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const [selectedItem, setSelectedItem] = useState<FashionItem | null>(null);
  const [moodboard3DItem, setMoodboard3DItem] = useState<string | null>(null);
  const [itemVariants, setItemVariants] = useState<string[]>([]);
  const [isGeneratingVariant, setIsGeneratingVariant] = useState(false);
  const [hubData, setHubData] = useState<any | null>(null);
  const [globalQueue, setGlobalQueue] = useState<{ id: string, progress: number, status: string } | null>(null);
  const [preloadedGarment, setPreloadedGarment] = useState<string | null>(null);
  const [projectedDesign, setProjectedDesign] = useState<string | null>(null);
  const [preloadedPrompt, setPreloadedPrompt] = useState<string | null>(null);
  const [curatedItems, setCuratedItems] = useState<FashionItem[]>([]);
  const [userRole, setUserRole] = useState<UserRole>('CEO');
  const [lockedItems, setLockedItems] = useState<Set<string>>(new Set());
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [assistantInput, setAssistantInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (instant = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: instant ? "auto" : "smooth",
        block: "end"
      });
    }
  };

  useEffect(() => {
    if (isAssistantOpen) {
      // Small delay to ensure render batching
      const timer = setTimeout(() => scrollToBottom(), 100);
      return () => clearTimeout(timer);
    }
  }, [assistantMessages, isTyping, isAssistantOpen]);

  // Firebase Auth Lifecycle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        signInAnonymously(auth).catch(err => console.error("Anonymous auth failed", err));
      }
    });
    return unsubscribe;
  }, []);

  // Firestore Real-time Sync
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = fashionItemService.subscribeToItems((items) => {
      setCuratedItems(items);
    });

    return unsubscribe;
  }, [currentUser]);

  const handleSelectItem = (item: FashionItem | null) => {
    setSelectedItem(item);
    setMoodboard3DItem(null);
    setItemVariants([]);
    setIsGeneratingVariant(false);
  };

  useEffect(() => {
    const unsub = appBus.on('UPDATE_QUEUE', (data) => {
      setGlobalQueue(data);
      if (data.progress >= 100) {
        setTimeout(() => setGlobalQueue(null), 3000);
      }
    });
    return unsub;
  }, []);

  const handleHubPush = (target: string, data: any) => {
    setNotification(`Synchronizing inspiration with ${target.toUpperCase()}...`);
    
    // Virtual Worker simulation
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      appBus.emit({ type: 'UPDATE_QUEUE', data: { id: 'SYNC_' + target, progress, status: 'Distributing Assets' } });
      if (progress >= 100) {
        clearInterval(interval);
        
        // Final Action Execution
        if (target === 'archival') {
          const newItemPayload: Partial<FashionItem> = {
            title: data.title || "Neural Concept " + Math.floor(Math.random()*1000),
            style: data.title || "Neural Concept",
            description: "Curated in-system concept",
            tags: ['AI-Selected', 'Curated'],
            imageUrl: data.url || data.imageUrl || (data.moodboard && data.moodboard[0]?.url),
            price: Math.floor(Math.random() * 500) + 100,
            category: 'Avant-Garde',
            userId: currentUser?.uid || 'guest',
            analysis: {
              sustainability: 85,
              heritageScore: 70,
              trendVelocity: 'Rising',
              fabricComposition: 'Recycled Polymer',
              vogueIndex: 95
            }
          };
          
          fashionItemService.createItem(newItemPayload).then(() => {
            setActiveTab('gallery');
            setNotification(translations[lang].system.archivalPushed);
          });
        } else if (target === 'synthesis') {
          setPreloadedPrompt(data.content || data.title || "Experimental Style Synthesis");
          setActiveTab('operations');
          setNotification(translations[lang].system.variableInjected);
        } else if (target === 'laboratory') {
          setPreloadedGarment(data.url || data.imageUrl || (data.moodboard && data.moodboard[0]?.url));
          setActiveTab('operations');
          setNotification(translations[lang].system.garmentPrecached);
        } else if (target === 'link') {
          setNotification(translations[lang].system.linkActive);
        }
      }
    }, 200);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-[400] flex justify-center py-8 pointer-events-none">
        <div className="glass px-8 py-3 rounded-full border border-black/5 dark:border-white/10 flex items-center gap-10 pointer-events-auto shadow-2xl transition-all">
           <div className="flex items-center gap-3 pr-8 border-r border-black/5 dark:border-white/10">
              <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center font-black italic tracking-tighter transition-all">F</div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-900 dark:text-white transition-all">FASHION_OS</span>
           </div>
           
           <div className="flex items-center gap-6">
              {[
                { id: 'gallery', label: translations[lang].tabs.gallery, icon: Library },
                { id: 'moodboard', label: translations[lang].nav.moodboard, icon: LayoutGrid },
                { id: 'operations', label: translations[lang].nav.operations, icon: Activity },
                { id: 'settings', label: translations[lang].nav.settings, icon: Cpu }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-2 group transition-all ${activeTab === item.id ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-white/40 hover:text-zinc-900 dark:hover:text-white'}`}
                >
                   <item.icon size={14} className={activeTab === item.id ? 'text-primary' : ''} />
                   <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
           </div>

           <div className="flex items-center gap-4 pl-8 border-l border-black/5 dark:border-white/10">
              <button 
                onClick={() => setIsAssistantOpen(true)}
                className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-zinc-900 dark:text-white"
              >
                <div className="w-1.5 h-1.5 bg-primary rounded-full absolute top-1.5 right-1.5 animate-pulse" />
                <MessageSquare size={18} />
              </button>
              <div className="h-8 w-[1px] bg-black/5 dark:bg-white/10" />
              <button 
                onClick={() => setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-zinc-900 dark:text-white"
              >
                {theme === Theme.DARK ? <Sparkles size={18} /> : <Zap size={18} />}
              </button>
           </div>
        </div>
      </nav>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'gallery' && (
           <motion.div
             key="gallery"
             initial={{ opacity: 0, scale: 1.02 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.98 }}
             className="pt-16 pb-48 px-10"
           >
              <div className="max-w-7xl mx-auto">
                 {/* Hero Video Section */}
                 <div className="relative h-[80vh] w-full rounded-[4rem] overflow-hidden mb-24 group shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s]"
                    >
                       <source src="https://player.vimeo.com/external/494252666.sd.mp4?s=347ef9d984cfb7eb257f89b6dc671c5ec843cda8&profile_id=165&oauth2_token_id=57447761" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                       <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.5 }}
                       >
                          <span className="text-[10px] font-black uppercase tracking-[1em] text-primary mb-6 block">{translations[lang].gallery.futureManifest}</span>
                          <h2 className="text-7xl md:text-9xl font-serif text-white uppercase tracking-tighter leading-none mb-8">
                             Neural<br/><span className="italic">{translations[lang].gallery.futureManifest === '未来宣言' ? '审美革命' : 'Aesthetics'}</span>
                          </h2>
                          <div className="flex justify-center gap-6">
                             <div className="flex items-center gap-2 px-6 py-3 glass rounded-full border border-white/20">
                                <Activity size={14} className="text-primary" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{translations[lang].gallery.realTimeAnalysis}</span>
                             </div>
                             <div className="flex items-center gap-2 px-6 py-3 glass rounded-full border border-white/20">
                                <Sparkles size={14} className="text-purple-400" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{translations[lang].gallery.generativeCore}</span>
                             </div>
                          </div>
                       </motion.div>
                    </div>
                    <div className="absolute bottom-12 left-12 flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white backdrop-blur-md">
                          <VolumeX size={18} />
                       </div>
                       <div className="h-0.5 w-32 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full aurora-progress"
                            animate={{ width: ['0%', '100%'] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          />
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary mb-4 block">{translations[lang].gallery.futureManifest}</span>
                      <h1 className="font-serif text-6xl md:text-8xl leading-none uppercase tracking-tighter dark:text-white">{translations[lang].gallery.trendDna}<br/><span className="italic">{translations[lang].gallery.subMatrix}</span></h1>
                    </div>
                    <div className="flex gap-4">
                       <div className="glass px-8 py-5 rounded-[2rem] border border-white/10 text-center">
                          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">{translations[lang].gallery.queueLoad}</p>
                          <p className="text-3xl font-mono text-primary font-bold leading-none">{activeTasksCount}</p>
                       </div>
                       <div className="glass px-8 py-5 rounded-[2rem] border border-white/10 text-center">
                          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">{translations[lang].gallery.registryUptime}</p>
                          <p className="text-3xl font-mono text-white font-bold leading-none">99.9%</p>
                       </div>
                    </div>
                 </div>

                 {/* Simulated Content Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[...curatedItems, ...MOCK_FASHION_GALLERY].map((item, idx) => (
                      <FashionItemCard 
                        key={item.id}
                        item={item}
                        idx={idx}
                        lang={lang}
                        onClick={() => handleSelectItem(item)}
                      />
                    ))}
                 </div>
              </div>
           </motion.div>
        )}

        {activeTab === 'moodboard' && (
           <motion.div
             key="moodboard"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="pt-32 pb-48 px-10 max-w-7xl mx-auto"
           >
              <div className="flex justify-between items-end mb-16">
                 <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 block">{translations[lang].moodboard.curationMatrix}</span>
                    <h2 className="font-serif text-7xl uppercase tracking-tighter dark:text-white leading-none">Aesthetic<br/><span className="italic">{translations[lang].moodboard.title}</span></h2>
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        const items = sharedMoodboard || TRENDING_MOODBOARD;
                        const ids = items.map(i => i.id).join(',');
                        const url = `${window.location.origin}${window.location.pathname}?mb=${btoa(ids)}`;
                        navigator.clipboard.writeText(url);
                        setNotification("Shareable link copied to clipboard.");
                      }}
                      className="px-8 py-4 glass border border-zinc-200 dark:border-white/10 rounded-full flex items-center gap-3 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group"
                    >
                       <Share2 size={16} className="text-primary group-hover:text-current" />
                       <span className="text-[10px] font-black uppercase tracking-widest">{translations[lang].moodboard.share}</span>
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {(sharedMoodboard || TRENDING_MOODBOARD).map((item, idx) => (
                   <motion.div
                     key={item.id}
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: idx * 0.1 }}
                     className="aspect-square relative rounded-[3rem] overflow-hidden group border border-zinc-100 dark:border-white/5"
                   >
                     <SafeImage src={item.url} alt={item.title} lang={lang} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-10 flex flex-col justify-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Trend_Reference</span>
                        <h4 className="text-3xl font-serif italic text-white uppercase tracking-tighter">{item.title}</h4>
                     </div>
                   </motion.div>
                 ))}
                 
                 {/* Empty slot for generation */}
                 <div className="aspect-square rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-white/5 flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-all">
                    <div className="p-6 bg-zinc-100 dark:bg-white/5 rounded-full mb-6 group-hover:scale-110 transition-transform">
                       <Plus size={24} className="text-zinc-400" />
                    </div>
                    <p className="text-sm font-serif italic text-zinc-500">Append new aesthetic concept</p>
                 </div>
              </div>
           </motion.div>
        )}

        {activeTab === 'operations' && (
           <AIOperationsCenter 
             lang={lang} 
             preloadedDesign={projectedDesign}
             onDesignUsed={() => setProjectedDesign(null)}
           />
        )}

        {activeTab === 'settings' && (
          <motion.div 
            key="settings" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-48 px-10 max-w-6xl mx-auto"
          >
             <div className="flex justify-between items-end mb-16">
                <div>
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 block">{translations[lang].ops.kernelSync}</span>
                   <h2 className="font-serif text-6xl uppercase tracking-tighter dark:text-white leading-none">Cluster<br/><span className="italic">{translations[lang].common.inventory}</span></h2>
                </div>
                <div className="text-right space-y-2">
                   <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest bg-zinc-100 dark:bg-white/5 px-4 py-2 rounded-full border border-zinc-200 dark:border-white/10">
                      UUID: FOS-88A2-X
                   </p>
                   <p className="text-[9px] font-mono text-primary uppercase tracking-widest">{translations[lang].common.state}: {translations[lang].common.sync.toUpperCase()}</p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Registry Section */}
                <div className="space-y-8">
                   <div className="p-10 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-white/5 shadow-sm">
                      <div className="flex items-center gap-3 mb-8">
                         <List size={20} className="text-primary" />
                         <h4 className="text-2xl font-serif italic dark:text-white uppercase tracking-tighter">{translations[lang].settings.modelStack}</h4>
                      </div>
                      <div className="space-y-4">
                         {registry?.models?.map((m: any) => (
                           <div key={m.id} className="p-6 bg-zinc-50 dark:bg-black/40 rounded-3xl border border-zinc-100 dark:border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                              <div>
                                 <p className="text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">{m.id}</p>
                                 <p className="text-[9px] text-zinc-400 uppercase font-mono mt-1">{m.type}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                 <span className="text-[8px] font-black uppercase text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">{translations[lang].common.ready}</span>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="p-10 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-white/5 shadow-sm">
                      <div className="flex items-center gap-3 mb-8">
                         <Code size={20} className="text-blue-500" />
                         <h4 className="text-2xl font-serif italic dark:text-white uppercase tracking-tighter">{translations[lang].settings.neuralScraper.title}</h4>
                      </div>
                      <div className="space-y-4">
                         {registry?.loras?.map((l: any) => (
                           <div key={l.id} className="p-6 bg-zinc-50 dark:bg-black/40 rounded-3xl border border-zinc-100 dark:border-white/5">
                              <div className="flex justify-between items-center mb-4">
                                 <p className="text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">{l.id}</p>
                                 <p className="text-[9px] font-mono text-blue-500 underline underline-offset-4">{l.base_model || 'SDXL'}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                 <div className="flex-1 h-1 bg-zinc-200 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500/50" style={{ width: `${(l.weight || 0.8) * 100}%` }} />
                                 </div>
                                 <span className="text-[10px] font-mono text-zinc-400">{(l.weight || 0.8).toFixed(1)}</span>
                              </div>
                           </div>
                         ))}
                         {(!registry?.loras || registry.loras.length === 0) && (
                            <p className="text-sm text-zinc-500 italic text-center py-4">{translations[lang].common.type === '类型' ? '暂无活动的风格 LoRA' : 'No active style LoRAs attached'}</p>
                         )}
                      </div>
                   </div>
                </div>

                {/* Operations Section */}
                <div className="space-y-8">
                   <div className="p-10 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-white/5 shadow-sm">
                      <div className="flex items-center gap-3 mb-8">
                         <Shield size={20} className="text-primary" />
                         <h4 className="text-2xl font-serif italic dark:text-white uppercase tracking-tighter">{translations[lang].ops.authorityLevel}</h4>
                      </div>
                         <div className="grid grid-cols-2 gap-4 p-2 bg-zinc-100 dark:bg-black/40 rounded-[2rem] border border-zinc-200 dark:border-white/10">
                            {['en', 'zh', 'it', 'fr'].map(l => (
                               <button 
                                 key={l}
                                 onClick={() => setLang(l as any)}
                                 className={`py-3 px-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${lang === l ? 'bg-primary text-black shadow-xl' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                               >
                                  {l === 'en' ? 'EN_NEURAL' : l === 'zh' ? 'ZH_SYNC' : l === 'it' ? 'IT_CRAFT' : 'FR_ATELIER'}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div className="p-10 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-white/5 shadow-sm">
                         <div className="flex items-center gap-3 mb-8">
                         <Shield size={20} className="text-primary" />
                            <h4 className="text-2xl font-serif italic dark:text-white uppercase tracking-tighter">{translations[lang].ops.authorityLevel}</h4>
                         </div>
                         <div className="grid grid-cols-2 gap-4 p-2 bg-zinc-100 dark:bg-black/40 rounded-[2rem] border border-zinc-200 dark:border-white/10">
                            {['SOURCING', 'DESIGNER', 'MARKETER', 'CEO'].map(role => (
                               <button 
                                 key={role}
                                 onClick={() => setUserRole(role as any)}
                                 className={`py-6 px-4 rounded-3xl text-[9px] font-black uppercase tracking-widest transition-all ${userRole === role ? 'bg-primary text-black shadow-xl shadow-primary/20 scale-105' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                               >
                                  {role === 'SOURCING' ? (translations[lang].common.type === '类型' ? '供应链' : 'SOURCING') : 
                                   role === 'DESIGNER' ? (translations[lang].common.type === '类型' ? '设计师' : 'DESIGNER') : 
                                   role === 'MARKETER' ? (translations[lang].common.type === '类型' ? '市场经理' : 'MARKETER') : 
                                   (translations[lang].common.type === '类型' ? '首席执行官' : 'CEO')}
                               </button>
                            ))}
                         </div>
                      </div>

                   <div className="p-10 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-white/5 shadow-sm">
                      <div className="flex items-center justify-between mb-10">
                         <div className="flex items-center gap-3">
                            <Server size={20} className="text-purple-500" />
                            <h4 className="text-2xl font-serif italic dark:text-white uppercase tracking-tighter">{translations[lang].ops.gpuMonitorDesc}</h4>
                         </div>
                      </div>
                      <div className="space-y-4">
                         {registry?.workers?.map((w: any) => (
                           <div key={w.id} className="p-6 bg-zinc-50 dark:bg-black/40 rounded-3xl border border-zinc-100 dark:border-white/5 flex items-center justify-between group">
                              <div className="flex items-center gap-4">
                                 <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                                 <div>
                                    <p className="text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">{w.id}</p>
                                    <p className="text-[9px] text-zinc-400 uppercase font-mono">{w.gpu || 'RTX Cluster'}</p>
                                 </div>
                              </div>
                              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">{translations[lang].common.online}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="p-10 bg-black rounded-[3rem] border border-white/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-1000" />
                      <div className="relative z-10 flex flex-col items-start gap-8">
                         <div>
                           <h4 className="text-3xl font-serif italic text-white flex items-center gap-3">
                              <Zap className="text-primary" /> {translations[lang].ops.neuralPipeline}
                           </h4>
                           <p className="text-zinc-500 text-sm mt-4 max-w-sm leading-relaxed">
                              {translations[lang].ops.vramPurgeDesc}
                           </p>
                         </div>
                         <button 
                            onClick={async () => {
                              await fetch("/api/fashion/runtime/op", { method: "POST", body: JSON.stringify({ action: 'CLEAR_VRAM' }) });
                            }}
                            className="w-full py-6 bg-primary text-black rounded-3xl text-[11px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_50px_rgba(0,184,217,0.3)]"
                         >
                            {translations[lang].ops.vramPurgeAction}
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-12 left-1/2 z-[2000] bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-full border border-white/20 shadow-2xl flex items-center gap-4"
          >
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OS Dashboard Layers */}
      <FashionOSConsole 
        health={health} 
        status={healthStatus} 
        t={t} 
        registry={registry} 
        globalQueue={globalQueue}
        lang={lang}
      />

      {/* Task Stack */}
      <div className="fixed bottom-24 right-10 z-[600]">
         <AnimatePresence>
            {tasks.slice(0, 3).map(task => (
               <TaskNotification key={task.id} task={task} />
            ))}
         </AnimatePresence>
      </div>

      {/* AI Analysis Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6"
            onClick={() => handleSelectItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="bg-zinc-50 dark:bg-zinc-950 w-full max-w-6xl h-[90vh] rounded-[4rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl border border-black/5 dark:border-white/5 relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Media Section */}
              <div className="lg:w-1/2 relative">
                <div className="w-full h-full relative bg-zinc-100 dark:bg-black group overflow-hidden">
                   <SafeImage 
                     src={selectedItem.imageUrl} 
                     alt={selectedItem.style} 
                     lang={lang}
                     className="w-full h-full object-cover" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                   
                   <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end pointer-events-none">
                      <div className="max-w-[70%]">
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">{translations[lang].system.archiveMatch}</span>
                         <h2 className="text-5xl font-serif italic text-white leading-tight uppercase tracking-tighter truncate">{selectedItem.style}</h2>
                      </div>
                   </div>
                </div>
                
                <button 
                  onClick={() => handleSelectItem(null)}
                  className="absolute top-8 left-8 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white transition-all z-[20]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Data Section */}
              <div className="lg:w-1/2 flex flex-col bg-white dark:bg-transparent overflow-y-auto no-scrollbar scroll-smooth">
                <div className="p-16 space-y-16">
                  {/* Category & Tags */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <Tag size={16} className="text-zinc-400" />
                       <div className="flex flex-wrap gap-2">
                          <span className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-[9px] font-black uppercase tracking-widest">
                             {selectedItem.category}
                          </span>
                          {selectedItem.tags.map(tag => (
                            <span key={tag} className="px-4 py-1.5 border border-zinc-200 dark:border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-500">
                               {tag}
                            </span>
                          ))}
                       </div>
                    </div>
                    <p className="text-lg font-serif italic text-zinc-500 dark:text-zinc-400 leading-relaxed">
                       {selectedItem.description}
                    </p>
                  </div>

                  {/* AI Style Analysis Section */}
                  <div className="space-y-10">
                    <div className="flex items-center gap-4 pb-6 border-b border-zinc-100 dark:border-white/10">
                      <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                        <Cpu size={24} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="text-3xl font-serif italic dark:text-white uppercase tracking-tighter">AI Style Analysis</h4>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mt-1">Neural Topology & Market Insight</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Metric Card: Sustainability */}
                      <div className="p-10 bg-zinc-50 dark:bg-black/40 rounded-[3rem] border border-zinc-100 dark:border-white/5 space-y-8 group hover:border-primary/30 transition-all">
                         <div className="flex justify-between items-center">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                              <Globe size={18} className="text-primary" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-primary transition-colors">Sustainability</span>
                         </div>
                         <div className="space-y-4">
                            <div className="flex justify-between items-end">
                               <p className="text-5xl font-serif italic text-zinc-900 dark:text-white">{selectedItem.analysis?.sustainability || 72}%</p>
                               <span className="text-[9px] font-mono text-primary mb-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">NODE_TRUST</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-200 dark:bg-white/5 rounded-full overflow-hidden p-[2px]">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${selectedItem.analysis?.sustainability || 72}%` }}
                                 className="h-full bg-gradient-to-r from-primary to-teal-400 rounded-full shadow-[0_0_10px_rgba(0,184,217,0.5)]"
                               />
                            </div>
                         </div>
                      </div>

                      {/* Metric Card: Trend Velocity */}
                      <div className="p-10 bg-zinc-50 dark:bg-black/40 rounded-[3rem] border border-zinc-100 dark:border-white/5 space-y-8 group hover:border-blue-500/30 transition-all">
                         <div className="flex justify-between items-center">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                              <TrendingUp size={18} className="text-blue-500" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-blue-500 transition-colors">Trend Velocity</span>
                         </div>
                         <div className="space-y-6">
                            <p className="text-5xl font-serif italic text-zinc-900 dark:text-white">{selectedItem.analysis?.trendVelocity || 'Rising'}</p>
                            <div className="flex gap-2">
                               {[1,2,3,4,5].map(i => (
                                 <motion.div 
                                   key={i} 
                                   initial={{ opacity: 0.3 }}
                                   animate={{ opacity: i <= 4 ? 1 : 0.1 }}
                                   className={`h-2 flex-1 rounded-full ${i <= 4 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-zinc-200 dark:bg-white/5'}`} 
                                 />
                               ))}
                            </div>
                         </div>
                      </div>

                      {/* Metric Card: Vogue Index */}
                      <div className="p-10 bg-zinc-50 dark:bg-black/40 rounded-[3rem] border border-zinc-100 dark:border-white/5 space-y-8 group hover:border-purple-500/30 transition-all">
                         <div className="flex justify-between items-center">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                              <Zap size={18} className="text-purple-500" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-purple-500 transition-colors">Vogue Index</span>
                         </div>
                         <div className="space-y-4">
                            <div className="flex justify-between items-end">
                               <p className="text-5xl font-serif italic text-zinc-900 dark:text-white">{selectedItem.analysis?.vogueIndex || 85}</p>
                               <span className="text-[9px] font-mono text-purple-500 mb-2 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">QUANTUM_SCORE</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-200 dark:bg-white/5 rounded-full overflow-hidden p-[2px]">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${selectedItem.analysis?.vogueIndex || 85}%` }}
                                 className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                               />
                            </div>
                         </div>
                      </div>

                      {/* ESG Compliance Indicator */}
                      <div className="p-10 bg-black rounded-[3rem] border border-primary/20 space-y-6">
                         <div className="flex justify-between items-center">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                              <ShieldCheck size={18} className="text-primary" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t.gallery.esg}</span>
                         </div>
                         <div className="space-y-2">
                           <p className="text-xs font-mono text-primary/80 uppercase">EU_REGULATION_REACH_COMPLIANT</p>
                           <p className="text-[9px] font-mono text-zinc-500 uppercase">Verification Hash: 0x88...F2A</p>
                         </div>
                         <button className="w-full py-4 border border-primary/20 rounded-2xl text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-black transition-all">
                            View Compliance Certificate
                         </button>
                      </div>

                      {/* Tech Pack Generator */}
                      <div className="p-10 bg-zinc-900 rounded-[3rem] border border-blue-500/20 space-y-6">
                         <div className="flex justify-between items-center">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                              <FileText size={18} className="text-blue-500" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{t.gallery.techPack}</span>
                         </div>
                         <div className="space-y-1">
                           <p className="text-lg font-serif italic text-white uppercase tracking-tighter">Digital Blueprint v2.0</p>
                           <p className="text-[9px] font-mono text-zinc-500 uppercase">Includes 3D Mesh & Laser Cut Paths</p>
                         </div>
                         <button className="w-full py-4 bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
                            Export to Factory (PLT/DXF)
                         </button>
                      </div>

                      {/* Metric Card: Fabric Composition */}
                      <div className="p-10 bg-zinc-50 dark:bg-black/40 rounded-[3rem] border border-zinc-100 dark:border-white/5 space-y-8 group hover:border-orange-500/30 transition-all">
                         <div className="flex justify-between items-center">
                            <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform">
                              <Layers size={18} className="text-orange-500" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-orange-500 transition-colors">Composition</span>
                         </div>
                         <div className="space-y-3">
                            <p className="text-2xl font-serif italic text-zinc-900 dark:text-white leading-tight">
                               {selectedItem.analysis?.fabricComposition || "Recycled Polyester Blend"}
                            </p>
                            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-2">
                               <CheckCircle2 size={10} className="text-primary" /> Molecularly Verified
                            </p>
                         </div>
                      </div>
                    </div>

                    {/* Color Palette Sub-section */}
                    <div className="p-12 bg-black rounded-[3rem] border border-white/5 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-1000" />
                       <div className="relative z-10 space-y-10">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                   <Palette size={20} className="text-zinc-400" />
                                </div>
                                <div>
                                   <h4 className="text-xl font-serif italic text-white uppercase tracking-tighter">Chromatic Spectrum</h4>
                                   <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1">AI Extracted Color Profiles</p>
                                </div>
                             </div>
                          </div>
                          <div className="flex gap-4">
                             {(selectedItem.analysis?.colors || ['#1A1A1A', '#F5F2ED', '#8B4513', '#D2B48C']).map((color, i) => (
                               <div key={i} className="group/swatch relative flex-1">
                                  <div 
                                    className="h-32 w-full rounded-[2rem] border border-white/10 shadow-2xl group-hover/swatch:scale-[1.05] group-hover/swatch:-translate-y-2 transition-all duration-500" 
                                    style={{ backgroundColor: color }}
                                  >
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/swatch:opacity-100 transition-opacity rounded-[2rem]" />
                                  </div>
                                  <div className="absolute -bottom-10 left-0 right-0 text-center opacity-0 group-hover/swatch:opacity-100 transition-all translate-y-2 group-hover/swatch:translate-y-0">
                                     <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                                       {color}
                                     </span>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Neural Pattern Variations */}
                  <div className="space-y-8">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <RefreshCw size={18} className={`text-primary ${isGeneratingVariant ? 'animate-spin' : ''}`} />
                           <h4 className="text-xl font-serif italic dark:text-white uppercase tracking-tighter">Neural Variants</h4>
                        </div>
                        <button 
                          disabled={isGeneratingVariant}
                          onClick={async () => {
                            setIsGeneratingVariant(true);
                            // Simulate variant generation
                            setTimeout(() => {
                              setItemVariants([...itemVariants, `https://picsum.photos/seed/${Math.random()}/1024/1024`]);
                              setIsGeneratingVariant(false);
                            }, 3000);
                          }}
                          className="px-6 py-2 bg-primary text-black text-[9px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all disabled:opacity-50"
                        >
                           {isGeneratingVariant ? 'Processing...' : 'Generate New Variation'}
                        </button>
                     </div>

                     {itemVariants.length > 0 ? (
                       <div className="grid grid-cols-4 gap-4">
                         {itemVariants.map((v, i) => (
                           <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-zinc-100 dark:border-white/10 group cursor-pointer">
                             <img src={v} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Variant" />
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="p-10 border-2 border-dashed border-zinc-100 dark:border-white/5 rounded-3xl flex items-center justify-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">No variants generated yet</p>
                       </div>
                     )}
                  </div>

                  {/* Action Bar */}
                  <div className="pt-12 border-t border-zinc-100 dark:border-white/5 space-y-6">
                     <div className="flex gap-4">
                        <button 
                          onClick={() => {
                            setHubData({
                              title: selectedItem.style,
                              items: [selectedItem],
                              context: "Direct Item Dispatch"
                            });
                          }}
                          className="flex-1 py-8 bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                        >
                           <Zap size={20} className="fill-current neon-cyan group-hover:animate-pulse" />
                           Dispatch to All Sectors
                        </button>
                        <button className="p-8 glass border border-zinc-200 dark:border-white/10 rounded-[2.5rem] text-zinc-900 dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all">
                           <Download size={24} />
                        </button>
                     </div>
                     <p className="text-[9px] font-mono text-center text-zinc-400 uppercase tracking-[0.3em]">
                        Neural Hash: <span className="text-primary">{selectedItem.id}</span> | State: <span className="text-blue-500">Volatile</span>
                     </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Super Share Hub Modal */}
      <AnimatePresence>
        {hubData && (
          <SuperShareHub 
            data={hubData} 
            onClose={() => setHubData(null)} 
            onPush={handleHubPush}
            lang={lang}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isAssistantOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 30 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 30 }}
               className="bg-white dark:bg-zinc-950 w-full max-w-5xl h-[80vh] rounded-[4rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_120px_rgba(0,0,0,0.7)] border border-white/5"
             >
                <div className="md:w-1/3 p-12 border-r border-zinc-100 dark:border-white/5 flex flex-col bg-zinc-50/50 dark:bg-black/20">
                   <div className="mb-12">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Neural Assistant</span>
                      </div>
                      <h3 className="text-4xl font-serif italic dark:text-white leading-tight">Digital<br/>Curator</h3>
                   </div>
                   
                   <div className="flex-1 space-y-8">
                   <div className="p-8 bg-white/50 dark:bg-white/5 rounded-[2.5rem] border border-zinc-100 dark:border-white/10 backdrop-blur-md relative overflow-hidden group">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                         NEURAL_QUERY_LOG
                      </p>
                      <div className="space-y-3">
                         {['Gen Dior Campaign', 'Clear Cache', 'Analyze VTO'].map((cmd, idx) => (
                            <motion.button 
                              key={cmd} 
                              whileHover={{ x: 6, backgroundColor: 'rgba(0,184,217,0.05)' }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleAssistantAction(cmd)}
                              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono text-left border border-transparent hover:border-primary/20 hover:text-primary transition-all group/btn"
                            >
                               <Terminal size={14} className="opacity-40 group-hover/btn:opacity-100 transition-opacity" /> 
                               <span className="truncate">{cmd}</span>
                            </motion.button>
                         ))}
                      </div>
                   </div>

                   <div className="p-8 bg-zinc-900/5 dark:bg-primary/5 rounded-[2.5rem] border border-primary/10">
                      <div className="flex items-center gap-3 mb-4">
                         <Bot size={16} className="text-primary" />
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">AURA_OS_INTEL</span>
                      </div>
                      <div className="h-1 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                         <motion.div 
                           animate={{ x: ['-100%', '100%'] }}
                           transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                           className="h-full w-1/3 bg-primary"
                         />
                      </div>
                      <p className="mt-4 text-[9px] font-mono text-zinc-500 uppercase leading-relaxed">
                         Nodes Synchronized: 128/128<br/>
                         Neural Latency: 0.04ms<br/>
                         Style_Registry: ONLINE
                      </p>
                   </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsAssistantOpen(false)}
                  className="w-full py-6 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3"
                >
                   <Power size={14} />
                   Shutdown Interface
                </motion.button>
                </div>
                
                <div className="flex-1 flex flex-col justify-between bg-white dark:bg-transparent overflow-hidden relative">
                   {/* Chat Header */}
                   <div className="px-12 py-8 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl z-10">
                      <div className="flex items-center gap-5">
                         <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center relative overflow-hidden group">
                               <motion.div 
                                 animate={{ rotate: 360 }}
                                 transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                 className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,var(--color-primary)_180deg,transparent_360deg)] opacity-20"
                               />
                               <Bot size={28} className="text-primary relative z-10" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-zinc-950" />
                         </div>
                         <div>
                            <h4 className="text-base font-black dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                               Neural Director
                               <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] tracking-tighter">AI_CORE</span>
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                               <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">v4.0.2 Stable Build</p>
                               <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                               <span className="text-[9px] font-mono text-primary animate-pulse uppercase">Syncing...</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <motion.button 
                           whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                           whileTap={{ scale: 0.95 }}
                           onClick={() => {
                             if (confirm('Verify: Purge all local neural traces?')) {
                               setAssistantMessages([{
                                 role: 'assistant',
                                 content: translations[lang].interaction.initMsg,
                                 moodboard: TRENDING_MOODBOARD,
                                 suggestions: translations[lang].interaction.suggestions
                               }]);
                             }
                           }}
                           className="p-4 bg-zinc-100 dark:bg-white/5 text-zinc-400 hover:text-red-500 rounded-2xl transition-all hover:shadow-lg border border-transparent hover:border-red-500/20"
                           title="Purge Logs"
                         >
                            <Trash2 size={20} />
                         </motion.button>
                      </div>
                   </div>

                   <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar scroll-smooth">
                      <AnimatePresence mode="popLayout">
                      {assistantMessages.map((m, i) => (
                        <motion.div 
                          key={i}
                          layout
                          initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 150, 
                            damping: 20
                          }}
                          className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} group/msg`}
                        >
                           <div className={`flex items-center gap-2 mb-3 px-6 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${m.role === 'user' ? 'bg-primary' : 'bg-zinc-500'} animate-pulse`} />
                              <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${m.role === 'user' ? 'text-primary' : 'text-zinc-500'}`}>
                                 {m.role === 'user' ? 'OPERATOR_LOCAL' : 'AURA_NEURAL_STATION'}
                              </span>
                           </div>
                           <motion.div 
                             whileHover={{ scale: 1.01 }}
                             className={`max-w-[90%] p-10 rounded-[3.5rem] text-[16px] leading-[1.6] shadow-2xl relative overflow-hidden backdrop-blur-sm ${
                             m.role === 'user' 
                               ? 'bg-zinc-900/90 text-white rounded-tr-none border border-white/20' 
                               : 'bg-white/90 dark:bg-zinc-900/50 dark:text-white rounded-tl-none border border-zinc-200 dark:border-white/10 font-serif italic'
                           }`}>
                              {m.role === 'assistant' && (
                                 <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                              )}
                              {m.content}
                           </motion.div>

                           {/* Structured Data: Suggestions */}
                           {m.role === 'assistant' && (m as any).suggestions?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-6 px-2">
                                 {(m as any).suggestions.map((s: string, idx: number) => (
                                    <motion.button 
                                      key={idx}
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleAssistantAction(s)}
                                      className="px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2"
                                    >
                                       <ArrowRight size={10} />
                                       {s}
                                    </motion.button>
                                 ))}
                              </div>
                           )}

                           {/* Structured Data: Moodboard */}
                           {m.role === 'assistant' && (m as any).moodboard?.length > 0 && (
                              <div className="space-y-6 mt-8 w-full">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                   {(m as any).moodboard.map((item: any, idx: number) => (
                                      <motion.div 
                                        key={idx} 
                                        whileHover={{ y: -5 }}
                                        className="aspect-[4/5] bg-zinc-100 dark:bg-white/10 rounded-3xl overflow-hidden border border-white/5 group cursor-pointer shadow-lg"
                                        onClick={() => handleSelectItem({
                                           id: item.id || `ref-${idx}`,
                                           style: item.title,
                                           imageUrl: item.url,
                                           category: 'Reference',
                                           tags: ['Moodboard'],
                                           description: `Neural reference from AI curation`,
                                           userId: 'system'
                                        })}
                                      >
                                          {moodboard3DItem === item.id ? (
                                             <div className="relative w-full h-full">
                                                <NeuralModelViewer 
                                                  url={item.modelUrl} 
                                                  onExportDesign={(img) => {
                                                     setProjectedDesign(img);
                                                     setActiveTab('operations');
                                                  }}
                                                />
                                                <button 
                                                   onClick={(e) => {
                                                      e.stopPropagation();
                                                      setMoodboard3DItem(null);
                                                   }}
                                                   className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
                                                >
                                                   <Minimize2 size={14} />
                                                </button>
                                             </div>
                                          ) : (
                                             <>
                                                <img src={item.url} alt="Reference" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                                   <p className="text-[10px] text-white font-black uppercase truncate">{item.title}</p>
                                                   {item.modelUrl && (
                                                      <button 
                                                         onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMoodboard3DItem(item.id);
                                                         }}
                                                         className="mt-2 w-full py-2 bg-primary text-black text-[8px] font-black uppercase rounded-lg hover:scale-105 active:scale-95 transition-all shadow-lg"
                                                      >
                                                         View in 3D
                                                      </button>
                                                   )}
                                                </div>
                                             </>
                                          )}
                                      </motion.div>
                                   ))}
                                </div>
                                <button 
                                  onClick={() => setHubData({
                                    ...m,
                                    title: "Neural Inspiration Board",
                                    context: "Assistant Intelligence"
                                  })}
                                  className="flex items-center gap-3 px-8 py-4 bg-zinc-100 dark:bg-white/5 hover:bg-primary dark:hover:bg-primary hover:text-black rounded-full transition-all text-zinc-500 dark:text-zinc-400 group border border-zinc-200 dark:border-white/10"
                                >
                                   <Share2 size={14} className="group-hover:rotate-12 transition-transform" />
                                   <span className="text-[10px] font-black uppercase tracking-widest">Share to Hub</span>
                                </button>
                              </div>
                           )}
                        </motion.div>
                      ))}
                      </AnimatePresence>
                      {isTyping && (
                         <div className="flex justify-start">
                            <div className="bg-zinc-100 dark:bg-white/5 p-8 rounded-[2.5rem] rounded-bl-none">
                               <div className="flex gap-2">
                                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-duration:0.6s]" />
                                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.1s]" />
                                  <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
                               </div>
                            </div>
                         </div>
                      )}
                      <div ref={messagesEndRef} />
                   </div>

                   <div className="p-12 border-t border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-950/80 backdrop-blur-xl">
                      <div className="relative group">
                         <textarea 
                           id="assistant-input"
                           rows={1}
                           value={assistantInput}
                           onChange={(e) => setAssistantInput(e.target.value)}
                           placeholder="Type a message or issue a command..."
                           className="w-full min-h-[72px] max-h-[200px] dark:bg-neutral-900/50 dark:text-white dark:border-neutral-800 border border-zinc-200 rounded-[2rem] px-8 py-6 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner no-scrollbar"
                           onKeyDown={(e) => {
                             if (e.key === 'Enter' && !e.shiftKey) {
                               e.preventDefault();
                               if (assistantInput.trim() && !isTyping) {
                                 handleAssistantAction(assistantInput);
                                 setAssistantInput('');
                                 e.currentTarget.style.height = '72px';
                               }
                             }
                           }}
                           onInput={(e) => {
                              const target = e.currentTarget;
                              target.style.height = '72px';
                              target.style.height = `${target.scrollHeight}px`;
                           }}
                         />
                         <motion.button 
                           whileHover={{ scale: 1.1, rotate: 5, boxShadow: "0 25px 50px -12px rgba(0, 184, 217, 0.5)" }}
                           whileTap={{ scale: 0.9, rotate: -5 }}
                           disabled={isTyping || !assistantInput.trim()}
                           onClick={() => {
                              const input = document.getElementById('assistant-input') as HTMLTextAreaElement;
                              if (input?.value.trim()) {
                                handleAssistantAction(input.value);
                                input.value = '';
                                input.style.height = '72px';
                              }
                           }}
                           className={`absolute right-4 bottom-4 p-5 rounded-3xl transition-all z-10 ${
                             isTyping || !assistantInput.trim() ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50' : 'bg-primary text-black shadow-[0_20px_40px_rgba(0,184,217,0.4)]'
                           }`}
                         >
                            {isTyping ? <RefreshCw size={24} className="animate-spin" /> : <Send size={24} />}
                         </motion.button>
                      </div>
                      <p className="mt-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest text-center opacity-50">
                         Neural Link Stable | Latency: 12ms | Cluster: EU-Alpha
                      </p>
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
