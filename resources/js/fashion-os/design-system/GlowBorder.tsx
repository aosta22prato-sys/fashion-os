import React from 'react';
import { motion } from 'motion/react';

interface GlowBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export const GlowBorder: React.FC<GlowBorderProps> = ({ 
  children, 
  className = '', 
  color = 'var(--color-primary)' 
}) => {
  return (
    <div className={`relative group p-[1px] rounded-[33px] overflow-hidden ${className}`}>
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ 
          background: `conic-gradient(from 0deg, transparent, ${color}, transparent 50%)`
        }}
      />
      <div className="relative z-10 w-full h-full bg-black rounded-[32px]">
        {children}
      </div>
    </div>
  );
};
