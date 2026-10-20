import React from 'react';
import { Clock, FileText, Settings, ChevronDown, Flame, Palette, Zap } from 'lucide-react';
import { UserIdentity, Profession } from '../../types/studio';

interface LeftSidebarProps {
  identity: UserIdentity;
  onUpdateIdentity: (updates: Partial<UserIdentity>) => void;
  activeTab: 'studio' | 'workbench' | 'drafts' | 'trends' | 'settings';
  onSelectTab: (tab: 'studio' | 'workbench' | 'drafts' | 'trends' | 'settings') => void;
  draftsCount: number;
}

const PROFESSIONS: Profession[] = [
  'Education & Academia',
  'Technology & Software',
  'Artificial Intelligence',
  'Product & Design',
  'Business & Startups',
  'Marketing & Growth',
  'Finance & Investing',
  'Healthcare & Medicine',
  'Sales & Partnerships',
  'Other'
];

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  identity,
  onUpdateIdentity,
  activeTab,
  onSelectTab,
  draftsCount
}) => {
  return (
    <aside className="w-full lg:w-56 shrink-0 flex flex-col gap-7 pt-1 select-none">
      {/* YOUR STUDIO SECTION */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[11px] font-bold tracking-wider text-studio-subtle uppercase px-1">
          Your Studio
        </h3>

        <nav className="flex flex-col gap-1">
          {/* Today's studio (Active pill matching screenshot) */}
          <button
            onClick={() => onSelectTab('studio')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
              activeTab === 'studio'
                ? 'bg-studio-activePill text-studio-text font-bold shadow-2xs'
                : 'text-studio-muted hover:text-studio-text hover:bg-studio-border/30 font-medium'
            }`}
          >
            <Clock className="w-4 h-4 text-studio-accent" />
            <span>Today's studio</span>
          </button>

          {/* Visual Workbench (Custom Studio Canvas) */}
          <button
            onClick={() => onSelectTab('workbench')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all ${
              activeTab === 'workbench'
                ? 'bg-studio-activePill text-studio-text font-bold shadow-2xs'
                : 'text-studio-muted hover:text-studio-text hover:bg-studio-border/30 font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-studio-accent" />
              <span>Visual Workbench</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-studio-accent/10 text-studio-accent font-extrabold uppercase">
              PRO
            </span>
          </button>

          {/* Tech & Job Radar */}
          <button
            onClick={() => onSelectTab('trends')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all ${
              activeTab === 'trends'
                ? 'bg-studio-activePill text-studio-text font-bold shadow-2xs'
                : 'text-studio-muted hover:text-studio-text hover:bg-studio-border/30 font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Tech & Job Radar</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-extrabold uppercase">
              INTEL
            </span>
          </button>

          {/* Drafts */}
          <button
            onClick={() => onSelectTab('drafts')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all ${
              activeTab === 'drafts'
                ? 'bg-studio-activePill text-studio-text font-bold shadow-2xs'
                : 'text-studio-muted hover:text-studio-text hover:bg-studio-border/30 font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-studio-accent" />
              <span>Drafts</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full text-studio-subtle font-bold">
              {draftsCount}
            </span>
          </button>

          {/* Settings */}
          <button
            onClick={() => onSelectTab('settings')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
              activeTab === 'settings'
                ? 'bg-studio-activePill text-studio-text font-bold shadow-2xs'
                : 'text-studio-muted hover:text-studio-text hover:bg-studio-border/30 font-medium'
            }`}
          >
            <Settings className="w-4 h-4 text-studio-accent" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* YOUR POINT OF VIEW CARD */}
      <div className="p-4 rounded-xl bg-white border border-studio-border shadow-2xs flex flex-col gap-4">
        <h3 className="text-[11px] font-bold tracking-wider text-studio-subtle uppercase">
          Your Point of View
        </h3>

        {/* Profession dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-studio-text">
            Profession
          </label>
          <div className="relative">
            <select
              value={identity.profession}
              onChange={(e) => onUpdateIdentity({ profession: e.target.value as Profession })}
              className="w-full appearance-none px-3 py-2 rounded-lg border border-studio-border bg-white text-xs font-medium text-studio-text focus:outline-none focus:ring-1 focus:ring-studio-accent transition-all cursor-pointer pr-8"
            >
              {PROFESSIONS.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-studio-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Your role input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-studio-text">
            Your role
          </label>
          <input
            type="text"
            value={identity.role}
            onChange={(e) => onUpdateIdentity({ role: e.target.value })}
            placeholder="AI engineer"
            className="w-full px-3 py-2 rounded-lg border border-studio-border bg-white text-xs font-medium text-studio-text placeholder:text-studio-muted/50 focus:outline-none focus:ring-1 focus:ring-studio-accent transition-all"
          />
          <p className="text-[11px] leading-tight text-studio-muted mt-0.5">
            Your role helps retrieve relevant recent public feed articles.
          </p>
        </div>
      </div>

      {/* Bottom disclaimer note with asterisk */}
      <div className="text-[11px] leading-relaxed text-studio-subtle px-1 flex items-start gap-1">
        <span className="text-studio-accent font-bold text-sm leading-none">*</span>
        <span>Publishing stays off until you connect LinkedIn and explicitly enable it.</span>
      </div>
    </aside>
  );
};
