import React, { useState } from 'react';
import { Download, RefreshCw, Sparkles, Check, Image as ImageIcon, Sliders } from 'lucide-react';
import { VisualStyle } from '../../types/studio';
import { ImageEditorModal } from './ImageEditorModal';

interface CrazyVisualCardProps {
  imageUrl: string;
  imageAlt: string;
  imagePrompt: string;
  imageStyle?: VisualStyle;
  imageHeadline?: string;
  imageSubtitle?: string;
  imageBadge?: string;
  thought: string;
  role: string;
  onRerollVisual: () => void;
  onApplyCustomVisual: (updated: {
    imageUrl: string;
    headline: string;
    subtitle: string;
    badge: string;
    style: VisualStyle;
  }) => void;
  onOpenWorkbench?: () => void;
}

export const CrazyVisualCard: React.FC<CrazyVisualCardProps> = ({
  imageUrl,
  imageAlt,
  imagePrompt,
  imageStyle = 'infographic',
  imageHeadline,
  imageSubtitle,
  imageBadge,
  thought,
  role,
  onRerollVisual,
  onApplyCustomVisual,
  onOpenWorkbench
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Download high-resolution PNG
  const handleDownload = async () => {
    try {
      setDownloading(true);

      // If it's an SVG data URL, render onto a high-res canvas
      if (imageUrl.startsWith('data:image/svg+xml')) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 1200;
          canvas.height = 675;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `poststudio-visual-${Date.now()}.png`;
            link.href = pngUrl;
            link.click();
            setDownloading(false);
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 2000);
          }
        };
        img.src = imageUrl;
        return;
      }

      // External AI image URL
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `poststudio-visual-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.target = '_blank';
      link.download = `poststudio-visual-${Date.now()}.png`;
      link.click();
      setDownloading(false);
    }
  };

  const isFlux = imageStyle === 'flux-cinematic' || imageUrl.includes('pollinations.ai');

  return (
    <>
      <div className="flex flex-col gap-3 p-4 rounded-xl bg-studio-bg border border-studio-border">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-studio-accent" />
            <span className="text-xs font-extrabold tracking-tight text-studio-text">
              {isFlux ? 'Flux AI Visual' : 'Technical Diagram & Card'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold uppercase tracking-wider">
              {imageStyle === 'cheatsheet' ? 'Cheatsheet' : imageStyle === 'comparison' ? 'Comparison Matrix' : imageStyle === 'editorial-3d' ? 'Editorial Brief' : imageStyle === 'flux-cinematic' ? 'Impact Card' : 'Infographic'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Open in Canva Workbench */}
            {onOpenWorkbench && (
              <button
                type="button"
                onClick={onOpenWorkbench}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-studio-accent hover:bg-studio-accentHover transition-colors px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer"
                title="Open in full Canva-grade Visual Design Workbench"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-200" />
                <span>Canva Workbench</span>
              </button>
            )}

            {/* Edit Visual Quick Modal */}
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-studio-accent bg-white border border-studio-border hover:bg-studio-bg transition-colors px-2.5 py-1.5 rounded-lg shadow-2xs cursor-pointer"
              title="Customize text, style, or colors on this visual"
            >
              <span>Quick Edit</span>
            </button>

            {/* Roll New Visual */}
            <button
              type="button"
              onClick={() => {
                setImageLoaded(false);
                onRerollVisual();
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-studio-muted hover:text-studio-text transition-colors p-1.5 rounded-md hover:bg-studio-border/50 cursor-pointer"
              title="Roll another visual concept"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-roll</span>
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-studio-border text-xs font-bold text-studio-text hover:bg-studio-bg transition-all shadow-2xs cursor-pointer"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-studio-accent" />
                  <span>{downloading ? 'Saving...' : 'Download HD PNG'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Visual Container */}
        <div className="relative rounded-xl overflow-hidden border border-studio-border bg-slate-900 shadow-xs aspect-[16/9] flex items-center justify-center">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />

          {/* Bottom subtle metadata */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 z-20">
            <span className="truncate pr-2 font-semibold">
              {imageHeadline || imageAlt}
            </span>
            <span className="text-white/70 text-[10px] shrink-0 font-mono">
              1200 × 675 HD
            </span>
          </div>
        </div>

        <p className="text-[11px] text-studio-muted line-clamp-1 italic px-0.5">
          {imagePrompt}
        </p>
      </div>

      {/* Interactive Editor Modal */}
      <ImageEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        thought={thought}
        role={role}
        currentHeadline={imageHeadline}
        currentSubtitle={imageSubtitle}
        currentBadge={imageBadge}
        currentStyle={imageStyle}
        onApply={onApplyCustomVisual}
      />
    </>
  );
};
