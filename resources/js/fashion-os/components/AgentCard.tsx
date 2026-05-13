import React from 'react';
import { motion } from 'motion/react';
import { Bot, LineChart, Cpu, Zap, Shield, Sparkles, Database, Users } from 'lucide-react';
import { NeuralCard } from './NeuralCard';
import { QuantumButton } from './QuantumButton';

import { Registry, OpsDashboard, Language, Agent } from '../../../../types';
import { translations } from '../../../../services/translationService';

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    role: string;
    status: 'idle' | 'busy' | 'offline' | 'restarting';
    permission: string;
  };
  onManage?: () => void;
  lang: Language;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onManage, lang }) => {
  const t = translations[lang].common;
  const getIcon = () => {
    switch (agent.role) {
      case 'Director': return <Shield className="text-primary" />;
      case 'Trend': return <LineChart className="text-blue-500" />;
      case 'Styling': return <Sparkles className="text-purple-500" />;
      case 'Campaign': return <Zap className="text-amber-500" />;
      case 'Runtime': return <Cpu className="text-red-500" />;
      case 'Dataset': return <Database className="text-cyan-500" />;
      case 'Memory': return <Database className="text-indigo-500" />;
      case 'Sourcing': return <Users className="text-orange-500" />;
      default: return <Bot className="text-zinc-500" />;
    }
  };

  const getGlow = () => {
    switch (agent.role) {
      case 'Director': return 'primary';
      case 'Trend': return 'blue';
      case 'Styling': return 'purple';
      case 'Campaign': return 'amber';
      default: return 'primary';
    }
  };

  return (
    <NeuralCard 
      title={agent.name} 
      subtitle={`${agent.role} ${translations[lang].ops.orchestrator || 'Orchestrator'}`} 
      icon={getIcon()}
      glowColor={getGlow() as any}
      className="!p-10 flex flex-col justify-between"
    >
      <div className="mt-8 mb-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">{t.agentState}</span>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'idle' ? 'bg-primary' : 'bg-amber-500 animate-pulse'}`} />
              <span className="text-[11px] font-black text-white uppercase">{t[agent.status as keyof typeof t] || agent.status}</span>
            </div>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">{t.agentSecurity}</span>
            <span className="text-[11px] font-black text-zinc-400 uppercase">{agent.permission}</span>
          </div>
        </div>
        
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: agent.status === 'busy' ? '70%' : '100%' }}
            className={`h-full ${agent.status === 'busy' ? 'bg-amber-500' : 'bg-primary'}`}
          />
        </div>
      </div>

      <QuantumButton variant="secondary" className="w-full !py-3" onClick={onManage}>
        {t.agentManage}
      </QuantumButton>
    </NeuralCard>
  );
};
