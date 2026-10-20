import React from 'react';
import { TagItem } from '../../types/studio';
import { TrendingUp, Flame, Target, RefreshCw } from 'lucide-react';

interface TrendingTagsBarProps {
  tags: TagItem[];
  onToggleTag: (tagId: string) => void;
  onRefreshTags: () => void;
}

export const TrendingTagsBar: React.FC<TrendingTagsBarProps> = ({
  tags,
  onToggleTag,
  onRefreshTags
}) => {
  return (
    <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-sage-50/70 border border-studio-border/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-bold tracking-tight text-studio-text">
            Current Trending Tags
          </span>
          <span className="text-[11px] text-studio-muted hidden sm:inline">
            (Click to append to your post)
          </span>
        </div>

        <button
          type="button"
          onClick={onRefreshTags}
          className="flex items-center gap-1.5 text-xs font-semibold text-sage-800 hover:text-sage-950 transition-colors p-1 rounded-md hover:bg-sage-200/50"
          title="Regenerate trending hashtag suggestions"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Trends</span>
        </button>
      </div>

      {/* Tag pills */}
      <div className="flex items-center gap-2 flex-wrap pt-0.5">
        {tags.map((tag) => {
          const isSelected = tag.selected;

          let badgeIcon = <Target className="w-3 h-3 text-studio-muted" />;
          let badgeText = 'Core';
          if (tag.velocity === 'trending') {
            badgeIcon = <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />;
            badgeText = 'Trending';
          } else if (tag.velocity === 'rising') {
            badgeIcon = <TrendingUp className="w-3 h-3 text-emerald-600" />;
            badgeText = 'Rising';
          }

          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggleTag(tag.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-studio-accent text-white border-studio-accent shadow-xs scale-102'
                  : 'bg-white text-studio-text border-studio-border hover:border-studio-accent/60 hover:bg-studio-cardMuted'
              }`}
            >
              <span>{badgeIcon}</span>
              <span className={`font-bold ${isSelected ? 'text-white' : 'text-studio-text'}`}>#{tag.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-studio-cardMuted text-studio-muted'
                }`}
              >
                {tag.volumeHint || badgeText}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

