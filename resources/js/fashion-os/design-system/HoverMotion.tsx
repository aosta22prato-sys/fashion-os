import React from 'react';
import { motion } from 'motion/react';

interface HoverMotionProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

export const HoverMotion: React.FC<HoverMotionProps> = ({ children, className = '', scale = 1.05 }) => {
  return (
    <motion.div
      whileHover={{ scale, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
