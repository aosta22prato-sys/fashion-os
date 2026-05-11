/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SEARCHING = 'SEARCHING',
  GENERATING = 'GENERATING',
  ERROR = 'ERROR'
}

export interface FashionItem {
  id: string;
  imageUrl: string;
  gallerySeries?: string[];
  category: string;
  tags: string[];
  style: string;
  description: string;
  isSearchResult?: boolean;
  analysis?: {
    sustainability: number;
    heritageScore: number;
    trendVelocity: 'Rising' | 'Stable' | 'Fading';
    fabricComposition: string;
    vogueIndex: number;
    colors?: string[];
    fabrics?: string[];
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  moodboard?: any[];
  generation_actions?: any[];
}

export interface ChatResponse {
  success: boolean;
  reply: string;
  suggestions: string[];
  moodboard: any[];
  generation_actions: any[];
}

export interface GenerationResponse {
  success: boolean;
  generation_id: string | number;
  status: string;
}

export interface HealthResponse {
  success: boolean;
  health: {
    status: string;
    gpu_runtime: boolean;
    redis: boolean;
  }
}

export interface HistoryResponse {
  success: boolean;
  data: Array<{
    id: string | number;
    prompt: string;
    status: string;
    image_url: string;
  }>;
}
