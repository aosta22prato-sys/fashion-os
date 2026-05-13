import React from 'react';
import { motion } from 'motion/react';

interface FashionGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const FashionGrid: React.FC<FashionGridProps> = ({ 
  children, 
  columns = 3, 
  className = '' 
}) => {
  const colStyles = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${colStyles[columns]} gap-12 ${className}`}>
      {children}
    </div>
  );
};
