import React, { useState, useEffect, useRef } from 'react';
import { FASHION_SOURCES } from '../../../../src/constants';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import { LuxuryTypography } from '../design-system/LuxuryTypography';
import { GlassCard } from '../design-system/GlassCard';
import { GradientButton } from '../design-system/GradientButton';
import { Sparkles, ArrowRight, Zap, Globe, Cpu, UserCheck, Terminal, Video, Activity, RefreshCw } from 'lucide-react';

const RunwayHero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-black">
      <div className="absolute inset-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-60"
          src="https://cdn.pixabay.com/vimeo/328224524/fashion-show-23253.mp4?width=1280&hash=8cb9c771701389808388d1d83c3c1e2858b907e5"
        />
      </div>
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="relative z-10 text-center">
          <h1 className="text-[14vw] md:text-[10vw] font-serif font-light text-white tracking-tighter">
            MODAUI
          </h1>
          <p className="mt-6 text-sm md:text-lg font-sans font-light text-white tracking-[0.2em] uppercase opacity-70">
            Digital Fashion Archives
          </p>
      </div>
    </section>
  );
};

const TrendMatrix = () => {
  const trends = [
    { label: 'TikTok_Global', val: 'Cyber_Silk_Inflow', status: 'Rising', delta: '+842%' },
    { label: 'Vogue_Runway', val: 'Brutalist_Stone', status: 'Peaking', delta: '-12%' },
    { label: 'Zara_Inditex', val: 'Technical_Knit', status: 'Critical', delta: '+142%' },
    { label: 'Prato_Hub', val: 'Graphene_Blend', status: 'Verified', delta: 'N/A' },
    { label: 'Seoul_Street', val: 'Annihilator_V2', status: 'Emergent', delta: '+390%' },
  ];

  return (
    <section className="py-20 md:py-60 px-6 md:px-12 bg-black border-y border-white/5">
      <div className="max-w-[1900px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-16 md:mb-32 border-b border-white/5 pb-12 gap-8">
           <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <LuxuryTypography variant="label" className="text-primary italic tracking-[0.5em]">Global_Trend_Intelligence</LuxuryTypography>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter"
              >
                Fashion_Intelligence
              </motion.h2>
           </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-white/5">
           {trends.map((t, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="group grid grid-cols-1 md:grid-cols-4 items-center py-12 px-8 hover:bg-white/[0.02] transition-colors relative overflow-hidden"
             >
                <div className="absolute left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500" />
                <div className="flex items-center gap-6">
                   <span className="text-[10px] font-mono text-zinc-700 tracking-tighter">0{i+1}</span>
                   <motion.div
                     whileHover={{ x: 5 }}
                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
                   >
                    <LuxuryTypography variant="label" className="text-zinc-500 group-hover:text-white transition-colors">{t.label}</LuxuryTypography>
                   </motion.div>
                </div>
                <div className="col-span-2 relative mt-4 md:mt-0">
                   <motion.h3 
                    whileHover={{ x: 10 }}
                    className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter group-hover:text-primary transition-all duration-500"
                   >
                    {t.val}
                   </motion.h3>
                </div>
                <div className="flex justify-between md:justify-end items-center gap-12 mt-8 md:mt-0">
                   <div className="text-left md:text-right">
                      <motion.p 
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.3em] mb-1"
                      >
                        {t.status}
                      </motion.p>
                      <p className={`text-lg md:text-2xl font-black italic tracking-tighter ${t.delta.startsWith('+') ? 'text-primary' : 'text-zinc-400'}`}>{t.delta}</p>
                   </div>
                   <motion.div 
                    whileHover={{ scale: 1.1, rotate: 45 }}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center text-zinc-700 group-hover:border-primary group-hover:text-primary transition-all shadow-[0_0_20px_rgba(255,255,255,0)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                   >
                       <ArrowRight size={24} />
                   </motion.div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

const LibraryTeaser = ({ title, img, video, id, onClick, className, textColor="text-white", overlay="bg-black/20", color = "#ffffff" }: { title: string, img?: string, video?: string, id: string, onClick: (id: string) => void, className?: string, textColor?: string, overlay?: string, color?: string }) => {
  return (
    <motion.section 
      onClick={() => onClick(id)}
      className={`relative h-[80vh] md:h-screen w-full overflow-hidden group cursor-pointer border-b border-zinc-900 bg-zinc-950 ${className || ''}`}
    >
      <div className="absolute inset-0 transition-transform duration-[2s] group-hover:scale-105">
        {video ? (
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
            src={video}
          />
        ) : (
          <img 
            src={img} 
            className="w-full h-full object-cover"
            alt={title}
          />
        )}
      </div>

      <div className={`absolute inset-0 ${overlay} transition-all duration-700`} />
      
      <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-20">
         <div className="text-white/70 font-sans text-xs uppercase tracking-[0.3em]">
           {id === 'collection' ? '01 / ARCHIVE' : id === 'design' ? '02 / STUDIO' : '03 / TRY-ON'}
         </div>

         <div className="flex flex-col items-center justify-center text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`text-[10vw] md:text-[6vw] font-serif font-light tracking-tighter leading-none ${textColor}`}
            >
              {title}
            </motion.h2>
            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               transition={{ delay: 0.5, duration: 1 }}
               className={`mt-8 px-8 py-3 border border-current font-sans text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all ${textColor}`}
            >
              Explore
            </motion.div>
         </div>

         <div className="text-white/70 font-sans text-xs uppercase tracking-[0.3em] text-right">
           FashionOS_2026
         </div>
      </div>
    </motion.section>
  );
};

const CreativeConsole = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'SYSTEM READY. AWAITING DESIGN PARAMETERS.' }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, progress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const prompt = input;
    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setInput('');
    setIsGenerating(true);
    setProgress(0);

    // Simulate generation process
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setMessages(prev => [...prev, { 
            role: 'ai', 
            content: `Vision generated for "${prompt}". Opening preview...` 
          }]);
        }, 500);
      }
      setProgress(currentProgress);
    }, 400);
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-black flex flex-col items-center border-t border-white/5">
      <div className="max-w-3xl w-full">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="text-center mb-12"
         >
           <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Assistant</h2>
         </motion.div>

         <div className="bg-black/80 border border-white/5 backdrop-blur-3xl rounded-[2rem] overflow-hidden flex flex-col h-[65vh] md:h-[650px] shadow-[0_0_100px_rgba(0,0,0,1)] relative group/console ring-1 ring-white/5">
            {/* Glossy Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
            
            {/* Terminal Header */}
            <div className="bg-black/50 px-8 py-4 border-b border-white/5 flex justify-between items-center backdrop-blur-md">
              <div className="flex gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.3em] font-medium italic">WORKSPACE</p>
              </div>
              <div className="flex gap-2">
                <Terminal size={12} className="text-zinc-600" />
              </div>
            </div>

          <div className="flex-1 overflow-y-auto p-8 md:p-14 space-y-10 font-mono text-xs md:text-sm">
             {messages.map((m, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                  <div className={`max-w-[85%] relative ${
                    m.role === 'user' 
                    ? 'text-white' 
                    : 'text-zinc-500'
                  }`}>
                     <p className={`text-sm md:text-lg font-mono leading-relaxed ${m.role === 'user' ? 'text-right' : 'text-left italic'}`}>
                       {m.role === 'ai' && <span className="text-primary/40 mr-3 underline underline-offset-4 decoration-primary/20">AI:</span>}
                       {m.content}
                     </p>
                  </div>
               </motion.div>
             ))}

               {isGenerating && (
                 <div className="pt-10 space-y-6">
                   <div className="flex justify-between items-center px-2">
                     <div className="flex items-center gap-3">
                        <Activity size={12} className="text-primary animate-spin" />
                        <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Generating_Vision...</span>
                     </div>
                     <span className="text-[10px] font-mono text-zinc-700">{Math.round(progress)}%</span>
                   </div>
                   <div className="h-[2px] w-full bg-zinc-900 rounded-full overflow-hidden">
                     <motion.div 
                       className="h-full bg-primary shadow-[0_0_15px_#c5fb45]" 
                       initial={{ width: 0 }}
                       animate={{ width: `${progress}%` }}
                     />
                   </div>
                 </div>
               )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-10 bg-black/40 border-t border-white/5 backdrop-blur-xl">
               <div className="relative flex items-center bg-zinc-900/50 border border-white/5 rounded-2xl md:rounded-3xl p-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                 <input 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   disabled={isGenerating}
                   placeholder="Ask for design inspiration..."
                   className="flex-1 bg-transparent text-white outline-none font-mono text-sm md:text-base p-4 px-6 placeholder:text-zinc-700"
                 />
                 <button 
                  type="submit" 
                  disabled={isGenerating || !input.trim()}
                  className={`px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-[1.2rem] font-bold uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center ${
                    isGenerating 
                    ? 'bg-zinc-800 text-zinc-600' 
                    : 'bg-white text-black hover:bg-primary active:scale-95'
                  }`}
                 >
                    {isGenerating ? <RefreshCw size={16} className="animate-spin" /> : 'Execute'}
                 </button>
               </div>
               <div className="mt-4 flex justify-center gap-6 opacity-20">
                  <span className="text-[8px] font-mono text-zinc-500 lowercase tracking-widest">prompt_engine: core_v4</span>
                  <span className="text-[8px] font-mono text-zinc-500 lowercase tracking-widest">model_0x88_active</span>
               </div>
            </form>
         </div>
      </div>
    </section>
  );
};


interface SystemHUDProps {
  label: string;
  value: string;
  active?: boolean;
}

const SystemHUD = ({ label, value, active }: SystemHUDProps) => (
  <div className="flex flex-col gap-1">
    <p className="text-[7px] font-mono text-zinc-600 uppercase tracking-widest">{label}</p>
    <div className="flex items-center gap-2">
      {active && <div className="w-1 h-1 bg-primary rounded-full animate-pulse shadow-[0_0_5px_#c5fb45]" />}
      <p className="text-[10px] font-mono text-zinc-400 font-bold">{value}</p>
    </div>
  </div>
);

const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,251,69,0.02),transparent)]" />
    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    <motion.div 
      animate={{ 
        opacity: [0.1, 0.2, 0.1],
        scale: [1, 1.05, 1]
      }}
      transition={{ duration: 10, repeat: Infinity }}
      className="absolute inset-0 bg-gradient-to-tr from-black via-zinc-950 to-black" 
    />
  </div>
);

export const HomePage: React.FC<{ onTabChange: (id: string) => void }> = ({ onTabChange }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  React.useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="w-full bg-[#fcfaf7] text-[#1a1a1a] font-sans overflow-x-hidden">
      <motion.div className="fixed top-0 left-0 right-0 h-px bg-black z-[100] origin-left" style={{ scaleX }} />
      
      <RunwayHero />
      
      <main className="flex flex-col">
        <div className="h-screen w-full">
          <LibraryTeaser 
            id="collection"
            title="全球趋势库"
            img="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80"
            color="#c5fb45"
            onClick={onTabChange}
          />
        </div>
        <div className="h-screen w-full">
          <LibraryTeaser 
            id="design"
            title="设计师工作室"
            video="https://cdn.pixabay.com/vimeo/197177579/fashion-show-6555.mp4?width=1280&hash=8cb9c771701389808388d1d83c3c1e2858b907e5"
            color="#000000"
            onClick={onTabChange}
          />
        </div>
        <div className="h-screen w-full [perspective:1000px]">
          <LibraryTeaser 
            id="try-on"
            title="收藏世界"
            img="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80"
            className="bg-[#fcfaf7]"
            textColor="text-[#1a1a1a]"
            overlay="bg-black/10"
            onClick={onTabChange}
          />
        </div>
      </main>

      <footer className="py-24 px-12 md:px-24 border-t border-zinc-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {['Luxury', 'Avant-Garde', 'Media'].map((category) => (
            <div key={category}>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 mb-6">{category}</h4>
              <ul className="space-y-4">
                {FASHION_SOURCES.filter(source => source.category === category).map((source) => (
                  <li key={source.name}>
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-light text-zinc-600 hover:text-black transition-colors"
                    >
                      {source.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-sm font-light text-zinc-600">© 2026 MODAUI</p>
      </footer>
    </div>
  );
};
