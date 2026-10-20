import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Trash2, 
  Cpu, 
  Zap, 
  Brain, 
  Terminal, 
  ExternalLink 
} from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { aiProviderService, PROVIDERS } from '../../services/aiProviderService';
import { UserIdentity, AIProvider } from '../../types/studio';

interface SettingsViewProps {
  identity: UserIdentity;
  onUpdateIdentity: (updates: Partial<UserIdentity>) => void;
  onOpenLoginModal?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  identity,
  onUpdateIdentity,
  onOpenLoginModal
}) => {
  const [activeProvider, setActiveProvider] = useState<AIProvider>(() => aiProviderService.getActiveProvider());
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const [pythonStatus, setPythonStatus] = useState<{ online: boolean; details?: any }>({ online: false });

  useEffect(() => {
    const prov = aiProviderService.getActiveProvider();
    setActiveProvider(prov);
    setApiKey(aiProviderService.getKeyForProvider(prov));

    // Check Python FastAPI backend health
    fetch('http://127.0.0.1:8000/api/health')
      .then(r => r.json())
      .then(data => setPythonStatus({ online: true, details: data }))
      .catch(() => setPythonStatus({ online: false }));
  }, []);

  const handleSwitchProvider = (newProv: AIProvider) => {
    setActiveProvider(newProv);
    aiProviderService.setActiveProvider(newProv);
    setApiKey(aiProviderService.getKeyForProvider(newProv));
    setTestStatus('idle');
    setTestMessage('');
  };

  const handleSaveKey = () => {
    aiProviderService.setKeyForProvider(activeProvider, apiKey);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleTestKey = async () => {
    setTestStatus('testing');
    try {
      const res = await aiProviderService.testProviderKey(activeProvider, apiKey);
      if (res.valid) {
        setTestStatus('valid');
        setTestMessage(res.message);
      } else {
        setTestStatus('invalid');
        setTestMessage(res.message);
      }
    } catch (err: any) {
      setTestStatus('invalid');
      setTestMessage(err.message || 'Validation failed.');
    }
  };

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear your local cache? This will reset your drafts and settings.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const [brandKit, setBrandKit] = useState<import('../../types/studio').BrandKit>(() => {
    return {
      creatorName: localStorage.getItem('poststudio_brand_name') || 'Alex Vance',
      handle: localStorage.getItem('poststudio_brand_handle') || '@alexvance.ai',
      jobTitle: localStorage.getItem('poststudio_brand_title') || 'Principal AI Architect',
      primaryColor: localStorage.getItem('poststudio_brand_primary') || '#1F322C',
      accentColor: localStorage.getItem('poststudio_brand_accent') || '#3E6F58',
      secondaryColor: localStorage.getItem('poststudio_brand_secondary') || '#E06A3B'
    };
  });

  const [brandSaved, setBrandSaved] = useState(false);

  const handleSaveBrandKit = () => {
    localStorage.setItem('poststudio_brand_name', brandKit.creatorName);
    localStorage.setItem('poststudio_brand_handle', brandKit.handle);
    localStorage.setItem('poststudio_brand_title', brandKit.jobTitle);
    localStorage.setItem('poststudio_brand_primary', brandKit.primaryColor);
    localStorage.setItem('poststudio_brand_accent', brandKit.accentColor);
    localStorage.setItem('poststudio_brand_secondary', brandKit.secondaryColor);
    setBrandSaved(true);
    setTimeout(() => setBrandSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl w-full">
      
      {/* Settings Header */}
      <div className="flex flex-col gap-1 p-6 rounded-2xl bg-white border border-studio-border shadow-2xs">
        <h2 className="text-xl font-extrabold text-studio-text tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-studio-accent" />
          <span>Studio Engine & Brand Kit</span>
        </h2>
        <p className="text-xs text-studio-muted">
          Configure external AI models, API keys, and your executive brand kit for automatic post watermarking.
        </p>
      </div>

      {/* Python Backend Status Card */}
      <div className="p-6 rounded-2xl bg-white border border-studio-border shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-studio-border flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🐍</span>
            <div>
              <h3 className="text-sm font-bold text-studio-text uppercase tracking-wider">
                Python 3.13 Multi-Agent Core Engine
              </h3>
              <p className="text-[11px] text-studio-muted">
                FastAPI backend running on <code className="font-mono text-studio-accent font-bold">http://127.0.0.1:8000</code>
              </p>
            </div>
          </div>
          <span className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            pythonStatus.online
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${pythonStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{pythonStatus.online ? 'Python Core Online' : 'Offline (Client Mode)'}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-studio-bg border border-studio-border flex flex-col gap-1">
            <span className="text-[10px] font-bold text-studio-subtle uppercase">Architecture</span>
            <span className="font-bold text-studio-text">FastAPI + Python 3.13</span>
          </div>
          <div className="p-2.5 rounded-xl bg-studio-bg border border-studio-border flex flex-col gap-1">
            <span className="text-[10px] font-bold text-studio-subtle uppercase">NLP Pipeline</span>
            <span className="font-bold text-emerald-700">Multi-Cadence Agent</span>
          </div>
          <div className="p-2.5 rounded-xl bg-studio-bg border border-studio-border flex flex-col gap-1">
            <span className="text-[10px] font-bold text-studio-subtle uppercase">Radar Engine</span>
            <span className="font-bold text-emerald-700">Python HTTPX Scraper</span>
          </div>
          <div className="p-2.5 rounded-xl bg-studio-bg border border-studio-border flex flex-col gap-1">
            <span className="text-[10px] font-bold text-studio-subtle uppercase">Model Discovery</span>
            <span className="font-bold text-emerald-700">Google v1beta Auto</span>
          </div>
        </div>
      </div>

      {/* Brand Kit Section */}
      <div className="p-6 rounded-2xl bg-white border border-studio-border shadow-2xs flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-studio-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-studio-accent" />
            <h3 className="text-sm font-bold text-studio-text uppercase tracking-wider">
              Executive Brand Kit (Auto-Stamped on Visuals)
            </h3>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
            ● Active
          </span>
        </div>

        <p className="text-xs text-studio-muted">
          Your personal handle, name, and brand color palette automatically stamp onto all generated infographics, whiteboard cards, and canvas exports.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-studio-text">Creator Name</label>
            <input
              type="text"
              value={brandKit.creatorName}
              onChange={(e) => setBrandKit({ ...brandKit, creatorName: e.target.value })}
              className="px-3 py-2 rounded-xl border border-studio-border text-xs text-studio-text focus:outline-none focus:ring-1 focus:ring-studio-accent"
              placeholder="e.g. Alex Vance"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-studio-text">LinkedIn / X Handle</label>
            <input
              type="text"
              value={brandKit.handle}
              onChange={(e) => setBrandKit({ ...brandKit, handle: e.target.value })}
              className="px-3 py-2 rounded-xl border border-studio-border text-xs text-studio-text focus:outline-none focus:ring-1 focus:ring-studio-accent"
              placeholder="@alexvance.ai"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-studio-text">Headline / Job Title</label>
            <input
              type="text"
              value={brandKit.jobTitle}
              onChange={(e) => setBrandKit({ ...brandKit, jobTitle: e.target.value })}
              className="px-3 py-2 rounded-xl border border-studio-border text-xs text-studio-text focus:outline-none focus:ring-1 focus:ring-studio-accent"
              placeholder="Principal AI Architect"
            />
          </div>
        </div>

        {/* Brand Colors */}
        <div className="flex flex-col gap-2 pt-2 border-t border-studio-border/60">
          <span className="text-xs font-bold text-studio-text">Brand Color Palette</span>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brandKit.primaryColor}
                onChange={(e) => setBrandKit({ ...brandKit, primaryColor: e.target.value })}
                className="w-8 h-8 rounded-lg border border-studio-border cursor-pointer"
              />
              <span className="text-xs font-mono text-studio-subtle">Primary ({brandKit.primaryColor})</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brandKit.accentColor}
                onChange={(e) => setBrandKit({ ...brandKit, accentColor: e.target.value })}
                className="w-8 h-8 rounded-lg border border-studio-border cursor-pointer"
              />
              <span className="text-xs font-mono text-studio-subtle">Accent ({brandKit.accentColor})</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brandKit.secondaryColor}
                onChange={(e) => setBrandKit({ ...brandKit, secondaryColor: e.target.value })}
                className="w-8 h-8 rounded-lg border border-studio-border cursor-pointer"
              />
              <span className="text-xs font-mono text-studio-subtle">Highlight ({brandKit.secondaryColor})</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSaveBrandKit}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-studio-accent text-white text-xs font-bold hover:bg-studio-accentHover transition-colors shadow-2xs cursor-pointer"
          >
            {brandSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4 text-emerald-300" />}
            <span>{brandSaved ? 'Brand Kit Saved!' : 'Save Brand Kit'}</span>
          </button>
        </div>
      </div>

      {/* Multi-Provider AI Engine & Key Management Card */}
      <div className="p-6 rounded-2xl bg-white border border-studio-border shadow-2xs flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-studio-border flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-studio-accent" />
            <h3 className="text-sm font-bold text-studio-text uppercase tracking-wider">
              AI Engine & Provider Key
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLoginModal && (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="text-[11px] font-bold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                Open Quick Gateway
              </button>
            )}
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              aiProviderService.hasKeyForProvider(activeProvider)
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-studio-bg text-studio-subtle'
            }`}>
              ● {PROVIDERS[activeProvider].name}
            </span>
          </div>
        </div>

        {/* Provider Selector Tabs */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-studio-text uppercase tracking-wider">
            Select Active AI Provider
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.keys(PROVIDERS) as AIProvider[]).map((provKey) => {
              const meta = PROVIDERS[provKey];
              const isSelected = activeProvider === provKey;
              return (
                <button
                  key={provKey}
                  type="button"
                  onClick={() => handleSwitchProvider(provKey)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-700'
                      : 'border-studio-border hover:border-studio-borderLight bg-white text-studio-text'
                  }`}
                >
                  <span className="text-[11px] font-bold truncate">{meta.name.split(' ')[0]}</span>
                  <span className="text-[9px] text-studio-muted font-normal uppercase">{meta.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Provider Description & Key Input */}
        <div className="p-4 rounded-xl bg-zinc-50 border border-studio-border flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-studio-text">
              {PROVIDERS[activeProvider].name} Configuration
            </span>
            {PROVIDERS[activeProvider].keyHelpUrl && (
              <a
                href={PROVIDERS[activeProvider].keyHelpUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
              >
                <span>Get API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <p className="text-xs text-studio-muted">
            {PROVIDERS[activeProvider].tagline}
          </p>

          {PROVIDERS[activeProvider].requiresKey ? (
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-[11px] font-bold text-studio-text uppercase tracking-wider">
                {PROVIDERS[activeProvider].name} API Key
              </label>
              <div className="relative flex items-center">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setTestStatus('idle');
                  }}
                  placeholder={PROVIDERS[activeProvider].keyPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-white text-xs font-mono text-studio-text placeholder:text-studio-muted/50 focus:outline-hidden focus:ring-1 focus:ring-studio-accent pr-24"
                />
                
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 p-1 text-studio-muted hover:text-studio-text cursor-pointer"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[10px] text-studio-muted flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Key stored locally in encrypted browser storage. Never sent to any intermediary server.
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-emerald-100/60 text-emerald-900 text-xs font-medium flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>No API key required. This provider runs 100% locally on your Python FastAPI backend (http://127.0.0.1:8000).</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveKey}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-studio-accent text-white text-xs font-bold hover:bg-studio-accentHover transition-colors shadow-2xs cursor-pointer"
            >
              {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4 text-emerald-300" />}
              <span>{saveSuccess ? 'Saved to Device!' : 'Save Key'}</span>
            </button>

            <button
              type="button"
              onClick={handleTestKey}
              disabled={testStatus === 'testing'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-studio-border bg-white text-xs font-bold text-studio-text hover:bg-studio-bg transition-colors cursor-pointer"
            >
              <span>{testStatus === 'testing' ? 'Testing connection...' : 'Test Connection'}</span>
            </button>
          </div>

          {/* Test Result Message */}
          {testStatus !== 'idle' && (
            <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
              testStatus === 'valid'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : testStatus === 'invalid'
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-studio-bg border-studio-border text-studio-muted'
            }`}>
              {testStatus === 'valid' ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{testMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Local Storage & Cache Card */}
      <div className="p-6 rounded-2xl bg-white border border-studio-border shadow-2xs flex flex-col gap-4">
        <h3 className="text-sm font-bold text-studio-text uppercase tracking-wider">
          Storage & Reset
        </h3>
        <p className="text-xs text-studio-muted">
          Clear saved drafts, reset your point of view settings, or wipe your browser cache.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleClearCache}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-200 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
            <span>Clear Local Storage Cache</span>
          </button>
        </div>
      </div>

    </div>
  );
};


