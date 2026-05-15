import React from 'react';

interface LuxuryTypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'label' | 'mono';
  className?: string;
  italic?: boolean;
}

export const LuxuryTypography: React.FC<LuxuryTypographyProps> = ({ 
  children, 
  variant = 'h1', 
  className = '',
  italic = true
}) => {
  const styles = {
    h1: `text-[12vw] font-black tracking-tighter uppercase leading-[0.8] ${italic ? 'italic' : ''}`,
    h2: `text-[5vw] font-black tracking-tight uppercase leading-[0.9] ${italic ? 'italic' : ''}`,
    label: `text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ${italic ? 'italic' : ''}`,
    mono: `font-mono text-[10px] tracking-widest text-zinc-400`
  };

  return (
    <div className={`${styles[variant]} ${className}`}>
      {children}
    </div>
  );
};
