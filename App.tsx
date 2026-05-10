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
  Send
} from 'lucide-react';
import { AppState, FashionItem, ChatMessage } from './types';
import { MOCK_FASHION_GALLERY, FASHION_CATEGORIES, fileToBase64 } from './utils';
import { analyzeFashionQuery, getFashionAssistantResponse } from './services/geminiService';

// --- Components ---

const HeroSection: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
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
          className="font-serif text-6xl md:text-8xl mb-8 leading-tight tracking-tight"
        >
          Tomorrow's <br /> <span className="italic">Elegance</span>, Today.
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
              placeholder="Describe the style you're looking for..."
              className="bg-transparent border-none outline-none w-full text-lg placeholder:text-white/50 text-white"
              onKeyDown={(e) => e.key === 'Enter' && onSearch(searchInput)}
            />
            <button 
              onClick={() => onSearch(searchInput)}
              className="ml-4 bg-white text-black hover:bg-brand-beige px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2"
            >
              Analyze <Sparkles size={16} />
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

const FashionCard: React.FC<{ item: FashionItem }> = ({ item }) => {
  return (
    <motion.div 
      layout
      className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer"
    >
      <div className="aspect-vogue overflow-hidden relative">
        <img 
          src={item.imageUrl} 
          alt={item.description}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Magic Tags - AI analysis teaser */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          {item.tags.map((tag, idx) => (
            <span key={idx} className="px-3 py-1 glass text-[10px] uppercase tracking-widest text-white rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-6 border-x border-b border-zinc-50 rounded-b-2xl">
        <div className="flex items-center justify-between mb-3 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
          <span>{item.category}</span>
          <span className="flex items-center gap-1"><TrendingUp size={10} /> 94% Trend Score</span>
        </div>
        <h3 className="font-serif text-xl mb-2 group-hover:text-zinc-600 transition-colors uppercase">{item.style}</h3>
        <p className="text-sm text-zinc-500 line-clamp-2 italic">{item.description}</p>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All Trends");
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [gallery, setGallery] = useState<FashionItem[]>(MOCK_FASHION_GALLERY);
  const [searchStatus, setSearchStatus] = useState<AppState>(AppState.IDLE);
  const [aiAnalysis, setAiAnalysis] = useState<{ category: string, tags: string[], description: string } | null>(null);

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

  return (
    <div className="min-h-screen font-sans selection:bg-brand-ink selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 p-6 flex items-center justify-between pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto"
        >
          <span className="font-serif text-3xl font-black tracking-tighter uppercase text-white drop-shadow-lg">Vogue.AI</span>
        </motion.div>
        
        <div className="flex gap-4 pointer-events-auto">
          <button 
            onClick={() => setIsAssistantOpen(true)}
            className="p-3 glass rounded-full text-white hover:scale-110 transition-all relative group"
          >
            <MessageSquare size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75" />
            <div className="absolute right-0 top-14 opacity-0 group-hover:opacity-100 transition-all bg-white text-black text-[10px] px-3 py-2 rounded-lg whitespace-nowrap uppercase tracking-widest shadow-xl">
              Ask Fashion Curator
            </div>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <HeroSection onSearch={handleSmartSearch} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-400 mb-2 block">Intelligent Curation</span>
            <h2 className="font-serif text-4xl uppercase tracking-tighter">Global Trends</h2>
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
        <div className="fashion-grid">
          <AnimatePresence mode="popLayout">
            {filteredGallery.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <FashionCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* AI visual search upload section */}
        <section className="mt-32 border-t border-zinc-200 pt-32 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Camera className="mx-auto mb-8 text-zinc-300" size={48} />
            <h2 className="font-serif text-4xl mb-6 uppercase tracking-tighter">Visual Search</h2>
            <p className="text-zinc-500 mb-10 leading-relaxed italic">
              Upload a sketch, a fabric pattern, or a reference photo. Our AI vision model will dissect the silhouette and find matching trends in our archive.
            </p>
            <button className="px-10 py-5 bg-brand-ink text-white rounded-full flex items-center gap-3 mx-auto hover:scale-105 transition-all shadow-xl font-medium tracking-wide">
              UPLOAD REFERENCE <Upload size={20} />
            </button>
          </motion.div>
        </section>
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
