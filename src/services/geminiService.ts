// Gemini API and AI Services Integration
import { API_BASE_URL } from './apiConfig';

export interface GeminiConfig {
  apiKey: string;
  model: string;
  imageModel: string;
}

const GEMINI_API_KEY_STORAGE = 'poststudio_gemini_api_key';
const GEMINI_ACTIVE_MODEL_STORAGE = 'poststudio_active_model';

export const geminiService = {
  getApiKey(): string {
    return localStorage.getItem(GEMINI_API_KEY_STORAGE) || '';
  },

  setApiKey(key: string): void {
    if (key.trim()) {
      localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(GEMINI_API_KEY_STORAGE);
    }
  },

  hasApiKey(): boolean {
    const key = this.getApiKey();
    return key.length > 10;
  },

  getActiveModel(): string {
    return localStorage.getItem(GEMINI_ACTIVE_MODEL_STORAGE) || 'gemini-1.5-flash';
  },

  /**
   * Tests the API key with dynamic Google Gemini model discovery.
   * Eliminates 404 model-not-found errors by discovering exact supported models.
   */
  async testApiKey(apiKey: string): Promise<{ valid: boolean; message: string; activeModel?: string }> {
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      return { valid: false, message: 'Please enter an API key.' };
    }

    // 1. Try testing via Python FastAPI backend
    try {
      const pyRes = await fetch(`${API_BASE_URL}/api/test-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: cleanKey })
      });
      if (pyRes.ok) {
        const data = await pyRes.json();
        if (data.valid && data.activeModel) {
          localStorage.setItem(GEMINI_ACTIVE_MODEL_STORAGE, data.activeModel);
          this.setApiKey(cleanKey);
          return {
            valid: true,
            message: `✓ Python Backend Verified: Connected to ${data.activeModel}`,
            activeModel: data.activeModel
          };
        } else if (!data.valid) {
          return { valid: false, message: data.message };
        }
      }
    } catch {
      // Python backend not running or timed out; fall back to direct browser discovery
    }

    // 2. Direct Google Gemini Models Discovery
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`;
      const res = await fetch(url);

      if (res.ok) {
        const data = await res.json();
        const available = (data.models || [])
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name.replace('models/', ''));

        const preferred = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-1.5-pro-latest'];
        let chosen = 'gemini-1.5-flash';
        for (const p of preferred) {
          if (available.includes(p)) {
            chosen = p;
            break;
          }
        }

        if (available.length > 0 && !available.includes(chosen)) {
          chosen = available[0];
        }

        localStorage.setItem(GEMINI_ACTIVE_MODEL_STORAGE, chosen);
        this.setApiKey(cleanKey);

        return {
          valid: true,
          message: `✓ API Key Verified! Active Model: ${chosen}`,
          activeModel: chosen
        };
      } else {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson.error?.message || `HTTP ${res.status}`;
        return {
          valid: false,
          message: `Google API Key Error: ${errMsg}`
        };
      }
    } catch (err: any) {
      return {
        valid: false,
        message: err.message || 'Network error verifying API key with Google AI Studio.'
      };
    }
  },

  /**
   * Generates a professional, human-sounding post using Gemini with automatic model cascade fallback
   */
  async generateWithGemini(prompt: string, profession: string, role: string, tone: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('No API key configured. Please enter your Gemini API key in Settings.');
    }

    const systemInstruction = `You are an elite ghostwriter for top 1% technology executives, AI architects, and engineering founders on LinkedIn (in the caliber of Andrej Karpathy, Chip Huyen, Harrison Chase).
Your goal is to write a post that commands immediate authority, stops mobile scrolling, and delivers high technical and strategic density.

VIRAL LINKEDIN ANATOMY TO FOLLOW:
1. THE HOOK (Line 1):
   - A visceral, contrarian, or punchy truth in all-caps or high-contrast wording.
   - Examples: "THE LLM IS NOT THE PRODUCT. THE SYSTEM AROUND IT IS." or "Evaluating an AI agent like deterministic software is why 90% of pilots fail before production."
   - Never start with generic pleasantries or filler.

2. THE HARD REALITY (Lines 2-5):
   - Contrast naive amateur approaches with production reality.
   - Mention real friction: latency, hallucination drift, brittle tool schemas, lack of evaluation benchmarks.

3. THE STRUCTURED FRAMEWORK:
   - Provide a numbered breakdown (01 through 04 or 05) matching the architecture of the topic.
   - Each point must have a bold header followed by a practical 1-sentence technical explanation.

4. THE GOLDEN RULE / KEY TAKEAWAY:
   - A memorable 1-line aphorism that people screenshot and share.
   - Example: "A powerful model is just the beginning. Great AI products are engineered, not just prompted." / "Trust is earned call by call."

5. ENGAGEMENT QUESTION:
   - An open-ended question inviting engineering debate in the comments.

STRICT CONSTRAINTS:
- NEVER use: "delve", "testament", "tapestry", "game-changer", "revolutionize", "seamless", "in today's fast-paced world", "ever-evolving", "furthermore", "moreover", "in conclusion", "beacon", "foster", "elevate", "harness", "pleased to announce".
- Role calibration: User is ${role} in ${profession}.
- Tone: ${tone}.
- Output ONLY the clean markdown post with double line breaks for scannability. No quotation wrappers or introductory chat.`;

    const activeModel = this.getActiveModel();
    const candidateModels = [
      activeModel,
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro'
    ];
    // Deduplicate
    const uniqueCandidates = Array.from(new Set(candidateModels));

    let lastError: Error | null = null;

    for (const model of uniqueCandidates) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `Here is my topic/thought for today: "${prompt}". Write a viral, high-density LinkedIn post following the instructions.` }]
              }
            ],
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            generationConfig: {
              temperature: 0.75,
              maxOutputTokens: 1000
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate && candidate.trim().length > 0) {
            localStorage.setItem(GEMINI_ACTIVE_MODEL_STORAGE, model);
            return candidate.trim();
          }
        } else {
          const errBody = await response.json().catch(() => ({}));
          const errMsg = errBody.error?.message || `HTTP ${response.status}`;
          
          if (response.status === 400 && errMsg.includes('API_KEY_INVALID')) {
            throw new Error('Invalid Gemini API Key. Please verify or update your key in Settings.');
          }
          if (response.status === 429) {
            throw new Error('Gemini API quota exceeded (Rate Limit). Please wait or check your Google AI Studio quota.');
          }
          lastError = new Error(`Model ${model}: ${errMsg}`);
        }
      } catch (err: any) {
        if (err.message.includes('API Key') || err.message.includes('quota exceeded')) {
          throw err;
        }
        lastError = err;
      }
    }

    throw lastError || new Error('All Gemini models failed. Please verify your internet connection or API Key in Settings.');
  },

  /**
   * Generates a real AI image via Imagen 3 if key exists, or enhanced Flux
   */
  async generateAiImage(prompt: string, style: string): Promise<string> {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
        const enhancedPrompt = `${prompt}, high-end editorial LinkedIn graphic, 16:9 ratio, professional, minimalist aesthetic, 4k resolution`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: enhancedPrompt }],
            parameters: {
              sampleCount: 1,
              aspectRatio: '16:9',
              outputMimeType: 'image/jpeg'
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const base64Bytes = data.predictions?.[0]?.bytesBase64Encoded;
          if (base64Bytes) {
            return `data:image/jpeg;base64,${base64Bytes}`;
          }
        }
      } catch (e) {
        console.warn('Imagen 3 direct call failed, falling back to Flux engine:', e);
      }
    }

    // High quality Flux AI fallback
    const seed = Math.floor(Math.random() * 999999);
    const cleanPrompt = `${prompt}, professional editorial graphic, clean composition, architectural digest style, studio lighting, high resolution`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1200&height=675&nologo=true&seed=${seed}&model=flux`;
  }
};

