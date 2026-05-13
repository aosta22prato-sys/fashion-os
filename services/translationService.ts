
import { Language } from '../types';

export interface Translations {
  hero: {
    title: string;
    subtitle: string;
    placeholder: string;
    analyze: string;
  };
  nav: {
    curator: string;
    moodboard: string;
    settings: string;
    operations: string;
  };
  tabs: {
    gallery: string;
    design: string;
    interaction: string;
    settings: string;
    operations: string;
  };
  gallery: {
    title: string;
    curation: string;
    trendScore: string;
    visualSearch: string;
    upload: string;
    analyzing: string;
    searchDesc: string;
    neuralAnalysis: string;
    sustainability: string;
    heritage: string;
    velocity: string;
    composition: string;
    download: string;
    share: string;
    copied: string;
    sharePinterest: string;
    shareTwitter: string;
    shareFacebook: string;
    filterByStyle: string;
    filterByTag: string;
    resetFilters: string;
    styles: string;
    tags: string;
    addToDesign: string;
    added: string;
    designConcept: string;
    generatingDesign: string;
    viewSeries: string;
    series: string;
    techPack: string;
    esg: string;
    remix: string;
    neuralMatch: string;
    globalArtifact: string;
    liquidity: string;
    futureManifest: string;
    realTimeAnalysis: string;
    generativeCore: string;
    trendDna: string;
    subMatrix: string;
    queueLoad: string;
    registryUptime: string;
  };
  moodboard: {
    title: string;
    empty: string;
    export: string;
    remove: string;
    share: string;
    curationMatrix: string;
    appendedConcept: string;
  };
  settings: {
    theme: string;
    light: string;
    dark: string;
    authLevel: string;
    modelStack: string;
    factoryExport: string;
    blueprint: string;
    molecularlyVerified: string;
    chromaticSpectrum: string;
    neuralScraper: {
      title: string;
      subtitle: string;
      status: string;
      sources: string;
      action: string;
      configure: string;
    };
  };
  styleGen: {
    button: string;
    prompt: string;
    generating: string;
    result: string;
    close: string;
  };
  design: {
    title: string;
    subtitle: string;
    generate: string;
    promptLabel: string;
    placeholder: string;
    labStatus: string;
  };
  ops: {
    matrix: string;
    agents: string;
    memory: string;
    logs: string;
    director: string;
    health: string;
    gpuFabric: string;
    clusterSync: string;
    queueIntel: string;
    activeRequests: string;
    prioritize: string;
    flushCache: string;
    runtimeControls: string;
    highLevelAccess: string;
    modelsTopology: string;
    modelsInventory: string;
    triggerWatchdog: string;
    executeRestart: string;
    load: string;
    unload: string;
    forceSync: string;
    activeTrends: string;
    syncState: string;
    optimal: string;
    gpuWatchdog: string;
    kernelSync: string;
    trendVelocity: string;
    hubSummary: string;
    intelligenceState: string;
    brandMemory: string;
    recycleWorkers: string;
    agentStatus: string;
    syncLoRA: string;
    systemDirective: string;
    nodeTime: string;
    autonomous: string;
    gpuMonitorDesc: string;
    kernelSyncDesc: string;
    taskBacklog: string;
    oomFlush: string;
    kernelSyncPersist: string;
    vramFlush: string;
    vramPurgeDesc: string;
    vramPurgeAction: string;
    directorHub: string;
    state: string;
    security: string;
    manageNode: string;
    orchestrator: string;
  };
  hub: {
    title: string;
    subtitle: string;
    ready: string;
    syncActive: string;
    crossModule: string;
    manifestNeural: string;
    global: string;
    team: string;
    encrypted: string;
    pushArchival: string;
    syncStyle: string;
    injectSynthesis: string;
    mapPrompt: string;
    loadLab: string;
    preCache: string;
    neuralCollab: string;
    generateLink: string;
    compressing: string;
  };
  common: {
    sysStatus: string;
    armed: string;
    offline: string;
    ready: string;
    active: string;
    idle: string;
    busy: string;
    online: string;
    type: string;
    state: string;
    sync: string;
    healthy: string;
    streamReady: string;
    inventory: string;
    gpu: string;
    workers: string;
    redis: string;
    proto: string;
    build: string;
    node: string;
    authorized: string;
  };
  system: {
    reconstructionActive: string;
    processingCloud: string;
    voxAligned: string;
    quadReflow: string;
    texSynth: string;
    archiveMatch: string;
    hubReady: string;
    teamSync: string;
    crossModule: string;
    compressingWeights: string;
    archivalPushed: string;
    variableInjected: string;
    garmentPrecached: string;
    linkActive: string;
    kernelAuthorized: string;
    buildProduction: string;
    nodeLocal: string;
    protoV2: string;
    sysUuid: string;
    heartbeatSync: string;
    archiveIntegrityFailure: string;
  };
  interaction: {
    title: string;
    subtitle: string;
    placeholder: string;
    initMsg: string;
    suggestions: string[];
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    hero: {
      title: "Intelligent Design, Trend Gallery.",
      subtitle: "Bestsellers",
      placeholder: "Discover the next global trend...",
      analyze: "Analyze Trend"
    },
    nav: {
      curator: "ModaUI Curator",
      moodboard: "My Moodboard",
      settings: "Settings",
      operations: "Operations Hub"
    },
    tabs: {
      gallery: "Gallery",
      design: "Design",
      interaction: "AI Interaction",
      settings: "Settings",
      operations: "Operations"
    },
    gallery: {
      title: "Global Trends",
      curation: "Intelligent Curation",
      trendScore: "Trend Score",
      visualSearch: "Visual Search",
      upload: "Upload Reference",
      analyzing: "Analyzing Style",
      searchDesc: "Upload a sketch, a fabric pattern, or a reference photo. Our AI vision model will dissect the silhouette.",
      neuralAnalysis: "Neural Analysis",
      sustainability: "Sustainability",
      heritage: "Heritage Score",
      velocity: "Trend Velocity",
      composition: "Composition",
      download: "Download HD",
      share: "Share Concept",
      copied: "Link Copied",
      sharePinterest: "Pinterest",
      shareTwitter: "X / Twitter",
      shareFacebook: "Facebook",
      filterByStyle: "Filter by Style",
      filterByTag: "Filter by Tag",
      resetFilters: "Reset Filters",
      styles: "Styles",
      tags: "Tags",
      addToDesign: "Add to Design",
      added: "Added",
      designConcept: "Design Concept",
      generatingDesign: "Generating Design...",
      viewSeries: "View Series",
      series: "Series",
      techPack: "Generate Tech Pack",
      esg: "ESG Compliance",
      remix: "Remix Concept",
      neuralMatch: "Neural Match",
      globalArtifact: "Global Artifact",
      liquidity: "Liquidity",
      futureManifest: "Future Manifest",
      realTimeAnalysis: "Real-time Analysis",
      generativeCore: "Generative Core",
      trendDna: "Trend DNA",
      subMatrix: "Sub-Matrix",
      queueLoad: "Queue Load",
      registryUptime: "Registry Uptime"
    },
    design: {
      title: "AI Studio Workshop",
      subtitle: "Creative Lab",
      generate: "Generate Concept",
      promptLabel: "Style Seed",
      placeholder: "e.g. Victorian Cyberpunk with Silk accents...",
      labStatus: "Neural Engine Active"
    },
    interaction: {
      title: "ModaUI Intelligence",
      subtitle: "Ask the Curator",
      placeholder: "Inquire about trend cycles...",
      initMsg: "Fashion OS initialized. Neural pathways standing by. Based on the latest high-fashion reports for Summer 2025, I've curated a trend moodboard for you.",
      suggestions: ["Analyze trends", "Generate synthesis", "Start search"]
    },
    ops: {
      matrix: "Compute Matrix",
      agents: "Agent Mesh",
      memory: "Fashion Memory",
      logs: "Neural Logs",
      director: "AURA_CORE Director",
      health: "Kernel Status",
      gpuFabric: "Distributed GPU Fabric",
      clusterSync: "Cluster Synchronization",
      queueIntel: "Queue Intelligence",
      activeRequests: "Active Neural Requests",
      prioritize: "Prioritize",
      flushCache: "Flush Cache",
      runtimeControls: "System Runtime Precision Controls",
      highLevelAccess: "High Level Access Required",
      modelsTopology: "Model Neural Topology",
      modelsInventory: "Model Inventory & Registry",
      triggerWatchdog: "Trigger Watchdog",
      executeRestart: "Execute Restart",
      load: "Load",
      unload: "Unload",
      forceSync: "Force Global Sync",
      activeTrends: "Active Trends",
      syncState: "Sync State",
      optimal: "OPTIMAL",
      gpuWatchdog: "GPU Watchdog Monitor",
      kernelSync: "Kernel Synchronization",
      trendVelocity: "Global Trend Velocity Matrix",
      hubSummary: "Neural Hub Summary",
      intelligenceState: "Shared Intelligence State",
      brandMemory: "Shared Brand Memory",
      recycleWorkers: "Recycle Workers",
      agentStatus: "Agent System Status",
      syncLoRA: "Sync to LoRA Train",
      systemDirective: "System Directive",
      nodeTime: "node-time",
      autonomous: "System AURA_CORE is autonomous.",
      gpuMonitorDesc: "Monitors latent-space temperature and heartbeat.",
      kernelSyncDesc: "Full kernel re-synchronization. Flushes VRAM.",
      taskBacklog: "Task Backlog in Cluster",
      oomFlush: "OOM Flush Sequence",
      kernelSyncPersist: "Persistent Kernel Sync",
      vramFlush: "Neural Pipeline",
      vramPurgeDesc: "Flush the VRAM buffers across the distributed cluster. Recommended after heavy Synthesis sessions.",
      vramPurgeAction: "Purge Global VRAM",
      directorHub: "Director Hub",
      state: "State",
      security: "Security",
      manageNode: "Manage Node",
      orchestrator: "Orchestrator"
    },
    hub: {
      title: "Quantum Distribution Hub",
      subtitle: "Manifest neural inspiration across all sectors.",
      ready: "OS_HUB_READY",
      syncActive: "Team Sync Active",
      crossModule: "Cross-Module Operations",
      manifestNeural: "Manifest neural inspiration across all sectors.",
      global: "Global",
      team: "Team",
      encrypted: "Encrypted",
      pushArchival: "Push to Archival",
      syncStyle: "Sync style metadata into registry",
      injectSynthesis: "Inject Synthesis",
      mapPrompt: "Map prompt variables to engine",
      loadLab: "Load to VTO_Lab",
      preCache: "Pre-cache garment in fitting room",
      neuralCollab: "Neural Collaborative",
      generateLink: "Generate dynamic session link",
      compressing: "Compressing Neural Weights..."
    },
    moodboard: {
      title: "Your Moodboard",
      empty: "Your creative board is empty.",
      export: "Export Collection",
      remove: "Remove from board",
      share: "Share moodboard",
      curationMatrix: "Curation Matrix",
      appendedConcept: "Append new aesthetic concept"
    },
    settings: {
      theme: "Theme Mode",
      light: "Light",
      dark: "Dark",
      authLevel: "Authority Level",
      modelStack: "Model Stack",
      factoryExport: "Export to Factory (PLT/DXF)",
      blueprint: "Digital Blueprint v2.0",
      molecularlyVerified: "Molecularly Verified",
      chromaticSpectrum: "Chromatic Spectrum",
      neuralScraper: {
        title: "Neural Scraper Engine",
        subtitle: "Global Trend Automated Harvesting",
        status: "Active Streams",
        sources: "Sources: IG, Pinterest, Vogue, Runway",
        action: "Trigger Forced Sync",
        configure: "Configure Sources"
      }
    },
    common: {
      sysStatus: "SYS_STATUS",
      armed: "ARMED",
      offline: "OFFLINE",
      ready: "READY",
      active: "ACTIVE",
      idle: "IDLE",
      busy: "BUSY",
      online: "ONLINE",
      type: "TYPE",
      state: "STATE",
      sync: "SYNC",
      healthy: "HEALTHY",
      streamReady: "STREAM READY",
      inventory: "INVENTORY",
      gpu: "GPU",
      workers: "WORKERS",
      redis: "REDIS",
      proto: "PROTO",
      build: "BUILD",
      node: "NODE",
      authorized: "AUTHORIZED",
      coreAesthetic: "Core Aesthetic",
      keyMaterials: "Key Materials",
      neuralMatch: "Neural Match",
      agentManage: "Manage Node",
      agentState: "State",
      agentSecurity: "Security",
      logStream: "SYS_LOG_STREAM",
      authorityLevel: "Authority Level",
      modelStack: "Model Stack",
      gpuClusters: "GPU Clusters",
      gpuWatchdogDesc: "GPU High-Performance Monitor",
      neuralPipeline: "Neural Pipeline",
      vramPurgeDesc: "Flush the VRAM buffers across the distributed cluster.",
      vramPurgeAction: "Purge Global VRAM"
    },
    system: {
      reconstructionActive: "Neural_Reconstruction_Active",
      processingCloud: "Processing volumetric point cloud...",
      voxAligned: "VOX_ALIGNED",
      quadReflow: "QUAD_REFLOW",
      texSynth: "TEX_SYNTH",
      archiveMatch: "FOS_ARCHIVE_MATCH",
      hubReady: "OS_HUB_READY",
      teamSync: "Team Sync Active",
      crossModule: "Cross-Module Operations",
      compressingWeights: "Compressing Neural Weights...",
      archivalPushed: "Concept registered in Archival Matrix.",
      variableInjected: "Parametric variables injected into Synthesis core.",
      garmentPrecached: "Garment pre-cached in Lab-VRAM.",
      linkActive: "Collaborative Neural Link active in clipboard.",
      kernelAuthorized: "Kernel Authorized & Synchronized",
      buildProduction: "PRODUCTION",
      nodeLocal: "LOCAL_CLUSTER",
      protoV2: "FOS-V2",
      sysUuid: "SYS_UUID",
      heartbeatSync: "HEARTBEAT_SYNC",
      archiveIntegrityFailure: "Archive Integrity Failure"
    }
  },
  zh: {
    hero: {
      title: "时装智能化，全球爆款库。",
      subtitle: "趋势爆款",
      placeholder: "搜索全球时尚趋势...",
      analyze: "核心分析"
    },
    nav: {
      curator: "ModaUI 策展管家",
      moodboard: "我的灵感板",
      settings: "系统设置",
      operations: "运营枢纽"
    },
    tabs: {
      gallery: "图库",
      design: "设计",
      interaction: "交互",
      settings: "设置",
      operations: "运营"
    },
    gallery: {
      title: "全球趋势",
      curation: "智能策展",
      trendScore: "流行指数",
      visualSearch: "视觉搜索",
      upload: "上传参考图",
      analyzing: "正在分析风格",
      searchDesc: "上传草图、面料图案或参考照片。我们的 AI 视觉模型将剖析廓形。",
      neuralAnalysis: "神经元分析",
      sustainability: "环保评定",
      heritage: "历史底蕴",
      velocity: "流行趋势",
      composition: "面料成分",
      download: "下载高清图",
      share: "分享灵感",
      copied: "链接已复制",
      sharePinterest: "Pinterest",
      shareTwitter: "X / 推特",
      shareFacebook: "Facebook",
      filterByStyle: "按风格筛选",
      filterByTag: "按标签筛选",
      resetFilters: "重置筛选",
      styles: "风格",
      tags: "标签",
      addToDesign: "加入设计",
      added: "已加入",
      designConcept: "设计概念",
      generatingDesign: "正在生成设计...",
      viewSeries: "查看系列",
      series: "组图",
      techPack: "生成技术包",
      esg: "ESG 合规",
      remix: "重塑概念",
      neuralMatch: "神经匹配度",
      globalArtifact: "全球档案",
      liquidity: "市场流动性",
      futureManifest: "未来宣言",
      realTimeAnalysis: "实时分析",
      generativeCore: "生成核心",
      trendDna: "趋势基因 (Trend DNA)",
      subMatrix: "子矩阵",
      queueLoad: "队列负载",
      registryUptime: "注册表正常运行时间"
    },
    design: {
      title: "AI 创意实验室",
      subtitle: "设计工坊",
      generate: "生成方案",
      promptLabel: "风格种子",
      placeholder: "例如：带有丝绸点缀的维多利亚赛博朋克...",
      labStatus: "神经引擎已启用"
    },
    interaction: {
      title: "ModaUI 智能系统",
      subtitle: "咨询策展人",
      placeholder: "查询趋势周期...",
      initMsg: "时尚操作系统已初始化。神经通路就绪。根据 2025 年夏季最新高级时装报告，我为您策划了一个趋势灵感板。",
      suggestions: ["分析趋势", "生成综述", "开始搜索"]
    },
    ops: {
      matrix: "算力矩阵",
      agents: "智能体集群",
      memory: "时尚记忆图谱",
      logs: "神经日志",
      director: "AURA_CORE 系统总监",
      health: "核心状态",
      gpuFabric: "分布式 GPU 阵列",
      clusterSync: "集群同步状态",
      queueIntel: "队列情报",
      activeRequests: "活跃神经请求",
      prioritize: "优先级调度",
      flushCache: "清空缓存",
      runtimeControls: "系统运行时精准控制",
      highLevelAccess: "需要高级访问权限",
      modelsTopology: "模型神经拓扑",
      modelsInventory: "模型清单与注册表",
      triggerWatchdog: "触发守门狗重连",
      executeRestart: "执行核心重启",
      load: "加载",
      unload: "卸载",
      forceSync: "强制全局同步",
      activeTrends: "活跃趋势数",
      syncState: "同步状态",
      optimal: "最佳 (OPTIMAL)",
      gpuWatchdog: "GPU 守门狗监控",
      kernelSync: "内核同步",
      trendVelocity: "全球趋势速率矩阵",
      hubSummary: "神经枢纽概览",
      intelligenceState: "共享智能状态",
      brandMemory: "共享品牌记忆",
      recycleWorkers: "循环重启工作节点",
      agentStatus: "智能体系统状态",
      syncLoRA: "同步至 LoRA 训练",
      systemDirective: "系统指令",
      nodeTime: "节点时间",
      autonomous: "AURA_CORE 系统处于自动运行状态。",
      gpuMonitorDesc: "监控潜空间温度及心跳。延迟异常时需手动同步。",
      kernelSyncDesc: "内核全量重新同步。清空所有临时显存并回收总监智能体。",
      taskBacklog: "集群任务积压数",
      oomFlush: "OOM 显存清理序列",
      kernelSyncPersist: "持久化内核同步",
      vramFlush: "神经管道",
      vramPurgeDesc: "清理分布式集群中的 VRAM 缓存。建议在重度生成会话后执行。",
      vramPurgeAction: "净化全局显存 (VRAM)",
      directorHub: "总监枢纽 (Director Hub)",
      state: "状态",
      security: "安全性",
      manageNode: "管理节点",
      orchestrator: "编排器"
    },
    hub: {
      title: "量子分发枢纽",
      subtitle: "跨部门同步神经启发。",
      ready: "枢纽就绪 (OS_HUB_READY)",
      syncActive: "团队同步中",
      crossModule: "跨模块操作",
      manifestNeural: "在所有部门中体现神经灵感。",
      global: "全局",
      team: "团队",
      encrypted: "加密",
      pushArchival: "推送到档案库",
      syncStyle: "同步风格元数据到注册表",
      injectSynthesis: "注入合成器",
      mapPrompt: "将提示变量映射到引擎",
      loadLab: "加载到实验室 (VTO_Lab)",
      preCache: "在试衣间预缓存服装",
      neuralCollab: "神经协作",
      generateLink: "生成动态会话链接",
      compressing: "正在压缩神经权重..."
    },
    moodboard: {
      title: "灵感板",
      empty: "您的创意板目前为空。",
      export: "导出收藏",
      remove: "从板中移除",
      share: "分享灵感板",
      curationMatrix: "策展矩阵",
      appendedConcept: "追加新审美概念"
    },
    settings: {
      theme: "主题模式",
      light: "浅色",
      dark: "深色",
      authLevel: "权限等级",
      modelStack: "模型栈",
      factoryExport: "导出到工厂 (PLT/DXF)",
      blueprint: "数字蓝图 v2.0",
      molecularlyVerified: "分子级验证",
      chromaticSpectrum: "色彩频谱",
      neuralScraper: {
        title: "神经自动采集引擎",
        subtitle: "全球爆款趋势自动化收割",
        status: "活跃流",
        sources: "信源: IG, Pinterest, Vogue, 时装周",
        action: "强制同步触发",
        configure: "配置信源"
      }
    },
    common: {
      sysStatus: "系统状态",
      armed: "就绪 (ARMED)",
      offline: "离线 (OFFLINE)",
      ready: "准备就绪",
      active: "活跃",
      idle: "闲置",
      busy: "繁忙",
      online: "在线",
      type: "类型",
      state: "状态",
      sync: "同步",
      healthy: "健康",
      streamReady: "流就绪",
      inventory: "库存",
      gpu: "显卡 (GPU)",
      workers: "工作节点",
      redis: "数据库 (REDIS)",
      proto: "协议",
      build: "构建",
      node: "节点",
      authorized: "已授权",
      coreAesthetic: "核心审美",
      keyMaterials: "主要材质",
      neuralMatch: "神经匹配",
      agentManage: "管理节点",
      agentState: "状态",
      agentSecurity: "安全级别",
      logStream: "系统日志流",
      authorityLevel: "授权等级",
      modelStack: "模型堆栈",
      gpuClusters: "GPU 集群",
      gpuWatchdogDesc: "GPU 高性能监控",
      neuralPipeline: "神经管道",
      vramPurgeDesc: "清除分布式集群中的 VRAM 缓存。",
      vramPurgeAction: "从全局清除 VRAM"
    },
    system: {
      reconstructionActive: "神经元重构激活",
      processingCloud: "正在处理体积点云...",
      voxAligned: "体素对齐 (VOX_ALIGNED)",
      quadReflow: "拓扑流 (QUAD_REFLOW)",
      texSynth: "纹理合成 (TEX_SYNTH)",
      archiveMatch: "档案匹配 (FOS_ARCHIVE_MATCH)",
      hubReady: "枢纽就绪 (OS_HUB_READY)",
      teamSync: "团队同步就绪",
      crossModule: "跨模块操作",
      compressingWeights: "正在压缩神经权重...",
      archivalPushed: "概念已在档案矩阵中注册。",
      variableInjected: "参数变量已注入合成核心。",
      garmentPrecached: "服装已在实验显存中预缓存。",
      linkActive: "协作神经链接已在剪贴板中激活。",
      kernelAuthorized: "内核已授权并同步",
      buildProduction: "生产环境 (PRODUCTION)",
      nodeLocal: "本地集群 (LOCAL_CLUSTER)",
      protoV2: "FOS-V2",
      sysUuid: "系统识别码 (SYS_UUID)",
      heartbeatSync: "心跳同步 (HEARTBEAT_SYNC)",
      archiveIntegrityFailure: "档案完整性校验失败"
    }
  },
  it: {
    hero: {
      title: "Design Intelligente, Galleria Trend.",
      subtitle: "Bestseller",
      placeholder: "Scopri il prossimo trend globale...",
      analyze: "Analizza Trend"
    },
    nav: {
      curator: "Curatore ModaUI",
      moodboard: "Mia Moodboard",
      settings: "Impostazioni",
      operations: "Hub Operativo"
    },
    tabs: {
      gallery: "Galleria",
      design: "Design",
      interaction: "Interazione AI",
      settings: "Impostazioni",
      operations: "Operazioni"
    },
    gallery: {
      title: "Trend Globali",
      curation: "Curatela Intelligente",
      trendScore: "Punteggio Trend",
      visualSearch: "Ricerca Visiva",
      upload: "Carica Riferimento",
      analyzing: "Analisi Stile",
      searchDesc: "Carica uno schizzo o una foto. La nostra AI analizzerà la silhouette.",
      neuralAnalysis: "Analisi Neurale",
      sustainability: "Sostenibilità",
      heritage: "Punteggio Heritage",
      velocity: "Velocità Trend",
      composition: "Composizione",
      download: "Scarica HD",
      share: "Condividi",
      copied: "Link Copiato",
      sharePinterest: "Pinterest",
      shareTwitter: "X / Twitter",
      shareFacebook: "Facebook",
      filterByStyle: "Filtra per Stile",
      filterByTag: "Filtra per Tag",
      resetFilters: "Reset",
      styles: "Stili",
      tags: "Tag",
      addToDesign: "Aggiungi al Design",
      added: "Aggiunto",
      designConcept: "Concetto Design",
      generatingDesign: "Generazione...",
      viewSeries: "Vedi Serie",
      series: "Serie",
      techPack: "Genera Scheda Tecnica",
      esg: "Conformità ESG"
    },
    design: {
      title: "Workshop AI Studio",
      subtitle: "Lab Creativo",
      generate: "Genera Concetto",
      promptLabel: "Seme Stile",
      placeholder: "es. Cyberpunk Vittoriano con accenti in seta...",
      labStatus: "Motore Neurale Attivo"
    },
    interaction: {
      title: "Intelligenza ModaUI",
      subtitle: "Chiedi al Curatore",
      placeholder: "Chiedi sui cicli di tendenza..."
    },
    ops: {
      matrix: "Matrice di Calcolo",
      agents: "Rete Agenti",
      memory: "Memoria di Moda",
      logs: "Log Neurali",
      director: "Direttore AURA_CORE",
      health: "Stato Kernel"
    },
    moodboard: {
      title: "La Tua Moodboard",
      empty: "La tua bacheca è vuota.",
      export: "Esporta Collezione",
      remove: "Rimuovi"
    },
    settings: {
      theme: "Modalità Tema",
      light: "Chiaro",
      dark: "Scuro",
      scraper: {
        title: "Motore Scraper Neurale",
        subtitle: "Raccolta Automatica Trend Globali",
        status: "Stream Attivi",
        sources: "Fonti: IG, Pinterest, Vogue, Sfilate",
        action: "Sincronizzazione",
        configure: "Configura"
      }
    },
    styleGen: {
      button: "Remix Stile",
      prompt: "Descrivi il remix",
      generating: "Rendering Neurale...",
      result: "Risultato",
      close: "Chiudi"
    }
  },
  fr: {
    hero: {
      title: "Design Intelligent, Galerie de Tendances.",
      subtitle: "Bestsellers",
      placeholder: "Découvrez la prochaine tendance...",
      analyze: "Analyser la Tendance"
    },
    nav: {
      curator: "Curateur ModaUI",
      moodboard: "Mon Moodboard",
      settings: "Paramètres",
      operations: "Hub Opérationnel"
    },
    tabs: {
      gallery: "Galerie",
      design: "Design",
      interaction: "Interaction IA",
      settings: "Paramètres",
      operations: "Opérations"
    },
    gallery: {
      title: "Tendances Globales",
      curation: "Curation Intelligente",
      trendScore: "Score Tendance",
      visualSearch: "Recherche Visuelle",
      upload: "Télécharger Référence",
      analyzing: "Analyse du Style",
      searchDesc: "Téléchargez un croquis ou une photo.",
      neuralAnalysis: "Analyse Neurale",
      sustainability: "Durabilité",
      heritage: "Score Héritage",
      velocity: "Vélocité Tendance",
      composition: "Composition",
      download: "Télécharger HD",
      share: "Partager",
      copied: "Lien Copié",
      sharePinterest: "Pinterest",
      shareTwitter: "X / Twitter",
      shareFacebook: "Facebook",
      filterByStyle: "Filtrer par Style",
      filterByTag: "Filtrer par Tag",
      resetFilters: "Réinitialiser",
      styles: "Styles",
      tags: "Tags",
      addToDesign: "Ajouter au Design",
      added: "Ajouté",
      designConcept: "Concept Design",
      generatingDesign: "Génération...",
      viewSeries: "Voir la Série",
      series: "Série",
      techPack: "Générer Fiche Technique",
      esg: "Conformité RSE"
    },
    design: {
      title: "Atelier AI Studio",
      subtitle: "Lab Créatif",
      generate: "Générer Concept",
      promptLabel: "Graine de Style",
      placeholder: "ex. Cyberpunk Victorien avec touches de soie...",
      labStatus: "Moteur Neural Actif"
    },
    interaction: {
      title: "Intelligence ModaUI",
      subtitle: "Demander au Curateur",
      placeholder: "Interrogez sur les cycles de tendances..."
    },
    ops: {
      matrix: "Matrice de Calcul",
      agents: "Maillage d'Agents",
      memory: "Mémoire de la Mode",
      logs: "Journaux Neuraux",
      director: "Directeur AURA_CORE",
      health: "État du Noyau"
    },
    moodboard: {
      title: "Votre Moodboard",
      empty: "Votre tableau est vide.",
      export: "Exporter Collection",
      remove: "Retirer"
    },
    settings: {
      theme: "Mode Thème",
      light: "Clair",
      dark: "Sombre",
      scraper: {
        title: "Moteur de Scrapping Neural",
        subtitle: "Récolte Automatique de Tendances",
        status: "Flux Actifs",
        sources: "Sources: IG, Pinterest, Vogue, Défilés",
        action: "Sincronisation Forcee",
        configure: "Configurer"
      }
    },
    styleGen: {
      button: "Remix de Style",
      prompt: "Décrire le remix",
      generating: "Rendu Neural...",
      result: "Résultat",
      close: "Fermer"
    }
  }
};

export const getBrowserLanguage = (): Language => {
  const lang = navigator.language || (navigator as any).userLanguage;
  if (lang && lang.startsWith('zh')) return 'zh';
  if (lang && lang.startsWith('it')) return 'it';
  if (lang && lang.startsWith('fr')) return 'fr';
  return 'en';
};

// --- Localization & AI Translation Core ---

const translationCache = new Map<string, string>();

export const ModaTranslator = {
  /**
   * AI-powered dynamic translation for gallery items.
   */
  async fetchAITranslation(text: string, targetLang: Language): Promise<string> {
    const cacheKey = `${text}_${targetLang}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    if (targetLang === 'en') return text;

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const termGroup = getFashionTerm(text, targetLang);
      let result = text;
      
      if (termGroup) {
        if (targetLang === 'zh') {
           result = `${termGroup}设计单品`;
           if (text.toLowerCase().includes('hoodie')) result = `${termGroup}廓形连帽衫`;
           else if (text.toLowerCase().includes('cargo')) result = `${termGroup}功能性工装裤`;
           else if (text.toLowerCase().includes('jacket')) result = `${termGroup}先锋夹克外套`;
        } else {
           result = `${termGroup} piece`;
        }
      } else {
        // Fallback for ZH
        if (targetLang === 'zh') {
          if (text.toLowerCase().includes('hoodie')) result = "核心廓形连帽衫";
          else if (text.toLowerCase().includes('top')) result = "极简短款上衣";
          else if (text.toLowerCase().includes('cyberpunk')) result = "赛博朋克重构系列";
          else result = "智能重构款式";
        }
      }

      translationCache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error("Neural translation failed", error);
      return text;
    }
  },

  /**
   * Localizes currency based on current language.
   */
  formatCurrency(valueInUSD: number, lang: Language): string {
    const localeMap: Record<Language, string> = { 'zh': 'zh-CN', 'en': 'en-US', 'it': 'it-IT', 'fr': 'fr-FR' };
    const currencyMap: Record<Language, string> = { 'zh': 'CNY', 'en': 'USD', 'it': 'EUR', 'fr': 'EUR' };
    
    let rate = 1;
    if (lang === 'zh') rate = 7.23;
    if (lang === 'it' || lang === 'fr') rate = 0.92;

    const finalValue = valueInUSD * rate;

    return new Intl.NumberFormat(localeMap[lang], {
      style: 'currency',
      currency: currencyMap[lang],
      minimumFractionDigits: 0
    }).format(finalValue);
  },

  /**
   * Converts and localizes measurements.
   */
  formatMeasurement(cm: number, lang: Language): string {
    if (lang === 'en') {
      const inches = (cm / 2.54).toFixed(1);
      return `${inches} in`;
    }
    return `${cm} cm`;
  },

  /**
   * Localizes timestamps.
   */
  formatTimestamp(timestamp: number, lang: Language): string {
    const locales = { 'zh': 'zh-CN', 'en': 'en-US', 'it': 'it-IT', 'fr': 'fr-FR' };
    return new Intl.DateTimeFormat(locales[lang] || 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(timestamp));
  }
};

function getFashionTerm(text: string, lang: Language): string {
  const zhMap: Record<string, string> = {
    'oversized': '廓形',
    'techwear': '机能',
    'distressed': '破坏水洗',
    'asymmetrical': '剪裁',
    'sustainable': '可持续',
    'vintage': '复古',
    'utility': '工装',
    'avant-garde': '前卫',
    'minimalism': '极简',
    'y2k': '趋势千禧'
  };

  const itMap: Record<string, string> = {
     'tailored': 'Sartoriale',
     'drape': 'Drappeggio',
     'hand-made': 'Fatto a mano',
     'leather': 'Pelle superiore',
     'embroidery': 'Ricamo alta moda',
     'minimalist': 'Minimalismo italiano'
  };

  const frMap: Record<string, string> = {
     'haute couture': 'Haute Couture',
     'avant-garde': 'Avant-garde Parisienne',
     'chic': 'Élégance française',
     'pleats': 'Plissé soleil',
     'atelier': 'Fait en atelier'
  };
  
  const map = lang === 'zh' ? zhMap : (lang === 'it' ? itMap : (lang === 'fr' ? frMap : {}));
  
  for (const [key, value] of Object.entries(map)) {
    if (text.toLowerCase().includes(key)) return value;
  }
  return '';
}
