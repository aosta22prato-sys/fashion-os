/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// @ts-ignore
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

export const FASHION_CATEGORIES = [
  "All Trends",
  "Streetwear",
  "Minimalist",
  "Avant-Garde",
  "Bohemian",
  "Cyberpunk",
  "Luxury Editorial"
];

export const MOCK_FASHION_GALLERY: any[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1539109132314-3477524c8830?auto=format&fit=crop&q=80&w=800',
    category: 'Minimalist',
    tags: ['Sustainable', 'Linen', 'Beige'],
    style: 'Scandinavian Minimalist',
    description: 'Clean lines and sustainable fabrics for a timeless look.'
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    category: 'Streetwear',
    tags: ['Graphic', 'Oversized', 'Urban'],
    style: 'Tokyo Streetwear',
    description: 'Vibrant colors and bold graphics inspired by Shibuya culture.'
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    category: 'Luxury Editorial',
    tags: ['Haute Couture', 'Satin', 'Evening'],
    style: 'Parisian Elegance',
    description: 'Sophisticated evening wear for the modern aristocrat.'
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1529133039943-085215f6d58d?auto=format&fit=crop&q=80&w=800',
    category: 'Bohemian',
    tags: ['Floral', 'Flowy', 'Vintage'],
    style: 'Retro Boho',
    description: 'Ethereal silhouettes and vintage floral patterns.'
  }
];

export const cleanBase64 = (data: string): string => {
  return data.replace(/^data:.*,/, '');
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
