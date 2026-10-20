import React, { useState } from 'react';
import { trendingFeedService } from '../../services/trendingFeedService';
import { TrendingLinkedInPost } from '../../types/studio';
import { Flame, ThumbsUp, MessageSquare, ArrowRight, Copy, Check, Sparkles, Search, RefreshCw } from 'lucide-react';
import { storageAdapter } from '../../services/storageAdapter';

interface LinkedInTrendsViewProps {
  onRemixToStudio: (thought: string) => void;
}

const CATEGORIES = ['All', 'Engineering & Tech', 'Marketing & Growth', 'Leadership & Startups', 'Product & Design'];

export const LinkedInTrendsView: React.FC<LinkedInTrendsViewProps> = ({ onRemixToStudio }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shuffleTick, setShuffleTick] = useState<number>(0);

  const posts = trendingFeedService.getTrendingPosts(activeCategory, searchQuery, shuffleTick > 0);

  const handleCopy = async (id: string, text: string) => {
    await storageAdapter.copyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShuffle = () => {
    setShuffleTick(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-studio-border shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center text-orange-600">
                <Flame className="w-4 h-4 fill-orange-500" />
              </span>
              <h2 className="text-xl font-extrabold text-studio-text tracking-tight">
                Trending on LinkedIn Today
              </h2>
            </div>
            <p className="text-xs text-studio-muted">
              Discover real viral hooks and discussions across tech, marketing, startups, and leadership. Click "Remix to Studio" to craft your own take.
            </p>
          </div>

          <button
            onClick={handleShuffle}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-studio-border bg-white text-xs font-bold text-studio-text hover:bg-studio-bg transition-colors shadow-2xs self-start md:self-auto cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-studio-accent" />
            <span>Shuffle Trends</span>
          </button>
        </div>

        {/* Search Bar + Categories Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-studio-border/60">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-studio-accent text-white shadow-2xs'
                    : 'bg-studio-bg text-studio-muted hover:text-studio-text hover:bg-studio-border/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-studio-subtle absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. RAG, Python, pricing)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-studio-border bg-studio-bg/50 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-studio-accent focus:bg-white"
            />
          </div>

        </div>
      </div>

      {/* Feed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {posts.length === 0 ? (
          <div className="col-span-2 p-12 text-center bg-white rounded-2xl border border-studio-border text-xs text-studio-muted">
            No trending posts match your search query. Try another keyword or clear the search.
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-5 rounded-2xl bg-white border border-studio-border hover:border-studio-accent/60 hover:shadow-xs transition-all flex flex-col justify-between gap-4 group"
            >
              <div className="flex flex-col gap-3">
                
                {/* Author & Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-studio-activePill text-studio-accent font-bold text-xs flex items-center justify-center border border-studio-border">
                      {post.author.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-studio-text leading-tight">
                        {post.author}
                      </span>
                      <span className="text-[10px] text-studio-muted line-clamp-1">
                        {post.authorTitle}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-studio-bg text-studio-accent font-bold">
                    {post.visualType}
                  </span>
                </div>

                {/* Bold Viral Hook */}
                <h3 className="font-extrabold text-sm text-studio-text leading-snug">
                  "{post.hook}"
                </h3>

                {/* Full Text Snippet */}
                <div className="p-3 rounded-xl bg-studio-bg/60 border border-studio-border/50 text-xs text-studio-text whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto font-normal">
                  {post.fullText}
                </div>

                {/* Hashtags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {post.tags.map((t) => (
                    <span key={t} className="text-[11px] font-semibold text-studio-accent">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Engagement & Action Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-studio-border/60">
                <div className="flex items-center gap-3 text-xs text-studio-muted">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-studio-subtle" />
                    {post.comments}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(post.id, post.fullText)}
                    className="p-1.5 rounded-lg border border-studio-border hover:bg-studio-bg text-studio-muted hover:text-studio-text transition-colors cursor-pointer"
                    title="Copy post text"
                  >
                    {copiedId === post.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemixToStudio(post.suggestedPrompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-studio-accent text-white text-xs font-bold hover:bg-studio-accentHover transition-colors shadow-2xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Remix to Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
