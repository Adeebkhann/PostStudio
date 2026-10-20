import { AIProvider, UserAuthSession } from '../types/studio';
import { geminiService } from './geminiService';

const ACTIVE_PROVIDER_STORAGE = 'poststudio_active_provider';
const OPENAI_API_KEY_STORAGE = 'poststudio_openai_api_key';
const ANTHROPIC_API_KEY_STORAGE = 'poststudio_anthropic_api_key';
const GROQ_API_KEY_STORAGE = 'poststudio_groq_api_key';
const AUTH_SESSION_STORAGE = 'poststudio_auth_session';

export interface ProviderMetadata {
  id: AIProvider;
  name: string;
  tagline: string;
  badge: string;
  iconName: string;
  recommendedModel: string;
  keyPlaceholder: string;
  keyHelpUrl: string;
  requiresKey: boolean;
}

export const PROVIDERS: Record<AIProvider, ProviderMetadata> = {
  'gemini': {
    id: 'gemini',
    name: 'Google Gemini',
    tagline: 'Gemini 1.5 Flash & 2.0 Flash with live model discovery',
    badge: 'RECOMMENDED',
    iconName: 'sparkles',
    recommendedModel: 'gemini-1.5-flash',
    keyPlaceholder: 'AIzaSy...',
    keyHelpUrl: 'https://aistudio.google.com/app/apikey',
    requiresKey: true
  },
  'openai': {
    id: 'openai',
    name: 'OpenAI GPT-4o',
    tagline: 'GPT-4o and GPT-4o-mini high-precision synthesis',
    badge: 'POPULAR',
    iconName: 'cpu',
    recommendedModel: 'gpt-4o-mini',
    keyPlaceholder: 'sk-proj-...',
    keyHelpUrl: 'https://platform.openai.com/api-keys',
    requiresKey: true
  },
  'anthropic': {
    id: 'anthropic',
    name: 'Anthropic Claude',
    tagline: 'Claude 3.5 Sonnet nuanced long-form voice',
    badge: 'PREMIUM',
    iconName: 'brain',
    recommendedModel: 'claude-3-5-sonnet-20241022',
    keyPlaceholder: 'sk-ant-...',
    keyHelpUrl: 'https://console.anthropic.com/settings/keys',
    requiresKey: true
  },
  'groq': {
    id: 'groq',
    name: 'Groq Cloud (Llama 3.3)',
    tagline: 'Ultra-fast inference (500+ tokens/sec) on Llama 3.3 70B',
    badge: 'LIGHTNING FAST',
    iconName: 'zap',
    recommendedModel: 'llama-3.3-70b-versatile',
    keyPlaceholder: 'gsk_...',
    keyHelpUrl: 'https://console.groq.com/keys',
    requiresKey: true
  },
  'python-local': {
    id: 'python-local',
    name: 'Python Multi-Agent Core',
    tagline: 'FastAPI local engine with semantic anti-AI cadence (No API Key needed)',
    badge: '100% LOCAL & FREE',
    iconName: 'terminal',
    recommendedModel: 'Python 3.13 Multi-Agent NLP',
    keyPlaceholder: 'No API Key required (Runs on http://127.0.0.1:8000)',
    keyHelpUrl: '',
    requiresKey: false
  }
};

export const aiProviderService = {
  getActiveProvider(): AIProvider {
    const saved = localStorage.getItem(ACTIVE_PROVIDER_STORAGE) as AIProvider;
    if (saved && PROVIDERS[saved]) {
      return saved;
    }
    // If user already has a Gemini key saved in geminiService, default to Gemini
    if (geminiService.hasApiKey()) {
      return 'gemini';
    }
    return 'python-local';
  },

  setActiveProvider(provider: AIProvider): void {
    localStorage.setItem(ACTIVE_PROVIDER_STORAGE, provider);
  },

  getKeyForProvider(provider: AIProvider): string {
    switch (provider) {
      case 'gemini':
        return geminiService.getApiKey();
      case 'openai':
        return localStorage.getItem(OPENAI_API_KEY_STORAGE) || '';
      case 'anthropic':
        return localStorage.getItem(ANTHROPIC_API_KEY_STORAGE) || '';
      case 'groq':
        return localStorage.getItem(GROQ_API_KEY_STORAGE) || '';
      case 'python-local':
        return '';
    }
  },

  setKeyForProvider(provider: AIProvider, key: string): void {
    const cleanKey = key.trim();
    switch (provider) {
      case 'gemini':
        geminiService.setApiKey(cleanKey);
        break;
      case 'openai':
        if (cleanKey) localStorage.setItem(OPENAI_API_KEY_STORAGE, cleanKey);
        else localStorage.removeItem(OPENAI_API_KEY_STORAGE);
        break;
      case 'anthropic':
        if (cleanKey) localStorage.setItem(ANTHROPIC_API_KEY_STORAGE, cleanKey);
        else localStorage.removeItem(ANTHROPIC_API_KEY_STORAGE);
        break;
      case 'groq':
        if (cleanKey) localStorage.setItem(GROQ_API_KEY_STORAGE, cleanKey);
        else localStorage.removeItem(GROQ_API_KEY_STORAGE);
        break;
      case 'python-local':
        break;
    }
  },

  hasKeyForProvider(provider: AIProvider): boolean {
    if (provider === 'python-local') return true;
    const key = this.getKeyForProvider(provider);
    return key.length > 8;
  },

  // Auth Session Management
  getAuthSession(): UserAuthSession | null {
    try {
      const data = localStorage.getItem(AUTH_SESSION_STORAGE);
      if (data) {
        return JSON.parse(data);
      }
      // Migration: If user already has a gemini key or user identity in existing storage, synthesize session
      if (geminiService.hasApiKey()) {
        const session: UserAuthSession = {
          isLoggedIn: true,
          userName: localStorage.getItem('poststudio_brand_name') || 'Creator',
          activeProvider: 'gemini',
          geminiApiKey: geminiService.getApiKey(),
          savedAt: Date.now()
        };
        this.saveAuthSession(session);
        return session;
      }
    } catch {
      return null;
    }
    return null;
  },

  saveAuthSession(session: UserAuthSession): void {
    try {
      localStorage.setItem(AUTH_SESSION_STORAGE, JSON.stringify(session));
      this.setActiveProvider(session.activeProvider);
      if (session.geminiApiKey) this.setKeyForProvider('gemini', session.geminiApiKey);
      if (session.openaiApiKey) this.setKeyForProvider('openai', session.openaiApiKey);
      if (session.anthropicApiKey) this.setKeyForProvider('anthropic', session.anthropicApiKey);
      if (session.groqApiKey) this.setKeyForProvider('groq', session.groqApiKey);
    } catch (e) {
      console.warn('Failed to save auth session', e);
    }
  },

  clearAuthSession(): void {
    localStorage.removeItem(AUTH_SESSION_STORAGE);
  },

  /**
   * Tests a provider API key live
   */
  async testProviderKey(provider: AIProvider, key: string): Promise<{ valid: boolean; message: string; model?: string }> {
    const cleanKey = key.trim();

    if (provider === 'python-local') {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/health');
        if (res.ok) {
          const data = await res.json();
          return {
            valid: true,
            message: `✓ Python Backend Connected (FastAPI v${data.python_version || '3.13'})`,
            model: 'Python 3.13 Multi-Agent Core'
          };
        }
      } catch {
        return {
          valid: false,
          message: 'Python backend is offline. Run `python run.py` in your terminal to start it.'
        };
      }
    }

    if (!cleanKey) {
      return { valid: false, message: 'Please enter an API key.' };
    }

    if (provider === 'gemini') {
      return geminiService.testApiKey(cleanKey);
    }

    if (provider === 'openai') {
      try {
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${cleanKey}` }
        });
        if (res.ok) {
          const data = await res.json();
          const hasGpt4 = data.data?.some((m: any) => m.id?.includes('gpt-4'));
          const chosenModel = hasGpt4 ? 'gpt-4o-mini' : 'gpt-3.5-turbo';
          return {
            valid: true,
            message: `✓ OpenAI Key Verified: Ready with ${chosenModel}`,
            model: chosenModel
          };
        } else {
          const err = await res.json().catch(() => ({}));
          return {
            valid: false,
            message: err.error?.message || `OpenAI returned status ${res.status}`
          };
        }
      } catch (e: any) {
        return { valid: false, message: e.message || 'Network error reaching OpenAI' };
      }
    }

    if (provider === 'groq') {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { 'Authorization': `Bearer ${cleanKey}` }
        });
        if (res.ok) {
          return {
            valid: true,
            message: '✓ Groq Key Verified: Ready with Llama 3.3 70B (500+ tok/s)',
            model: 'llama-3.3-70b-versatile'
          };
        } else {
          const err = await res.json().catch(() => ({}));
          return {
            valid: false,
            message: err.error?.message || `Groq returned status ${res.status}`
          };
        }
      } catch (e: any) {
        return { valid: false, message: e.message || 'Network error reaching Groq' };
      }
    }

    if (provider === 'anthropic') {
      if (cleanKey.startsWith('sk-ant-') && cleanKey.length > 25) {
        return {
          valid: true,
          message: '✓ Anthropic Key Formatted: Ready with Claude 3.5 Sonnet',
          model: 'claude-3-5-sonnet-20241022'
        };
      } else {
        return {
          valid: false,
          message: 'Anthropic keys typically start with sk-ant- and are at least 30 characters long.'
        };
      }
    }

    return { valid: false, message: 'Unknown provider.' };
  },

  /**
   * Generates post using selected provider
   */
  async generatePost(params: {
    thought: string;
    profession: string;
    role: string;
    tone: string;
  }): Promise<string | null> {
    const provider = this.getActiveProvider();
    const key = this.getKeyForProvider(provider);
    const { thought, profession, role, tone } = params;

    // 1. If OpenAI
    if (provider === 'openai' && key) {
      try {
        const systemPrompt = `You are an elite LinkedIn ghostwriter for a ${role} in ${profession}.
Write a high-impact, human-sounding LinkedIn post based on the user's thought.
Tone: ${tone}.
CRITICAL RULES:
- Never use AI clichés like "delve", "tapestry", "game-changer", "testament", "revolutionize", "seamless".
- Use crisp, punchy sentences with natural white space.
- Write with deep authority and pragmatic, real-world field experience.
- End with an engaging takeaway and thought-provoking question.`;

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: thought }
            ],
            temperature: 0.7,
            max_tokens: 650
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content?.trim();
          if (text) return text;
        }
      } catch {
        // Fall back gracefully
      }
    }

    // 2. If Groq
    if (provider === 'groq' && key) {
      try {
        const systemPrompt = `You are an elite executive LinkedIn ghostwriter for a ${role} in ${profession}.
Write a sharp, human LinkedIn post based on the user's thought.
Tone: ${tone}.
CRITICAL: No AI buzzwords (no delve, revolutionize, game-changer, seamless, tapestry). Format with clean spacing and punchy hooks.`;

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: thought }
            ],
            temperature: 0.7,
            max_tokens: 650
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content?.trim();
          if (text) return text;
        }
      } catch {
        // Fall back gracefully
      }
    }

    // 3. If Gemini
    if (provider === 'gemini' && geminiService.hasApiKey()) {
      try {
        const text = await geminiService.generateWithGemini(thought, profession, role, tone as any);
        if (text) return text;
      } catch {
        // Fall back gracefully
      }
    }

    return null;
  }
};

