import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Target, 
  Users, 
  Zap, 
  Activity,
  ArrowUpRight,
  MapPin,
  PieChart,
  ShoppingBag,
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  Area,
  CartesianGrid
} from 'recharts';

const TREND_DATA = [
  { name: 'W1', sales: 4000, trend: 2400 },
  { name: 'W2', sales: 3000, trend: 1398 },
  { name: 'W3', sales: 2000, trend: 9800 },
  { name: 'W4', sales: 2780, trend: 3908 },
  { name: 'W5', sales: 1890, trend: 4800 },
  { name: 'W6', sales: 2390, trend: 3800 },
  { name: 'W7', sales: 3490, trend: 4300 },
];

export const CommerceIntelligence: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 select-none">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Editorial Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full w-fit">
                 <Globe size={14} className="text-primary animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">Intelligence_Market_Pulse</span>
              </div>
              <h1 className="text-7xl font-black italic uppercase tracking-tighter outline-text">Visionary Commerce</h1>
           </div>

           <div className="flex gap-4">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black text-zinc-500 uppercase">Sell-Through Prediction</span>
                 <span className="text-4xl font-black italic text-primary">+24.8%</span>
              </div>
           </div>
        </header>

        {/* Core KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { label: 'TRENDING_VELOCITY', val: '0.84', unit: 'Pts', trend: '+12%', icon: Zap, color: 'text-primary' },
             { label: 'MARKET_DOMINANCE', val: '32.1', unit: '%', trend: '+4.2%', icon: Target, color: 'text-sky-400' },
             { label: 'STYLE_INDEX_SCORE', val: '9.2', unit: '/10', trend: '-2.1%', icon: Activity, color: 'text-rose-500' }
           ].map(kpi => (
             <div key={kpi.label} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[40px] space-y-6 hover:border-white/10 transition-all group">
                <div className="flex justify-between items-start">
                   <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-primary transition-all group-hover:text-black">
                      <kpi.icon size={24} />
                   </div>
                   <div className="flex items-center gap-2 text-emerald-400 font-black text-[12px] italic">
                      <ArrowUpRight size={14} />
                      {kpi.trend}
                   </div>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{kpi.label}</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black italic uppercase italic">{kpi.val}</span>
                      <span className="text-[14px] font-black text-zinc-600 uppercase">{kpi.unit}</span>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Predictive Analytics Visualisation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 space-y-8">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <BarChart3 size={20} className="text-primary" />
                    <h3 className="text-lg font-black uppercase italic italic tracking-tighter">Market Penetration Forecast</h3>
                 </div>
                 <div className="flex gap-2">
                    <button className="px-4 py-1.5 rounded-full bg-white text-black font-black text-[9px] uppercase">7_DAY</button>
                    <button className="px-4 py-1.5 rounded-full bg-white/5 text-zinc-500 font-black text-[9px] uppercase">30_DAY</button>
                 </div>
              </div>

              <div className="h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={TREND_DATA}>
                     <defs>
                       <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#00ff41" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                     <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#333', fontSize: 10, fontWeight: 900 }} 
                     />
                     <YAxis hide />
                     <Tooltip 
                       contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                       itemStyle={{ fontWeight: 900 }}
                     />
                     <Area 
                       type="monotone" 
                       dataKey="sales" 
                       stroke="#00ff41" 
                       strokeWidth={4} 
                       fillOpacity={1} 
                       fill="url(#colorSales)" 
                     />
                     <Area 
                       type="monotone" 
                       dataKey="trend" 
                       stroke="#333" 
                       strokeWidth={2} 
                       fillOpacity={0} 
                     />
                   </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 space-y-12">
              <div className="flex items-center gap-4 text-primary">
                <Users size={20} />
                <h3 className="text-lg font-black uppercase italic italic tracking-tighter">Demographic Pulse</h3>
              </div>

              <div className="space-y-8">
                 {[
                   { group: 'NEO_GEN_Z', affinity: 92, val: '$2.4M' },
                   { group: 'CYBER_MILLENNIAL', affinity: 74, val: '$1.8M' },
                   { group: 'TECH_NOMADS', affinity: 61, val: '$0.9M' }
                 ].map(demo => (
                   <div key={demo.group} className="space-y-3">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-black uppercase tracking-widest">{demo.group}</span>
                         <span className="text-[12px] font-black italic">{demo.val}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${demo.affinity}%` }}
                           className="h-full bg-primary"
                         />
                      </div>
                   </div>
                 ))}
              </div>

              <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
                 <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                    <MapPin size={16} className="text-zinc-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Global Heatmap_Preview</span>
                 </button>
                 <button className="w-full py-4 bg-primary text-black rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest italic shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    AI_COMMERCE_SYNC
                 </button>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};
