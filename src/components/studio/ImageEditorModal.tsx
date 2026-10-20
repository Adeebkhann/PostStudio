import React, { useState } from 'react';
import { VisualStyle } from '../../types/studio';
import { X, Check, Sparkles, Sliders, Palette, RefreshCw } from 'lucide-react';
import { renderVectorCard, generateCrazyVisual } from '../../services/crazyVisualEngine';

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  thought: string;
  role: string;
  currentHeadline?: string;
  currentSubtitle?: string;
  currentBadge?: string;
  currentStyle?: VisualStyle;
  onApply: (updated: {
    imageUrl: string;
    headline: string;
    subtitle: string;
    badge: string;
    style: VisualStyle;
  }) => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  isOpen,
  onClose,
  thought,
  role,
  currentHeadline = '',
  currentSubtitle = '',
  currentBadge = '',
  currentStyle = 'infographic',
  onApply
}) => {
  const [headline, setHeadline] = useState(currentHeadline || thought || 'How Production RAG Works');
  const [subtitle, setSubtitle] = useState(currentSubtitle || 'A visual technical breakdown for modern engineering teams.');
  const [badge, setBadge] = useState(currentBadge || 'SYSTEM ARCHITECTURE');
  const [style, setStyle] = useState<VisualStyle>(currentStyle);
  const [palette, setPalette] = useState<'sage' | 'dark' | 'amber'>('sage');

  if (!isOpen) return null;

  // Compute live preview
  let previewUrl = '';
  if (style === 'flux-cinematic') {
    const randomSeed = 42;
    const cleanPrompt = `${headline}, cinematic architectural photography, studio rim lighting, 8k, photorealistic`;
    previewUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1200&height=675&nologo=true&seed=${randomSeed}&model=flux`;
  } else {
    const svg = renderVectorCard({
      thought,
      role,
      style,
      customHeadline: headline,
      customSubtitle: subtitle,
      customBadge: badge,
      paletteTheme: palette
    });
    previewUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  const handleSave = () => {
    onApply({
      imageUrl: previewUrl,
      headline,
      subtitle,
      badge,
      style
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-studio-border shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-studio-border">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-studio-accent" />
            <h3 className="font-extrabold text-lg text-studio-text">
              Customize LinkedIn Visual Card
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-studio-muted hover:text-studio-text hover:bg-studio-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Controls Column */}
          <div className="flex flex-col gap-4">
            
            {/* Visual Archetype Style */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-studio-text flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-studio-accent" />
                <span>Visual Style Archetype</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'infographic', label: '📊 Infographic', desc: 'RAG / Architecture' },
                  { id: 'cheatsheet', label: '⚡ Cheatsheet', desc: 'Python / Code Tips' },
                  { id: 'flux-cinematic', label: '🎬 Flux AI', desc: 'Cinematic Photo' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyle(s.id as VisualStyle)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      style === s.id
                        ? 'bg-studio-activePill border-studio-accent font-bold shadow-2xs'
                        : 'border-studio-border hover:bg-studio-bg/60 text-studio-muted'
                    }`}
                  >
                    <div className="text-xs font-bold text-studio-text">{s.label}</div>
                    <div className="text-[10px] text-studio-muted mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Headline Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-studio-text">
                Card Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. How Production RAG Architecture Works"
                className="w-full px-3 py-2 rounded-lg border border-studio-border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-studio-accent"
              />
            </div>

            {/* Subtitle Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-studio-text">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. 4-step retrieval pipeline for engineers"
                className="w-full px-3 py-2 rounded-lg border border-studio-border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-studio-accent"
              />
            </div>

            {/* Badge Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-studio-text">
                Top Badge Label
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. PYTHON 3.12 CHEATSHEET"
                className="w-full px-3 py-2 rounded-lg border border-studio-border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-studio-accent uppercase"
              />
            </div>

            {/* Color Palette Theme (for vector cards) */}
            {style !== 'flux-cinematic' && (
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-xs font-bold text-studio-text flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-studio-accent" />
                  <span>Color Theme</span>
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'sage', label: 'Emerald & Sage', bg: 'bg-[#14221A]' },
                    { id: 'dark', label: 'Obsidian & Cyan', bg: 'bg-[#0F172A]' },
                    { id: 'amber', label: 'Dark Stone & Gold', bg: 'bg-[#1C1917]' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPalette(p.id as any)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        palette === p.id
                          ? 'border-studio-accent bg-studio-activePill font-bold'
                          : 'border-studio-border hover:bg-studio-bg text-studio-muted'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${p.bg}`} />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Preview Column */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-studio-text">
              Live Preview (1200 × 675 LinkedIn Aspect Ratio)
            </span>
            <div className="rounded-xl overflow-hidden border border-studio-border bg-black shadow-md aspect-[16/9] flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] text-studio-muted text-center italic mt-1">
              Changes render instantly. Click 'Apply to Post' to update your studio.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-studio-border bg-studio-bg/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-studio-muted hover:text-studio-text hover:bg-studio-border/50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs tracking-tight text-white bg-studio-accent hover:bg-studio-accentHover shadow-2xs transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply to Post</span>
          </button>
        </div>

      </div>
    </div>
  );
};

