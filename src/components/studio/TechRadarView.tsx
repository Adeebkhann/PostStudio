import React, { useState, useEffect } from 'react';
import { 
  Zap, Building2, Terminal, Search, ArrowRight, 
  Quote, AlertTriangle, TrendingUp, Check, Copy, 
  Sparkles, ExternalLink, RefreshCw, BookmarkCheck
} from 'lucide-react';
import { techRadarService, fetchLiveRadarArticles } from '../../services/techRadarService';
import { TechRadarArticle, TechRadarCategory } from '../../types/studio';
import { storageAdapter } from '../../services/storageAdapter';

interface TechRadarViewProps {
  onRemixToStudio: (suggestedThought: string, recommendedLayout?: string) => void;
}

const CATEGORIES: { label: string; value: TechRadarCategory; icon: React.FC<{ className?: string }> }[] = [
  { label: 'All Intel', value: 'All', icon: Sparkles },
  { label: 'Job & Career Disruption', value: 'Job & Workflow Disruption', icon: Zap },
  { label: 'Big Tech & Exec Quotes', value: 'Big Tech Updates & Executive Words', icon: Building2 },
  { label: 'Emerging Tech & Code', value: 'Emerging Tech & Next-Gen Code', icon: Terminal }
];

export const TechRadarView: React.FC<TechRadarViewProps> = ({ onRemixToStudio }) => {
  const [activeCategory, setActiveCategory] = useState<TechRadarCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [articles, setArticles] = useState<TechRadarArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadArticles = async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    try {
      const data = await techRadarService.getLiveArticles(activeCategory, searchQuery, forceRefresh);
      setArticles(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [activeCategory, searchQuery]);

  const handleCopyQuote = async (id: string, text: string) => {
    await storageAdapter.copyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getThreatColor = (level: TechRadarArticle['threatLevel']) => {
    switch (level) {
      case 'High Disruption':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Skill Upgrade Required':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Massive Opportunity':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getUrgencyBadgeColor = (badge: TechRadarArticle['urgencyBadge']) => {
    switch (badge) {
      case 'DISRUPTION ALERT':
        return 'bg-rose-600 text-white';
      case 'CAREER SHIFT':
        return 'bg-purple-600 text-white';
      case 'OFFICIAL UPDATE':
        return 'bg-blue-600 text-white';
      case 'NEW RELEASE':
        return 'bg-emerald-600 text-white';
      case 'HIGH IMPACT':
      default:
        return 'bg-amber-600 text-white';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-studio-border shadow-2xs flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-studio-accent/10 flex items-center justify-center text-studio-accent shadow-2xs">
                <Zap className="w-5 h-5 fill-studio-accent" />
              </span>
              <h2 className="text-2xl font-extrabold text-studio-text tracking-tight">
                Tech & Career Disruption Radar
              </h2>
            </div>
            <p className="text-sm text-studio-muted max-w-2xl">
              Curated intelligence on emerging methods, automated job disruption, Big Tech executive announcements, and breakthrough code. Click <strong>"Craft Executive Take"</strong> to draft your high-authority perspective with an architecture visual.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => loadArticles(true)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Refresh live articles from engineering feeds"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-studio-accent' : ''}`} />
              <span>Refresh</span>
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE INTEL FEED
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all cursor-pointer ${
                    isActive
                      ? 'bg-studio-accent text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, tech, or skills..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-studio-accent transition-all text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Articles Feed */}
      <div className="flex flex-col gap-5">
        {isLoading ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-studio-border flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-studio-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Fetching real-time engineering &amp; tech articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-studio-border text-slate-500 text-sm">
            No live articles found matching "{searchQuery}".
          </div>
        ) : (
          articles.map((article) => {
            const isCopied = copiedId === article.id;

            return (
              <article
                key={article.id}
                className="p-6 md:p-7 rounded-2xl bg-white border border-studio-border hover:border-studio-accent/40 hover:shadow-md transition-all flex flex-col gap-5 group"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${getUrgencyBadgeColor(article.urgencyBadge)}`}>
                      {article.urgencyBadge}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {article.source}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-400">
                      {article.publishedTime}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getThreatColor(article.threatLevel)}`}>
                    {article.threatLevel}
                  </span>
                </div>

                {/* Title & Summary */}
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-studio-accent transition-colors leading-snug tracking-tight">
                    {article.title}
                  </h3>
                  <p className="text-[15px] md:text-base text-slate-700 leading-relaxed font-normal">
                    {article.summary}
                  </p>
                </div>

                {/* Key Quote / Hard Benchmark */}
                <div className="p-4 md:p-5 rounded-xl bg-slate-50 border-l-4 border-studio-accent flex items-start gap-3.5 shadow-2xs">
                  <Quote className="w-5 h-5 text-studio-accent shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1 text-sm text-slate-800 italic leading-relaxed font-semibold">
                    {article.keyQuoteOrFact}
                  </div>
                </div>

                {/* Career / Job Impact Box */}
                <div className="p-4 md:p-5 rounded-xl bg-gradient-to-r from-amber-50/90 to-orange-50/60 border border-amber-300/80 shadow-2xs flex items-start gap-3.5">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">
                      <span>⚡ Why This Matters to Your Career / Compensation:</span>
                    </span>
                    <p className="text-sm text-amber-950 font-medium leading-relaxed">
                      {article.jobImpact}
                    </p>
                  </div>
                </div>

                {/* Tags & Action CTA Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    <button
                      onClick={() => handleCopyQuote(article.id, article.keyQuoteOrFact)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
                      title="Copy Key Quote to Clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Quote</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onRemixToStudio(article.suggestedPrompt, article.recommendedLayout)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-studio-accent text-white text-xs font-bold hover:bg-studio-accent/90 shadow-2xs transition-all cursor-pointer group/btn"
                    >
                      <Sparkles className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform" />
                      <span>Craft Executive Take</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

