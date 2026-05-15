import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import { LuxuryTypography } from '../design-system/LuxuryTypography';
import { GlassCard } from '../design-system/GlassCard';
import { GradientButton } from '../design-system/GradientButton';
import { Sparkles, ArrowRight, Zap, Globe, Cpu, UserCheck, Terminal, Video, Activity } from 'lucide-react';

const RunwayHero = () => {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const yVideo = useTransform(scrollY, [0, 500], [0, 60]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden flex items-center justify-center bg-black">
      <motion.div style={{ scale, y: yVideo }} className="absolute inset-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover grayscale brightness-[0.4]"
          src="https://cdn.pixabay.com/vimeo/328224524/fashion-show-23253.mp4?width=1280&hash=8cb9c771701389808388d1d83c3c1e2858b907e5"
        />
      </motion.div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grain Texture */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        
        {/* Dynamic Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
        
        {/* Deep Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.8)_100%)]" />

        {/* HUD Film Markers */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
          <div className="flex items-center gap-4 text-primary/40 font-mono text-[8px] tracking-[0.3em] uppercase">
            <Video size={10} />
            <span>REC // 00:00:24:12</span>
          </div>
          <div className="flex items-center gap-4 text-white/20 font-mono text-[8px] tracking-[0.3em] uppercase">
            <span>ISO_800</span>
            <div className="w-8 h-px bg-white/20" />
            <span>F_2.8</span>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
          <div className="flex items-center gap-4 text-white/20 font-mono text-[8px] tracking-[0.3em] uppercase">
             <Activity size={10} />
             <span>NEURAL_FLOW: ACTIVE</span>
          </div>
          <div className="text-[8px] font-mono text-white/10 uppercase tracking-[0.5em]">
             MODAUI_KERNEL_V4.2_STABLE
          </div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"
      />
      
      <motion.div style={{ y: yText, opacity }} className="relative z-10 w-full px-6 md:px-24">
        <div className="flex flex-col items-center text-center">
          <LuxuryTypography variant="label" className="text-primary mb-12 animate-pulse tracking-[1.5em] text-[12px]">
            NODE_SYNC_ESTABLISHED // OS_V4
          </LuxuryTypography>
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-[12vw] md:text-[18vw] font-black italic uppercase leading-[0.7] tracking-tighter mix-blend-difference text-white"
          >
            MODAUI
          </motion.h1>
          <div className="mt-8">
             <LuxuryTypography variant="h2" className="text-[6vw] md:text-[4.5vw] lowercase italic font-normal tracking-[-0.08em] opacity-80">
               Fashion_Operating_System
             </LuxuryTypography>
          </div>
        </div>
      </motion.div>

      {/* Floating HUD Elements */}
      <div className="absolute top-12 left-6 md:left-12 space-y-1">
        <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">LATENCY: 4.2MS</p>
        <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">VRAM: 92%_ACTIVE</p>
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
         <div className="w-px h-24 bg-gradient-to-b from-primary to-transparent" />
         <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-600 hidden md:block">Explore_Kernel</span>
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
              <LuxuryTypography variant="label" className="text-primary">Global_Trend_Intelligence</LuxuryTypography>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase italic tracking-tighter">Fashion_Bloomberg_Terminal</h2>
           </div>
           
           {/* Animated Floating Labels */}
           <div className="flex gap-12 font-mono text-[10px] text-zinc-600">
             <motion.div initial={{ y: -5 }} animate={{ y: 5 }} transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}>
               <p>REFRESH: 1.0S</p>
             </motion.div>
             <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}>
               <p>NODE: MILAN_0xAF</p>
             </motion.div>
           </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-white/5">
           {trends.map((t, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.1 }}
               className="group grid grid-cols-1 md:grid-cols-4 items-center py-12 px-8 hover:bg-white/[0.02] transition-colors relative overflow-hidden"
             >
                <div className="absolute left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500" />
                <div className="flex items-center gap-6">
                   <span className="text-[10px] font-mono text-zinc-700">0{i+1}</span>
                   <LuxuryTypography variant="label" className="text-zinc-500 group-hover:text-white transition-colors">{t.label}</LuxuryTypography>
                </div>
                <div className="col-span-2 relative">
                   <h3 className="text-4xl font-black italic uppercase tracking-tighter group-hover:text-primary transition-colors">{t.val}</h3>
                   
                   {/* Flashing Tags */}
                   <AnimatePresence>
                     {t.delta !== 'N/A' && (
                       <motion.span 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: [0, 1, 0] }}
                         transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                         className="absolute -top-4 -right-12 text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-mono"
                       >
                         {t.delta}
                       </motion.span>
                     )}
                   </AnimatePresence>
                </div>
                <div className="flex justify-end items-center gap-12">
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">{t.status}</p>
                      <p className={`text-lg font-black italic ${t.delta.startsWith('+') ? 'text-primary' : 'text-zinc-400'}`}>{t.delta}</p>
                   </div>
                   <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-700 group-hover:border-primary group-hover:text-primary transition-all">
                      <ArrowRight size={18} />
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

const LibraryTeaser = ({ title, subTitle, img, video, desc, id, onClick }: { title: string, subTitle: string, img?: string, video?: string, desc: string, id: string, onClick: (id: string) => void }) => {
  return (
    <section 
      onClick={() => onClick(id)}
      className="relative h-[70vh] md:h-screen w-full overflow-hidden group cursor-pointer border-b border-white/5 bg-black"
    >
      {/* Background Media */}
      <div className="absolute inset-0 transition-all duration-1000 ease-out group-hover:scale-105">
        {video ? (
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover grayscale brightness-[0.2] group-hover:grayscale-0 group-hover:brightness-[0.4] transition-all duration-1000"
            src={video}
          />
        ) : (
          <img 
            src={img} 
            className="w-full h-full object-cover grayscale brightness-[0.2] group-hover:grayscale-0 group-hover:brightness-[0.4] transition-all duration-1000"
          />
        )}
      </div>

      {/* AI Scanning Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        <motion.div 
          animate={{ y: ['0%', '100%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-full h-px bg-primary/20 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
        />
      </div>

      {/* Cinematic Gradation Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      
      <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-32 space-y-6 md:space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4"
        >
           <div className="h-4 w-4 bg-primary/20 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
           </div>
           <LuxuryTypography variant="label" className="text-primary italic tracking-[0.5em] text-[9px] uppercase">{subTitle}</LuxuryTypography>
        </motion.div>

        <div className="max-w-full">
           <motion.h2 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.1 }}
             className="text-[12vw] md:text-[10vw] font-black uppercase leading-[0.8] tracking-tighter text-white/90 group-hover:text-white transition-all duration-700"
           >
             {title}
           </motion.h2>
           <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="max-w-2xl text-zinc-400 text-xs md:text-xl font-mono uppercase tracking-widest leading-relaxed mt-6 md:mt-10 opacity-60 group-hover:opacity-100 transition-all duration-700"
           >
             {desc}
           </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="pt-8 flex items-center justify-between border-t border-white/5"
        >
           <div className="flex items-center gap-8">
             <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all duration-500 shadow-2xl">
                <ArrowRight size={20} className="md:w-8 md:h-8" />
             </div>
             <div className="hidden md:block">
               <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest group-hover:text-white transition-colors">Awaiting Prompt...</p>
               <div className="h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-700" />
             </div>
           </div>
           
           <span className="text-[8px] font-mono text-zinc-800 uppercase tracking-tighter">OS_READY_0x{id.toUpperCase()}</span>
        </motion.div>
      </div>
    </section>
  );
};

const CreativeConsole = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'SYSTEM READY.' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: `PROCESSING: '${input.slice(0,25)}...'` }]);
    }, 800);
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-black flex flex-col items-center border-t border-white/5">
      <div className="max-w-3xl w-full">
         <h2 className="text-xl md:text-2xl font-bold text-white mb-10 text-center uppercase tracking-widest leading-none">Director Console</h2>

         <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[60vh] md:h-[500px] shadow-2xl">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 font-mono text-xs md:text-sm">
               {messages.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-zinc-800 text-white' : 'bg-transparent text-zinc-400'}`}>
                       <p>{m.content}</p>
                    </div>
                 </div>
               ))}
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 bg-zinc-950/50 border-t border-zinc-800">
               <div className="relative flex items-center bg-zinc-900 rounded-full">
                 <input 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   placeholder="Enter command..."
                   className="flex-1 bg-transparent text-white outline-none font-mono text-sm p-4 px-6 placeholder:text-zinc-600"
                 />
                 <button type="submit" className="p-3 mr-2 bg-zinc-800 text-zinc-400 rounded-full hover:text-white transition-colors">
                    <Sparkles size={16} />
                 </button>
               </div>
            </form>
         </div>
      </div>
    </section>
  );
};


export const HomePage: React.FC<{ onTabChange: (id: string) => void }> = ({ onTabChange }) => {
  return (
    <div className="w-full">
      {/* SECTION 1 — FULLSCREEN RUNWAY FILM */}
      <RunwayHero />
      
      {/* SECTION 2 — LIVE TREND MATRIX (Fashion Bloomberg Terminal) */}
      <TrendMatrix />
      
      {/* SECTION 3 — THREE CORE LIBRARIES (Apple Style Fullscreen) */}
      <div className="space-y-0">
        <LibraryTeaser 
          id="collection"
          title="全球趋势库"
          subTitle="TREND_ARCHIVE // 0x01"
          desc="Access the deep neural archives of global aesthetic evolution. From Milan runways to Tokyo backstreets."
          img="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80"
          onClick={onTabChange}
        />
        <LibraryTeaser 
          id="design"
          title="设计师工作室"
          subTitle="DESIGN_STUDIO // 0x02"
          desc="Professional inference tools for the next generation of creative directors. Style remixing in real-time."
          video="https://cdn.pixabay.com/vimeo/197177579/fashion-show-6555.mp4?width=1280&hash=8cb9c771701389808388d1d83c3c1e2858b907e5"
          onClick={onTabChange}
        />
        <LibraryTeaser 
          id="try-on"
          title="收藏世界"
          subTitle="WORLD_ENGINE // 0x03"
          desc="Infinite scalability for digital wardrobes. Deploy multi-angle simulations and neural try-ons."
          img="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80"
          onClick={onTabChange}
        />
      </div>

      {/* SECTION 4 — FEATURED CAMPAIGN (Editorial Noir) */}
      <section className="min-h-[60vh] md:h-screen w-full relative overflow-hidden group">
         <motion.img 
           initial={{ scale: 1.1 }}
           whileInView={{ scale: 1 }}
           transition={{ duration: 2 }}
           src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80" 
           className="w-full h-full object-cover grayscale contrast-[2] brightness-[0.7]"
         />
         <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8 md:p-20 text-center">
            <motion.div 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="space-y-8 md:space-y-12"
            >
               <LuxuryTypography variant="label" className="text-white tracking-[0.5em] md:tracking-[1em] mb-8 md:mb-12 text-[9px]">EDITORIAL_CAMPAIGN_SS26</LuxuryTypography>
               <h2 className="text-[15vw] md:text-[10vw] font-black uppercase tracking-tighter leading-none text-white mix-blend-overlay">
                 VOID_RAIDERS
               </h2>
               <div className="flex items-center justify-center gap-6 md:gap-12 pt-8 md:pt-12">
                  <div className="h-px w-12 md:w-24 bg-white/20" />
                  <span className="text-[8px] md:text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] md:tracking-[0.5em] italic">NODE_0x44</span>
                  <div className="h-px w-12 md:w-24 bg-white/20" />
               </div>
            </motion.div>
         </div>
      </section>

      {/* SECTION 5 — AI DIRECTOR CONSOLE */}
      <CreativeConsole />


      <footer className="py-20 md:py-32 bg-black border-t border-white/5 px-8 md:px-24">
         <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white/20">MODAUI</h2>
            
            <div className="flex gap-10">
               {['X', 'IG', 'DC'].map(platform => (
                 <a key={platform} className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-all">{platform}</a>
               ))}
            </div>
         </div>
         
         <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5 opacity-40">
            <p className="text-[8px] font-mono uppercase tracking-widest">© 2026 SS26_PROTOCOLS</p>
            <p className="text-[8px] font-mono uppercase tracking-widest text-primary">STATUS: CONNECTED</p>
         </div>
      </footer>
    </div>
  );
};
