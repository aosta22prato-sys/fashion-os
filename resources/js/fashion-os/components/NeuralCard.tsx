import React from 'react';
import { motion } from 'motion/react';

interface NeuralCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const NeuralCard: React.FC<NeuralCardProps> = ({ 
  children, 
  title, 
  subtitle, 
  icon, 
  className = '',
  glowColor = 'emerald'
}) => {
  const glowStyles = {
    emerald: "group-hover:border-emerald-500/30 group-hover:bg-emerald-500/[0.02]",
    purple: "group-hover:border-purple-500/30 group-hover:bg-purple-500/[0.02]",
    blue: "group-hover:border-blue-500/30 group-hover:bg-blue-500/[0.02]",
    amber: "group-hover:border-amber-500/30 group-hover:bg-amber-500/[0.02]",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        group relative p-8 bg-white dark:bg-neutral-900 
        rounded-[2.5rem] border border-neutral-100 dark:border-white/5 
        transition-all duration-500 
        ${glowColor ? glowStyles[glowColor as keyof typeof glowStyles] : ''}
        ${className}
      `}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {icon && (
              <div className={`p-3 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-100 dark:border-white/5`}>
                {icon}
              </div>
            )}
            {title && (
              <div>
                <h4 className="text-xl font-serif italic dark:text-white uppercase tracking-tighter">{title}</h4>
                {subtitle && <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mt-1">{subtitle}</p>}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Decorative Neural Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-0 group-hover:opacity-[0.03] blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity duration-1000 pointer-events-none" />
    </motion.div>
  );
};
