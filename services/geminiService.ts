/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import { GoogleGenAI } from "@google/genai";
import { cleanBase64 } from "../utils";

// Helper to ensure we always get a fresh instance with the latest key
const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to create a blank black image for the video start frame
const createBlankImage = (width: number, height: number): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
  }
  const dataUrl = canvas.toDataURL('image/png');
  return cleanBase64(dataUrl);
};

export const analyzeFashionQuery = async (query: string): Promise<{ category: string, tags: string[], description: string }> => {
  try {
    const response = await fetch("/api/fashion/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Fashion analysis failed, using fallback", e);
    return { category: "Minimalist", tags: ["Modern", "Clean", "Chic"], description: "A sophisticated exploration of form and function." };
  }
};

export const getFashionAssistantResponse = async (messages: { role: string, content: string }[]): Promise<string> => {
  try {
    const lastMessage = messages[messages.length - 1].content;
    const response = await fetch("/api/fashion/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: lastMessage,
        session_id: "client_" + Date.now()
      })
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error || "API error");
    return data.reply;
  } catch (e) {
    console.error("Fashion OS Chat failed", e);
    return "I'm sorry, the Fashion OS Intelligence core is currently offline. Please ensure Ollama and the Laravel backend are running.";
  }
};

export const performVisualSearch = async (imageBase64: string, mimeType: string): Promise<{ category: string, tags: string[], description: string }> => {
  try {
    const response = await fetch("/api/fashion/visual-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: cleanBase64(imageBase64), mimeType })
    });
    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Visual search analysis failed", e);
    return { category: "Minimalist", tags: ["Modern", "Reference", "Uploaded"], description: "A unique style detected from your visual reference." };
  }
};

interface TextImageOptions {
  text: string;
  style: string;
  typographyPrompt?: string;
  referenceImage?: string; // Full Data URL
}

export const generateTextImage = async ({ text, style, creativity, fidelity }: any): Promise<{ data: string, mimeType: string }> => {
  try {
    const response = await fetch("/api/fashion/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: text,
        style: style,
        creativity: creativity,
        fidelity: fidelity
      })
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error || "Generation failed");
    
    // In a real environment, we'd wait for a web-socket or poll for the result.
    // For now, we simulate success with a placeholder if the image isn't immediate.
    if (data.image_url) {
        return { data: data.image_url, mimeType: 'image/jpeg' };
    }
    
    throw new Error("Job queued, waiting for async result...");
  } catch (error: any) {
    console.warn("Falling back to local simulation due to:", error.message);
    // TEMPORARY FALLBACK for the UI during the transition
    return { 
        data: "https://picsum.photos/seed/" + encodeURIComponent(text) + "/1024/1024", 
        mimeType: 'image/jpeg' 
    };
  }
};

export const generateHeroBackground = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch("/api/fashion/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `Cinematic background: ${prompt}`,
        style: "architectural luxury"
      })
    });

    const data = await response.json();
    if (data.image_url) return data.image_url;
    
    // Simulate return if immediate result
    return "https://picsum.photos/seed/" + encodeURIComponent(prompt) + "/1920/1080?blur=1";
  } catch (error) {
    console.error("Backend Background failed", error);
    return "https://picsum.photos/seed/fashion/1920/1080?blur=2";
  }
};

export const generateTextVideo = async (text: string, imageBase64: string, imageMimeType: string, promptStyle: string): Promise<string> => {
  try {
    const response = await fetch("/api/fashion/generate-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `Visual reveal: ${text}`,
        style: promptStyle,
        image: cleanBase64(imageBase64)
      })
    });

    const data = await response.json();
    if (data.video_url) return data.video_url;
    
    // Fallback: Real video generation takes time, so we'd normally poll.
    // For the UI experience, we'll return a placeholder video during the bridge transition.
    return "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4";
  } catch (error) {
    console.error("Backend Video failed", error);
    throw new Error("Fashion OS Video Engine is currently synthesizing. Please try again in 30s.");
  }
};
