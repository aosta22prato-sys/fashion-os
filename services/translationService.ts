
export type Language = 'en' | 'zh';

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
  };
  tabs: {
    gallery: string;
    design: string;
    interaction: string;
    settings: string;
  };
  gallery: {
    title: string;
    curation: string;
    trendScore: string;
    visualSearch: string;
    upload: string;
    analyzing: string;
    searchDesc: string;
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
      settings: "Settings"
    },
    tabs: {
      gallery: "Gallery",
      design: "Design",
      interaction: "AI Interaction",
      settings: "Settings"
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
      designConcept: "Design Concept",
      generatingDesign: "Generating Design...",
      viewSeries: "View Series",
      series: "Series"
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
      settings: "系统设置"
    },
    tabs: {
      gallery: "图库",
      design: "设计",
      interaction: "交互",
      settings: "设置"
    },
    gallery: {
      title: "全球趋势",
      curation: "智能策展",
      trendScore: "流行指数",
      visualSearch: "视觉搜索",
      upload: "上传参考图",
      analyzing: "正在分析风格",
      searchDesc: "上传草图、面料图案或参考照片。我们的 AI 视觉模型将剖析轮廓并匹配趋势。",
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
      designConcept: "设计概念",
      generatingDesign: "正在生成设计...",
      viewSeries: "查看系列",
      series: "组图"
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
  }
};

export const getBrowserLanguage = (): Language => {
  const lang = navigator.language || (navigator as any).userLanguage;
  if (lang && lang.startsWith('zh')) {
    return 'zh';
  }
  return 'en';
};
