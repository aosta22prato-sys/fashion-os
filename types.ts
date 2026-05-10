/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

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
  category: string;
  tags: string[];
  style: string;
  description: string;
  analysis?: {
    sustainability: number;
    heritageScore: number;
    trendVelocity: 'Rising' | 'Stable' | 'Fading';
    fabricComposition: string;
    vogueIndex: number;
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
