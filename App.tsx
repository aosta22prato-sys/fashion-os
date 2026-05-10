/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import { 
  Search, 
  Camera, 
  MessageSquare, 
  X, 
  ChevronRight, 
  Zap,
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
  Share2,
  Download,
  Check,
  Send,
  Twitter,
  Facebook,
  Link,
  LayoutGrid,
  Palette,
  Settings,
  User,
  Globe,
  Library,
  Activity,
  Server,
  ChevronLeft,
  MapPin,
  Cpu,
  TrendingDown
} from 'lucide-react';
import { AppState, FashionItem, ChatMessage, Theme } from './types';
import { MOCK_FASHION_GALLERY, FASHION_CATEGORIES, fileToBase64, optimizeImage } from './utils';
import { analyzeFashionQuery, getFashionAssistantResponse, performVisualSearch, generateTextImage } from './services/geminiService';
import { translations, getBrowserLanguage, Language } from './services/translationService';

// --- Components ---

const StatusTag: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="flex flex-col">
    <span className="text-[8px] text-zinc-500 uppercase tracking-widest leading-none mb-1">{label}</span>
    <span className={`text-[10px] font-mono font-bold text-${color}-500 leading-none`}>{value}</span>
  </div>
);

const TrendHotspots: React.FC<{ t: any }> = ({ t }) => {
  const hotspots = [
    { city: 'Tokyo', x: '75%', y: '40%', intensity: 0.9, style: 'Cyberpunk' },
    { city: 'Paris', x: '48%', y: '35%', intensity: 0.8, style: 'Couture' },
    { city: 'Seoul', x: '78%', y: '42%', intensity: 0.7, style: 'Minimalist' },
    { city: 'New York', x: '25%', y: '38%', intensity: 0.85, style: 'Streetwear' },
    { city: 'London', x: '47%', y: '32%', intensity: 0.6, style: 'Avant-garde' },
  ];

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-[32px] p-8 mb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-500 mb-2 block">Real-time Pulse</span>
          <h3 className="font-serif text-2xl uppercase tracking-tighter dark:text-white">Global Trend Hotspots</h3>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-black px-4 py-2 rounded-full border border-zinc-100 dark:border-white/10 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Scanning 48k nodes</span>
        </div>
      </div>

      <div className="relative aspect-[21/9] md:aspect-[3/1] w-full bg-zinc-100 dark:bg-black/40 rounded-2xl overflow-hidden group">
        {/* Abstract World Map Dots */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-10 gap-4 p-8 opacity-10">
          {Array.from({ length: 200 }).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-zinc-900 dark:bg-white rounded-full" />
          ))}
        </div>

        {/* Hotspot Indicators */}
        {hotspots.map((spot) => (
          <motion.div
            key={spot.city}
            style={{ left: spot.x, top: spot.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-crosshair z-10"
            whileHover={{ scale: 1.2 }}
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 2], opacity: [spot.intensity, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-emerald-500 rounded-full blur-sm"
              />
              <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-black shadow-lg" />
              
              <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-2xl border border-zinc-100 dark:border-white/5 pointer-events-none whitespace-nowrap">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={10} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase text-zinc-900 dark:text-white">{spot.city}</span>
                </div>
                <div className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold">
                  Trend DNA: <span className="text-emerald-500">{spot.style}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Global Stats Overlay */}
        <div className="absolute bottom-6 left-6 flex gap-4">
          <div className="glass px-5 py-3 rounded-2xl border-white/10 flex items-center gap-3">
            <TrendingUp size={14} className="text-emerald-400" />
            <div>
              <div className="text-[8px] uppercase tracking-widest text-zinc-400 leading-none mb-1">Active Flow</div>
              <div className="text-[10px] font-bold text-white leading-none">84.2 GB/s</div>
            </div>
          </div>
        </div>
      </div>
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
        <div className="absolute inset-0 bg-zinc-100 flex items-center justify-center">
          <motion.div 
            animate={{ 
              background: ["rgba(244, 244, 245, 1)", "rgba(255, 255, 255, 1)", "rgba(244, 244, 245, 1)"],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0"
          />
          <div className="w-8 h-8 border-[1px] border-zinc-200 border-t-zinc-800 rounded-full animate-spin z-10" />
        </div>
      )}
      {hasError ? (
        <div className="absolute inset-0 bg-zinc-50 flex flex-col items-center justify-center text-zinc-300 p-4 text-center">
          <Camera size={24} className="mb-2 opacity-30" />
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] leading-tight opacity-50">Archive Integrity<br/>Failure</span>
        </div>
      ) : (
        <motion.img 
          src={src} 
          alt={alt}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: isLoading ? 0 : 1, 
            scale: isLoading ? 1.05 : 1
          }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

const HeroSection: React.FC<{ 
  onSearch: (query: string) => void;
  t: any;
}> = ({ onSearch, t }) => {
  const [searchInput, setSearchInput] = useState("");
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <video 
          autoPlay 
          muted={isMuted} 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://www.gstatic.com/aistudio/starter-apps/type-motion/smoke_v2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[10px] uppercase font-bold tracking-[0.5em] mb-4 block text-white/50">ModaUI Intelligence Core</span>
          <h1 className="editorial-title font-serif text-[15vw] md:text-[18vw] mb-12 uppercase leading-[0.85] tracking-tighter">
            {t.hero.title.split('，').map((line: string, i: number) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                <span className={
                  i === 0 
                  ? "font-black tracking-[-0.08em] block drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                  : "italic font-light bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent block"
                }>
                  {line}
                </span>
              </React.Fragment>
            ))}
          </h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="relative max-w-md mx-auto"
        >
          <div className="flex items-center glass rounded-full px-5 py-3 shadow-[0_0_40px_rgba(255,255,255,0.1)] border-white/10 group focus-within:ring-1 focus-within:ring-white/50 transition-all">
            <Search className="text-white/40 mr-3" size={18} />
            <input 
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.hero.placeholder}
              className="bg-transparent border-none outline-none w-full text-base placeholder:text-white/30 text-white font-serif"
              onKeyDown={(e) => e.key === 'Enter' && onSearch(searchInput)}
            />
            <button 
              onClick={() => onSearch(searchInput)}
              className="ml-3 bg-white text-black hover:bg-white/90 px-6 py-2 rounded-full font-bold uppercase text-[9px] tracking-widest transition-all flex items-center gap-2 whitespace-nowrap"
            >
              {t.hero.analyze} <Sparkles size={14} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-12 left-12 flex flex-col gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-4 group cursor-pointer">
            <span className="text-[10px] font-mono text-white/20 group-hover:text-white transition-colors">0{i}</span>
            <div className="w-12 h-[1px] bg-white/20 group-hover:w-20 group-hover:bg-white transition-all" />
          </div>
        ))}
      </div>

      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-12 right-12 p-4 glass rounded-full text-white hover:bg-white/20 transition-all border-white/5"
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
          className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white dark:bg-zinc-900 border-l border-zinc-100 dark:border-white/5 shadow-2xl z-[100] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-bottom flex items-center justify-between border-b border-zinc-100 dark:border-white/5">
            <div>
              <h2 className="font-serif text-2xl font-semibold dark:text-white">AI Curator</h2>
              <p className="text-xs text-zinc-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" /> Intelligent Style Assistant
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-all dark:text-white">
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

const StyleRemixModal: React.FC<{
  item: FashionItem;
  onClose: () => void;
  onGenerate: (prompt: string, referenceImage: string, mutationLevel: number) => Promise<void>;
  isLoading: boolean;
  generatedImageUrl: string | null;
  initialMutationLevel: number;
  t: any;
}> = ({ item, onClose, onGenerate, isLoading, generatedImageUrl, initialMutationLevel, t }) => {
  const [prompt, setPrompt] = useState('');
  const [mutationLevel, setMutationLevel] = useState(initialMutationLevel);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6"
    >
      <div className="max-w-6xl w-full bg-white dark:bg-zinc-950 rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition-all z-50 text-zinc-900 dark:text-white"
        >
          <X size={20} />
        </button>

        <div className="md:w-1/2 h-64 md:h-full relative bg-zinc-100 dark:bg-zinc-900">
          <img src={generatedImageUrl || item.imageUrl} className="w-full h-full object-cover" alt="Source" />
          {!generatedImageUrl && (
            <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
              Source Reference
            </div>
          )}
          {generatedImageUrl && (
            <div className="absolute top-8 left-8 bg-emerald-500 border border-white/20 px-4 py-2 rounded-full text-black text-[10px] font-black uppercase tracking-widest">
              {t.styleGen.result}
            </div>
          )}
        </div>

        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-10">
            <span className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-300 dark:text-zinc-700 mb-2 block">Neural Remix Engine</span>
            <h2 className="font-serif text-4xl uppercase tracking-tighter leading-none dark:text-white">{t.styleGen.button}</h2>
          </div>

          {!generatedImageUrl ? (
            <div className="space-y-8">
              <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-white/5">
                <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest mb-4">{t.styleGen.prompt}</p>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-xl font-serif italic text-zinc-900 dark:text-white placeholder:text-zinc-200 dark:placeholder:text-zinc-800 resize-none h-32"
                  placeholder="e.g. As a 3D digital sculpture in a neon rain city..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span>Mutation Intensity</span>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${mutationLevel > 0.7 ? 'bg-red-500 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {mutationLevel > 0.7 ? 'EXPERIMENTAL' : 'POLISHED'}
                    </span>
                  </div>
                  <span className={mutationLevel > 0.7 ? 'text-red-500' : 'text-emerald-500'}>{Math.round(mutationLevel * 100)}%</span>
                </div>
                <div className="relative h-6 flex items-center">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01"
                    value={mutationLevel}
                    onChange={(e) => setMutationLevel(parseFloat(e.target.value))}
                    className={`w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-current ${mutationLevel > 0.7 ? 'text-red-500' : 'text-emerald-500'}`}
                  />
                </div>
                <div className="flex justify-between text-[8px] text-zinc-300 dark:text-zinc-700 uppercase font-bold tracking-widest">
                  <span>Conservative</span>
                  <div className="flex items-center gap-1">
                    {mutationLevel > 0.7 && <Zap size={8} className="text-red-500 animate-pulse" />}
                    <span>Neuro-Shaking</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onGenerate(prompt, item.imageUrl, mutationLevel)}
                disabled={isLoading || !prompt.trim()}
                className="w-full py-6 bg-brand-ink text-white rounded-full text-[12px] font-black uppercase tracking-[0.4em] disabled:opacity-30 flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isLoading ? (
                  <><Sparkles className="animate-spin" size={18} /> {t.styleGen.generating}</>
                ) : (
                  <><Zap size={18} /> {t.styleGen.button}</>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-zinc-400 text-sm italic leading-relaxed">
                Remix analysis complete. The neural network has extrapolated new aesthetic directions based on your prompt and the core DNA of the original item.
              </p>
              <div className="flex gap-4">
                <a 
                  href={generatedImageUrl} 
                  download="remix.jpg"
                  className="flex-1 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Download size={14} /> Download 4K
                </a>
                <button 
                  onClick={() => {
                    setPrompt('');
                    // Logic to clear generatedImageUrl would need to be in parent state
                  }}
                  className="px-8 py-4 border border-zinc-200 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-all text-zinc-900 dark:text-white"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const FashionCard: React.FC<{ 
  item: FashionItem; 
  index: number; 
  onAddToMoodboard: (item: FashionItem) => void;
  onViewDetails: (item: FashionItem) => void;
  onAddToDesign: (item: FashionItem) => void;
  onRemix: (item: FashionItem) => void;
  isSaved: boolean;
  t: any;
}> = ({ item, index, onAddToMoodboard, onViewDetails, onAddToDesign, onRemix, isSaved, t }) => {
  const [isAddedToDesign, setIsAddedToDesign] = useState(false);

  const handleAddToDesign = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToDesign(item);
    setIsAddedToDesign(true);
    setTimeout(() => setIsAddedToDesign(false), 2000);
  };

  return (
    <motion.div 
      layout
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 }
      }}
      initial="hidden"
      animate="show"
      transition={{ 
        delay: index * 0.08,
        duration: 1,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={`group relative overflow-hidden cursor-pointer shadow-sm transition-all duration-700 ${
        item.isSearchResult 
          ? 'ring-2 ring-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)] bg-emerald-950/20' 
          : 'bg-white dark:bg-zinc-900 border border-transparent'
      } hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)]`}
      onClick={() => onViewDetails(item)}
    >
      {item.isSearchResult && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-white to-emerald-400 z-[30] animate-pulse" />
      )}
      <div className="aspect-vogue overflow-hidden relative">
        {item.isSearchResult && (
          <div className="absolute bottom-4 left-4 z-[40] group/aitip">
            <div className="bg-emerald-500/80 backdrop-blur-md text-black px-2 py-1 rounded-[4px] text-[7px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg border border-white/20">
              <Cpu size={8} className="animate-pulse" /> AI Match
            </div>
            
            {/* AI Tooltip */}
            <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-black/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl text-[9px] text-white opacity-0 group-hover/aitip:opacity-100 transition-all duration-300 pointer-events-none z-[50] shadow-2xl translate-y-2 group-hover/aitip:translate-y-0 text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <Cpu size={10} className="text-emerald-400" />
                <span className="font-bold uppercase tracking-widest text-emerald-400">Neural Intelligence</span>
              </div>
              <p className="leading-relaxed opacity-80">This result was identified and scored by our AI vision model.</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-brand-ink opacity-0 group-hover:opacity-20 transition-opacity duration-700 z-10" />
        <SafeImage 
          src={item.imageUrl} 
          alt={item.description}
          className="w-full h-full object-cover origin-center grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
        />
        
        {/* Luxury Meta */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col gap-2"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[8px] uppercase font-bold tracking-[0.4em] text-white/60">Intelligence</span>
              <span className="text-[10px] text-white font-mono">#{item.id}/INTEL</span>
            </div>
            
            {item.gallerySeries && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md border border-white/5">
                <Library size={10} className="text-white/60" />
                <span className="text-[8px] text-white/80 font-bold uppercase tracking-widest">{item.gallerySeries.length}</span>
              </div>
            )}
          </motion.div>

          <div className="flex flex-col items-end gap-3">
             {/* Trend Badge */}
             {(item.analysis?.vogueIndex || 0) > 90 && (
                <div className={`backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full flex items-center gap-2 ${item.isSearchResult ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-brand-ink/40'}`}>
                  <TrendingUp size={10} className={item.isSearchResult ? 'text-emerald-400' : 'text-white'} />
                  <span className={`text-[8px] font-bold uppercase tracking-[0.2em] ${item.isSearchResult ? 'text-emerald-500' : ''}`}>Bestseller</span>
                </div>
             )}
             
             <div className="flex flex-col items-end gap-1">
                <div className={`backdrop-blur-lg border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 ${item.isSearchResult ? 'bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-white/10'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${item.isSearchResult ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,1)]' : 'bg-white shadow-[0_0_8px_white]'}`} />
                  <span className={`text-2xl font-black tracking-tight font-serif italic ${item.isSearchResult ? 'text-emerald-400' : 'text-white'}`}>
                    {item.isSearchResult ? ((item.analysis?.vogueIndex || 0) / 10).toFixed(1) : `${item.analysis?.vogueIndex}%`}
                  </span>
                </div>
                <span className={`text-[7px] uppercase font-bold tracking-[0.4em] ${item.isSearchResult ? 'text-emerald-500/60' : 'text-white/40'}`}>
                  {item.isSearchResult ? 'Neural Score' : t.gallery.trendScore}
                </span>
             </div>
          </div>
        </div>

        <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRemix(item);
            }}
            className="p-3 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-full hover:bg-emerald-500 hover:text-black transition-all group/remix"
          >
            <Zap size={12} className="text-emerald-400 group-hover/remix:text-black" />
          </button>
          <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">
            <Maximize2 size={12} className="text-white hover:text-black" />
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const link = document.createElement('a');
              link.href = item.imageUrl;
              link.download = `vogue-${item.id}.jpg`;
              link.click();
            }}
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white hover:text-black transition-all"
          >
            <Download size={12} className="text-white hover:text-black" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(window.location.href);
            }}
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white hover:text-black transition-all"
          >
            <Share2 size={12} className="text-white hover:text-black" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.22, 1, 0.36, 1] z-20 flex flex-col gap-3 justify-end bg-gradient-to-t from-black/95 via-black/40 to-transparent pt-32">
          {item.isSearchResult && item.analysis && (
            <div className="mb-4 p-4 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">Textile Intel</span>
              </div>
              <p className="text-[10px] text-white/90 italic font-serif leading-tight">
                {item.analysis.fabricComposition || "Neural detected fiber structure"}
              </p>
              <div className="mt-3 flex gap-1 h-[2px]">
                {item.analysis.colors.map((c, i) => (
                  <div key={i} className="flex-1 rounded-full opacity-60" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          )}
          
          <button 
            onClick={handleAddToDesign}
            className={`w-full py-4 border rounded-full text-[10px] font-bold uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden ${
              isAddedToDesign 
                ? 'bg-emerald-500 border-emerald-400 text-black' 
                : 'bg-brand-ink text-white border-white/10 hover:bg-white hover:text-black'
            }`}
          >
            <AnimatePresence mode="wait">
              {isAddedToDesign ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Check size={14} strokeWidth={3} /> {t.gallery.added || "Ready"}
                </motion.div>
              ) : (
                <motion.div
                  key="palette"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                   className="flex items-center gap-2"
                >
                  <Palette size={14} /> {t.gallery.addToDesign}
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToMoodboard(item);
            }}
            disabled={isSaved}
            className={`w-full py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${
              isSaved 
                ? 'bg-white text-black opacity-100' 
                : 'bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black'
            }`}
          >
            {isSaved ? (
              <><Sparkles size={14} /> Curated</>
            ) : (
              <><Upload size={14} className="rotate-180" /> Save to Archive</>
            )}
          </button>
        </div>
      </div>
      
      <div className={`p-8 border-b border-zinc-100 dark:border-white/5 transition-colors duration-500 ${
        item.isSearchResult 
          ? 'bg-emerald-50/50 dark:bg-emerald-900/5' 
          : 'bg-white dark:bg-zinc-900 group-hover:bg-zinc-50 dark:group-hover:bg-white/5'
      }`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`h-[1px] ${item.isSearchResult ? 'bg-emerald-400 w-12' : 'bg-zinc-400 group-hover:w-12'} transition-all duration-500`} />
          <span className={`text-[9px] uppercase tracking-[0.4em] font-black ${item.isSearchResult ? 'text-emerald-500' : 'text-zinc-400'}`}>{item.category}</span>
        </div>
        <h3 className={`font-serif text-3xl mb-3 uppercase tracking-tighter transition-all duration-700 group-hover:tracking-[-0.05em] group-hover:italic font-medium flex items-center gap-3 ${item.isSearchResult ? 'text-zinc-900 dark:text-emerald-50' : 'dark:text-white'}`}>
          {item.style}
          {item.isSearchResult && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md"
            >
              <Sparkles size={12} className="text-emerald-500" />
            </motion.div>
          )}
        </h3>
        <p className={`text-[10px] line-clamp-2 italic font-serif leading-loose uppercase tracking-[0.1em] opacity-60 group-hover:opacity-100 transition-opacity ${item.isSearchResult ? 'text-emerald-800/60 dark:text-emerald-400/60' : 'text-zinc-400 dark:text-zinc-500'}`}>{item.description}</p>
        
        {item.isSearchResult && (
          <div className="mt-6 flex flex-wrap gap-2">
            {item.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const DesignGeneratorModal: React.FC<{
  item: FashionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  generatedUrl: string | null;
  setGeneratedUrl: (url: string | null) => void;
  t: any;
}> = ({ item, isOpen, onClose, onGenerate, isGenerating, generatedUrl, setGeneratedUrl, t }) => {
  const [prompt, setPrompt] = useState("");

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-0 md:p-10"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-white rounded-[40px] w-full max-w-5xl h-full md:h-initial overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-zinc-100 rounded-full z-20 transition-all">
              <X size={28} strokeWidth={1.5} />
            </button>

            <div className="md:w-[55%] h-full relative bg-zinc-50 border-r border-zinc-100">
              <AnimatePresence mode="wait">
                {generatedUrl ? (
                  <motion.div 
                    key="generated"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full"
                  >
                    <img src={generatedUrl} className="w-full h-full object-cover" alt="Generated Design" />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="original"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full flex items-center justify-center relative overflow-hidden"
                  >
                    <SafeImage src={item.imageUrl} className="w-full h-full object-cover opacity-20 grayscale scale-110" alt="" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-900 bg-white/40">
                      {isGenerating ? (
                        <div className="flex flex-col items-center gap-6">
                          <div className="relative">
                            <Sparkles size={64} className="animate-spin text-brand-ink" />
                            <motion.div 
                              className="absolute inset-0 border-2 border-brand-ink rounded-full"
                              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          </div>
                          <span className="text-[12px] uppercase font-bold tracking-[0.4em] text-brand-ink animate-pulse">{t.gallery.generatingDesign}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-8 px-20 text-center">
                          <div className="w-24 h-24 rounded-full border border-zinc-200 flex items-center justify-center">
                            <Palette size={40} className="text-zinc-200" />
                          </div>
                          <div>
                            <h4 className="font-serif text-3xl uppercase tracking-tighter mb-4 text-zinc-300">Awaiting Concept</h4>
                            <p className="text-zinc-300 text-sm italic font-serif">Original Reference: {item.style}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 p-10 md:p-16 flex flex-col justify-center bg-white dark:bg-zinc-950">
              <div className="mb-12">
                <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-zinc-300 dark:text-zinc-700 mb-2 block">AI Design Lab</span>
                <h3 className="font-serif text-5xl uppercase tracking-tighter leading-none dark:text-white">{t.gallery.addToDesign}</h3>
              </div>
              
              {!generatedUrl ? (
                <>
                  <div className="mb-10">
                    <label className="text-[10px] uppercase font-bold tracking-[0.4em] text-zinc-400 mb-4 block">{t.gallery.designConcept}</label>
                    <textarea 
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      placeholder={t.design.placeholder}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-[30px] p-8 text-xl font-serif focus:outline-none focus:ring-1 focus:ring-brand-ink transition-all h-48 resize-none placeholder:text-zinc-200 dark:placeholder:text-zinc-800 dark:text-white"
                    />
                  </div>
                  <button 
                    onClick={() => onGenerate(prompt)}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full py-6 bg-brand-ink text-white rounded-full font-bold uppercase text-[11px] tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 hover:scale-[1.02] transition-transform"
                  >
                    {isGenerating ? <><Sparkles className="animate-spin" size={20} /> {t.gallery.generatingDesign}</> : <><Palette size={20} /> {t.design.generate}</>}
                  </button>
                </>
              ) : (
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-6 bg-emerald-50 text-emerald-700 rounded-3xl text-sm italic font-serif flex items-center gap-4 mb-10"
                  >
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <Check size={20} />
                    </div>
                    Concept Matched & Materialized
                  </motion.div>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = generatedUrl;
                      link.download = "vogue-ai-design.png";
                      link.click();
                    }}
                    className="w-full py-6 bg-brand-ink text-white rounded-full font-bold uppercase text-[11px] tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] transition-transform"
                  >
                    <Download size={22} /> {t.gallery.download}
                  </button>
                  <button 
                    onClick={() => {
                      setGeneratedUrl(null);
                      setPrompt("");
                    }}
                    className="w-full py-6 border border-zinc-100 rounded-full font-bold uppercase text-[11px] tracking-[0.3em] text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 transition-all"
                  >
                    {t.gallery.resetFilters}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
          className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-brand-beige dark:bg-zinc-950 border-l border-zinc-200 dark:border-white/5 shadow-2xl z-[110] flex flex-col"
        >
          <div className="p-8 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-3xl uppercase tracking-tighter dark:text-white">{t.moodboard.title}</h2>
              <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest">{items.length} Elements</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-white/5 rounded-full transition-all dark:text-white">
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
                  <div className="w-24 aspect-vogue rounded-lg overflow-hidden flex-shrink-0 shadow-lg bg-zinc-100">
                    <SafeImage src={item.imageUrl} className="w-full h-full object-cover" alt="" />
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
  onRemix: (item: FashionItem) => void;
  isSaved: boolean;
  t: any;
}> = ({ item, onClose, onAddToMoodboard, onRemix, isSaved, t }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [item]);

  if (!item) return null;

  const currentImageUrl = item.gallerySeries && item.gallerySeries.length > 0 
    ? item.gallerySeries[currentImageIndex] 
    : item.imageUrl;

  const handleDownload = async () => {
    try {
      const response = await fetch(currentImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vogue-ai-${item.style.toLowerCase().replace(/\s+/g, '-')}-${currentImageIndex}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleShare = (platform: 'pinterest' | 'twitter' | 'facebook' | 'link') => {
    const shareUrl = window.location.href;
    const text = `ModaUI - ${item.style}: ${item.description}`;
    
    switch (platform) {
      case 'pinterest':
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(currentImageUrl)}&description=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'link':
        navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        break;
    }
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-0 md:p-10"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.05, opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="bg-white w-full h-full md:max-h-[85vh] md:max-w-7xl md:rounded-[40px] overflow-hidden flex flex-col md:flex-row relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Visual */}
            <div className="md:w-1/2 h-[50vh] md:h-full relative overflow-hidden bg-zinc-100 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full"
                >
                  <SafeImage 
                    src={currentImageUrl} 
                    alt={item.style}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows for Series */}
              {item.gallerySeries && item.gallerySeries.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev - 1 + item.gallerySeries!.length) % item.gallerySeries!.length)}
                    className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all z-20 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev + 1) % item.gallerySeries!.length)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all z-20 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Series Thumbnails */}
              {item.gallerySeries && item.gallerySeries.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20 px-6 py-3 bg-black/20 backdrop-blur-md rounded-full border border-white/10">
                  {item.gallerySeries.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-12 h-16 rounded-md overflow-hidden border-2 transition-all ${
                        currentImageIndex === idx ? 'border-white scale-110 shadow-xl' : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Content */}
            <div className="flex-1 p-8 md:p-20 overflow-y-auto no-scrollbar flex flex-col justify-between bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white scroll-smooth font-sans">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-4 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-all z-30 dark:text-white"
              >
                <X size={32} strokeWidth={1} />
              </button>

              <div className="relative">
                <div className="flex items-center gap-6 mb-12">
                  <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-zinc-300 dark:text-zinc-700">ModaUI ID: {item.id}x92</span>
                  <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-white/5" />
                </div>

                <h2 className="font-serif text-5xl md:text-8xl uppercase leading-[0.85] tracking-tighter mb-10 w-full break-words">
                  {item.style}
                </h2>

              <p className="font-serif text-2xl text-zinc-400 italic leading-snug mb-16 max-w-xl">
                "{item.description}"
              </p>

                {/* AI Intelligence Modules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                  <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-white/5 group transition-all duration-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-white dark:bg-zinc-950 rounded-xl shadow-sm border border-zinc-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                        <Palette size={14} className="text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-zinc-900 dark:text-white">Color DNA</span>
                    </div>
                    <div className="flex gap-2">
                      {item.analysis?.colors?.map((color, i) => (
                        <div key={i} className="flex flex-col gap-2">
                          <div className="w-12 h-12 rounded-2xl shadow-inner cursor-pointer hover:scale-105 transition-transform" style={{ backgroundColor: color }} />
                          <span className="text-[8px] font-mono text-zinc-400 uppercase text-center">{color}</span>
                        </div>
                      )) || (
                        <div className="flex gap-2 opacity-30">
                          {['#E5E5E5', '#A3A3A3', '#525252'].map(c => (
                            <div key={c} className="w-12 h-12 rounded-2xl bg-zinc-200" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-white/5 group transition-all duration-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-white dark:bg-zinc-950 rounded-xl shadow-sm border border-zinc-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                        <Library size={14} className="text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-zinc-900 dark:text-white">Textile Intelligence</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.analysis?.fabrics?.map((fabric, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors cursor-pointer">
                          {fabric}
                        </span>
                      )) || (
                        ['Organic Linen', 'Raw Silk', 'Recycled Wool'].map(f => (
                          <span key={f} className="px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-white/5 rounded-full text-[9px] font-bold uppercase tracking-widest text-zinc-300 dark:text-zinc-700">
                            {f}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              {/* Advanced Neural Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                {[
                  { label: t.gallery.sustainability, value: `${item.analysis?.sustainability || 85}%`, color: "bg-emerald-500" },
                  { label: t.gallery.heritage, value: `${item.analysis?.heritageScore || 60}%`, color: "bg-indigo-500" },
                  { label: t.gallery.velocity, value: item.analysis?.trendVelocity || "Rising", color: "bg-orange-500" },
                  { label: t.gallery.composition, value: item.analysis?.fabricComposition || "Premium Blend", color: "bg-zinc-800" },
                ].map((stat, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400">{stat.label}</span>
                      <span className="text-sm font-bold font-mono">{stat.value}</span>
                    </div>
                    <div className="h-[2px] w-full bg-zinc-100 overflow-hidden">
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className={`h-full w-full ${stat.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 mt-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onAddToMoodboard(item)}
                  disabled={isSaved}
                  className={`flex-1 py-6 rounded-full font-bold uppercase text-[11px] tracking-[0.4em] transition-all flex items-center justify-center gap-4 ${
                    isSaved 
                      ? 'bg-zinc-900 dark:bg-white dark:text-black text-white cursor-default' 
                      : 'bg-zinc-900 dark:bg-white dark:text-black text-white hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-2xl'
                  }`}
                >
                  {isSaved ? <><Sparkles size={20} /> Verified Archive</> : <><Upload size={20} className="rotate-180" /> Append to Board</>}
                </button>

                <button 
                  onClick={() => onRemix(item)}
                  className="flex-1 py-6 bg-emerald-500 text-black rounded-full font-black uppercase text-[11px] tracking-[0.4em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-4 shadow-xl shadow-emerald-500/20"
                >
                  <Zap size={20} /> {t.styleGen.button}
                </button>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleDownload}
                  className="flex-1 py-5 border border-zinc-200 dark:border-white/10 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-zinc-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                >
                  <Download size={18} /> {t.gallery.download}
                </button>
              </div>

              <div className="flex flex-wrap gap-4">
                {[
                  { id: 'pinterest', icon: Share2, label: t.gallery.sharePinterest, color: 'hover:text-red-600' },
                  { id: 'twitter', icon: Twitter, label: t.gallery.shareTwitter, color: 'hover:text-sky-500' },
                  { id: 'facebook', icon: Facebook, label: t.gallery.shareFacebook, color: 'hover:text-blue-600' },
                  { id: 'link', icon: Link, label: isCopied ? t.gallery.copied : t.gallery.share, color: 'hover:text-zinc-900' }
                ].map((option) => (
                  <button 
                    key={option.id}
                    onClick={() => handleShare(option.id as any)}
                    className={`flex-1 min-w-[120px] py-4 border border-zinc-100 rounded-2xl font-bold uppercase text-[9px] tracking-[0.2em] transition-all flex flex-col items-center justify-center gap-2 text-zinc-400 bg-zinc-50/50 hover:bg-white hover:shadow-lg ${option.color}`}
                  >
                    {option.id === 'link' && isCopied ? <Check size={16} /> : <option.icon size={16} />}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
    </AnimatePresence>
  );
};

const FilterPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  allStyles: string[];
  selectedStyles: string[];
  toggleStyle: (style: string) => void;
  allTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  resetFilters: () => void;
  t: any;
}> = ({ isOpen, onClose, allStyles, selectedStyles, toggleStyle, allTags, selectedTags, toggleTag, resetFilters, t }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[140]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white dark:bg-zinc-950 z-[150] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-zinc-100 dark:border-white/10 flex items-center justify-between">
              <h3 className="font-serif text-2xl uppercase tracking-tighter dark:text-white">{t.gallery.filterByStyle}</h3>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-all dark:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400">{t.gallery.styles}</h4>
                  <span className="text-[10px] font-mono text-zinc-300 dark:text-zinc-700">{selectedStyles.length} Selected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allStyles.map(style => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`px-4 py-2 rounded-full text-xs transition-all ${
                        selectedStyles.includes(style)
                          ? 'bg-brand-ink text-white shadow-lg scale-105'
                          : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 border border-zinc-100 dark:border-white/5'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400">{t.gallery.tags}</h4>
                  <span className="text-[10px] font-mono text-zinc-300 dark:text-zinc-700">{selectedTags.length} Selected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full text-xs transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg scale-105'
                          : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 border border-zinc-100 dark:border-white/5'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="p-8 border-t border-zinc-100 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 flex gap-4">
              <button 
                onClick={resetFilters}
                className="flex-1 py-4 border border-zinc-200 dark:border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 hover:text-red-500 transition-all"
              >
                {t.gallery.resetFilters}
              </button>
              <button 
                onClick={onClose}
                className="flex-1 py-4 bg-brand-ink text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SettingsPanel: React.FC<{ 
  theme: Theme; 
  setTheme: (theme: Theme) => void;
  t: any;
}> = ({ theme, setTheme, t }) => {
  return (
    <section className="py-20 max-w-2xl mx-auto px-6">
      <h2 className="font-serif text-4xl mb-10 uppercase tracking-tighter">System Configuration</h2>
      <div className="space-y-8">
        {/* Theme Toggle */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-white/5 flex items-center justify-between shadow-sm">
          <div>
            <h4 className="font-bold text-lg mb-1">{t.settings.theme}</h4>
            <p className="text-zinc-400 text-sm italic">Switch between light and dark visual aesthetics.</p>
          </div>
          <div className="flex bg-zinc-100 dark:bg-black p-1 rounded-full border border-zinc-200 dark:border-white/10">
            <button 
              onClick={() => setTheme(Theme.LIGHT)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                theme === Theme.LIGHT ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              {t.settings.light}
            </button>
            <button 
              onClick={() => setTheme(Theme.DARK)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                theme === Theme.DARK ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.settings.dark}
            </button>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg mb-1">AI Curation Sensitivity</h4>
            <p className="text-zinc-400 text-sm italic">Adjust how strictly the AI filters trends.</p>
          </div>
          <div className="w-12 h-6 bg-emerald-500 rounded-full relative shadow-inner">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg mb-1">Creative Mode</h4>
            <p className="text-zinc-400 text-sm italic">Enable high-experimental trend detection.</p>
          </div>
          <div className="w-12 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full relative">
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
          </div>
        </div>

        {/* Neural Scraper Engine */}
        <div className="p-8 bg-zinc-900 dark:bg-black rounded-[40px] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all duration-1000" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                  <Server className="text-emerald-400" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-white leading-tight">{t.settings.scraper.title}</h4>
                  <p className="text-emerald-400/60 text-xs font-mono uppercase tracking-widest">{t.settings.scraper.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <Activity size={12} className="text-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">{t.settings.scraper.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group/metric overflow-hidden relative">
                <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover/metric:translate-y-0 transition-transform duration-500" />
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block mb-2 relative z-10">Sync Delay</span>
                <p className="text-white font-serif text-lg italic relative z-10">0.42ms</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group/metric overflow-hidden relative">
                <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover/metric:translate-y-0 transition-transform duration-500" />
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block mb-2 relative z-10">Confidence</span>
                <p className="text-white font-serif text-lg italic relative z-10">94.2%</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group/metric overflow-hidden relative">
                <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover/metric:translate-y-0 transition-transform duration-500" />
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block mb-2 relative z-10">Streams</span>
                <p className="text-white font-serif text-lg italic relative z-10">1.2k/s</p>
              </div>
            </div>

            {/* Neural Topology Visualization */}
            <div className="mb-8 h-24 relative bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full stroke-emerald-500/20 stroke-[0.5]" viewBox="0 0 400 100">
                {[...Array(12)].map((_, i) => (
                  <motion.circle
                    key={`node-${i}`}
                    cx={30 + i * 30}
                    cy={50 + Math.sin(i) * 20}
                    r="2"
                    fill="#10b981"
                    animate={{ opacity: [0.2, 1, 0.2], r: [2, 3, 2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
                {[...Array(11)].map((_, i) => (
                  <motion.line
                    key={`line-${i}`}
                    x1={30 + i * 30}
                    y1={50 + Math.sin(i) * 20}
                    x2={30 + (i + 1) * 30}
                    y2={50 + Math.sin(i + 1) * 20}
                    strokeDasharray="4 2"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/30 mix-blend-overlay">Active Pipeline 392X</span>
              </div>
            </div>

            {/* Simulated Live Log Upgrade */}
            <div className="mb-8 p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-[9px] h-32 overflow-hidden flex flex-col gap-2">
              <div className="text-emerald-400/80 animate-pulse flex justify-between"><span>[SYSTEM] Neural Harvester active</span> <span>TX-92</span></div>
              <div className="text-white/40 flex justify-between"><span>[CRAWL] Pinterest/Tokyo_Streetwear :: Captured</span> <span>2ms</span></div>
              <div className="text-white/40 flex justify-between"><span>[AI] Feature Vectorization complete</span> <span>1024_DIM</span></div>
              <div className="text-white/40 flex justify-between"><span>[DB] Pinecone Indexing successful</span> <span>ID_82x</span></div>
              <div className="text-emerald-500 flex justify-between"><span>[SUCCESS] Scraped metadata for Gown_92</span> <span>OK</span></div>
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-white/60 text-sm italic font-serif leading-relaxed">
                {t.settings.scraper.sources}
              </p>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ x: '-100%' }}
                   animate={{ x: '100%' }}
                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                   className="h-full w-1/3 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                {t.settings.scraper.action}
              </button>
              <button className="px-6 py-4 border border-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
                {t.settings.scraper.configure}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/5">
          <h4 className="font-bold text-lg mb-4">Neural Engine Status</h4>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-2 text-emerald-600"><span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" /> Gemini Pro Vision: Active</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="flex items-center gap-2 text-zinc-400">VE-1.4: Syncing...</span>
          </div>
        </div>
      </div>
      <div className="mt-20 pt-10 border-t border-zinc-100 dark:border-white/5 text-center">
        <p className="text-[10px] uppercase tracking-widest text-zinc-300">ModaUI Core Protocol v4.82</p>
      </div>
    </section>
  );
};

// --- Main App ---

export default function App() {
  const [lang, setLang] = useState<Language>(getBrowserLanguage());
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<"gallery" | "design" | "interaction" | "settings">("gallery");
  const [activeCategory, setActiveCategory] = useState("All Trends");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [gallery, setGallery] = useState<FashionItem[]>(MOCK_FASHION_GALLERY);
  const [searchStatus, setSearchStatus] = useState<AppState>(AppState.IDLE);
  const [aiAnalysis, setAiAnalysis] = useState<{ category: string, tags: string[], description: string } | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [remixItem, setRemixItem] = useState<FashionItem | null>(null);
  const [isRemixing, setIsRemixing] = useState(false);
  const [remixResult, setRemixResult] = useState<string | null>(null);
  const [mutationLevel, setMutationLevel] = useState(0.3);
  const [labStatus, setLabStatus] = useState<'IDLE' | 'SCANNING' | 'REMIXING'>('IDLE');

  // Simulated Stats
  const [flowRate, setFlowRate] = useState("1.2");
  const [confidence, setConfidence] = useState("98.2");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLabStatus('SCANNING');
    setIsAnalyzingImage(true);
    
    try {
      const { blob } = await optimizeImage(file);
      const base64 = await fileToBase64(blob);
      const analysis = await performVisualSearch(base64, blob.type);
      
      const simulatedResult: FashionItem = {
        id: `img-${Date.now()}`,
        imageUrl: base64,
        category: analysis.category,
        tags: [...analysis.tags, "Neural Harvest"],
        style: "Harvested DNA",
        description: analysis.description,
        isSearchResult: true,
        analysis: {
          sustainability: 85,
          heritageScore: 70,
          trendVelocity: 'Rising',
          fabricComposition: 'Extracted via Neural Scan',
          vogueIndex: 94,
          colors: analysis.colors || ['#000000', '#FFFFFF'],
          fabrics: analysis.fabrics || ['Identified via Scan']
        }
      };
      
      setGallery(prev => [simulatedResult, ...prev]);
      setActiveCategory(analysis.category);
      window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
      setError("Genetic retrieval failed.");
    } finally {
      setTimeout(() => {
        setLabStatus('IDLE');
        setIsAnalyzingImage(false);
      }, 1000);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    noClick: true,
    accept: { 'image/*': [] }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFlowRate((parseFloat(flowRate) + (Math.random() - 0.5) * 0.1).toFixed(1));
      setConfidence((parseFloat(confidence) + (Math.random() - 0.5) * 0.2).toFixed(1));
    }, 3000);
    return () => clearInterval(interval);
  }, [flowRate, confidence]);

  const handleRemix = async (prompt: string, referenceImage: string, level: number) => {
    setIsRemixing(true);
    setMutationLevel(level);
    try {
      // Incorporate mutation level into the prompt or params if the service supports it
      const enhancedPrompt = `Mutation Level: ${level}. ${prompt}`;
      const result = await generateTextImage({
        text: enhancedPrompt,
        style: remixItem?.style || '',
        referenceImage
      });
      setRemixResult(`data:${result.mimeType};base64,${result.data}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Remix failed");
    } finally {
      setIsRemixing(false);
    }
  };
  const [moodboard, setMoodboard] = useState<FashionItem[]>([]);
  const [isMoodboardOpen, setIsMoodboardOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FashionItem | null>(null);
  const [designItem, setDesignItem] = useState<FashionItem | null>(null);
  const [isGeneratingDesign, setIsGeneratingDesign] = useState(false);
  const [generatedDesignUrl, setGeneratedDesignUrl] = useState<string | null>(null);
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
    return gallery.filter(item => {
      const categoryMatch = activeCategory === "All Trends" || item.category === activeCategory;
      const styleMatch = selectedStyles.length === 0 || selectedStyles.includes(item.style);
      const tagsMatch = selectedTags.length === 0 || selectedTags.every(tag => item.tags.includes(tag));
      return categoryMatch && styleMatch && tagsMatch;
    });
  }, [activeCategory, gallery, selectedStyles, selectedTags]);

  const allAvailableStyles = useMemo(() => {
    const styles = new Set<string>();
    MOCK_FASHION_GALLERY.forEach(item => styles.add(item.style));
    return Array.from(styles).sort();
  }, []);

  const allAvailableTags = useMemo(() => {
    const tags = new Set<string>();
    MOCK_FASHION_GALLERY.forEach(item => item.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setActiveCategory("All Trends");
    setSelectedStyles([]);
    setSelectedTags([]);
  };

  const handleGenerateDesign = async (prompt: string) => {
    if (!designItem || !prompt.trim()) return;
    
    setIsGeneratingDesign(true);
    try {
      const result = await generateTextImage({
        text: prompt,
        style: designItem.style,
        referenceImage: designItem.imageUrl
      });
      setGeneratedDesignUrl(`data:${result.mimeType};base64,${result.data}`);
    } catch (e) {
      console.error("Design generation error:", e);
      setError("AI generation failed. Our neural core is currently overwhelmed.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsGeneratingDesign(false);
    }
  };

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
      const { blob } = await optimizeImage(file);
      const base64 = await fileToBase64(blob);
      const analysis = await performVisualSearch(base64, blob.type);
      
      setAiAnalysis(analysis);
      
      const simulatedResult: FashionItem = {
        id: `img-${Date.now()}`,
        imageUrl: base64,
        category: analysis.category,
        tags: [...analysis.tags, "Visual Intelligence", "Direct Analysis"],
        style: "AI Identified Style",
        description: analysis.description,
        isSearchResult: true,
        analysis: {
          sustainability: 85,
          heritageScore: 70,
          trendVelocity: 'Rising',
          fabricComposition: 'Detected via Neural Analysis',
          vogueIndex: 92,
          colors: analysis.colors || ['#000000', '#FFFFFF'],
          fabrics: analysis.fabrics || ['Detected Textile']
        }
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
    <div {...getRootProps()} className={`min-h-screen font-sans selection:bg-brand-ink selection:text-white pb-24 md:pb-0 vogue-grain ${theme === Theme.DARK ? 'dark bg-black text-white' : 'bg-white text-zinc-900'} ${activeTab !== 'gallery' && theme === Theme.LIGHT ? 'bg-zinc-50' : ''}`}>
      <input {...getInputProps()} />

      {/* Gravity Capture Overlay */}
      <AnimatePresence>
        {isDragActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-emerald-500/10 backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent opacity-50" />
            
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0, transition: { type: 'spring', damping: 15 } }}
              className="relative"
            >
              <div className="w-[400px] h-[400px] border-2 border-dashed border-emerald-500/50 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                 <div className="w-[300px] h-[300px] border border-emerald-500/30 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
              </div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-emerald-500 text-black p-6 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.5)]"
                >
                  <Upload size={40} strokeWidth={2.5} />
                </motion.div>
                <div className="text-center">
                  <h3 className="text-emerald-500 font-mono text-xl font-black tracking-[0.3em] mb-2">GRAVITY CAPTURE</h3>
                  <p className="text-white/60 font-mono text-[10px] uppercase tracking-widest">Drop to harvest item DNA</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Error Toast */}
      <AnimatePresence>
        {isAnalyzingImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center text-white p-10"
          >
            <div className="relative mb-20">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-64 h-64 border-[1px] border-emerald-500/10 rounded-full flex items-center justify-center"
              >
                <div className="absolute inset-0 border-t border-emerald-400 rounded-full animate-spin shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
              </motion.div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Cpu size={48} className="text-emerald-400 animate-pulse mb-4" />
                <motion.div 
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] tracking-widest"
                >
                  <Activity size={14} className="animate-bounce" /> DNA_HARVEST_V2
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center max-w-2xl px-6"
            >
              <h2 className="font-serif text-5xl md:text-8xl uppercase tracking-tighter mb-8 italic drop-shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-[pulse_2s_infinite]">
                Neural Harvest <span className="not-italic font-black text-emerald-400 opacity-20">v.4</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[10px] font-mono text-emerald-500/60 uppercase tracking-widest mb-16">
                {[
                  { phase: 'Phase 1', label: 'Geometric Mapping', status: 'OK', delay: 0 },
                  { phase: 'Phase 2', label: 'DNA Extraction', status: 'RUNNING', delay: 0.2 },
                  { phase: 'Phase 3', label: 'Vector Alignment', status: 'PENDING', delay: 0.4 }
                ].map((p, i) => (
                  <motion.div 
                    key={p.phase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + p.delay }}
                    className="flex flex-col gap-2 p-6 bg-emerald-500/5 rounded-[24px] border border-emerald-500/10 backdrop-blur-md relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                    <span className="text-white/30 text-[8px]">{p.phase}</span>
                    <span className="text-white font-bold mb-1">{p.label}</span>
                    <span className={`text-[9px] ${p.status === 'RUNNING' ? 'text-white animate-pulse' : 'text-emerald-400/60'}`}>{p.status}</span>
                  </motion.div>
                ))}
              </div>

              {/* Progress Bar Upgrade */}
              <div className="px-10">
                <div className="relative w-full h-[2px] bg-white/5 overflow-hidden rounded-full">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_40px_rgba(16,185,129,1)]"
                  />
                </div>
              </div>

              <div className="mt-12 flex justify-center items-center gap-10">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-2">Memory Allocation</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: [4, 12, 4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 bg-emerald-500/40 rounded-full"
                      />
                    ))}
                  </div>
                </div>
                <div className="w-[1px] h-10 bg-white/10" />
                <div className="text-left">
                  <div className="text-[8px] text-white/40 uppercase font-bold tracking-widest mb-1">Status Code</div>
                  <div className="text-emerald-500 font-mono text-[10px] animate-pulse">TX_DNA_SYNC_ACTIVE</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
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
      <nav className="fixed top-0 w-full z-50 p-6 flex items-start justify-between pointer-events-none md:flex hidden">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto cursor-pointer flex items-center gap-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-ink rounded-xl border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)]">
              <span className="font-serif text-2xl font-black text-white italic">M</span>
            </div>
            <span className="font-serif text-3xl font-black tracking-tighter uppercase text-white drop-shadow-lg" onClick={() => setActiveTab("gallery")}>ModaUI</span>
          </div>
          
          {/* Neural Harvester Dashboard */}
          <div className="flex items-start gap-8 border-l border-white/10 pl-8">
            <div className="flex flex-col">
              <span className="text-[8px] text-white/40 uppercase font-black tracking-widest leading-none mb-1">Flow Rate</span>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-sm font-bold">{flowRate}GB/S</span>
                <TrendingUp size={10} className="text-emerald-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-white/40 uppercase font-black tracking-widest leading-none mb-1">Confidence</span>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-sm font-bold">{confidence}%</span>
                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    className="h-full bg-emerald-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-4 pointer-events-auto items-start">
          {/* Mutation Console */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/80 backdrop-blur-2xl border border-white/10 p-5 rounded-[24px] w-64 shadow-2xl mr-4"
          >
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Live Optimization</span>
                </div>
                <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className="text-[8px] font-mono text-white/40 hover:text-white transition-all uppercase tracking-widest">
                  {lang === 'en' ? 'ZH' : 'EN'}
                </button>
             </div>
             
             <div className="space-y-4">
               <div>
                 <div className="flex justify-between items-center mb-2">
                   <label className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Mutation Level</label>
                   <span className={`text-[9px] font-black font-mono px-2 py-0.5 rounded ${mutationLevel > 0.7 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                      {mutationLevel > 0.7 ? 'EXPERIMENTAL' : 'POLISHED'}
                   </span>
                 </div>
                 <input 
                   type="range" 
                   min="0" 
                   max="1" 
                   step="0.01"
                   value={mutationLevel}
                   onChange={(e) => setMutationLevel(parseFloat(e.target.value))}
                   className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-400"
                 />
               </div>
             </div>
          </motion.div>

          <button 
            onClick={() => setIsMoodboardOpen(true)}
            className="p-3 glass rounded-full text-white hover:scale-110 transition-all relative group"
          >
            <LayoutGrid size={20} />
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
            <div className="absolute right-0 top-14 opacity-0 group-hover:opacity-100 transition-all bg-white text-black text-[10px] px-3 py-2 rounded-lg whitespace-nowrap uppercase tracking-widest shadow-xl font-bold">
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
                {/* Intelligence Status Indicators */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20 border-b border-zinc-100 pb-12">
                  <div className="flex items-center gap-5">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-9 h-9 rounded-full bg-zinc-100 border-2 border-white overflow-hidden hover:z-10 transition-all cursor-pointer">
                          <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <div className="w-9 h-9 rounded-full bg-zinc-900 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">+1.2k</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-900 block mb-0.5 whitespace-nowrap">ModaUI Trend Engine</span>
                      <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-zinc-400 whitespace-nowrap">48,202 Active Data Streams</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 px-5 py-3 rounded-2xl">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black tracking-[0.15em] text-zinc-900 dark:text-white leading-none mb-1">Neural Cluster 07</span>
                        <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Status: Synchronized</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-zinc-900 dark:bg-white px-5 py-3 rounded-2xl shadow-xl">
                      <div className="p-1.5 bg-white/10 dark:bg-black/10 rounded-lg">
                        <Activity size={12} className="text-emerald-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black tracking-[0.15em] text-white dark:text-black leading-none mb-1">Pulse Harvest</span>
                        <span className="text-[8px] uppercase tracking-widest text-emerald-400 font-bold">Scraping Tokyo...</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <TrendHotspots t={t} />
                
                {/* Category Filters */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-400 mb-2 block">{t.gallery.curation}</span>
                    <h2 className="font-serif text-4xl uppercase tracking-tighter dark:text-zinc-100">{t.gallery.title}</h2>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
                      {FASHION_CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                            activeCategory === cat 
                              ? 'bg-brand-ink text-white shadow-xl shadow-brand-ink/20' 
                              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-400 hover:border-brand-ink'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => setIsFilterPanelOpen(true)}
                      className={`mb-4 px-6 py-2 rounded-full flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all ${
                        selectedStyles.length > 0 || selectedTags.length > 0
                          ? 'bg-brand-ink text-white'
                          : 'border border-zinc-200 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900'
                      }`}
                    >
                      <Filter size={14} />
                      {(selectedStyles.length > 0 || selectedTags.length > 0) && (
                        <span className="bg-white text-brand-ink w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                          {selectedStyles.length + selectedTags.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* AI Insight Bar */}
                {aiAnalysis && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 p-5 bg-zinc-900 rounded-2xl text-white flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl mb-1 italic">Fashion AI Insight</h3>
                      <p className="text-zinc-400 text-[13px] max-w-xl leading-relaxed">{aiAnalysis.description}</p>
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
                          onAddToDesign={setDesignItem}
                          onRemix={setRemixItem}
                          isSaved={moodboard.some(m => m.id === item.id)}
                          t={t}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`min-h-screen pt-32 pb-20 px-6 transition-colors duration-500 ${theme === Theme.DARK ? 'bg-black text-white' : 'bg-brand-ink text-white'}`}
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-white/40 mb-4 block">{t.design.subtitle}</span>
                  <h2 className="editorial-title font-serif text-7xl md:text-9xl uppercase leading-[0.8]">{t.design.title}</h2>
                </div>
                <div className="glass p-6 rounded-2xl flex items-center gap-4 border-white/5">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-widest">{t.design.labStatus}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className="space-y-12">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40">{t.design.promptLabel}</label>
                    <textarea 
                      placeholder={t.design.placeholder}
                      className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-xl font-serif focus:outline-none focus:ring-1 focus:ring-white transition-all h-64 resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {['Silhouette', 'Fabric', 'Era', 'Mood'].map(param => (
                      <div key={param} className="p-4 border border-white/10 rounded-2xl flex justify-between items-center group hover:bg-white/5 cursor-pointer transition-all">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 group-hover:text-white">{param}</span>
                        <ChevronRight size={14} className="text-white/20" />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isAnalyzingImage}
                      className="flex-1 py-6 border border-white/10 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-white/5 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                      {isAnalyzingImage && (
                        <motion.div 
                          className="absolute inset-0 bg-white/10"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                      <Camera size={18} className={isAnalyzingImage ? 'animate-bounce' : ''} /> 
                      {isAnalyzingImage ? t.gallery.analyzing : t.gallery.upload}
                    </button>
                    <button className="flex-1 py-6 bg-white text-black rounded-full font-bold uppercase text-[10px] tracking-[0.3em] hover:scale-[1.02] transition-transform shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                      {t.design.generate}
                    </button>
                  </div>
                </div>

                <div className="aspect-square bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-50" />
                  
                  <AnimatePresence mode="wait">
                    {isAnalyzingImage ? (
                      <motion.div 
                        key="analyzing"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="flex flex-col items-center"
                      >
                        <div className="relative">
                          <Sparkles size={48} className="text-white animate-pulse" />
                          <motion.div 
                            className="absolute inset-0 border border-white rounded-full"
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </div>
                        <span className="mt-6 text-[8px] uppercase font-bold tracking-[0.4em] text-white/30">Scanning Hub</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center"
                      >
                        <Sparkles size={40} className="text-white/10 group-hover:text-white/20 transition-all group-hover:scale-110 duration-1000" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute bottom-8 left-8 right-8 p-8 glass rounded-3xl border-white/5">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-mono text-white/40">GEN-PROT v2.0 / {activeCategory}</span>
                      <span className="text-[10px] font-mono text-emerald-500">READY</span>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className="flex-1 h-3 bg-white/5 overflow-hidden">
                          <motion.div 
                            animate={{ opacity: [0.1, 0.5, 0.1] }}
                            transition={{ duration: 2, delay: i * 0.05, repeat: Infinity }}
                            className="h-full w-full bg-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
            />
          </motion.div>
        )}

        {activeTab === 'interaction' && (
          <motion.div
            key="interaction"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`min-h-screen pt-32 pb-20 px-6 transition-colors duration-500 ${theme === Theme.DARK ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'}`}
          >
            <div className="max-w-4xl mx-auto">
              <div className="mb-20">
                <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-zinc-400 mb-4 block">{t.interaction.subtitle}</span>
                <h2 className="editorial-title font-serif text-[12vw] md:text-8xl uppercase tracking-tighter leading-[0.8]">{t.interaction.title}</h2>
              </div>

              <div className="space-y-16">
                <div className="space-y-8">
                  <div className="p-10 border border-zinc-100 dark:border-white/5 rounded-[40px] bg-zinc-50 dark:bg-zinc-900 flex items-start gap-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-ink opacity-0 group-hover:opacity-5 transition-opacity" />
                    <div className="w-16 h-16 bg-white dark:bg-black rounded-2xl flex items-center justify-center shadow-lg border border-zinc-100 dark:border-white/10 flex-shrink-0">
                      <Sparkles className="text-brand-ink" size={32} />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-serif italic text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        "Welcome to the Neural Archive. I can dissect trend velocities, material histories, and silhouette evolutions for you."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-white/10 dark:to-white/5 rounded-[30px] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                  <div className="relative">
                    <input 
                      placeholder={t.interaction.placeholder}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-[30px] px-8 py-6 text-xl font-serif focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all font-light dark:text-white"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full hover:scale-105 transition-transform shadow-xl">
                      <Send size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-8">
                  {['2026 Trend Cycles', 'Material Scribing', 'DNA Analysis', 'Export Dataset'].map(cmd => (
                    <button key={cmd} className="px-8 py-4 border border-zinc-100 dark:border-white/5 rounded-full text-[10px] uppercase font-bold tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-900 dark:hover:border-white transition-all hover:bg-zinc-50 dark:hover:bg-white/5">
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className={theme === Theme.DARK ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900'}
          >
            <SettingsPanel theme={theme} setTheme={setTheme} t={t} />
          </motion.div>
        )}
      </AnimatePresence>

      <ItemDetailModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
        onAddToMoodboard={addToMoodboard}
        onRemix={setRemixItem}
        isSaved={!!selectedItem && moodboard.some(m => m.id === selectedItem.id)}
        t={t}
      />

      <AnimatePresence>
        {remixItem && (
          <StyleRemixModal 
            item={remixItem}
            onClose={() => {
              setRemixItem(null);
              setRemixResult(null);
            }}
            onGenerate={handleRemix}
            isLoading={isRemixing}
            generatedImageUrl={remixResult}
            initialMutationLevel={mutationLevel}
            t={t}
          />
        )}
      </AnimatePresence>

      <MoodboardDrawer 
        isOpen={isMoodboardOpen} 
        onClose={() => setIsMoodboardOpen(false)} 
        items={moodboard}
        onRemove={removeFromMoodboard}
        t={t}
      />

      <FilterPanel 
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        allStyles={allAvailableStyles}
        selectedStyles={selectedStyles}
        toggleStyle={toggleStyle}
        allTags={allAvailableTags}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        resetFilters={resetFilters}
        t={t}
      />

      <DesignGeneratorModal 
        item={designItem}
        isOpen={!!designItem}
        onClose={() => {
          setDesignItem(null);
          setGeneratedDesignUrl(null);
        }}
        onGenerate={handleGenerateDesign}
        isGenerating={isGeneratingDesign}
        generatedUrl={generatedDesignUrl}
        setGeneratedUrl={setGeneratedDesignUrl}
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
      <footer className={`${theme === Theme.DARK ? 'bg-zinc-950 border-t border-white/5' : 'bg-brand-ink'} text-white py-20 px-6 mt-20`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-20 mb-10">
          <div className="col-span-2">
            <h2 className="font-serif text-4xl mb-6 tracking-tighter">MODAUI</h2>
            <p className="text-white/50 max-w-sm leading-relaxed text-sm italic font-serif">
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
