export type Profession = 
  | 'Technology & Software'
  | 'Artificial Intelligence'
  | 'Product & Design'
  | 'Education & Academia'
  | 'Business & Startups'
  | 'Marketing & Growth'
  | 'Finance & Investing'
  | 'Healthcare & Medicine'
  | 'Sales & Partnerships'
  | 'Other';

export type ToneMode = 
  | 'auto'          // Default: Calibrated by role
  | 'contrarian'    // Hot take, challenging conventional wisdom
  | 'story'         // Personal, reflective, vulnerable lesson
  | 'tactical'      // Field notes, actionable breakdown
  | 'observation';  // Quiet, philosophical, observant

export type TagVelocity = 'trending' | 'rising' | 'core';

export interface TagItem {
  id: string;
  name: string;        // e.g. "GenerativeAI"
  velocity: TagVelocity; // 'trending' | 'rising' | 'core'
  selected: boolean;
  volumeHint?: string; // e.g. "🔥 124k posts"
}

export type VisualStyle = 'infographic' | 'cheatsheet' | 'flux-cinematic' | 'editorial-3d' | 'comparison';

export interface VisualArtwork {
  dataUrl: string;
  prompt: string;
  headline: string;
  subtitle: string;
  badge: string;
  style: VisualStyle;
  palette: string[];
}

export interface GeneratedPost {
  id: string;
  thought: string;
  role: string;
  profession: string;
  tone: ToneMode;
  copy: string;
  tags: TagItem[];
  imagePrompt: string;
  imageUrl: string;
  imageAlt: string;
  imageStyle?: VisualStyle;
  imageHeadline?: string;
  imageSubtitle?: string;
  imageBadge?: string;
  visualAst?: import('./canvas').CanvasElement[];
  createdAt: number;
}

export interface UserIdentity {
  profession: Profession;
  customProfession?: string;
  role: string;
}

export interface BrandKit {
  creatorName: string;
  handle: string;
  jobTitle: string;
  primaryColor: string;
  accentColor: string;
  secondaryColor: string;
  avatarUrl?: string;
}

export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'groq' | 'python-local';

export interface UserAuthSession {
  isLoggedIn: boolean;
  userName: string;
  userRole?: string;
  activeProvider: AIProvider;
  geminiApiKey?: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  groqApiKey?: string;
  savedAt: number;
}

export interface StudioSettings {
  autoPublishEnabled: boolean;
  cadence: 'Daily (9:00 AM)' | 'Weekdays' | 'Manual';
  linkedinConnected: boolean;
  voiceInputEnabled: boolean;
  activeProvider?: AIProvider;
  geminiApiKey?: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  groqApiKey?: string;
  imageEngine?: 'gemini' | 'flux' | 'svg-architect';
  brandKit?: BrandKit;
}

export type TrendingCategory = 
  | 'Engineering & Tech' 
  | 'Marketing & Growth' 
  | 'Leadership & Startups' 
  | 'Product & Design'
  | 'RAG & AI'
  | 'Python & Code'
  | 'Architecture'
  | 'Career & Leadership';

export type TechRadarCategory = 
  | 'All'
  | 'Job & Workflow Disruption'
  | 'Big Tech Updates & Executive Words'
  | 'Emerging Tech & Next-Gen Code';

export interface TechRadarArticle {
  id: string;
  category: 'Job & Workflow Disruption' | 'Big Tech Updates & Executive Words' | 'Emerging Tech & Next-Gen Code';
  title: string;
  source: string;
  publishedTime: string;
  urgencyBadge: 'CAREER SHIFT' | 'OFFICIAL UPDATE' | 'NEW RELEASE' | 'DISRUPTION ALERT' | 'HIGH IMPACT';
  summary: string;
  keyQuoteOrFact: string;
  jobImpact: string;
  threatLevel: 'High Disruption' | 'Skill Upgrade Required' | 'Massive Opportunity';
  tags: string[];
  suggestedPrompt: string;
  recommendedLayout?: string;
}

export interface TrendingLinkedInPost {
  id: string;
  author: string;
  authorTitle: string;
  category: TrendingCategory | string;
  hook: string;
  fullText: string;
  likes: string;
  comments: string;
  tags: string[];
  suggestedPrompt: string;
  visualType: 'Cheatsheet' | 'Infographic' | 'Diagram' | 'Story';
}

