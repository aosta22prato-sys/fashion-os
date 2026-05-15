import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Sparkles, MessageSquare, 
  Zap, TrendingUp, Eraser, User,
  MoreHorizontal, Plus
} from 'lucide-react';
import { LuxuryTypography } from '../../design-system/LuxuryTypography';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'trend' | 'suggestion';
}

export const FashionAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'INITIALIZING_NEURAL_LINK... SYSTEM_ONLINE. How can I assist your SS26 creation process today?' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input) return;
    const newMsg: Message = { role: 'user', content: input };
    setMessages([...messages, newMsg]);
    setInput('');

    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Analyzing trend vectors for "' + input + '"... Recommendation: Consider Graphene-based knits with architectural volume. Shall I generate a moodboard?' 
      }]);
    }, 1000);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
              <Sparkles className="text-primary animate-pulse" size={18} />
           </div>
           <div>
              <LuxuryTypography variant="label" className="text-white italic">Neural_Consultant</LuxuryTypography>
              <p className="text-[7px] font-black text-primary tracking-[0.4em] uppercase mt-1">Status: Synced</p>
           </div>
        </div>
        <button className="p-3 rounded-full hover:bg-white/5 text-zinc-500 transition-colors">
           <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 space-y-8 overflow-y-auto no-scrollbar scroll-smooth"
      >
        <AnimatePresence>
           {messages.map((msg, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 10, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
             >
               <div className={`max-w-[85%] p-6 rounded-[32px] border ${
                 msg.role === 'user' 
                 ? 'bg-white text-black border-white' 
                 : 'bg-white/[0.03] border-white/5 text-zinc-300'
               }`}>
                  <p className={`text-[12px] font-medium leading-relaxed uppercase tracking-wider italic ${msg.role === 'user' ? 'not-italic font-black text-[10px]' : ''}`}>
                    {msg.content}
                  </p>
               </div>
             </motion.div>
           ))}
        </AnimatePresence>
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-3">
         {[
           { icon: TrendingUp, label: 'SS26 Trends' },
           { icon: Eraser, label: 'Remix Style' },
           { icon: User, label: 'Pose Ideas' }
         ].map(s => (
           <button key={s.label} className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-full hover:border-primary/40 hover:bg-primary/5 transition-all group">
              <s.icon size={12} className="text-zinc-500 group-hover:text-primary transition-colors" />
              <span className="text-[8px] font-black uppercase text-zinc-500 group-hover:text-white transition-colors">{s.label}</span>
           </button>
         ))}
      </div>

      {/* Input */}
      <div className="pt-8 border-t border-white/5">
         <div className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Query the fashion core..."
              className="w-full bg-white/[0.05] border border-white/5 rounded-full py-6 px-8 text-[11px] font-black uppercase tracking-widest placeholder:text-zinc-600 outline-none focus:border-white/20 transition-all font-mono"
            />
            <button 
              onClick={sendMessage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
            >
               <Plus size={18} />
            </button>
         </div>
      </div>
    </div>
  );
};
