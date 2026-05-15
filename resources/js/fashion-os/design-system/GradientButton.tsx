import React from 'react';
import { motion } from 'motion/react';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost';
}

export const GradientButton: React.FC<GradientButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary' 
}) => {
  const variants = {
    primary: "bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5",
    outline: "bg-transparent border border-white/10 text-white hover:bg-white/5",
    ghost: "bg-transparent text-zinc-500 hover:text-white hover:bg-white/5"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] italic transition-all ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};
