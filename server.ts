import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- Fashion OS Registry & State ---

interface Worker {
  id: string;
  name: string;
  type: 'GPU' | 'CPU' | 'TPU';
  status: 'idle' | 'busy' | 'offline' | 'restarting';
  gpu_memory: number; // MB
  load: number;
}

interface Agent {
  id: string;
  name: string;
  role: 'Runtime' | 'Trend' | 'Campaign' | 'Director' | 'Styling';
  status: 'idle' | 'active' | 'thinking';
  permission: 'Observer' | 'Operator' | 'Director' | 'Admin' | 'Autonomous';
}

interface Task {
  id: string;
  type: string;
  status: 'queued' | 'loading_model' | 'generating' | 'completed' | 'failed';
  progress: number;
  result_url?: string;
  created_at: number;
  agent_id?: string;
}

const REGISTRY = {
  models: [
    { id: 'fashion-sdxl-1.0', name: 'SDXL Fashion Master', status: 'online', type: 'image' },
    { id: 'ollama-llama3', name: 'Ollama Llama 3 (Fashion Tuning)', status: 'online', type: 'text' },
    { id: 'lora-cyberpunk-2077', name: 'Cyberpunk Aesthetic LoRA', status: 'idle', type: 'lora' },
    { id: 'garment-segmentation-v2', name: 'Precision Segmenter', status: 'online', type: 'vision' }
  ],
  workers: [
    { id: 'worker-01', name: 'A100-NODE-ALPHA', type: 'GPU', status: 'idle', gpu_memory: 81920, load: 0 },
    { id: 'worker-02', name: 'H100-NODE-BETA', type: 'GPU', status: 'busy', gpu_memory: 81920, load: 75 },
    { id: 'worker-03', name: 'RTX-6000-ADAX', type: 'GPU', status: 'idle', gpu_memory: 49152, load: 12 }
  ] as Worker[],
  agents: [
    { id: 'agent-director', name: 'AURA_CORE', role: 'Director', status: 'active', permission: 'Autonomous' },
    { id: 'agent-trend', name: 'NEURAL_PULSE', role: 'Trend', status: 'idle', permission: 'Operator' },
    { id: 'agent-runtime', name: 'MATRIX_WATCHDOG', role: 'Runtime', status: 'active', permission: 'Admin' }
  ] as Agent[]
};

// --- Shared Fashion Memory (The Persistent Kernel) ---
const FASHION_MEMORY = {
  trends: [
    { id: 't1', topic: 'Bio-Digital Textures', velocity: 0.85, region: 'Global', nodes: ['Sustainable', 'Cyber', 'Organic'] },
    { id: 't2', topic: 'Neo-Italian Heritage', velocity: 0.72, region: 'Europe', nodes: ['Classic', 'Luxe', 'Modernist'] },
    { id: 't3', topic: 'Hyper-Functional Utility', velocity: 0.94, region: 'Asia', nodes: ['Techwear', 'Modular', 'Urban'] }
  ],
  brand_dna: {
    'ModaAI': { aesthetic: 'Minimalist Tech', colors: ['#000000', '#FFFFFF', '#00FF41'], materials: ['Recycled Nylon', 'Graphene Fiber'] }
  },
  history: [
    { timestamp: Date.now() - 3600000, event: 'System Boot', actor: 'AURA_CORE' },
    { timestamp: Date.now() - 1800000, event: 'Trend Graph Synchronized', actor: 'NEURAL_PULSE' }
  ]
};

const TASK_QUEUE: Task[] = [];
let clients: any[] = [];
let systemLogs: string[] = [];

// --- SSE Broadcast Functions ---

function addLog(msg: string, level: 'INFO' | 'WARN' | 'ACTION' | 'AI' = 'INFO') {
  const log = `[${new Date().toISOString().split('T')[1].split('.')[0]}] [${level}] ${msg}`;
  systemLogs.unshift(log);
  if (systemLogs.length > 100) systemLogs.pop();
  broadcast({ type: 'log', message: log, level });
}

function broadcast(data: any) {
  clients.forEach(c => {
    c.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// --- Agent Autonomous Reasoning Simulation ---

setInterval(() => {
  // Proactive detection simulation
  const random = Math.random();
  if (random > 0.95) {
    const agent = REGISTRY.agents.find(a => a.role === 'Trend');
    if (agent) {
      addLog(`[AUTONOMOUS_DETECTION] Trend Agent detected shift in Pinterest 'Cyber-Floral' vibes.`, 'AI');
      const taskId = `auto_${Math.random().toString(36).substr(2, 9)}`;
      const newTask: Task = {
        id: taskId,
        type: 'AUTO_INGESTION',
        status: 'queued',
        progress: 0,
        created_at: Date.now(),
        agent_id: agent.id
      };
      TASK_QUEUE.unshift(newTask);
      broadcast({ type: 'task_update', task: newTask });
      simulateTaskProcessing(taskId);
    }
  }
}, 30000);

// --- Runtime Simulation Logic ---

function simulateTaskProcessing(taskId: string) {
  const task = TASK_QUEUE.find(t => t.id === taskId);
  if (!task) return;

  const statuses: Task['status'][] = ['loading_model', 'generating', 'completed'];
  let currentStep = 0;

  const interval = setInterval(() => {
    if (currentStep < statuses.length) {
      task.status = statuses[currentStep];
      task.progress = (currentStep + 1) * 33;
      
      if (task.status === 'completed') {
        task.progress = 100;
        if (task.type === 'GENERATE' || task.type === 'AUTO_INGESTION') {
          task.result_url = `https://picsum.photos/seed/${taskId}/800/1200`;
        }
        clearInterval(interval);
        addLog(`Task ${taskId} finalized by System Runtime.`, 'INFO');
      }
      
      broadcast({ type: 'task_update', task });
      currentStep++;
    } else {
      clearInterval(interval);
    }
  }, 1500 + Math.random() * 2000);
}

// --- API Endpoints ---

// Runtime & Health
app.get("/api/fashion/runtime/health", (req, res) => {
  res.json({
    success: true,
    online: true,
    health: {
      status: 'online',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      queue_depth: TASK_QUEUE.filter(t => t.status === 'queued').length,
      active_workers: REGISTRY.workers.filter(w => w.status !== 'offline').length,
      total_workers: REGISTRY.workers.length,
      redis: true,
      python_runtime: true,
      gpu_runtime: true,
      gpu_stats: { raw: 'NVIDIA A100-SXM4-40GB | 32.4GB/40.0GB' },
      workers: { active: REGISTRY.workers.filter(w => w.status !== 'offline').length }
    }
  });
});

// AI Director Autonomous Loop (Simulated)
setInterval(() => {
  const roll = Math.random();
  if (roll > 0.8) {
    const alerts = [
      "VRAM depth reaching 85% on Worker_01 - initiating partial buffer flush",
      "Trend velocity spike detected in Neo-Italian Heritage - re-weighting embedding bias",
      "Model flux.1-dev-fp8 loaded into VRAM cache for designer agents",
      "Shared Memory sync complete: Global artifacts consolidated",
      "GPU Watchdog verified all 4 runtime kernels operational",
      "Detected suboptimal queue routing - re-balancing task distribution"
    ];
    const log = {
      timestamp: new Date().toLocaleTimeString(),
      level: roll > 0.95 ? 'warn' : 'info',
      module: 'DIRECTOR',
      message: alerts[Math.floor(Math.random() * alerts.length)]
    };
    broadcast({ type: 'log', log });
  }
}, 5000);

// System Registry
app.get("/api/fashion/registry", (req, res) => {
  res.json(REGISTRY);
});

app.post("/api/fashion/registry", (req, res) => {
  res.json(REGISTRY);
});

// SSE Stream
app.get("/api/fashion/runtime/stream", (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  const clientId = Date.now();
  const newClient = { id: clientId, res };
  clients.push(newClient);

  req.on('close', () => {
    clients = clients.filter(c => c.id !== clientId);
  });
});

// Fashion Memory Graph
app.get("/api/fashion/memory", (req, res) => {
  res.json(FASHION_MEMORY);
});

// Agent Control System (The Brain)
app.post("/api/agents/chat", async (req, res) => {
  const { message, context } = req.body;
  const userRole = context?.role || 'Guest';
  
  addLog(`${userRole} directive to Director: "${message}"`, 'AI');

  // Multi-tool Orchestration Simulation
  let reply = "";
  let action = null;

  if (message.toLowerCase().includes('generate') || message.toLowerCase().includes('design')) {
    const trend = FASHION_MEMORY.trends[0];
    reply = `Orchestrating design sequence based on ${trend.topic} (Velocity: ${trend.velocity}). Selecting SDXL-Fashion node.`;
    action = { type: 'GENERATE', params: { prompt: message, agent: 'AURA_CORE', trend_focus: trend.topic } };
    addLog(`ACTION: Initializing latent space synthesis for ${trend.topic}...`, 'ACTION');
  } else if (message.toLowerCase().includes('restart') || message.toLowerCase().includes('fix')) {
    const worker = REGISTRY.workers.find(w => w.status === 'busy') || REGISTRY.workers[0];
    reply = `Executing forced synchronization on ${worker.name}. System stability priority maximized.`;
    action = { type: 'WORKER_RECYCLE', target: worker.id };
    addLog(`CRITICAL: Recycling node ${worker.name}...`, 'WARN');
    worker.status = 'restarting';
    setTimeout(() => { 
      worker.status = 'idle'; 
      broadcast({ type: 'registry_update', registry: REGISTRY }); 
      addLog(`Worker ${worker.name} successfully re-integrated.`, 'INFO');
    }, 5000);
  } else if (message.toLowerCase().includes('trend')) {
    const trendList = FASHION_MEMORY.trends.map(t => t.topic).join(', ');
    reply = `Scanning global matrix... Current shared memory includes hotspots: ${trendList}. Top velocity: ${FASHION_MEMORY.trends[2].topic}.`;
    action = { type: 'TREND_SCAN', results: FASHION_MEMORY.trends };
    addLog(`DATASET: Syncing trend topology with Fashion Memory Graph...`, 'INFO');
  } else {
    reply = `Kernel synchronized for ${userRole}. System is currently optimal. Awaiting strategic directive from the Director Hub.`;
  }

  res.json({ 
    success: true, 
    reply, 
    action,
    stats: {
      gpu_status: 'NOMINAL',
      memory_usage: '42.8 GB',
      active_agents: REGISTRY.agents.length
    }
  });
});

// Task History
app.get("/api/fashion/history", (req, res) => {
  res.json({ success: true, history: TASK_QUEUE, data: TASK_QUEUE });
});

// Task Submission
app.post("/api/fashion/generate", (req, res) => {
  const taskId = `task_${Math.random().toString(36).substr(2, 9)}`;
  const newTask: Task = {
    id: taskId,
    type: 'GENERATE',
    status: 'queued',
    progress: 0,
    created_at: Date.now()
  };
  
  TASK_QUEUE.unshift(newTask);
  res.json({ success: true, task_id: taskId, generation_id: taskId, status: "queued" });
  
  broadcast({ type: 'task_update', task: newTask });
  simulateTaskProcessing(taskId);
});

// Task Polling
app.get("/api/fashion/tasks/:id", (req, res) => {
  const task = TASK_QUEUE.find(t => t.id === req.params.id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ success: false, error: "Task not found" });
  }
});

// Try On
app.post("/api/fashion/tryon", (req, res) => {
  const taskId = `vto_${Math.random().toString(36).substr(2, 9)}`;
  const newTask: Task = {
    id: taskId,
    type: 'TRY_ON',
    status: 'queued',
    progress: 0,
    created_at: Date.now()
  };
  
  TASK_QUEUE.unshift(newTask);
  res.json({ success: true, task_id: taskId, status: "queued" });
  
  broadcast({ type: 'task_update', task: newTask });
  simulateTaskProcessing(taskId);
});

// --- AI Operations Center Endpoints ---

// Runtime Controls
app.post("/api/runtime/start", (req, res) => {
  console.log("[RUNTIME] Starting engine...");
  res.json({ success: true, message: "Engine started" });
});

app.post("/api/runtime/stop", (req, res) => {
  console.log("[RUNTIME] Stopping engine...");
  res.json({ success: true, message: "Engine stopped" });
});

app.post("/api/runtime/restart", (req, res) => {
  console.log("[RUNTIME] Restarting engine...");
  res.json({ success: true, message: "Engine restarted" });
});

app.post("/api/runtime/workers/restart", (req, res) => {
  console.log("[RUNTIME] Restarting workers...");
  REGISTRY.workers.forEach(w => w.status = 'idle');
  res.json({ success: true, message: "Workers recycled" });
});

app.post("/api/runtime/watchdog/sync", (req, res) => {
  console.log("[RUNTIME] GPU Watchdog Syncing...");
  res.json({ success: true, message: "Watchdog synchronized" });
});

app.post("/api/runtime/oom/flush", (req, res) => {
  console.log("[RUNTIME] OOM Flush initiated...");
  res.json({ success: true, message: "Memory pressure released" });
});

// Model Management
app.post("/api/models/load/sdxl", (req, res) => {
  console.log("[MODELS] Loading SDXL weights...");
  res.json({ success: true, message: "SDXL loaded" });
});

app.post("/api/models/load/ollama", (req, res) => {
  console.log("[MODELS] Loading Ollama Llama3...");
  res.json({ success: true, message: "Ollama initialized" });
});

app.post("/api/models/load/qdrant", (req, res) => {
  console.log("[MODELS] Connecting to Qdrant...");
  res.json({ success: true, message: "Qdrant connected" });
});

app.post("/api/models/pulse", (req, res) => {
  console.log("[MODELS] Running pulse check...");
  res.json({ success: true, message: "All weights verified" });
});

app.post("/api/models/switch", (req, res) => {
  console.log("[MODELS] Switching model versions...");
  res.json({ success: true, message: "Version migrated" });
});

// Dataset & Scraping
app.post("/api/dataset/scrape/tiktok", (req, res) => {
  console.log("[DATASET] Scraping TikTok trending...");
  res.json({ success: true, message: "TikTok crawl initiated" });
});

app.post("/api/dataset/scrape/instagram", (req, res) => {
  console.log("[DATASET] Scraping IG Reels...");
  res.json({ success: true, message: "IG crawl initiated" });
});

app.post("/api/dataset/sync/pinterest", (req, res) => {
  console.log("[DATASET] Syncing Pinterest boards...");
  res.json({ success: true, message: "Pinterest synced" });
});

app.post("/api/dataset/clean", (req, res) => {
  console.log("[DATASET] Scrubbing outliers...");
  res.json({ success: true, message: "Dataset cleaned" });
});

app.post("/api/dataset/export", (req, res) => {
  console.log("[DATASET] Exporting metadata...");
  res.json({ success: true, message: "Metadata exported" });
});

// Queue Management
app.post("/api/queue/clear", (req, res) => {
  console.log("[QUEUE] Clearing all jobs...");
  TASK_QUEUE.length = 0;
  res.json({ success: true, message: "Queue purged" });
});

app.post("/api/queue/prioritize", (req, res) => {
  console.log("[QUEUE] Balancing task priorities...");
  res.json({ success: true, message: "Priorities updated" });
});

app.post("/api/queue/pause", (req, res) => {
  console.log("[QUEUE] Processing paused...");
  res.json({ success: true, message: "Queue suspended" });
});

app.post("/api/queue/resume", (req, res) => {
  console.log("[QUEUE] Processing resumed...");
  res.json({ success: true, message: "Queue active" });
});

app.post("/api/queue/logs", (req, res) => {
  console.log("[QUEUE] Fetching logs...");
  res.json({ success: true, message: "Logs fetched" });
});

// Memory
app.post("/api/memory/sync", (req, res) => {
  console.log("[MEMORY] Persistent Sync...");
  res.json({ success: true, message: "State persisted" });
});

app.post("/api/memory/flush", (req, res) => {
  console.log("[MEMORY] Flushing cache...");
  res.json({ success: true, message: "Cache cleared" });
});

app.post("/api/memory/graph/rebuild", (req, res) => {
  console.log("[MEMORY] Rebuilding Knowledge Graph...");
  res.json({ success: true, message: "Graph rebuilt" });
});

// Training
app.post("/api/training/lora/train", (req, res) => {
  console.log("[TRAINING] Starting LoRA training...");
  res.json({ success: true, message: "Training initiated" });
});

app.post("/api/training/stop", (req, res) => {
  console.log("[TRAINING] Stopping training...");
  res.json({ success: true, message: "Training halted" });
});

app.post("/api/training/export", (req, res) => {
  console.log("[TRAINING] Exporting weights...");
  res.json({ success: true, message: "Weights exported" });
});

app.post("/api/training/curve", (req, res) => {
  console.log("[TRAINING] Fetching loss curve...");
  res.json({ success: true, message: "Curve data sent" });
});

// Try-On
app.post("/api/fashion/tryon/init", (req, res) => {
  console.log("[TRYON] Initializing fitting sequence...");
  res.json({ success: true, message: "Try-On kernel ready" });
});

app.post("/api/fashion/tryon/batch", (req, res) => {
  console.log("[TRYON] Batch try-on initiated...");
  res.json({ success: true, message: "Batch started" });
});

app.post("/api/fashion/tryon/warp", (req, res) => {
  console.log("[TRYON] Calibrating warp mesh...");
  res.json({ success: true, message: "Calibration complete" });
});

// Agents
app.post("/api/agents/spawn", (req, res) => {
  console.log("[AGENTS] Spawning new agent...");
  res.json({ success: true, message: "Agent active" });
});

app.post("/api/agents/terminate", (req, res) => {
  console.log("[AGENTS] Terminating agent...");
  res.json({ success: true, message: "Agent offline" });
});

app.post("/api/agents/pulse", (req, res) => {
  console.log("[AGENTS] Sending sync pulse...");
  res.json({ success: true, message: "Agents synchronized" });
});

// Monitoring
app.post("/api/monitoring/alerts/config", (req, res) => {
  console.log("[MONITORING] Updating alert config...");
  res.json({ success: true, message: "Config saved" });
});

app.post("/api/monitoring/snapshot", (req, res) => {
  console.log("[MONITORING] Creating system snapshot...");
  res.json({ success: true, message: "Snapshot saved" });
});

app.post("/api/monitoring/profile", (req, res) => {
  console.log("[MONITORING] Profiling performance...");
  res.json({ success: true, message: "Profiling done" });
});

// --- Server Startup & Vite Middleware ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FASHION-OS] Core Matrix Engine Active on Port ${PORT}`);
  });
}

startServer();
