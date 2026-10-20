import { UserIdentity, StudioSettings, GeneratedPost } from '../types/studio';

const IDENTITY_KEY = 'poststudio_identity';
const SETTINGS_KEY = 'poststudio_settings';
const DRAFTS_KEY = 'poststudio_drafts';

export const DEFAULT_IDENTITY: UserIdentity = {
  profession: 'Technology & Software',
  role: 'Engineering Leader'
};

export const DEFAULT_BRAND_KIT = {
  creatorName: '',
  handle: '',
  jobTitle: '',
  primaryColor: '#0F172A',
  accentColor: '#10B981',
  secondaryColor: '#E2E8F0',
  avatarUrl: ''
};

export const DEFAULT_SETTINGS: StudioSettings = {
  autoPublishEnabled: false,
  cadence: 'Daily (9:00 AM)',
  linkedinConnected: false,
  voiceInputEnabled: true,
  imageEngine: 'flux',
  brandKit: DEFAULT_BRAND_KIT
};


export const storageAdapter = {
  getIdentity(): UserIdentity {
    try {
      const data = localStorage.getItem(IDENTITY_KEY);
      return data ? JSON.parse(data) : DEFAULT_IDENTITY;
    } catch {
      return DEFAULT_IDENTITY;
    }
  },

  saveIdentity(identity: UserIdentity): void {
    try {
      localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
    } catch (e) {
      console.warn('Failed to save identity to localStorage', e);
    }
  },

  getSettings(): StudioSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: StudioSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }
  },

  getDrafts(): GeneratedPost[] {
    try {
      const data = localStorage.getItem(DRAFTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveDraft(post: GeneratedPost): void {
    try {
      const drafts = this.getDrafts();
      const filtered = drafts.filter(d => d.id !== post.id);
      localStorage.setItem(DRAFTS_KEY, JSON.stringify([post, ...filtered]));
    } catch (e) {
      console.warn('Failed to save draft to localStorage', e);
    }
  },

  deleteDraft(id: string): void {
    try {
      const drafts = this.getDrafts().filter(d => d.id !== id);
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
    } catch (e) {
      console.warn('Failed to delete draft', e);
    }
  },

  async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      return false;
    }
  }
};

