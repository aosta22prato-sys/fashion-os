import React from 'react';
import { motion } from 'motion/react';

interface FloatingPanelProps {
  children: React.ReactNode;
  className?: string;
  side?: 'left' | 'right' | 'bottom';
}

export const FloatingPanel: React.FC<FloatingPanelProps> = ({ children, className = '', side = 'right' }) => {
  const variants = {
    left: { x: [-100, 0], opacity: [0, 1] },
    right: { x: [100, 0], opacity: [0, 1] },
    bottom: { y: [100, 0], opacity: [0, 1] }
  };

  return (
    <motion.div
      initial={variants[side]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      className={`fixed z-[100] glass-dark border border-white/10 rounded-[40px] shadow-2xl p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
};
