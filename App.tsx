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
  Radio, Database, Network, ChevronDown, List, Code, HardDrive, Terminal
} from 'lucide-react';

import { AppState, FashionItem, ChatMessage, Theme } from './types';
import { MOCK_FASHION_GALLERY, FASHION_CATEGORIES, fileToBase64, optimizeImage } from './utils';
import { 
  getFashionAssistantResponse, 
  generateTextImage, 
  getRuntimeHealth,
  getSystemRegistry,
  getGenerationHistory
} from './services/geminiService';
import { translations, getBrowserLanguage, Language } from './services/translationService';

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

const FashionOSConsole: React.FC<{ health: any; status: string; t: any; registry?: any }> = ({ health, status, t, registry }) => {
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

const LaboratorySection: React.FC<{ createTask: (type: string, payload: any) => Promise<string | null>; addLocalTask: (id: string, type: string) => void; t: any }> = ({ createTask, addLocalTask, t }) => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDropPerson = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setPersonImage(base64);
    }
  }, []);

  const onDropGarment = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setGarmentImage(base64);
    }
  }, []);

  const { getRootProps: getPersonProps, getInputProps: getPersonInput, isDragActive: isPersonDrag } = useDropzone({ onDrop: onDropPerson, accept: { 'image/*': [] }, multiple: false });
  const { getRootProps: getGarmentProps, getInputProps: getGarmentInput, isDragActive: isGarmentDrag } = useDropzone({ onDrop: onDropGarment, accept: { 'image/*': [] }, multiple: false });

  const handleTryOn = async () => {
    if (!personImage || !garmentImage) return;
    setIsProcessing(true);
    const taskId = await createTask('TRY_ON', { person_image: personImage, garment_image: garmentImage });
    if (taskId) {
      addLocalTask(taskId, 'TRY_ON');
    }
    setIsProcessing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto py-32 px-6">
      <div className="mb-20">
         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-2 block">Experimental Protocol</span>
         <h2 className="font-serif text-7xl uppercase tracking-tighter dark:text-white leading-none">Virtual<br/><span className="italic">Try-On Lab</span></h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Drop Zones */}
         <div className="space-y-12">
            <div className="space-y-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">01_Source_Human</span>
               <div 
                 {...getPersonProps()}
                 className={`aspect-video rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden relative ${isPersonDrag ? 'border-blue-500 bg-blue-500/5' : 'border-zinc-200 dark:border-white/5 hover:border-zinc-400 dark:hover:border-white/20'}`}
               >
                  <input {...getPersonInput()} />
                  {personImage ? (
                    <>
                      <img src={personImage} className="w-full h-full object-cover" alt="Source Human" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <RefreshCw className="text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <User size={32} className="text-zinc-300 mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Drop person reference</p>
                    </>
                  )}
               </div>
            </div>

            <div className="space-y-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">02_Garment_DNA</span>
               <div 
                 {...getGarmentProps()}
                 className={`aspect-video rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden relative ${isGarmentDrag ? 'border-purple-500 bg-purple-500/5' : 'border-zinc-200 dark:border-white/5 hover:border-zinc-400 dark:hover:border-white/20'}`}
               >
                  <input {...getGarmentInput()} />
                  {garmentImage ? (
                    <>
                      <img src={garmentImage} className="w-full h-full object-cover" alt="Garment DNA" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <RefreshCw className="text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Shirt size={32} className="text-zinc-300 mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Drop garment image</p>
                    </>
                  )}
               </div>
            </div>
         </div>

         {/* Control & Preview Area */}
         <div className="flex flex-col">
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-[4rem] border border-zinc-100 dark:border-white/5 p-12 flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               
               <div className="z-10 text-center">
                  <div className="mb-10 flex justify-center gap-10">
                     <div className={`p-6 rounded-full border border-zinc-200 dark:border-white/10 ${personImage ? 'bg-emerald-500/10 border-emerald-500/20' : ''}`}>
                        <User className={personImage ? 'text-emerald-500' : 'text-zinc-300'} />
                     </div>
                     <ArrowRight className="text-zinc-300 mt-6" />
                     <div className={`p-6 rounded-full border border-zinc-200 dark:border-white/10 ${garmentImage ? 'bg-emerald-500/10 border-emerald-500/20' : ''}`}>
                        <Shirt className={garmentImage ? 'text-emerald-500' : 'text-zinc-300'} />
                     </div>
                  </div>

                  <h3 className="text-3xl font-serif dark:text-white italic mb-4">Neural Fitting Sequence</h3>
                  <p className="text-sm text-zinc-500 max-w-xs mx-auto mb-10 leading-relaxed">
                     Our AI runtime will decompose the garment texture and remap it onto the human frame using latent-space pose estimation.
                  </p>

                  <button 
                    disabled={!personImage || !garmentImage || isProcessing}
                    onClick={handleTryOn}
                    className="w-full py-8 bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.5em] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl"
                  >
                     {isProcessing ? 'Initializing Kernel...' : 'Execute Try-On Sequence'}
                  </button>
               </div>
            </div>
            
            <div className="mt-12 p-8 bg-black rounded-[2.5rem] border border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Cpu className="text-blue-500" />
                  <div>
                     <p className="text-[10px] font-black text-white uppercase tracking-widest">Inference_Engine</p>
                     <p className="text-[9px] text-zinc-500 font-mono">ESTIMATED_TIME: ~12s</p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 text-zinc-500 rounded-full border border-white/10">POSE_SYNC_V4</span>
                  <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 text-zinc-500 rounded-full border border-white/10">TEX_MAP_HD</span>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

const GenerationsSection: React.FC<{ tasks: FashionTask[]; t: any }> = ({ tasks, t }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto py-32 px-6"
    >
      <div className="flex justify-between items-end mb-16">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 mb-2 block">Neural Storage</span>
          <h2 className="font-serif text-6xl uppercase tracking-tighter dark:text-white leading-none">Generation<br/><span className="italic">History</span></h2>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest bg-zinc-100 dark:bg-white/5 px-4 py-2 rounded-full border border-zinc-200 dark:border-white/10">
            LOADED_ASSETS: {tasks.length}
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="h-[50vh] flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-[3rem] bg-zinc-50/50 dark:bg-black/20">
          <HardDrive size={48} className="text-zinc-200 dark:text-zinc-800 mb-6" />
          <p className="font-serif italic text-xl text-zinc-400">Memory matrix is currently sparse</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {tasks.map((task) => (
             <motion.div 
               key={task.id}
               className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-2xl transition-all group"
             >
                <div className="aspect-square relative overflow-hidden bg-zinc-100 dark:bg-black">
                   {task.status === TaskStatus.COMPLETED && task.result_url ? (
                     <img src={task.result_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-10 text-center">
                        <div className="w-16 h-16 border-2 border-t-purple-500 border-white/5 rounded-full animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 animate-pulse">{task.status}...</p>
                     </div>
                   )}
                   <div className="absolute top-6 left-6 flex gap-2">
                      <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-black/60 backdrop-blur-md text-white rounded-full border border-white/20">
                         {task.type}
                      </span>
                   </div>
                </div>
                <div className="p-8">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">{new Date(task.created_at).toLocaleString()}</span>
                      {task.metadata?.aesthetic_score && (
                         <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase">
                            Score: {task.metadata.aesthetic_score}
                         </span>
                      )}
                   </div>
                   <h4 className="font-serif text-xl italic dark:text-white truncate mb-2">
                      {task.metadata?.prompt || "Neural manifest"}
                   </h4>
                   <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-white/5">
                      <span className="text-[8px] font-black uppercase text-zinc-400">Model: {task.metadata?.model || 'SDXL'}</span>
                      <span className="text-[8px] font-black uppercase text-zinc-400">Style: {task.metadata?.style || 'Editorial'}</span>
                      {task.metadata?.generation_time && <span className="text-[8px] font-black uppercase text-zinc-400">Time: {task.metadata.generation_time}s</span>}
                   </div>

                   <div className="h-[10px]" />
                   <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-white/5 mt-4">
                      <div className="flex gap-2">
                        {task.metadata?.model && <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{task.metadata.model}</span>}
                      </div>
                      <div className="flex gap-2">
                         <button className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition-all dark:text-white">
                           <Download size={14} />
                         </button>
                         <button className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition-all dark:text-white">
                           <Share2 size={14} />
                         </button>
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      )}
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [lang] = useState<Language>(getBrowserLanguage());
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<"gallery" | "generations" | "laboratory" | "settings">("gallery");
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
    content: "Fashion OS initialized. Neural pathways standing by. How shall we manifest today's aesthetic?"
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('moda-theme');
      return saved === Theme.DARK ? Theme.DARK : Theme.LIGHT;
    }
    return Theme.LIGHT;
  });

  useEffect(() => {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('moda-theme', theme);
  }, [theme]);

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
      const response = await getFashionAssistantResponse([
        ...assistantMessages,
        { role: 'user', content: input }
      ]);
      
      setAssistantMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.reply,
        suggestions: response.suggestions,
        moodboard: response.moodboard,
        generation_actions: response.generation_actions
      }]);

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
                { id: 'generations', label: 'Synthesis', icon: Zap },
                { id: 'laboratory', label: 'Laboratory', icon: Box },
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
             className="pt-32 pb-48 px-10"
           >
              <div className="max-w-7xl mx-auto">
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
                    {MOCK_FASHION_GALLERY.map((item, idx) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative cursor-pointer"
                        onClick={() => {
                          // In a full app, this would open details
                          console.log("View item", item.id);
                        }}
                      >
                         <div className="aspect-[3/4] relative overflow-hidden rounded-[3rem] border border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.2)] transition-all">
                            <SafeImage src={item.imageUrl} alt={item.style} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            
                            <div className="absolute top-8 left-8 right-8 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-20px] group-hover:translate-y-0">
                               <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-[10px] font-black uppercase text-white tracking-widest">
                                  #{item.category}
                               </div>
                               <div className="p-4 bg-emerald-500 rounded-full text-black shadow-xl">
                                  <Zap size={20} />
                               </div>
                            </div>

                            <div className="absolute bottom-10 left-10 right-10 opacity-0 group-hover:opacity-100 transition-all translate-y-20 group-hover:translate-y-0 duration-700">
                               <h3 className="text-3xl font-serif italic text-white mb-6 leading-tight">{item.style}</h3>
                               <div className="flex gap-3">
                                  <button className="flex-1 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                     Remix Concept
                                  </button>
                                  <button className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-white hover:text-black transition-all">
                                     <Download size={18} />
                                  </button>
                               </div>
                            </div>
                         </div>
                         <div className="p-8">
                            <div className="flex items-center gap-3 mb-2">
                               <div className="w-10 h-[1px] bg-zinc-300 dark:bg-white/10" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Vogue Intelligence Index</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                               <p className="text-3xl font-serif italic dark:text-white uppercase tracking-tighter leading-none">{item.style.split(' ')[0]}</p>
                               <span className="text-2xl font-black italic text-emerald-500">{item.analysis?.vogueIndex}%</span>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                 </div>
              </div>
           </motion.div>
        )}

        {activeTab === 'generations' && (
           <GenerationsSection key="generations" tasks={allGenerations} t={t} />
        )}

        {activeTab === 'laboratory' && (
           <LaboratorySection 
             key="laboratory" 
             createTask={createTask} 
             addLocalTask={addLocalTask} 
             t={t} 
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
                              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">{status}</span>
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

      {/* OS Dashboard Layers */}
      <FashionOSConsole health={health} status={healthStatus} t={t} registry={registry} />

      {/* Task Stack */}
      <div className="fixed bottom-24 right-10 z-[600]">
         <AnimatePresence>
            {tasks.slice(0, 3).map(task => (
               <TaskNotification key={task.id} task={task} />
            ))}
         </AnimatePresence>
      </div>

      {/* Assistant Modal */}
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
                           <div className={`max-w-[80%] p-6 rounded-[2.5rem] text-sm leading-relaxed ${m.role === 'user' ? 'bg-black text-white rounded-br-none' : 'bg-zinc-100 dark:bg-white/5 dark:text-white rounded-bl-none italic'}`}>
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
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 w-full max-w-sm">
                                 {(m as any).moodboard.map((item: any, idx: number) => (
                                    <div key={idx} className="aspect-square bg-zinc-100 dark:bg-white/10 rounded-2xl overflow-hidden border border-white/5 group">
                                       <img src={item.url} alt="Reference" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                 ))}
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
