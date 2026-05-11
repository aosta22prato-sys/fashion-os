/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import { GoogleGenAI } from "@google/genai";
import { cleanBase64 } from "../utils";

// Helper to ensure we always get a fresh instance with the latest key
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this fashion search query: "${query}". 
      Return a JSON object with:
      - category: One of ["Streetwear", "Minimalist", "Avant-Garde", "Bohemian", "Cyberpunk", "Luxury Editorial"]
      - tags: Array of 3 relevant trend tags.
      - description: A short, poetic description of the style (max 15 words).
      
      Response must be ONLY JSON.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Fashion analysis failed", e);
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
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          inlineData: {
            data: cleanBase64(imageBase64),
            mimeType: mimeType
          }
        },
        {
          text: `Analyze this fashion reference image. 
          Identify the main style category, three specific trend tags, and a short poetic description.
          Return a JSON object with:
          - category: One of ["Streetwear", "Minimalist", "Avant-Garde", "Bohemian", "Cyberpunk", "Luxury Editorial"]
          - tags: Array of 3 relevant trend tags.
          - description: A short, poetic description of the style (max 15 words).
          
          Response must be ONLY JSON.`
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
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

const pollForVideo = async (operation: any) => {
  const ai = getAI();
  let op = operation;
  const startTime = Date.now();
  const MAX_WAIT_TIME = 180000; 

  while (!op.done) {
    if (Date.now() - startTime > MAX_WAIT_TIME) {
      throw new Error("Video generation timed out.");
    }
    await sleep(5000); 
    op = await ai.operations.getVideosOperation({ operation: op });
  }
  return op;
};

const fetchVideoBlob = async (uri: string) => {
  try {
    const url = new URL(uri);
    url.searchParams.append('key', process.env.API_KEY || '');
    
    const videoResponse = await fetch(url.toString());
    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video content: ${videoResponse.statusText}`);
    }
    const blob = await videoResponse.blob();
    return URL.createObjectURL(blob);
  } catch (e: any) {
    const fallbackUrl = `${uri}${uri.includes('?') ? '&' : '?'}key=${process.env.API_KEY}`;
    const videoResponse = await fetch(fallbackUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video content: ${videoResponse.statusText}`);
    }
    const blob = await videoResponse.blob();
    return URL.createObjectURL(blob);
  }
};

export const generateTextVideo = async (text: string, imageBase64: string, imageMimeType: string, promptStyle: string): Promise<string> => {
  const ai = getAI();

  if (!imageBase64) throw new Error("Image generation failed, cannot generate video.");

  const cleanImageBase64 = cleanBase64(imageBase64);

  const maxRevealRetries = 1; 
  for (let i = 0; i <= maxRevealRetries; i++) {
    try {
      const startImage = createBlankImage(1280, 720);
      const revealPrompt = `Cinematic transition. The text "${text}" gradually forms and materializes from darkness. ${promptStyle}. High quality, 8k, smooth motion.`;

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: revealPrompt,
        image: {
          imageBytes: startImage,
          mimeType: 'image/png'
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9',
          lastFrame: {
            imageBytes: cleanImageBase64,
            mimeType: imageMimeType
          }
        }
      });

      const op = await pollForVideo(operation);

      if (!op.error && op.response?.generatedVideos?.[0]?.video?.uri) {
        return await fetchVideoBlob(op.response.generatedVideos[0].video.uri);
      }
      
      if (op.error) {
        if (i < maxRevealRetries) {
          await sleep(3000);
          continue; 
        }
        throw new Error(op.error.message);
      }
    } catch (error: any) {
      if (i === maxRevealRetries) throw error;
      await sleep(3000);
    }
  }

  throw new Error("Unable to generate video.");
};
