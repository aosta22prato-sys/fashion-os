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

export type Language = 'en' | 'it' | 'fr' | 'zh';
export type UserRole = 'CEO' | 'Designer' | 'Curation' | 'Operations';

export interface FashionItem {
  id: string;
  imageUrl: string;
  gallerySeries?: string[];
  category: string;
  tags: string[];
  style: string;
  description: string;
  isSearchResult?: boolean;
  modelUrl?: string;
  title?: string;
  price?: number;
  sustainability?: number;
  velocity?: number;
  vogue?: number;
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

export interface Agent {
  id: string;
  name: string;
  role: 'Runtime' | 'Trend' | 'Campaign' | 'Director' | 'Styling';
  status: 'idle' | 'active' | 'thinking';
  permission: 'Observer' | 'Operator' | 'Director' | 'Admin' | 'Autonomous';
}

export interface SystemLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ACTION' | 'AI';
  message: string;
}

export interface Registry {
  models: Array<{
    id: string;
    name: string;
    status: string;
    type: string;
  }>;
  workers: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    gpu_memory: number;
    load: number;
  }>;
  agents: Agent[];
}

export interface OpsDashboard {
  revenue_metrics: {
    daily: number;
    monthly: number;
    trend: string;
  };
  system_latency: string;
  active_operations: number;
  team_sync_status: string;
  worker_load?: Array<{ id: string; load: number }>;
}
