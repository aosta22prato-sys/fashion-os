import React from 'react';
import { CollectionCard } from './CollectionCard';

const MOCK_ITEMS = [
  {
    id: '1',
    title: 'Cyber_Silk_v2',
    designer: 'Aris_Neural',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80',
    tags: ['NEO_SILK', 'SS26'],
    year: '2026'
  },
  {
    id: '2',
    title: 'Graphene_Knit',
    designer: 'Proto_Studio',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80',
    tags: ['TECH_KNIT', 'MODULAR'],
    year: '2026'
  },
  {
    id: '3',
    title: 'Void_Mantle',
    designer: 'Zero_G',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80',
    tags: ['MINIMAL', 'FLUX'],
    year: '2026'
  },
  {
    id: '4',
    title: 'Neural_Drape',
    designer: 'Syn_Synth',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80',
    tags: ['ADAPTIVE', 'SS26'],
    year: '2026'
  },
];

export const CollectionMasonryGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 p-12">
      {MOCK_ITEMS.map((item) => (
        <CollectionCard key={item.id} {...item} />
      ))}
      {/* Repeated for masonry feel */}
      {MOCK_ITEMS.map((item) => (
        <CollectionCard key={`repeat-${item.id}`} {...item} />
      ))}
    </div>
  );
};
