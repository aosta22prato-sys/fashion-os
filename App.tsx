/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Camera, 
  MessageSquare, 
  X, 
  ChevronRight, 
  Sparkles, 
  Upload, 
  Filter,
  ArrowRight,
  TrendingUp,
  Tag,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Send,
  LayoutGrid,
  Palette,
  Settings,
  User,
  Globe
} from 'lucide-react';
import { AppState, FashionItem, ChatMessage } from './types';
import { MOCK_FASHION_GALLERY, FASHION_CATEGORIES, fileToBase64 } from './utils';
import { analyzeFashionQuery, getFashionAssistantResponse, performVisualSearch } from './services/geminiService';
import { translations, getBrowserLanguage, Language } from './services/translationService';

// --- Components ---

const HeroSection: React.FC<{ 
  onSearch: (query: string) => void;
  t: any;
}> = ({ onSearch, t }) => {
  const [searchInput, setSearchInput] = useState("");
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted={isMuted} 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://www.gstatic.com/aistudio/starter-apps/type-motion/smoke_v2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 backdrop-grayscale-[0.2]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-6 text-center text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="font-serif text-6xl md:text-8xl mb-8 leading-tight tracking-tight whitespace-pre-line"
        >
          {t.hero.title}
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="flex items-center glass rounded-full px-6 py-4 shadow-2xl">
            <Search className="text-white/70 mr-4" size={24} />
            <input 
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.hero.placeholder}
              className="bg-transparent border-none outline-none w-full text-lg placeholder:text-white/50 text-white"
              onKeyDown={(e) => e.key === 'Enter' && onSearch(searchInput)}
            />
            <button 
              onClick={() => onSearch(searchInput)}
              className="ml-4 bg-white text-black hover:bg-brand-beige px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2"
            >
              {t.hero.analyze} <Sparkles size={16} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Constraints/Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
        <div className="w-0.5 h-12 bg-white/30 rounded-full" />
      </div>

      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-10 right-10 p-3 glass rounded-full text-white hover:bg-white/20 transition-all"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </section>
  );
};

const FashionAssistant: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Welcome to the AI Fashion Curator. How can I inspire your style journey today?' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const aiResponse = await getFashionAssistantResponse([...messages, userMsg]);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a bit of trouble connecting to the archives. Please try again soon." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white border-l border-zinc-100 shadow-2xl z-[100] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-bottom flex items-center justify-between border-b border-zinc-100">
            <div>
              <h2 className="font-serif text-2xl font-semibold">AI Curator</h2>
              <p className="text-xs text-zinc-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" /> Intelligent Style Assistant
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-brand-ink text-white rounded-tr-none' 
                    : 'bg-zinc-100 text-brand-ink rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 px-4 py-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 border-t border-zinc-100">
            <div className="relative group">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about trends, outfits, or styles..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-1 focus:ring-brand-ink transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-brand-ink disabled:opacity-50 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FashionCard: React.FC<{ 
  item: FashionItem; 
  index: number; 
  onAddToMoodboard: (item: FashionItem) => void;
  onViewDetails: (item: FashionItem) => void;
  isSaved: boolean;
}> = ({ item, index, onAddToMoodboard, onViewDetails, isSaved }) => {
  return (
    <motion.div 
      layout
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      initial="hidden"
      animate="show"
      transition={{ 
        delay: index * 0.05,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
      onClick={() => onViewDetails(item)}
    >
      <div className="aspect-vogue overflow-hidden relative">
        <motion.img 
          src={item.imageUrl} 
          alt={item.description}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Magic Tags - AI analysis teaser */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          {item.tags.map((tag, idx) => (
            <motion.span 
              key={idx} 
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              className="px-3 py-1 glass text-[10px] uppercase tracking-widest text-white rounded-full font-bold"
            >
              {tag}
            </motion.span>
          ))}
        </div>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <div className="p-2 glass rounded-full text-white">
            <Maximize2 size={16} />
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToMoodboard(item);
            }}
            disabled={isSaved}
            className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              isSaved 
                ? 'bg-emerald-500 text-white cursor-default' 
                : 'bg-white text-black hover:bg-brand-beige'
            }`}
          >
            {isSaved ? (
              <><Sparkles size={12} /> Saved</>
            ) : (
              <><Upload size={12} className="rotate-180" /> Add to Moodboard</>
            )}
          </button>
        </div>
      </div>
      
      <div className="p-6 border-x border-b border-zinc-50 rounded-b-2xl">
        <div className="flex items-center justify-between mb-3 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
          <span className="bg-zinc-100 px-2 py-0.5 rounded">{item.category}</span>
          <span className="flex items-center gap-1 text-emerald-600"><TrendingUp size={10} /> 94% Match</span>
        </div>
        <h3 className="font-serif text-xl mb-2 group-hover:text-emerald-900 transition-colors uppercase leading-tight">{item.style}</h3>
        <p className="text-sm text-zinc-500 line-clamp-2 italic font-serif leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  );
};

const MoodboardDrawer: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  items: FashionItem[];
  onRemove: (id: string) => void;
  t: any;
}> = ({ isOpen, onClose, items, onRemove, t }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-brand-beige border-l border-zinc-200 shadow-2xl z-[110] flex flex-col"
        >
          <div className="p-8 border-b border-zinc-200 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-3xl uppercase tracking-tighter">{t.moodboard.title}</h2>
              <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest">{items.length} Elements</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-all">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-center px-10">
                <Sparkles size={48} className="mb-4 opacity-20" />
                <p className="italic font-serif">{t.moodboard.empty}</p>
              </div>
            ) : (
              items.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-4 group"
                >
                  <div className="w-24 aspect-vogue rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                    <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">{item.category}</div>
                    <h4 className="font-serif text-lg leading-tight mb-2 uppercase">{item.style}</h4>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-[10px] uppercase font-bold tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                    >
                      <X size={10} /> {t.moodboard.remove}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="p-8 border-t border-zinc-200 bg-white">
            <button className="w-full py-4 bg-brand-ink text-white rounded-full font-bold uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
              {t.moodboard.export} <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ItemDetailModal: React.FC<{ 
  item: FashionItem | null; 
  onClose: () => void; 
  onAddToMoodboard: (item: FashionItem) => void;
  isSaved: boolean;
}> = ({ item, onClose, onAddToMoodboard, isSaved }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-10"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white max-w-6xl w-full h-full max-h-[90vh] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main Visual */}
          <div className="md:w-3/5 h-[50vh] md:h-full relative overflow-hidden bg-zinc-100">
            <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.style} />
            <button 
              onClick={onClose}
              className="absolute top-6 left-6 p-3 glass rounded-full text-white hover:bg-black/40 transition-all md:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Details Content */}
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-center overflow-y-auto bg-brand-beige">
            <button 
              onClick={onClose}
              className="absolute top-10 right-10 p-4 hover:bg-zinc-200 rounded-full transition-all hidden md:block"
            >
              <X size={24} />
            </button>

            <div className="mb-10 text-center md:text-left text-brand-ink">
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-400 mb-4 block">Archive Record #{item.id}</span>
              <h2 className="font-serif text-5xl md:text-7xl uppercase tracking-tighter mb-6">{item.style}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
                {item.tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-brand-ink text-white text-[10px] uppercase tracking-widest rounded-full font-bold">
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="font-serif text-xl md:text-2xl text-zinc-600 leading-relaxed italic border-l-4 border-zinc-200 pl-6 mb-10">
                "{item.description}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12 text-brand-ink">
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Category</h4>
                <p className="font-medium">{item.category}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Trend Score</h4>
                <p className="font-medium text-emerald-600">94.8% Stable Expansion</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button 
                onClick={() => onAddToMoodboard(item)}
                disabled={isSaved}
                className={`flex-1 py-5 rounded-full font-bold uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 ${
                  isSaved 
                    ? 'bg-emerald-500 text-white cursor-default' 
                    : 'bg-brand-ink text-white hover:scale-[1.02]'
                }`}
              >
                {isSaved ? <><Sparkles size={18} /> In Moodboard</> : <><Upload size={18} className="rotate-180" /> Save to Board</>}
              </button>
              <button className="flex-1 py-5 border-2 border-brand-ink text-brand-ink rounded-full font-bold uppercase tracking-[0.2em] hover:bg-brand-ink hover:text-white transition-all flex items-center justify-center gap-3">
                Style Guide <TrendingUp size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const SettingsPanel: React.FC = () => {
  return (
    <section className="py-20 max-w-2xl mx-auto px-6">
      <h2 className="font-serif text-4xl mb-10 uppercase tracking-tighter">System Configuration</h2>
      <div className="space-y-8">
        <div className="p-6 bg-white rounded-2xl border border-zinc-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg mb-1">AI Curation Sensitivity</h4>
            <p className="text-zinc-400 text-sm italic">Adjust how strictly the AI filters trends.</p>
          </div>
          <div className="w-12 h-6 bg-emerald-500 rounded-full relative shadow-inner">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
          </div>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-zinc-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg mb-1">Creative Mode</h4>
            <p className="text-zinc-400 text-sm italic">Enable high-experimental trend detection.</p>
          </div>
          <div className="w-12 h-6 bg-zinc-200 rounded-full relative">
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
          </div>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-zinc-100">
          <h4 className="font-bold text-lg mb-4">Neural Engine Status</h4>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-2 text-emerald-600"><span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" /> Gemini Pro Vision: Active</span>
            <span className="text-zinc-300">|</span>
            <span className="flex items-center gap-2 text-zinc-400">VE-1.4: Syncing...</span>
          </div>
        </div>
      </div>
      <div className="mt-20 pt-10 border-t border-zinc-100 text-center">
        <p className="text-[10px] uppercase tracking-widest text-zinc-300">Vogue.AI Core Protocol v4.82</p>
      </div>
    </section>
  );
};

// --- Main App ---

export default function App() {
  const [lang, setLang] = useState<Language>(getBrowserLanguage());
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<"gallery" | "design" | "interaction" | "settings">("gallery");
  const [activeCategory, setActiveCategory] = useState("All Trends");
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [gallery, setGallery] = useState<FashionItem[]>(MOCK_FASHION_GALLERY);
  const [searchStatus, setSearchStatus] = useState<AppState>(AppState.IDLE);
  const [aiAnalysis, setAiAnalysis] = useState<{ category: string, tags: string[], description: string } | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [moodboard, setMoodboard] = useState<FashionItem[]>([]);
  const [isMoodboardOpen, setIsMoodboardOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FashionItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load moodboard from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('vogue_moodboard');
    if (saved) {
      try {
        setMoodboard(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load moodboard", e);
      }
    }
  }, []);

  // Save moodboard to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vogue_moodboard', JSON.stringify(moodboard));
  }, [moodboard]);

  const addToMoodboard = (item: FashionItem) => {
    if (moodboard.find(m => m.id === item.id)) return;
    setMoodboard(prev => [item, ...prev]);
  };

  const removeFromMoodboard = (id: string) => {
    setMoodboard(prev => prev.filter(item => item.id !== id));
  };

  const filteredGallery = useMemo(() => {
    if (activeCategory === "All Trends") return gallery;
    return gallery.filter(item => item.category === activeCategory);
  }, [activeCategory, gallery]);

  const handleSmartSearch = async (query: string) => {
    if (!query.trim()) {
      setGallery(MOCK_FASHION_GALLERY);
      setAiAnalysis(null);
      return;
    }

    setSearchStatus(AppState.SEARCHING);
    try {
      const analysis = await analyzeFashionQuery(query);
      setAiAnalysis(analysis);
      
      // Simulation of intelligent search
      // In a real app index, we would use vector search (Milvus/Pinecone)
      // Here we filter the mock data and add a "New" trend item based on AI
      const simulatedResult: FashionItem = {
        id: Date.now().toString(),
        imageUrl: `https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=800`,
        category: analysis.category,
        tags: analysis.tags,
        style: `Discover: ${query}`,
        description: analysis.description
      };
      
      setActiveCategory(analysis.category);
      setGallery(prev => [simulatedResult, ...prev]);
      
      window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    } finally {
      setSearchStatus(AppState.IDLE);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingImage(true);
    setSearchStatus(AppState.ANALYZING);
    
    try {
      const base64 = await fileToBase64(file);
      const analysis = await performVisualSearch(base64, file.type);
      
      setAiAnalysis(analysis);
      
      const simulatedResult: FashionItem = {
        id: `img-${Date.now()}`,
        imageUrl: base64,
        category: analysis.category,
        tags: [...analysis.tags, "Visual Search"],
        style: "Visual Reference Found",
        description: analysis.description
      };
      
      setActiveCategory(analysis.category);
      setGallery(prev => [simulatedResult, ...prev]);
      
      window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    } catch (e) {
      console.error("Visual search error:", e);
      setError("AI analysis failed. Please check your image format and try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsAnalyzingImage(false);
      setSearchStatus(AppState.IDLE);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-brand-ink selection:text-white pb-24 md:pb-0">
      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-[200] bg-red-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-3 whitespace-nowrap"
          >
            <X size={18} className="cursor-pointer" onClick={() => setError(null)} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 p-6 flex items-center justify-between pointer-events-none md:flex hidden">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto cursor-pointer flex items-center gap-6"
        >
          <span className="font-serif text-3xl font-black tracking-tighter uppercase text-white drop-shadow-lg" onClick={() => setActiveTab("gallery")}>Vogue.AI</span>
          <button 
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-2 glass px-4 py-1.5 rounded-full text-[10px] text-white uppercase font-bold tracking-widest hover:bg-white/20 transition-all"
          >
            <Globe size={14} /> {lang === 'en' ? '中文' : 'English'}
          </button>
        </motion.div>
        
        <div className="flex gap-4 pointer-events-auto">
          <button 
            onClick={() => setIsMoodboardOpen(true)}
            className="p-3 glass rounded-full text-white hover:scale-110 transition-all relative group"
          >
            <Filter size={20} />
            {moodboard.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-brand-ink text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                {moodboard.length}
              </span>
            )}
            <div className="absolute right-0 top-14 opacity-0 group-hover:opacity-100 transition-all bg-white text-black text-[10px] px-3 py-2 rounded-lg whitespace-nowrap uppercase tracking-widest shadow-xl font-bold">
              {t.nav.moodboard}
            </div>
          </button>
          <button 
            onClick={() => setIsAssistantOpen(true)}
            className="p-3 glass rounded-full text-white hover:scale-110 transition-all relative group"
          >
            <MessageSquare size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75" />
            <div className="absolute right-0 top-14 opacity-0 group-hover:opacity-100 transition-all bg-white text-black text-[10px] px-3 py-2 rounded-lg whitespace-nowrap uppercase tracking-widest shadow-xl">
              {t.nav.curator}
            </div>
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className="p-3 glass rounded-full text-white hover:scale-110 transition-all relative group"
          >
            <Settings size={20} />
            <div className="absolute right-0 top-14 opacity-0 group-hover:opacity-100 transition-all bg-white text-black text-[10px] px-3 py-2 rounded-lg whitespace-nowrap uppercase tracking-widest shadow-xl font-bold">
              {t.nav.settings}
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Bot Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-2xl border-t border-zinc-100 px-6 py-4 flex items-center justify-between z-[120] md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        {[
          { id: 'gallery', icon: LayoutGrid, label: t.tabs.gallery },
          { id: 'design', icon: Palette, label: t.tabs.design },
          { id: 'interaction', icon: Sparkles, label: t.tabs.interaction },
          { id: 'settings', icon: Settings, label: t.tabs.settings },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => {
              // @ts-ignore
              setActiveTab(tab.id);
              if(tab.id === 'interaction') setIsAssistantOpen(true);
            }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-brand-ink scale-110' : 'text-zinc-300'}`}
          >
            <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero */}
              <HeroSection onSearch={handleSmartSearch} t={t} />

              {/* Main Content Area */}
              <div className="max-w-7xl mx-auto px-6 py-20">
                
                {/* Category Filters */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-400 mb-2 block">{t.gallery.curation}</span>
                    <h2 className="font-serif text-4xl uppercase tracking-tighter">{t.gallery.title}</h2>
                  </div>
                  
                  <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
                    {FASHION_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                          activeCategory === cat 
                            ? 'bg-brand-ink text-white' 
                            : 'bg-white border border-zinc-200 text-zinc-500 hover:border-brand-ink'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Insight Bar */}
                {aiAnalysis && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 p-8 bg-zinc-900 rounded-2xl text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="text-white" size={32} />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl mb-2 italic">Fashion AI Insight</h3>
                      <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">{aiAnalysis.description}</p>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      {aiAnalysis.tags.map(t => (
                        <span key={t} className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] uppercase tracking-widest">#{t}</span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Gallery Grid */}
                <motion.div 
                  className="fashion-grid"
                  layout
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    {filteredGallery.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ 
                          duration: 0.4,
                          layout: { type: "spring", stiffness: 200, damping: 25 }
                        }}
                      >
                        <FashionCard 
                          item={item} 
                          index={index} 
                          onAddToMoodboard={addToMoodboard}
                          onViewDetails={setSelectedItem}
                          isSaved={!!moodboard.find(m => m.id === item.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          )}

        {activeTab === 'design' && (
          <motion.div
            key="design"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="flex-1 min-h-screen pt-32 px-6"
          >
            {/* Visual Search Section (Moved here from footer area) */}
            <section className="text-center pb-20">
              <motion.div className="max-w-2xl mx-auto">
                <Camera className={`mx-auto mb-8 ${isAnalyzingImage ? 'text-emerald-500 animate-pulse' : 'text-zinc-300'}`} size={48} />
                <h2 className="font-serif text-5xl mb-6 uppercase tracking-tighter">AI Studio Workshop</h2>
                <p className="text-zinc-500 mb-10 leading-relaxed italic">
                  Upload references or explore your board. Our vision model identifies silhouettes, fabric weights, and historical style precedents in real-time.
                </p>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzingImage}
                    className="px-10 py-5 bg-brand-ink text-white rounded-full flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl font-medium tracking-wide disabled:opacity-50"
                  >
                    {isAnalyzingImage ? (
                      <>ANALYZING <Sparkles className="animate-spin" size={20} /></>
                    ) : (
                      <>UPLOAD REFERENCE <Upload size={20} /></>
                    )}
                  </button>
                  <button 
                    onClick={() => setIsMoodboardOpen(true)}
                    className="px-10 py-5 bg-white border-2 border-brand-ink text-brand-ink rounded-full flex items-center justify-center gap-3 hover:scale-105 transition-all font-medium tracking-wide"
                  >
                    MY MOODBOARD <Filter size={20} />
                  </button>
                </div>
              </motion.div>
            </section>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            <SettingsPanel />
          </motion.div>
        )}
      </AnimatePresence>

      <ItemDetailModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
        onAddToMoodboard={addToMoodboard}
        isSaved={!!selectedItem && !!moodboard.find(m => m.id === selectedItem.id)}
      />

      <MoodboardDrawer 
        isOpen={isMoodboardOpen} 
        onClose={() => setIsMoodboardOpen(false)} 
        items={moodboard}
        onRemove={removeFromMoodboard}
        t={t}
      />

        {/* AI visual search upload section (Hidden in Gallery to avoid redundancy with Design Tab) */}
        {activeTab === 'gallery' && (
          <section className="mt-32 border-t border-zinc-200 pt-32 pb-20 text-center md:block hidden">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <Camera className={`mx-auto mb-8 ${isAnalyzingImage ? 'text-emerald-500 animate-pulse' : 'text-zinc-300'}`} size={48} />
              <h2 className="font-serif text-4xl mb-6 uppercase tracking-tighter">{t.gallery.visualSearch}</h2>
              <p className="text-zinc-500 mb-10 leading-relaxed italic">
                {t.gallery.searchDesc}
              </p>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzingImage}
                className="px-10 py-5 bg-brand-ink text-white rounded-full flex items-center gap-3 mx-auto hover:scale-105 transition-all shadow-xl font-medium tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzingImage ? (
                  <>{t.gallery.analyzing.toUpperCase()} <Sparkles className="animate-spin" size={20} /></>
                ) : (
                  <>{t.gallery.upload.toUpperCase()} <Upload size={20} /></>
                )}
              </button>
            </motion.div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brand-ink text-white py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-20 mb-10">
          <div className="col-span-2">
            <h2 className="font-serif text-4xl mb-6">VOGUE.AI</h2>
            <p className="text-white/50 max-w-sm leading-relaxed text-sm">
              The world's first intelligent fashion gallery. Powered by state-of-the-art vision and language models to curate, classify, and predict global trends.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="hover:text-white transition-colors cursor-pointer">Archive</li>
              <li className="hover:text-white transition-colors cursor-pointer">Trend Reports</li>
              <li className="hover:text-white transition-colors cursor-pointer">Style Guide</li>
              <li className="hover:text-white transition-colors cursor-pointer">AI Workbench</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-6">Genesis</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="hover:text-white transition-colors cursor-pointer">Digital Twins</li>
              <li className="hover:text-white transition-colors cursor-pointer">Smart Tags</li>
              <li className="hover:text-white transition-colors cursor-pointer">Vector Search</li>
              <li className="hover:text-white transition-colors cursor-pointer">FLUX.1 Models</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between text-[10px] uppercase tracking-[0.2em] text-white/30">
          <span>© 2026 AI Fashion Intelligence Portfolio</span>
          <span>Designed with Gemini 3.1 & Veo</span>
        </div>
      </footer>

      <FashionAssistant 
        isOpen={isAssistantOpen} 
        onClose={() => setIsAssistantOpen(false)} 
      />
    </div>
  );
}
