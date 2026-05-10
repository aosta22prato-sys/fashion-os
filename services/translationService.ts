
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
}

export const translations: Record<Language, Translations> = {
  en: {
    hero: {
      title: "Tomorrow's Elegance, Today.",
      subtitle: "Elegance",
      placeholder: "Describe the style you're looking for...",
      analyze: "Analyze"
    },
    nav: {
      curator: "Ask Fashion Curator",
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
      searchDesc: "Upload a sketch, a fabric pattern, or a reference photo. Our AI vision model will dissect the silhouette."
    },
    moodboard: {
      title: "Your Moodboard",
      empty: "Your creative board is empty.",
      export: "Export Collection",
      remove: "Remove from board"
    }
  },
  zh: {
    hero: {
      title: "今日，预见明日的优雅。",
      subtitle: "优雅",
      placeholder: "描述您正在寻找的风格...",
      analyze: "智能分析"
    },
    nav: {
      curator: "时尚 AI 助手",
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
      searchDesc: "上传草图、面料图案或参考照片。我们的 AI 视觉模型将剖析轮廓并匹配趋势。"
    },
    moodboard: {
      title: "灵感板",
      empty: "您的创意板目前为空。",
      export: "导出收藏",
      remove: "从板中移除"
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
