import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedPost, VisualStyle } from '../../types/studio';
import { PostCopyEditor } from './PostCopyEditor';
import { TrendingTagsBar } from './TrendingTagsBar';
import { CrazyVisualCard } from './CrazyVisualCard';
import { Sparkles } from 'lucide-react';

interface UnfoldingCardProps {
  post: GeneratedPost | null;
  onUpdateCopy: (text: string) => void;
  onToggleTag: (tagId: string) => void;
  onRefreshTags: () => void;
  onRerollVisual: () => void;
  onApplyCustomVisual: (updated: {
    imageUrl: string;
    headline: string;
    subtitle: string;
    badge: string;
    style: VisualStyle;
  }) => void;
  onCopyPost: () => void;
  copyFeedback: boolean;
  onSaveToDrafts: () => void;
  onOpenWorkbench?: () => void;
}

export const UnfoldingCard: React.FC<UnfoldingCardProps> = ({
  post,
  onUpdateCopy,
  onToggleTag,
  onRefreshTags,
  onRerollVisual,
  onApplyCustomVisual,
  onCopyPost,
  copyFeedback,
  onSaveToDrafts,
  onOpenWorkbench
}) => {
  return (
    <AnimatePresence>
      {post && (
        <motion.div
          initial={{ opacity: 0, height: 0, scale: 0.98, y: -10 }}
          animate={{ opacity: 1, height: 'auto', scale: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, scale: 0.98, y: -10 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="p-6 md:p-7 rounded-xl bg-white border-2 border-studio-border shadow-md flex flex-col gap-6 relative">
            {/* Unfolding Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-studio-border">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-[11px] px-2 py-0.5 rounded-md bg-studio-accent">
                  02
                </span>
                <span className="font-extrabold tracking-wider text-studio-text text-xs uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Your Readymade Post
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-studio-bg text-studio-accent border border-studio-border">
                Tailored for {post.role || 'Your Role'}
              </span>
            </div>

            {/* 1. Human Copy Editor */}
            <PostCopyEditor
              copy={post.copy}
              onChangeCopy={onUpdateCopy}
              onCopyPost={onCopyPost}
              copyFeedback={copyFeedback}
              onSaveToDrafts={onSaveToDrafts}
            />

            {/* 2. Dynamic Real-Time Trending Tags Bar */}
            <TrendingTagsBar
              tags={post.tags}
              onToggleTag={onToggleTag}
              onRefreshTags={onRefreshTags}
            />

            {/* 3. Crazy / Technical Visual Card with Live Editor */}
            <CrazyVisualCard
              imageUrl={post.imageUrl}
              imageAlt={post.imageAlt}
              imagePrompt={post.imagePrompt}
              imageStyle={post.imageStyle}
              imageHeadline={post.imageHeadline}
              imageSubtitle={post.imageSubtitle}
              imageBadge={post.imageBadge}
              thought={post.thought}
              role={post.role}
              onRerollVisual={onRerollVisual}
              onApplyCustomVisual={onApplyCustomVisual}
              onOpenWorkbench={onOpenWorkbench}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
