import { useState, useEffect, useCallback } from 'react';
import { UserIdentity, ToneMode, GeneratedPost, StudioSettings, VisualStyle } from '../types/studio';
import { storageAdapter, DEFAULT_IDENTITY, DEFAULT_SETTINGS } from '../services/storageAdapter';
import { generateHumanPost } from '../services/antiAiEngine';
import { generateTrendingTags } from '../services/trendingTagsEngine';
import { generateCrazyVisual, detectRecommendedStyle, generateVisualAst } from '../services/crazyVisualEngine';

export function useStudioState() {
  const [identity, setIdentityState] = useState<UserIdentity>(DEFAULT_IDENTITY);
  const [settings, setSettingsState] = useState<StudioSettings>(DEFAULT_SETTINGS);
  const [drafts, setDrafts] = useState<GeneratedPost[]>([]);
  
  // Studio interaction state
  const [thought, setThought] = useState<string>('how production RAG works');
  const [tone, setTone] = useState<ToneMode>('auto');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<GeneratedPost | null>(null);
  const [activeTab, setActiveTab] = useState<'studio' | 'workbench' | 'drafts' | 'trends' | 'settings'>('studio');
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  // Initialize from storage on mount
  useEffect(() => {
    setIdentityState(storageAdapter.getIdentity());
    setSettingsState(storageAdapter.getSettings());
    setDrafts(storageAdapter.getDrafts());
  }, []);

  const updateIdentity = useCallback((updates: Partial<UserIdentity>) => {
    setIdentityState(prev => {
      const next = { ...prev, ...updates };
      storageAdapter.saveIdentity(next);
      return next;
    });
  }, []);

  const updateSettings = useCallback((updates: Partial<StudioSettings>) => {
    setSettingsState(prev => {
      const next = { ...prev, ...updates };
      storageAdapter.saveSettings(next);
      return next;
    });
  }, []);

  // Main generation trigger (async)
  const generatePost = useCallback(async () => {
    if (!thought.trim()) return;

    setIsGenerating(true);

    try {
      const copy = await generateHumanPost({
        thought,
        profession: identity.profession,
        role: identity.role,
        tone
      });

      const tags = generateTrendingTags(thought, identity.profession, identity.role);
      const recommendedStyle = detectRecommendedStyle(thought);
      const visual = generateCrazyVisual(thought, identity.role, { style: recommendedStyle });
      const visualAst = generateVisualAst(thought, identity.role, recommendedStyle, settings.brandKit);

      let finalCopy = copy;
      const initialSelected = tags.filter(t => t.selected).map(t => `#${t.name}`);
      if (initialSelected.length > 0) {
        finalCopy = `${copy}\n\n${initialSelected.join(' ')}`;
      }

      const post: GeneratedPost = {
        id: `post-${Date.now()}`,
        thought,
        role: identity.role,
        profession: identity.profession,
        tone,
        copy: finalCopy,
        tags,
        imagePrompt: visual.prompt,
        imageUrl: visual.dataUrl,
        imageAlt: visual.headline,
        imageStyle: visual.style,
        imageHeadline: visual.headline,
        imageSubtitle: visual.subtitle,
        imageBadge: visual.badge,
        visualAst,
        createdAt: Date.now()
      };

      setCurrentPost(post);
    } catch (err) {
      console.error('Post generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [thought, identity, tone, settings.brandKit]);


  // Toggle a trending tag into/out of the copy
  const toggleTag = useCallback((tagId: string) => {
    if (!currentPost) return;

    const tag = currentPost.tags.find(t => t.id === tagId);
    if (!tag) return;

    const tagString = `#${tag.name}`;
    const isCurrentlySelected = tag.selected;
    const newSelected = !isCurrentlySelected;

    let updatedCopy = currentPost.copy;

    if (newSelected) {
      if (!updatedCopy.includes(tagString)) {
        if (updatedCopy.includes('#')) {
          updatedCopy = `${updatedCopy} ${tagString}`;
        } else {
          updatedCopy = `${updatedCopy}\n\n${tagString}`;
        }
      }
    } else {
      updatedCopy = updatedCopy
        .replace(new RegExp(`\\s*${tagString}\\b`, 'g'), '')
        .trim();
    }

    const updatedTags = currentPost.tags.map(t => 
      t.id === tagId ? { ...t, selected: newSelected } : t
    );

    setCurrentPost({
      ...currentPost,
      copy: updatedCopy,
      tags: updatedTags
    });
  }, [currentPost]);

  // Refresh/regenerate trending tags
  const refreshTrendingTags = useCallback(() => {
    if (!currentPost) return;
    const newTags = generateTrendingTags(currentPost.thought, identity.profession, identity.role);
    setCurrentPost({
      ...currentPost,
      tags: newTags
    });
  }, [currentPost, identity]);

  // Re-roll crazy visual with genuine layout and palette rotation
  const rerollVisual = useCallback(() => {
    if (!currentPost) return;
    const STYLES: VisualStyle[] = ['editorial-3d', 'comparison', 'flux-cinematic', 'infographic', 'cheatsheet'];
    const PALETTES: ('light' | 'dark' | 'indigo' | 'sage' | 'amber')[] = ['light', 'dark', 'indigo', 'sage', 'amber'];

    const currentIdx = STYLES.indexOf(currentPost.imageStyle || 'infographic');
    const nextStyle = STYLES[(currentIdx + 1) % STYLES.length];
    const nextPalette = PALETTES[(currentIdx + 1) % PALETTES.length];

    const newVisual = generateCrazyVisual(currentPost.thought, identity.role, { 
      style: nextStyle,
      paletteTheme: nextPalette 
    });

    setCurrentPost({
      ...currentPost,
      imageUrl: newVisual.dataUrl,
      imagePrompt: newVisual.prompt,
      imageAlt: newVisual.headline,
      imageStyle: newVisual.style,
      imageHeadline: newVisual.headline,
      imageSubtitle: newVisual.subtitle,
      imageBadge: newVisual.badge
    });
  }, [currentPost, identity]);

  // Apply custom visual adjustments from editor
  const applyCustomVisual = useCallback((updated: {
    imageUrl: string;
    headline: string;
    subtitle: string;
    badge: string;
    style: VisualStyle;
  }) => {
    if (!currentPost) return;
    setCurrentPost({
      ...currentPost,
      imageUrl: updated.imageUrl,
      imageAlt: updated.headline,
      imageHeadline: updated.headline,
      imageSubtitle: updated.subtitle,
      imageBadge: updated.badge,
      imageStyle: updated.style
    });
  }, [currentPost]);

  // Update copy directly from textarea
  const updateCopy = useCallback((text: string) => {
    if (!currentPost) return;
    setCurrentPost({
      ...currentPost,
      copy: text
    });
  }, [currentPost]);

  // Copy to clipboard with toast feedback
  const copyPost = useCallback(async () => {
    if (!currentPost) return;
    const success = await storageAdapter.copyToClipboard(currentPost.copy);
    if (success) {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    }
  }, [currentPost]);

  // Save current post to drafts
  const saveToDrafts = useCallback(() => {
    if (!currentPost) return;
    storageAdapter.saveDraft(currentPost);
    setDrafts(storageAdapter.getDrafts());
  }, [currentPost]);

  const deleteDraft = useCallback((id: string) => {
    storageAdapter.deleteDraft(id);
    setDrafts(storageAdapter.getDrafts());
  }, []);

  return {
    identity,
    updateIdentity,
    settings,
    updateSettings,
    thought,
    setThought,
    tone,
    setTone,
    isGenerating,
    currentPost,
    drafts,
    activeTab,
    setActiveTab,
    copyFeedback,
    generatePost,
    toggleTag,
    refreshTrendingTags,
    rerollVisual,
    applyCustomVisual,
    updateCopy,
    copyPost,
    saveToDrafts,
    deleteDraft
  };
}
