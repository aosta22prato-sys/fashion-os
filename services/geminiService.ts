/**
 * Fashion OS - Neural Bridge Service
 * Connects Frontend UI to FastAPI + Redis + GPU Runtime
 */

const API = import.meta.env.VITE_API_BASE || '';

export async function getFashionAssistantResponse(messages: any[], context: any = {}) {
  const lastMessage = messages[messages.length - 1]?.content;
  const response = await fetch(`${API}/api/agents/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message: lastMessage, 
      context
    })
  });
  
  if (!response.ok) throw new Error('Agent Director offline');
  const data = await response.json();
  
  if (!data.success) throw new Error(data.error || 'Agent reasoning failed');

  return {
    success: true,
    reply: data.reply,
    suggestions: data.suggestions || [],
    moodboard: data.moodboard || [],
    generation_actions: data.generation_actions || [],
    action: data.action // New tool-calling field
  };
}

/**
 * Image Generation Pipeline (SDXL / Flux)
 */
export async function generateTextImage(params: { prompt: string; style?: string; brand?: string }) {
  const response = await fetch(`${API}/api/fashion/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: params.prompt,
      style: params.style || 'editorial',
      brand: params.brand || 'Dior'
    })
  });
  
  if (!response.ok) throw new Error('Generation pipeline congested');
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Generation failed');
  return data; // { success: true, generation_id: 123, status: "queued" }
}

/**
 * Neural Try-On Bridge (VTO)
 */
export async function performTryOn(personImage: string | Blob, garmentImage: string | Blob) {
  const formData = new FormData();
  formData.append('person_image', personImage);
  formData.append('garment_image', garmentImage);

  const response = await fetch(`${API}/api/fashion/tryon`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) throw new Error('Try-on engine busy');
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Try-on failed');
  return data; // { success: true, task_id: "...", status: "processing" }
}

/**
 * Registry & Health Telemetry
 */
export async function getRuntimeHealth() {
  const response = await fetch(`${API}/api/fashion/runtime/health`);
  return response.json();
}

export async function getGenerationHistory() {
  const response = await fetch(`${API}/api/fashion/history`);
  return response.json();
}

export async function getSystemRegistry() {
  const response = await fetch(`${API}/api/fashion/registry`);
  return response.json();
}
