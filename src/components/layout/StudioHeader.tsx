import React, { useState, useEffect } from 'react';
import { RotateCw, Sparkles, Key, UserCheck, Cpu, Zap, Brain, Terminal } from 'lucide-react';
import { UserAuthSession, AIProvider } from '../../types/studio';
import { aiProviderService, PROVIDERS } from '../../services/aiProviderService';

interface StudioHeaderProps {
  onOpenSettings?: () => void;
  onOpenLogin?: () => void;
  currentSession?: UserAuthSession | null;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  onOpenSettings,
  onOpenLogin,
  currentSession
}) => {
  const [pythonActive, setPythonActive] = useState(false);
  const activeProvider = currentSession?.activeProvider || aiProviderService.getActiveProvider();
  const userName = currentSession?.userName || localStorage.getItem('poststudio_brand_name') || 'Creator';

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'online') setPythonActive(true);
      })
      .catch(() => setPythonActive(false));
  }, []);

  const getProviderIcon = (p: AIProvider) => {
    switch (p) {
      case 'gemini': return <Sparkles className="w-3 h-3 text-emerald-600" />;
      case 'openai': return <Cpu className="w-3 h-3 text-blue-600" />;
      case 'anthropic': return <Brain className="w-3 h-3 text-amber-600" />;
      case 'groq': return <Zap className="w-3 h-3 text-orange-500" />;
      case 'python-local': return <Terminal className="w-3 h-3 text-emerald-700" />;
    }
  };

  const getProviderLabel = (p: AIProvider) => {
    switch (p) {
      case 'gemini': return 'GEMINI 1.5/2.0';
      case 'openai': return 'GPT-4O';
      case 'anthropic': return 'CLAUDE 3.5';
      case 'groq': return 'GROQ 70B';
      case 'python-local': return 'PYTHON 3.13';
    }
  };

  return (
    <header className="w-full bg-white border-b border-studio-borderLight px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Brand logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-studio-accent flex items-center justify-center text-white font-extrabold text-sm tracking-tight shadow-2xs">
          p.
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-extrabold text-[17px] tracking-tight text-studio-text">postmark</span>
          <span className="text-studio-muted font-normal text-sm">/ studio</span>
        </div>
      </div>

      {/* Studio Status, Active Provider & User Switch Key */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        
        {/* Active AI Provider Switch Button */}
        <button
          onClick={onOpenLogin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-studio-border bg-zinc-50 hover:bg-zinc-100 text-studio-text shadow-2xs transition-all cursor-pointer"
          title="Click to Switch AI Provider or Change API Key"
        >
          {getProviderIcon(activeProvider)}
          <span className="hidden sm:inline font-mono text-[11px] font-extrabold text-zinc-700">
            {getProviderLabel(activeProvider)}
          </span>
          <Key className="w-3 h-3 text-studio-muted ml-0.5" />
        </button>

        {/* Python Backend Indicator */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-studio-badgeBorder bg-studio-badgeBg text-studio-badgeText shadow-2xs select-none"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
          {pythonActive ? (
            <span className="text-emerald-700 font-extrabold hidden md:inline">🐍 PYTHON ENGINE ACTIVE</span>
          ) : (
            <span className="hidden md:inline">STUDIO ENGINE READY</span>
          )}
        </div>

        {/* User Account / Login Button */}
        <button
          onClick={onOpenLogin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-studio-border hover:border-studio-accent bg-white text-xs font-bold text-studio-text hover:bg-studio-bg transition-colors cursor-pointer"
          title="Account & API Keys"
        >
          <UserCheck className="w-3.5 h-3.5 text-studio-accent" />
          <span className="hidden sm:inline max-w-[100px] truncate">{userName}</span>
        </button>

        {/* Reload Studio */}
        <button 
          onClick={() => window.location.reload()}
          className="w-8 h-8 flex items-center justify-center text-studio-muted hover:text-studio-text rounded-full hover:bg-studio-bg transition-colors cursor-pointer"
          title="Reset Studio"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
