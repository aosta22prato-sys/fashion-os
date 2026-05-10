/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { FashionItem } from './types';

export const FASHION_CATEGORIES = [
  "All Trends",
  "Streetwear",
  "Minimalist",
  "Avant-Garde",
  "Bohemian",
  "Cyberpunk",
  "Luxury Editorial"
];

export const MOCK_FASHION_GALLERY: FashionItem[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
    gallerySeries: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Minimalist',
    tags: ['Sustainable', 'Linen', 'Beige'],
    style: 'Scandinavian Minimalist',
    description: 'Clean lines and sustainable fabrics for a timeless look.',
    analysis: { 
      sustainability: 92, 
      heritageScore: 40, 
      trendVelocity: 'Stable', 
      fabricComposition: '100% Organic Linen', 
      vogueIndex: 88,
      colors: ['#F5F5DC', '#D2B48C', '#8B4513'],
      fabrics: ['Organic Linen', 'Hemp Fibre', 'Recycled Cotton']
    }
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1539109132314-3477524c8830?auto=format&fit=crop&q=80&w=1200',
    gallerySeries: [
      'https://images.unsplash.com/photo-1539109132314-3477524c8830?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Streetwear',
    tags: ['Graphic', 'Oversized', 'Urban'],
    style: 'Tokyo Streetwear',
    description: 'Vibrant colors and bold graphics inspired by Shibuya culture.',
    analysis: { 
      sustainability: 65, 
      heritageScore: 75, 
      trendVelocity: 'Rising', 
      fabricComposition: 'Heavyweight Cotton Jersey', 
      vogueIndex: 94,
      colors: ['#000000', '#FF0000', '#333333'],
      fabrics: ['Technical Nylon', 'Ripstop', 'Bonded Jersey']
    }
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
    category: 'Luxury Editorial',
    tags: ['Haute Couture', 'Satin', 'Evening'],
    style: 'Parisian Elegance',
    description: 'Sophisticated evening wear for the modern aristocrat.',
    analysis: { sustainability: 40, heritageScore: 98, trendVelocity: 'Stable', fabricComposition: 'Double-faced Silk Satin', vogueIndex: 99 }
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200',
    category: 'Bohemian',
    tags: ['Floral', 'Flowy', 'Vintage'],
    style: 'Retro Boho',
    description: 'Ethereal silhouettes and vintage floral patterns.',
    analysis: { sustainability: 85, heritageScore: 60, trendVelocity: 'Rising', fabricComposition: 'Recycled Viscose Chiffon', vogueIndex: 82 }
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1558769130-22c92138ac2a?auto=format&fit=crop&q=80&w=1200',
    category: 'Cyberpunk',
    tags: ['Neon', 'Techwear', 'Synthetic'],
    style: 'Neo-Tokyo Night',
    description: 'Functional silhouettes meet high-vis synthetic textiles.',
    analysis: { sustainability: 30, heritageScore: 10, trendVelocity: 'Rising', fabricComposition: 'Reflective Polyamide', vogueIndex: 91 }
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693bd?auto=format&fit=crop&q=80&w=1200',
    category: 'Avant-Garde',
    tags: ['Sculptural', 'Deconstructed', 'Artistic'],
    style: 'Architectural Form',
    description: 'Defying gravity with sculptural drapes and non-linear construction.',
    analysis: { sustainability: 70, heritageScore: 25, trendVelocity: 'Stable', fabricComposition: 'Reinforced Bonded Wool', vogueIndex: 96 }
  },
  {
    id: '7',
    imageUrl: 'https://images.unsplash.com/photo-1529133039943-085215f6d58d?auto=format&fit=crop&q=80&w=1200',
    category: 'Luxury Editorial',
    tags: ['Moda', 'Gold', 'Catwalk'],
    style: 'Golden Hour Gown',
    description: 'Metals threads woven into fine silk for ultimate opulence.',
    analysis: { sustainability: 55, heritageScore: 85, trendVelocity: 'Stable', fabricComposition: 'Silk with Gold Thread', vogueIndex: 97 }
  },
  {
    id: '8',
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=1200',
    category: 'Bohemian',
    tags: ['Free-spirit', 'Embroidered', 'Summer'],
    style: 'Nomadic Chic',
    description: 'Detailed embroidery inspired by traditional nomadic cultures.',
    analysis: { sustainability: 95, heritageScore: 90, trendVelocity: 'Stable', fabricComposition: 'Organic Hand-woven Cotton', vogueIndex: 85 }
  },
  {
    id: '9',
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=1200',
    category: 'Minimalist',
    tags: ['Monochrome', 'Tailored', 'Wool'],
    style: 'Urban Monolith',
    description: 'Single-tone tailoring that emphasizes silhouette over detail.',
    analysis: { sustainability: 78, heritageScore: 50, trendVelocity: 'Stable', fabricComposition: 'Virgin Wool Blend', vogueIndex: 89 }
  },
  {
    id: '10',
    imageUrl: 'https://images.unsplash.com/photo-1520006403945-5de815967f6b?auto=format&fit=crop&q=80&w=1200',
    category: 'Luxury Editorial',
    tags: ['Jewelry', 'Velvet', 'Midnight'],
    style: 'Stellar Nightwear',
    description: 'Deep velvet textures accented by intricate celestial jewelry.',
    analysis: { sustainability: 45, heritageScore: 70, trendVelocity: 'Rising', fabricComposition: 'Silk Velvet', vogueIndex: 93 }
  },
  {
    id: '11',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800',
    category: 'Streetwear',
    tags: ['Sneakers', 'Denim', 'Hype'],
    style: 'Underground Pulse',
    description: 'Raw denim and limited release sneakers for the urban explorer.'
  },
  {
    id: '12',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a760ef0a?auto=format&fit=crop&q=80&w=800',
    category: 'Minimalist',
    tags: ['Silent-Luxury', 'Cashmere', 'Soft'],
    style: 'Quiet Luxury',
    description: 'Highest quality cashmere in subtle, earth-toned palettes.'
  },
  {
    id: '13',
    imageUrl: 'https://images.unsplash.com/photo-1475180098004-ca77a6697484?auto=format&fit=crop&q=80&w=800',
    category: 'Bohemian',
    tags: ['Lace', 'Fringe', 'Festival'],
    style: 'Indie Soul',
    description: 'Intricate lace and long fringe details for a festival-ready vibe.'
  },
  {
    id: '14',
    imageUrl: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&q=80&w=800',
    category: 'Luxury Editorial',
    tags: ['Glow', 'Ethereal', 'Silk'],
    style: 'Ethereal Muse',
    description: 'Liquid silk that catches the light like water.'
  },
  {
    id: '15',
    imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=800',
    category: 'Avant-Garde',
    tags: ['Experimental', 'Recycled', 'Future'],
    style: 'Post-Organic',
    description: 'Experimental materials repurposed into high-fashion silhouettes.'
  },
  {
    id: '16',
    imageUrl: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=800',
    category: 'Minimalist',
    tags: ['Geometric', 'Boxy', 'Structured'],
    style: 'Modern Geometry',
    description: 'Structured boxy cuts that create a bold architectural profile.'
  },
  {
    id: '17',
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800',
    category: 'Streetwear',
    tags: ['Retro', 'Pop-Art', 'Colorblock'],
    style: '80s Electro',
    description: 'Retro colorblocking inspired by the golden era of arcade culture.'
  },
  {
    id: '18',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
    category: 'Cyberpunk',
    tags: ['Android', 'Chrome', 'Reflective'],
    style: 'Chrome Horizon',
    description: 'Reflective materials that simulate the skin of a future android.'
  },
  {
    id: '19',
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
    category: 'Bohemian',
    tags: ['Tassel', 'Suede', 'Desert'],
    style: 'Desert Wanderer',
    description: 'Soft suede and leather tassels for a rugged yet romantic look.'
  },
  {
    id: '20',
    imageUrl: 'https://images.unsplash.com/photo-1534030352691-3ef5d6ea24fd?auto=format&fit=crop&q=80&w=800',
    category: 'Minimalist',
    tags: ['Essential', 'Cotton', 'White'],
    style: 'Pure Essential',
    description: 'The redefined white shirt in ultra-premium organic cotton.'
  },
  {
    id: '21',
    imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6ec3?auto=format&fit=crop&q=80&w=800',
    category: 'Streetwear',
    tags: ['Skater', 'Baggy', 'Canvas'],
    style: 'Concrete King',
    description: 'Relaxed fits and durable canvas designed for the street.'
  },
  {
    id: '22',
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31521a24d770?auto=format&fit=crop&q=80&w=800',
    category: 'Avant-Garde',
    tags: ['Shadow', 'Gothic', 'Leather'],
    style: 'Dark Avant',
    description: 'Complex leather layering exploring the boundaries of shadow.'
  },
  {
    id: '23',
    imageUrl: 'https://images.unsplash.com/photo-1573533064132-01538356942c?auto=format&fit=crop&q=80&w=800',
    category: 'Cyberpunk',
    tags: ['Circuitry', 'LED', 'Translucent'],
    style: 'Digital Nomad',
    description: 'Translucent fabrics with embedded fiber-optic lighting.'
  },
  {
    id: '24',
    imageUrl: 'https://images.unsplash.com/photo-1588117223622-127c75a900dc?auto=format&fit=crop&q=80&w=800',
    category: 'Luxury Editorial',
    tags: ['Red-Carpet', 'Tulle', 'Drama'],
    style: 'Dramatic Volume',
    description: 'Explosive tulle volume designed for the spotlight.'
  },
  {
    id: '25',
    imageUrl: 'https://images.unsplash.com/photo-1591084728715-aa5a75ae1388?auto=format&fit=crop&q=80&w=800',
    category: 'Streetwear',
    tags: ['Cyber', 'Graffiti', 'Mesh'],
    style: 'Static Noise',
    description: 'Mesh overlays and graffiti-inspired digital prints.'
  },
  {
    id: '26',
    imageUrl: 'https://images.unsplash.com/photo-1604008841914-f0120121703e?auto=format&fit=crop&q=80&w=800',
    category: 'Minimalist',
    tags: ['Sharp', 'Linear', 'Grey'],
    style: 'Metric Chic',
    description: 'High-precision linear cuts in industrial grey tones.'
  },
  {
    id: '27',
    imageUrl: 'https://images.unsplash.com/photo-1618242475122-48206252467d?auto=format&fit=crop&q=80&w=800',
    category: 'Bohemian',
    tags: ['Nature', 'Woven', 'Artisanal'],
    style: 'Forest Spirit',
    description: 'Woven textures using natural plant-based fibers.'
  },
  {
    id: '28',
    imageUrl: 'https://images.unsplash.com/photo-1624266351336-0ef0c237c89f?auto=format&fit=crop&q=80&w=800',
    category: 'Avant-Garde',
    tags: ['Void', 'Asymmetric', 'Wrap'],
    style: 'Asymmetric Void',
    description: 'Exploring the space between fabric and skin through asymmetry.'
  },
  {
    id: '29',
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800',
    category: 'Cyberpunk',
    tags: ['Holographic', 'Prism', 'Vinyl'],
    style: 'Prism Overload',
    description: 'Holographic vinyl that shifts color with every movement.'
  },
  {
    id: '30',
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800',
    category: 'Bohemian',
    tags: ['Patchwork', 'Eclectic', 'Folk'],
    style: 'Eco-Artisan',
    description: 'Eclectic patchwork representing diverse global folk traditions.'
  },
  {
    id: '31',
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
    category: 'Streetwear',
    tags: ['Utility', 'Cargo', 'Heavy'],
    style: 'Industrial Edge',
    description: 'Heavyweight textiles with oversized multi-pocket utility features.'
  },
  {
    id: '32',
    imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80&w=800',
    category: 'Luxury Editorial',
    tags: ['Classic', 'Check', 'Tweed'],
    style: 'Royal Heritage',
    description: 'Modern interpretation of classic British royal heritage patterns.'
  },
  {
    id: '33',
    imageUrl: 'https://images.unsplash.com/photo-1539109132314-3477524c8830?auto=format&fit=crop&q=80&w=800',
    category: 'Minimalist',
    tags: ['Raw', 'Eco', 'Sand'],
    style: 'Raw Earth',
    description: 'Undyed raw materials that celebrate the natural state of fiber.'
  },
  {
    id: '34',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    category: 'Streetwear',
    tags: ['Graphic', 'Spray', 'Bold'],
    style: 'Aerosol Vibe',
    description: 'Hand-sprayed graphic elements on premium streetwear staples.'
  },
  {
    id: '35',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    category: 'Luxury Editorial',
    tags: ['Evening', 'Swarovski', 'Bling'],
    style: 'Diamond Drip',
    description: 'Hand-applied crystal details that shimmer with surgical precision.'
  },
  {
    id: '36',
    imageUrl: 'https://images.unsplash.com/photo-1529133039943-085215f6d58d?auto=format&fit=crop&q=80&w=800',
    category: 'Bohemian',
    tags: ['Chiffon', 'Lighter-than-air', 'Blue'],
    style: 'Ocean Gypsy',
    description: 'Layered chiffon that mimics the flow of ocean currents.'
  },
  {
    id: '37',
    imageUrl: 'https://images.unsplash.com/photo-1558769130-22c92138ac2a?auto=format&fit=crop&q=80&w=800',
    category: 'Cyberpunk',
    tags: ['Futurism', 'Hard-Surface', 'Exoskeleton'],
    style: 'Exo-Suit Minimal',
    description: 'Hard-surface elements integrated into flexible tech-knits.'
  },
  {
    id: '38',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693bd?auto=format&fit=crop&q=80&w=800',
    category: 'Avant-Garde',
    tags: ['Paper', 'Origami', 'White'],
    style: 'Origami Fold',
    description: 'Complex paper-folding techniques applied to heavy starched cotton.'
  },
  {
    id: '39',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
    category: 'Luxury Editorial',
    tags: ['Studio', 'Portrait', 'Slay'],
    style: 'Studio 54 Remix',
    description: 'Disco-era glamour updated for the digital generation.'
  },
  {
    id: '40',
    imageUrl: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&q=80&w=800',
    category: 'Bohemian',
    tags: ['Macramé', 'Tied', 'Beads'],
    style: 'Beaded Bliss',
    description: 'Intricate macramé work accented by hand-carved wooden beads.'
  },
  {
    id: '41',
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800',
    category: 'Minimalist',
    tags: ['Architecture', 'Concrete', 'Structure'],
    style: 'Brutalist Fit',
    description: 'Inspired by brutalist architecture, this fit prioritizes weight and form.'
  },
  {
    id: '42',
    imageUrl: 'https://images.unsplash.com/photo-1520006403945-5de815967f6b?auto=format&fit=crop&q=80&w=800',
    category: 'Luxury Editorial',
    tags: ['Jewels', 'Tiara', 'Regal'],
    style: 'Regnant Queen',
    description: 'Heirloom-quality accessories paired with modern couture.'
  },
  {
    id: '43',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800',
    category: 'Streetwear',
    tags: ['Brooklyn', 'Authentic', 'Vibe'],
    style: 'Borough Soul',
    description: 'Authentic Brooklyn street culture reflected in premium casuals.'
  },
  {
    id: '44',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a760ef0a?auto=format&fit=crop&q=80&w=800',
    category: 'Minimalist',
    tags: ['Quiet', 'Simple', 'Noble'],
    style: 'Noble Simplicity',
    description: 'Elegance achieved through the deliberate removal of the redundant.'
  },
  {
    id: '45',
    imageUrl: 'https://images.unsplash.com/photo-1475180098004-ca77a6697484?auto=format&fit=crop&q=80&w=800',
    category: 'Bohemian',
    tags: ['Retro-Boho', 'Suede', 'Folk'],
    style: 'Woodstock Legacy',
    description: 'A psychedelic journey through suede and artisanal dyes.'
  },
  {
    id: '46',
    imageUrl: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&q=80&w=800',
    category: 'Luxury Editorial',
    tags: ['Sunset', 'Glow', 'Flow'],
    style: 'Golden Muse',
    description: 'Satin that reflects the warmth of a setting Mediterranean sun.'
  },
  {
    id: '47',
    imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=800',
    category: 'Avant-Garde',
    tags: ['Dark', 'Mystic', 'Veil'],
    style: 'Mystic Veil',
    description: 'Sheer layering that creates an aura of enigmatic sophistication.'
  },
  {
    id: '48',
    imageUrl: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=800',
    category: 'Minimalist',
    tags: ['Zen', 'Focus', 'Clean'],
    style: 'Zen Form',
    description: 'Mindful construction techniques resulting in absolute clarity.'
  },
  {
    id: '49',
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800',
    category: 'Streetwear',
    tags: ['Club', 'Rave', 'Neon'],
    style: 'Neon Rave',
    description: 'UV-reactive textiles designed for the underground nightlife.'
  },
  {
    id: '50',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
    category: 'Cyberpunk',
    tags: ['Glitch', 'Digital', 'Matrix'],
    style: 'Matrix Resident',
    description: 'High-contrast black leather with digital glitch pattern accents.'
  }
];

export const cleanBase64 = (data: string): string => {
  return data.replace(/^data:.*,/, '');
};

export const optimizeImage = async (file: File): Promise<{ blob: Blob; url: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const MAX_DIM = 2000;
      let width = img.width;
      let height = img.height;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height *= MAX_DIM / width;
          width = MAX_DIM;
        } else {
          width *= MAX_DIM / height;
          height = MAX_DIM;
        }
      }
      canvas.width = width;
      canvas.height = height;
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
      }
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(img.src);
        if (blob) {
          resolve({ blob, url: URL.createObjectURL(blob) });
        } else {
          reject(new Error("Encoding failed"));
        }
      }, 'image/webp', 0.85);
    };
  });
};

export const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
