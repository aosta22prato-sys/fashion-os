import React from 'react';
import { motion } from 'motion/react';
import { Heart, Share2, Maximize2, Tag } from 'lucide-react';
import { LuxuryTypography } from '../../design-system/LuxuryTypography';

interface CollectionCardProps {
  image: string;
  title: string;
  designer: string;
  tags: string[];
  year: string;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ 
  image, 
  title, 
  designer, 
  tags, 
  year 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative rounded-[40px] overflow-hidden bg-zinc-900 border border-white/5"
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Hover Actions */}
        <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
           {[Heart, Share2, Maximize2].map((Icon, i) => (
             <button key={i} className="p-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full hover:bg-primary hover:text-black transition-all">
                <Icon size={16} />
             </button>
           ))}
        </div>

        {/* Info Overlay */}
        <div className="absolute bottom-10 left-10 right-10 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
           <div className="flex justify-between items-end gap-8">
              <div className="space-y-4">
                 <div className="flex gap-2">
                    {tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[7px] font-black uppercase tracking-widest">{tag}</span>
                    ))}
                 </div>
                 <LuxuryTypography variant="h2" className="text-2xl lowercase italic font-normal">{title}</LuxuryTypography>
              </div>
              <LuxuryTypography variant="mono" className="text-white">{year}</LuxuryTypography>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
