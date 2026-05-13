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
  Shield, Lock, Copy, MoreHorizontal, Monitor, Layout, Rocket, ShieldCheck, FileText
} from 'lucide-react';

import { AIOperationsCenter } from './AIOperationsCenter';
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
          <SafeImage src={item.imageUrl} alt={item.style} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 dark-suppress" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          <div className="absolute top-8 left-8 right-8 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-20px] group-hover:translate-y-0">
             <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-[10px] font-black uppercase text-white tracking-widest neon-purple">
                #{item.category}
             </div>
             <div className="p-4 bg-emerald-500 rounded-full text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-110 transition-all dark:bg-emerald-400">
                <Zap size={20} className="fill-current" />
             </div>
          </div>

          <div className="absolute bottom-10 left-10 right-10 opacity-0 group-hover:opacity-100 transition-all translate-y-20 group-hover:translate-y-0 duration-700">
                             <h3 className="text-3xl font-serif italic text-white mb-6 leading-tight zh:text-3xl zh:font-bold en:text-2xl en:font-normal en:tracking-tight en:break-words line-clamp-2 elastic-text">
                                {displayTitle}
                             </h3>
                             <div className="grid grid-cols-2 gap-3 en:grid-cols-1">
                                <button className="px-3 py-4 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                   Remix Concept
                                </button>
                                <button className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all flex items-center justify-center">
                                   <Download size={18} />
                                </button>
                             </div>
          </div>
       </div>
       <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
             <span className="text-[10px] font-black uppercase tracking-widest neon-green">Neural_Match_88%</span>
             <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-white/10" />
          </div>
          <div className="flex justify-between items-end">
             <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-sm font-serif italic text-zinc-400 uppercase tracking-tighter mb-1">Global Artifact</h4>
                <p className="font-bold dark:text-white leading-none zh:text-2xl en:text-xl en:tracking-tight en:break-words truncate elastic-text">
                   {displayTitle}
                </p>
             </div>
             <div className="text-right flex-shrink-0">
                <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Liquidity</h4>
                <p className="text-xl font-mono font-bold text-emerald-500 leading-none neon-green">
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
       <div className={`absolute inset-0 rounded-full border-2 border-white/5 ${task.status === TaskStatus.PROCESSING ? 'border-t-emerald-500 animate-spin' : ''}`} />
       <div className="absolute inset-0 flex items-center justify-center">
          {task.status === TaskStatus.COMPLETED ? <CheckCircle2 className="text-emerald-500" size={20} /> : <Zap size={18} className="text-emerald-500/50" />}
       </div>
    </div>
    <div className="flex-1 overflow-hidden">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{task.type}</span>
        <span className="text-[10px] font-mono text-emerald-400">{task.progress}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
         <motion.div 
           className="h-full bg-emerald-500"
           initial={{ width: 0 }}
           animate={{ width: `${task.progress}%` }}
         />
      </div>
    </div>
  </motion.div>
);

const FashionOSConsole: React.FC<{ 
  health: any; 
  status: string; 
  t: any; 
  registry?: any;
  globalQueue?: { id: string, progress: number, status: string } | null;
}> = ({ health, status, t, registry, globalQueue }) => {
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
             <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70">
               SYS_STATUS: <span className={status === 'online' ? 'text-emerald-500' : 'text-red-500'}>{status}</span>
             </span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="hidden md:flex items-center gap-6">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">GPU: {health?.gpu_runtime ? 'ARMED' : 'OFFLINE'}</span>
            
            {globalQueue && (
              <div className="flex items-center gap-3 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <Rocket size={10} className="text-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{globalQueue.status}</span>
                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${globalQueue.progress}%` }} />
                </div>
              </div>
            )}

            <span className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400/80">
              <Cpu size={10} /> {health?.gpu_stats?.raw || 'IDLE'}
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-mono text-purple-400/80">
              <Server size={10} /> {health?.workers?.active || 0} WORKERS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1 text-[8px] font-mono text-white/30 uppercase">
              <Database size={10} className={health?.redis ? 'text-emerald-500' : 'text-red-500'} /> REDIS
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
                  <Radio size={12} className={health?.python_runtime ? 'text-emerald-500' : 'text-red-500'} />
                  FastAPI_Bridge
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-serif italic text-white leading-tight">Qwen2.5:7b</p>
                  <p className="text-[9px] font-mono text-zinc-500 uppercase">State: Active</p>
                </div>
              </div>

              {/* GPU Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <Zap size={12} className="text-yellow-500" />
                  GPU_Compute
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-serif italic text-white leading-tight truncate">{health?.gpu_stats?.raw || 'N/A'}</p>
                  <div className="flex items-center gap-3">
                     <span className="text-[9px] font-mono text-emerald-500">ONLINE</span>
                  </div>
                </div>
              </div>

              {/* Infrastructure Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <Database size={12} className="text-blue-500" />
                  Cluster_Data
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-white flex justify-between">
                    Redis <span className={health?.redis ? "text-emerald-500 uppercase" : "text-red-500 uppercase"}>{health?.redis ? "Online" : "Offline"}</span>
                  </p>
                  <p className="text-[10px] font-medium text-white flex justify-between">
                    Workers <span className="text-emerald-500 uppercase">{health?.workers?.active} Ready</span>
                  </p>
                </div>
              </div>

              {/* Registry Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <Network size={12} className="text-purple-500" />
                  Task_Bus
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-serif italic text-white leading-none">Healthy</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 underline decoration-purple-500 underline-offset-4">Stream Ready</p>
                </div>
              </div>
            </div>

            {/* Model Registry List */}
            {registry && (
               <div className="px-10 pb-10">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                     <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30 mb-2">
                        <List size={12} /> Model_Inventory
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
                  <span>PROTO: FOS-V2</span>
                  <span>BUILD: PRODUCTION</span>
                  <span>NODE: LOCAL_CLUSTER</span>
               </div>
               <div className="text-[8px] font-black uppercase tracking-[0.4em] text-emerald-500/50 animate-pulse">
                  Kernel Authorized & Synchronized
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
}> = ({ src, alt, className, onLoad }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden group/img ${className}`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
          <div className="w-8 h-8 border-[1px] border-zinc-200 border-t-zinc-800 dark:border-zinc-800 dark:border-t-white rounded-full animate-spin z-10" />
        </div>
      )}
      {hasError ? (
        <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-900 flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-800 p-4 text-center">
          <Camera size={24} className="mb-2 opacity-30" />
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] leading-tight opacity-50">Archive Integrity<br/>Failure</span>
        </div>
      ) : (
        <motion.img 
          src={src} 
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.8 }}
          className={`${className} object-cover`}
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

const NeuralViewport: React.FC<{
  item: FashionItem;
  is3D: boolean;
  onToggle3D: () => void;
}> = ({ item, is3D, onToggle3D }) => {
  const [isReconstructing, setIsReconstructing] = useState(false);

  useEffect(() => {
    if (is3D && !isReconstructing) {
      setIsReconstructing(true);
      const timer = setTimeout(() => setIsReconstructing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [is3D]);

  return (
    <div className="w-full h-full relative bg-zinc-100 dark:bg-black group overflow-hidden">
      <AnimatePresence mode="wait">
        {!is3D ? (
          <motion.div
            key="2d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <SafeImage 
              src={item.imageUrl} 
              alt={item.style} 
              className="w-full h-full object-cover" 
            />
          </motion.div>
        ) : (
          <motion.div
            key="3d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            {isReconstructing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 z-20 bg-black">
                <div className="w-16 h-16 border-t-2 border-emerald-500 rounded-full animate-spin" />
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-2">Neural_Reconstruction_Active</p>
                  <p className="text-xs font-mono text-zinc-500">Processing volumetric point cloud...</p>
                </div>
              </div>
            ) : (
              <model-viewer
                src={item.modelUrl || "https://modelviewer.dev/shared-assets/models/Astronaut.glb"}
                alt="3D Neural Reconstruction"
                auto-rotate
                camera-controls
                shadow-intensity="1"
                environment-image="neutral"
                exposure="1"
                class="w-full h-full bg-zinc-950"
                style={{ width: '100%', height: '100%' }}
              ></model-viewer>
            )}
            
            <div className="absolute top-1/2 left-10 -translate-y-1/2 space-y-2">
               {['VOX_ALIGNED', 'QUAD_REFLOW', 'TEX_SYNTH'].map(status => (
                  <div key={status} className="flex items-center gap-2">
                     <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                     <span className="text-[8px] font-mono text-emerald-500/50 uppercase">{status}</span>
                  </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end pointer-events-none">
         <div className="max-w-[70%]">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-4 block">FOS_ARCHIVE_MATCH</span>
            <h2 className="text-5xl font-serif italic text-white leading-tight uppercase tracking-tighter truncate">{item.style}</h2>
         </div>
         <button 
           onClick={(e) => {
             e.stopPropagation();
             onToggle3D();
           }}
           className="pointer-events-auto w-16 h-16 glass border-white/20 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all active:scale-95 group/btn shadow-2xl"
         >
           {is3D ? <Maximize2 size={24} /> : <Box size={24} className="group-hover/btn:text-emerald-500 transition-colors" />}
         </button>
      </div>
    </div>
  );
};

const SuperShareHub: React.FC<{ 
  data: any; 
  onClose: () => void; 
  onPush: (target: string, data: any) => void;
}> = ({ data, onClose, onPush }) => {
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
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-4 block underline">OS_HUB_READY</span>
              <h2 className="text-4xl font-serif italic text-white leading-tight uppercase tracking-tighter">
                Quantum<br/>Distribution Hub
              </h2>
              <div className="mt-8 flex gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                 <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-none">Team Sync Active</span>
              </div>
           </div>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 p-12 space-y-10 overflow-y-auto no-scrollbar">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Cross-Module Operations</p>
                 <h3 className="text-2xl dark:text-white font-serif italic">Manifest neural inspiration across all sectors.</h3>
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
                { id: 'public', label: 'Global', icon: Globe },
                { id: 'team', label: 'Team', icon: Shield },
                { id: 'private', label: 'Encrypted', icon: Lock }
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
                className="p-8 bg-zinc-100 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10 flex flex-col items-start gap-4 hover:border-emerald-500/30 hover:bg-emerald-500/5 group transition-all text-left"
              >
                 <Library size={24} className="text-emerald-500" />
                 <div>
                    <h5 className="text-[11px] font-black dark:text-white uppercase tracking-widest mb-1">Push to Archival</h5>
                    <p className="text-[9px] text-zinc-500 uppercase font-mono">Sync style metadata into registry</p>
                 </div>
              </button>

              <button 
                disabled={isProcessing}
                onClick={() => handleShare('synthesis')}
                className="p-8 bg-zinc-100 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10 flex flex-col items-start gap-4 hover:border-purple-500/30 hover:bg-purple-500/5 group transition-all text-left"
              >
                 <Zap size={24} className="text-purple-500" />
                 <div>
                    <h5 className="text-[11px] font-black dark:text-white uppercase tracking-widest mb-1">Inject Synthesis</h5>
                    <p className="text-[9px] text-zinc-500 uppercase font-mono">Map prompt variables to engine</p>
                 </div>
              </button>

              <button 
                disabled={isProcessing}
                onClick={() => handleShare('laboratory')}
                className="p-8 bg-zinc-100 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10 flex flex-col items-start gap-4 hover:border-blue-500/30 hover:bg-blue-500/5 group transition-all text-left"
              >
                 <Box size={24} className="text-blue-500" />
                 <div>
                    <h5 className="text-[11px] font-black dark:text-white uppercase tracking-widest mb-1">Load to VTO_Lab</h5>
                    <p className="text-[9px] text-zinc-500 uppercase font-mono">Pre-cache garment in fitting room</p>
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
                    <h5 className="text-[11px] font-black dark:text-white uppercase tracking-widest mb-1">Neural Collaborative</h5>
                    <p className="text-[9px] text-zinc-500 uppercase font-mono">Generate dynamic session link</p>
                 </div>
              </button>
           </div>

           {isProcessing && (
              <div className="pt-4 space-y-3">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-emerald-500">
                    <span>Compressing Neural Weights...</span>
                    <span>72%</span>
                 </div>
                 <div className="h-1 bg-zinc-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500" 
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
  const [lang, setLang] = useState<Language>(getBrowserLanguage());
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
    content: "Fashion OS initialized. Neural pathways standing by. Based on the latest high-fashion reports for Summer 2025, I've curated a trend moodboard for you.",
    moodboard: TRENDING_MOODBOARD,
    suggestions: ["Analyze trends", "Generate synthesis", "Start search"]
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
  const [is3DActive, setIs3DActive] = useState(false);
  const [itemVariants, setItemVariants] = useState<string[]>([]);
  const [isGeneratingVariant, setIsGeneratingVariant] = useState(false);
  const [hubData, setHubData] = useState<any | null>(null);
  const [globalQueue, setGlobalQueue] = useState<{ id: string, progress: number, status: string } | null>(null);
  const [preloadedGarment, setPreloadedGarment] = useState<string | null>(null);
  const [preloadedPrompt, setPreloadedPrompt] = useState<string | null>(null);
  const [curatedItems, setCuratedItems] = useState<FashionItem[]>([]);
  const [userRole, setUserRole] = useState<UserRole>('CEO');
  const [lockedItems, setLockedItems] = useState<Set<string>>(new Set());

  const handleSelectItem = (item: FashionItem | null) => {
    setSelectedItem(item);
    setIs3DActive(false);
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
          const newItem: FashionItem = {
            id: 'curated_' + Date.now(),
            title: data.title || "Neural Concept " + Math.floor(Math.random()*1000),
            style: data.title || "Neural Concept",
            description: "Curated in-system concept",
            tags: ['AI-Selected', 'Curated'],
            imageUrl: data.url || data.imageUrl || (data.moodboard && data.moodboard[0]?.url),
            price: Math.floor(Math.random() * 500) + 100,
            category: 'Avant-Garde',
            sustainability: 85,
            velocity: 0.9,
            vogue: 0.95
          };
          setCuratedItems(prev => [newItem, ...prev]);
          setActiveTab('gallery');
          setNotification("Concept registered in Archival Matrix.");
        } else if (target === 'synthesis') {
          setPreloadedPrompt(data.content || data.title || "Experimental Style Synthesis");
          setActiveTab('operations');
          setNotification("Parametric variables injected into Synthesis core.");
        } else if (target === 'laboratory') {
          setPreloadedGarment(data.url || data.imageUrl || (data.moodboard && data.moodboard[0]?.url));
          setActiveTab('operations');
          setNotification("Garment pre-cached in Lab-VRAM.");
        } else if (target === 'link') {
          setNotification("Collaborative Neural Link active in clipboard.");
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
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-900 dark:text-white transition-all">Fashion_OS</span>
           </div>
           
           <div className="flex items-center gap-6">
              {[
                { id: 'gallery', label: 'Archival', icon: Library },
                { id: 'moodboard', label: 'Inspiration', icon: LayoutGrid },
                { id: 'operations', label: 'AI Operations Center', icon: Activity },
                { id: 'settings', label: 'Kernel', icon: Cpu }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-2 group transition-all ${activeTab === item.id ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-white/40 hover:text-zinc-900 dark:hover:text-white'}`}
                >
                   <item.icon size={14} className={activeTab === item.id ? 'text-emerald-500' : ''} />
                   <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
           </div>

           <div className="flex items-center gap-4 pl-8 border-l border-black/5 dark:border-white/10">
              <button 
                onClick={() => setIsAssistantOpen(true)}
                className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-zinc-900 dark:text-white"
              >
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute top-1.5 right-1.5 animate-pulse" />
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
                          <span className="text-[10px] font-black uppercase tracking-[1em] text-emerald-500 mb-6 block">Future_Manifest</span>
                          <h2 className="text-7xl md:text-9xl font-serif text-white uppercase tracking-tighter leading-none mb-8">
                             Neural<br/><span className="italic">Aesthetics</span>
                          </h2>
                          <div className="flex justify-center gap-6">
                             <div className="flex items-center gap-2 px-6 py-3 glass rounded-full border border-white/20">
                                <Activity size={14} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Real-time Analysis</span>
                             </div>
                             <div className="flex items-center gap-2 px-6 py-3 glass rounded-full border border-white/20">
                                <Sparkles size={14} className="text-purple-400" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Generative Core</span>
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
                            className="h-full bg-emerald-500"
                            animate={{ width: ['0%', '100%'] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          />
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-4 block">Fashion Global Pulse</span>
                      <h1 className="font-serif text-6xl md:text-8xl leading-none uppercase tracking-tighter dark:text-white">Trend DNA<br/><span className="italic">Sub-Matrix</span></h1>
                    </div>
                    <div className="flex gap-4">
                       <div className="glass px-8 py-5 rounded-[2rem] border border-white/10 text-center">
                          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Queue Load</p>
                          <p className="text-3xl font-mono text-emerald-500 font-bold leading-none">{activeTasksCount}</p>
                       </div>
                       <div className="glass px-8 py-5 rounded-[2rem] border border-white/10 text-center">
                          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Registry Uptime</p>
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
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-2 block">Curation Matrix</span>
                    <h2 className="font-serif text-7xl uppercase tracking-tighter dark:text-white leading-none">Aesthetic<br/><span className="italic">Moodboard</span></h2>
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
                       <Share2 size={16} className="text-emerald-500 group-hover:text-current" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Share moodboard</span>
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
                     <SafeImage src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-10 flex flex-col justify-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Trend_Reference</span>
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
           <AIOperationsCenter lang={lang} />
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
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-2 block">AI Kernel Registry</span>
                   <h2 className="font-serif text-6xl uppercase tracking-tighter dark:text-white leading-none">Cluster<br/><span className="italic">Inventory</span></h2>
                </div>
                <div className="text-right space-y-2">
                   <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest bg-zinc-100 dark:bg-white/5 px-4 py-2 rounded-full border border-zinc-200 dark:border-white/10">
                      SYS_UUID: FOS-88A2-X
                   </p>
                   <p className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">STATE: SYNCHRONIZED</p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Registry Section */}
                <div className="space-y-8">
                   <div className="p-10 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-white/5 shadow-sm">
                      <div className="flex items-center gap-3 mb-8">
                         <List size={20} className="text-emerald-500" />
                         <h4 className="text-2xl font-serif italic dark:text-white uppercase tracking-tighter">Model Stack</h4>
                      </div>
                      <div className="space-y-4">
                         {registry?.models?.map((m: any) => (
                           <div key={m.id} className="p-6 bg-zinc-50 dark:bg-black/40 rounded-3xl border border-zinc-100 dark:border-white/5 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                              <div>
                                 <p className="text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">{m.id}</p>
                                 <p className="text-[9px] text-zinc-400 uppercase font-mono mt-1">{m.type}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                 <span className="text-[8px] font-black uppercase text-emerald-500 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">READY</span>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="p-10 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-white/5 shadow-sm">
                      <div className="flex items-center gap-3 mb-8">
                         <Code size={20} className="text-blue-500" />
                         <h4 className="text-2xl font-serif italic dark:text-white uppercase tracking-tighter">Fashion LoRAs</h4>
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
                            <p className="text-sm text-zinc-500 italic text-center py-4">No active style LoRAs attached</p>
                         )}
                      </div>
                   </div>
                </div>

                {/* Operations Section */}
                <div className="space-y-8">
                   <div className="p-10 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-white/5 shadow-sm">
                      <div className="flex items-center gap-3 mb-8">
                         <Shield size={20} className="text-emerald-500" />
                         <h4 className="text-2xl font-serif italic dark:text-white uppercase tracking-tighter">Authority Level</h4>
                      </div>
                         <div className="grid grid-cols-2 gap-4 p-2 bg-zinc-100 dark:bg-black/40 rounded-[2rem] border border-zinc-200 dark:border-white/10">
                            {['en', 'zh', 'it', 'fr'].map(l => (
                               <button 
                                 key={l}
                                 onClick={() => setLang(l as any)}
                                 className={`py-3 px-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${lang === l ? 'bg-emerald-500 text-black shadow-xl' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                               >
                                  {l === 'en' ? 'EN_NEURAL' : l === 'zh' ? 'ZH_SYNC' : l === 'it' ? 'IT_CRAFT' : 'FR_ATELIER'}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div className="p-10 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-white/5 shadow-sm">
                         <div className="flex items-center gap-3 mb-8">
                            <Shield size={20} className="text-emerald-500" />
                            <h4 className="text-2xl font-serif italic dark:text-white uppercase tracking-tighter">Authority Level</h4>
                         </div>
                         <div className="grid grid-cols-2 gap-4 p-2 bg-zinc-100 dark:bg-black/40 rounded-[2rem] border border-zinc-200 dark:border-white/10">
                            {['SOURCING', 'DESIGNER', 'MARKETER', 'CEO'].map(role => (
                               <button 
                                 key={role}
                                 onClick={() => setUserRole(role as any)}
                                 className={`py-6 px-4 rounded-3xl text-[9px] font-black uppercase tracking-widest transition-all ${userRole === role ? 'bg-emerald-500 text-black shadow-xl shadow-emerald-500/20Scale-105' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                               >
                                  {role.replace('_', ' ')}
                               </button>
                            ))}
                         </div>
                      </div>

                   <div className="p-10 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-white/5 shadow-sm">
                      <div className="flex items-center justify-between mb-10">
                         <div className="flex items-center gap-3">
                            <Server size={20} className="text-purple-500" />
                            <h4 className="text-2xl font-serif italic dark:text-white uppercase tracking-tighter">GPU Clusters</h4>
                         </div>
                      </div>
                      <div className="space-y-4">
                         {registry?.workers?.map((w: any) => (
                           <div key={w.id} className="p-6 bg-zinc-50 dark:bg-black/40 rounded-3xl border border-zinc-100 dark:border-white/5 flex items-center justify-between group">
                              <div className="flex items-center gap-4">
                                 <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                 <div>
                                    <p className="text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">{w.id}</p>
                                    <p className="text-[9px] text-zinc-400 uppercase font-mono">{w.gpu || 'RTX Cluster'}</p>
                                 </div>
                              </div>
                              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">ONLINE</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="p-10 bg-black rounded-[3rem] border border-white/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all duration-1000" />
                      <div className="relative z-10 flex flex-col items-start gap-8">
                         <div>
                           <h4 className="text-3xl font-serif italic text-white flex items-center gap-3">
                              <Zap className="text-emerald-500" /> Neural Pipeline
                           </h4>
                           <p className="text-zinc-500 text-sm mt-4 max-w-sm leading-relaxed">
                              Flush the VRAM buffers across the distributed cluster. Recommended after heavy Synthesis sessions.
                           </p>
                         </div>
                         <button 
                            onClick={async () => {
                              await fetch("/api/fashion/runtime/op", { method: "POST", body: JSON.stringify({ action: 'CLEAR_VRAM' }) });
                            }}
                            className="w-full py-6 bg-emerald-500 text-black rounded-3xl text-[11px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                         >
                            Purge Global VRAM
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
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
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
                <NeuralViewport 
                  item={selectedItem} 
                  is3D={is3DActive} 
                  onToggle3D={() => setIs3DActive(!is3DActive)} 
                />
                
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
                      <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <Cpu size={24} className="text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="text-3xl font-serif italic dark:text-white uppercase tracking-tighter">AI Style Analysis</h4>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mt-1">Neural Topology & Market Insight</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Metric Card: Sustainability */}
                      <div className="p-10 bg-zinc-50 dark:bg-black/40 rounded-[3rem] border border-zinc-100 dark:border-white/5 space-y-8 group hover:border-emerald-500/30 transition-all">
                         <div className="flex justify-between items-center">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                              <Globe size={18} className="text-emerald-500" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-emerald-500 transition-colors">Sustainability</span>
                         </div>
                         <div className="space-y-4">
                            <div className="flex justify-between items-end">
                               <p className="text-5xl font-serif italic text-zinc-900 dark:text-white">{selectedItem.analysis?.sustainability || 72}%</p>
                               <span className="text-[9px] font-mono text-emerald-500 mb-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">NODE_TRUST</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-200 dark:bg-white/5 rounded-full overflow-hidden p-[2px]">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${selectedItem.analysis?.sustainability || 72}%` }}
                                 className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
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
                      <div className="p-10 bg-black rounded-[3rem] border border-emerald-500/20 space-y-6">
                         <div className="flex justify-between items-center">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                              <ShieldCheck size={18} className="text-emerald-500" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{t.gallery.esg}</span>
                         </div>
                         <div className="space-y-2">
                           <p className="text-xs font-mono text-emerald-500/80 uppercase">EU_REGULATION_REACH_COMPLIANT</p>
                           <p className="text-[9px] font-mono text-zinc-500 uppercase">Verification Hash: 0x88...F2A</p>
                         </div>
                         <button className="w-full py-4 border border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all">
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
                               <CheckCircle2 size={10} className="text-emerald-500" /> Molecularly Verified
                            </p>
                         </div>
                      </div>
                    </div>

                    {/* Color Palette Sub-section */}
                    <div className="p-12 bg-black rounded-[3rem] border border-white/5 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-all duration-1000" />
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
                           <RefreshCw size={18} className={`text-emerald-500 ${isGeneratingVariant ? 'animate-spin' : ''}`} />
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
                          className="px-6 py-2 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all disabled:opacity-50"
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
                           <Zap size={20} className="fill-current neon-green group-hover:animate-pulse" />
                           Dispatch to All Sectors
                        </button>
                        <button className="p-8 glass border border-zinc-200 dark:border-white/10 rounded-[2.5rem] text-zinc-900 dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all">
                           <Download size={24} />
                        </button>
                     </div>
                     <p className="text-[9px] font-mono text-center text-zinc-400 uppercase tracking-[0.3em]">
                        Neural Hash: <span className="text-emerald-500">{selectedItem.id}</span> | State: <span className="text-blue-500">Volatile</span>
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
            userRole={userRole}
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
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Neural Assistant</span>
                      </div>
                      <h3 className="text-4xl font-serif italic dark:text-white leading-tight">Digital<br/>Curator</h3>
                   </div>
                   
                   <div className="flex-1 space-y-8">
                      <div className="p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-zinc-100 dark:border-white/10">
                         <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-4">Command History</p>
                         <div className="space-y-4">
                            {['Gen Dior Campaign', 'Clear Cache', 'Analyze VTO'].map(cmd => (
                               <div key={cmd} className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-600 font-mono">
                                  <Terminal size={12} /> {cmd}
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   <button 
                     onClick={() => setIsAssistantOpen(false)}
                     className="w-full py-5 border border-zinc-200 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
                   >
                      Shutdown Interface
                   </button>
                </div>
                
                <div className="flex-1 flex flex-col justify-between bg-white dark:bg-transparent overflow-hidden">
                   <div className="flex-1 overflow-y-auto p-12 space-y-6 no-scrollbar">
                      {assistantMessages.map((m, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                           <div className={`max-w-[80%] p-6 rounded-[2.5rem] text-sm leading-relaxed ${m.role === 'user' ? 'bg-black text-white rounded-br-none' : 'bg-zinc-100 dark:bg-white/5 dark:text-white rounded-bl-none italic'} elastic-text`}>
                              {m.content}
                           </div>

                           {/* Structured Data: Suggestions */}
                           {m.role === 'assistant' && (m as any).suggestions?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4 px-2">
                                 {(m as any).suggestions.map((s: string, idx: number) => (
                                    <button 
                                      key={idx}
                                      onClick={() => handleAssistantAction(s)}
                                      className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"
                                    >
                                       {s}
                                    </button>
                                 ))}
                              </div>
                           )}

                           {/* Structured Data: Moodboard */}
                           {m.role === 'assistant' && (m as any).moodboard?.length > 0 && (
                              <div className="space-y-4 mt-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-sm">
                                   {(m as any).moodboard.map((item: any, idx: number) => (
                                      <div key={idx} className="aspect-square bg-zinc-100 dark:bg-white/10 rounded-2xl overflow-hidden border border-white/5 group">
                                         <img src={item.url} alt="Reference" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                      </div>
                                   ))}
                                </div>
                                 <button 
                                  onClick={() => setHubData({
                                    ...m,
                                    title: "Neural Inspiration Board",
                                    context: "Assistant Intelligence"
                                  })}
                                  className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-white/5 hover:bg-emerald-400 dark:hover:bg-emerald-400 hover:text-black rounded-full transition-all text-zinc-500 dark:text-zinc-400 group"
                                >
                                   <Share2 size={12} className="group-hover:rotate-12 transition-transform" />
                                   <span className="text-[9px] font-black uppercase tracking-widest">Quantum Hub Dispatch</span>
                                </button>
                              </div>
                           )}
                        </motion.div>
                      ))}
                      {isTyping && (
                         <div className="flex justify-start">
                            <div className="bg-zinc-100 dark:bg-white/5 p-6 rounded-[2.5rem] rounded-bl-none">
                               <div className="flex gap-2">
                                  <div className="w-2 h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full animate-bounce" />
                                  <div className="w-2 h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full animate-bounce [animation-delay:0.2s]" />
                                  <div className="w-2 h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full animate-bounce [animation-delay:0.4s]" />
                               </div>
                            </div>
                         </div>
                      )}
                   </div>

                   <div className="p-12 border-t border-zinc-100 dark:border-white/5">
                      <div className="relative group">
                         <input 
                           id="assistant-input"
                           placeholder="Type command or query..."
                           className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full px-10 py-6 text-base italic font-serif focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all dark:text-white"
                           onKeyDown={(e) => {
                             if (e.key === 'Enter') {
                               handleAssistantAction((e.target as HTMLInputElement).value);
                               (e.target as HTMLInputElement).value = '';
                             }
                           }}
                         />
                         <button className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-emerald-500 text-black rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all">
                            <Send size={20} />
                         </button>
                      </div>
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
