import React, { useState, useEffect } from 'react';
import { RefreshCw, Newspaper, ArrowUpRight } from 'lucide-react';
import { techRadarService } from '../../services/techRadarService';

interface ArticleInspirationCardProps {
  role: string;
  onSelectInspiration: (thought: string) => void;
}

interface ArticleSignal {
  id: string;
  source: string;
  headline: string;
  summary: string;
}

export const ArticleInspirationCard: React.FC<ArticleInspirationCardProps> = ({
  role,
  onSelectInspiration
}) => {
  const [articles, setArticles] = useState<ArticleSignal[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const live = await techRadarService.getLiveArticles('All');
      const mapped = live.slice(0, 3).map((a, i) => ({
        id: a.id || `live-${i}`,
        source: a.source,
        headline: a.title,
        summary: a.summary
      }));
      setArticles(mapped);
    } catch {
      // Ignore network errors
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <div className="p-6 md:p-7 rounded-xl bg-white border border-studio-border shadow-2xs flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold tracking-wider text-studio-subtle text-[11px] uppercase">
          Optional Article Inspiration
        </span>

        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-studio-border bg-white text-xs font-semibold text-studio-text hover:bg-studio-bg transition-colors shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-studio-accent ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh feed</span>
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-extrabold tracking-tight text-studio-text">
          Ideas in your orbit
        </h3>
        <p className="text-xs leading-relaxed text-studio-muted">
          Your thought is enough to generate a post. Select a recent article only if you want to add extra context; these are public feed signals, not LinkedIn-wide trend rankings.
        </p>
      </div>

      {/* Box matching screenshot: when no articles loaded yet, show the exact box */}
      {articles.length === 0 ? (
        <div 
          onClick={handleRefresh}
          className="p-5 rounded-lg border border-dashed border-studio-border bg-studio-bg/60 text-center flex flex-col items-center justify-center gap-1.5 text-xs text-studio-muted cursor-pointer hover:bg-studio-bg hover:border-studio-accent transition-colors"
        >
          <span className="font-medium text-studio-text">No current articles loaded.</span>
          <span className="text-[11px] text-studio-subtle">Click "Refresh feed" to retrieve relevant recent public feed articles for your role.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {articles.map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectInspiration(art.headline)}
              className="p-3.5 rounded-lg border border-studio-border bg-studio-bg/40 hover:bg-white hover:border-studio-accent hover:shadow-2xs transition-all cursor-pointer flex flex-col justify-between gap-2 group"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-studio-accent">
                  <span className="flex items-center gap-1">
                    <Newspaper className="w-3 h-3 text-studio-accent" />
                    {art.source}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-studio-muted group-hover:text-studio-text transition-colors" />
                </div>
                <h4 className="font-bold text-xs text-studio-text group-hover:text-studio-accent transition-colors line-clamp-2">
                  {art.headline}
                </h4>
                <p className="text-[11px] text-studio-muted line-clamp-2 leading-relaxed">
                  {art.summary}
                </p>
              </div>
              <span className="text-[10px] font-bold text-studio-accent uppercase tracking-wider">
                Use as seed →
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
