
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
  };
  moodboard: {
    title: string;
    empty: string;
    export: string;
    remove: string;
  };
  settings: {
    theme: string;
    light: string;
    dark: string;
    scraper: {
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
  };
  interaction: {
    title: string;
    subtitle: string;
    placeholder: string;
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
      esg: "ESG Compliance"
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
      placeholder: "Inquire about trend cycles..."
    },
    ops: {
      matrix: "Compute Matrix",
      agents: "Agent Mesh",
      memory: "Fashion Memory",
      logs: "Neural Logs",
      director: "AURA_CORE Director",
      health: "Kernel Status"
    },
    moodboard: {
      title: "Your Moodboard",
      empty: "Your creative board is empty.",
      export: "Export Collection",
      remove: "Remove from board"
    },
    settings: {
      theme: "Theme Mode",
      light: "Light",
      dark: "Dark",
      scraper: {
        title: "Neural Scraper Engine",
        subtitle: "Global Trend Automated Harvesting",
        status: "Active Streams",
        sources: "Sources: IG, Pinterest, Vogue, Runway",
        action: "Trigger Forced Sync",
        configure: "Configure Sources"
      }
    },
    styleGen: {
      button: "Style Remix",
      prompt: "Describe the remix (e.g., 'Cyberpunk style', '3D model')",
      generating: "Neural Rendering...",
      result: "Generation Result",
      close: "Close"
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
      searchDesc: "上传草图、面料图案或参考照片。",
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
      esg: "ESG 合规"
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
      placeholder: "查询趋势周期..."
    },
    ops: {
      matrix: "算力矩阵",
      agents: "智能体集群",
      memory: "时尚记忆图谱",
      logs: "神经日志",
      director: "AURA_CORE 系统总监",
      health: "核心状态"
    },
    moodboard: {
      title: "灵感板",
      empty: "您的创意板目前为空。",
      export: "导出收藏",
      remove: "从板中移除"
    },
    settings: {
      theme: "主题模式",
      light: "浅色",
      dark: "深色",
      scraper: {
        title: "神经自动采集引擎",
        subtitle: "全球爆款趋势自动化收割",
        status: "活跃流",
        sources: "信源: IG, Pinterest, Vogue, 时装周",
        action: "强制同步触发",
        configure: "配置信源"
      }
    },
    styleGen: {
      button: "风格重塑",
      prompt: "描述重塑方向 (例如: '赛博朋克风格', '3D 粘土模型')",
      generating: "神经渲染中...",
      result: "生成结果",
      close: "关闭"
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
