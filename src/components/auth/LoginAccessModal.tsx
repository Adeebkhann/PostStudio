import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Cpu, 
  Zap, 
  Terminal, 
  Brain, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  X
} from 'lucide-react';
import { AIProvider, UserAuthSession } from '../../types/studio';
import { aiProviderService, PROVIDERS } from '../../services/aiProviderService';

interface LoginAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: UserAuthSession) => void;
  currentSession: UserAuthSession | null;
  allowClose?: boolean;
}

export const LoginAccessModal: React.FC<LoginAccessModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentSession,
  allowClose = true
}) => {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('gemini');
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');
  const [pythonOnline, setPythonOnline] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const active = currentSession?.activeProvider || aiProviderService.getActiveProvider();
      setSelectedProvider(active);
      setApiKey(aiProviderService.getKeyForProvider(active));
      setUserName(currentSession?.userName || localStorage.getItem('poststudio_brand_name') || 'Creator');
      setUserRole(currentSession?.userRole || localStorage.getItem('poststudio_brand_title') || 'Senior Engineer & Creator');
      setTestStatus('idle');
      setTestMessage('');

      // Check Python backend
      fetch('http://127.0.0.1:8000/api/health')
        .then(r => r.json())
        .then(d => { if (d.status === 'online') setPythonOnline(true); })
        .catch(() => setPythonOnline(false));
    }
  }, [isOpen, currentSession]);

  if (!isOpen) return null;

  const handleSelectProvider = (providerId: AIProvider) => {
    setSelectedProvider(providerId);
    setApiKey(aiProviderService.getKeyForProvider(providerId));
    setTestStatus('idle');
    setTestMessage('');
  };

  const handleTestKey = async () => {
    setTestStatus('testing');
    setTestMessage('Validating connection...');

    const res = await aiProviderService.testProviderKey(selectedProvider, apiKey);
    if (res.valid) {
      setTestStatus('valid');
      setTestMessage(res.message);
    } else {
      setTestStatus('invalid');
      setTestMessage(res.message);
    }
  };

  const handleEnterStudio = () => {
    const cleanKey = apiKey.trim();
    if (selectedProvider !== 'python-local' && cleanKey) {
      aiProviderService.setKeyForProvider(selectedProvider, cleanKey);
    }

    const session: UserAuthSession = {
      isLoggedIn: true,
      userName: userName.trim() || 'Alex Vance',
      userRole: userRole.trim() || 'Software & AI Architect',
      activeProvider: selectedProvider,
      geminiApiKey: selectedProvider === 'gemini' ? cleanKey : aiProviderService.getKeyForProvider('gemini'),
      openaiApiKey: selectedProvider === 'openai' ? cleanKey : aiProviderService.getKeyForProvider('openai'),
      anthropicApiKey: selectedProvider === 'anthropic' ? cleanKey : aiProviderService.getKeyForProvider('anthropic'),
      groqApiKey: selectedProvider === 'groq' ? cleanKey : aiProviderService.getKeyForProvider('groq'),
      savedAt: Date.now()
    };

    aiProviderService.saveAuthSession(session);
    if (userName.trim()) localStorage.setItem('poststudio_brand_name', userName.trim());
    if (userRole.trim()) localStorage.setItem('poststudio_brand_title', userRole.trim());

    onSuccess(session);
    onClose();
  };

  const handleGuestAccess = () => {
    const session: UserAuthSession = {
      isLoggedIn: true,
      userName: 'Guest Creator',
      userRole: 'Developer & Creator',
      activeProvider: 'python-local',
      savedAt: Date.now()
    };
    aiProviderService.saveAuthSession(session);
    onSuccess(session);
    onClose();
  };

  const currentProviderMeta = PROVIDERS[selectedProvider];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-studio-border overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 pt-7 pb-5 bg-gradient-to-r from-emerald-950 via-[#1F322C] to-zinc-900 text-white flex items-start justify-between relative overflow-hidden">
          <div className="flex flex-col gap-1 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
                POSTSTUDIO ● MULTI-PROVIDER ACCESS GATEWAY
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              Connect Your AI Engine
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 font-normal mt-0.5">
              Enter your own API key or run 100% locally with Python. Your keys stay securely on your device.
            </p>
          </div>

          {allowClose && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors relative z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Decorative background glow */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex flex-col gap-6 overflow-y-auto">
          
          {/* User Profile Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-studio-borderLight">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-studio-muted">
                Your Name / Handle
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Alex Vance (@alexvance)"
                className="w-full text-xs font-semibold px-3 py-2 bg-white rounded-lg border border-studio-border focus:outline-hidden focus:ring-1 focus:ring-studio-accent"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-studio-muted">
                Your Role / Specialty
              </label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                placeholder="e.g. Senior Python Developer"
                className="w-full text-xs font-semibold px-3 py-2 bg-white rounded-lg border border-studio-border focus:outline-hidden focus:ring-1 focus:ring-studio-accent"
              />
            </div>
          </div>

          {/* Choose AI Provider */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-studio-text flex items-center justify-between">
              <span>Choose Your AI Provider</span>
              <span className="text-[11px] text-emerald-700 font-bold lowercase">
                {selectedProvider === 'python-local' ? '100% offline ready' : 'custom key required'}
              </span>
            </label>

            {/* Provider Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              
              {/* 1. Google Gemini */}
              <button
                type="button"
                onClick={() => handleSelectProvider('gemini')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  selectedProvider === 'gemini'
                    ? 'border-emerald-700 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-700'
                    : 'border-studio-border hover:border-studio-borderLight bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-extrabold text-studio-text">Google Gemini</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    POPULAR
                  </span>
                </div>
                <p className="text-[11px] text-studio-muted line-clamp-2">
                  Gemini 1.5 Flash & 2.0 with dynamic model discovery.
                </p>
              </button>

              {/* 2. OpenAI */}
              <button
                type="button"
                onClick={() => handleSelectProvider('openai')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  selectedProvider === 'openai'
                    ? 'border-emerald-700 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-700'
                    : 'border-studio-border hover:border-studio-borderLight bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-extrabold text-studio-text">OpenAI GPT-4o</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                    GPT-4o
                  </span>
                </div>
                <p className="text-[11px] text-studio-muted line-clamp-2">
                  Direct GPT-4o & GPT-4o-mini structured intelligence.
                </p>
              </button>

              {/* 3. Anthropic Claude */}
              <button
                type="button"
                onClick={() => handleSelectProvider('anthropic')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  selectedProvider === 'anthropic'
                    ? 'border-emerald-700 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-700'
                    : 'border-studio-border hover:border-studio-borderLight bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-extrabold text-studio-text">Anthropic Claude</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    SONNET
                  </span>
                </div>
                <p className="text-[11px] text-studio-muted line-clamp-2">
                  Claude 3.5 Sonnet nuanced long-form cadence.
                </p>
              </button>

              {/* 4. Groq Cloud */}
              <button
                type="button"
                onClick={() => handleSelectProvider('groq')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  selectedProvider === 'groq'
                    ? 'border-emerald-700 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-700'
                    : 'border-studio-border hover:border-studio-borderLight bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-extrabold text-studio-text">Groq Cloud</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
                    500+ TOK/S
                  </span>
                </div>
                <p className="text-[11px] text-studio-muted line-clamp-2">
                  Ultra-fast free inference on Llama 3.3 70B.
                </p>
              </button>

              {/* 5. Python Multi-Agent Core */}
              <button
                type="button"
                onClick={() => handleSelectProvider('python-local')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 sm:col-span-2 ${
                  selectedProvider === 'python-local'
                    ? 'border-emerald-700 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-700'
                    : 'border-studio-border hover:border-studio-borderLight bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-extrabold text-studio-text">Python Multi-Agent Core</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {pythonOnline ? 'ONLINE (127.0.0.1:8000)' : 'NO API KEY NEEDED'}
                  </span>
                </div>
                <p className="text-[11px] text-studio-muted">
                  Runs directly on your local Python FastAPI engine with multi-cadence anti-AI synthesis. 100% free and offline.
                </p>
              </button>

            </div>
          </div>

          {/* API Key Input Section (if requiresKey) */}
          {currentProviderMeta.requiresKey ? (
            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-zinc-50 border border-studio-border">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-studio-text flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-studio-accent" />
                  <span>Enter Your {currentProviderMeta.name} API Key</span>
                </label>

                {currentProviderMeta.keyHelpUrl && (
                  <a
                    href={currentProviderMeta.keyHelpUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
                  >
                    <span>Get Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setTestStatus('idle');
                  }}
                  placeholder={currentProviderMeta.keyPlaceholder}
                  className="w-full text-xs font-mono px-3.5 py-2.5 pr-20 bg-white rounded-xl border border-studio-border focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-studio-muted hover:text-studio-text p-1 cursor-pointer"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-studio-muted flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Keys are stored exclusively in your browser's encrypted localStorage
                </span>

                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={testStatus === 'testing' || !apiKey.trim()}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-studio-border hover:bg-zinc-100 text-studio-text transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {testStatus === 'testing' ? 'Testing...' : 'Test Key'}
                </button>
              </div>

              {/* Status Message */}
              {testStatus !== 'idle' && (
                <div
                  className={`mt-2 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    testStatus === 'valid'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : testStatus === 'invalid'
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {testStatus === 'valid' && <Check className="w-4 h-4 shrink-0 text-emerald-600" />}
                  {testStatus === 'invalid' && <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
                  <span>{testMessage}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-emerald-900">Python Multi-Agent Engine Active</span>
                <p className="text-[11px] text-emerald-800">
                  No API key required! You are running the 100% local Python NLP pipeline and semantic synthesis engine with zero token limits or latency.
                </p>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleGuestAccess}
              className="w-full sm:w-auto text-xs font-bold text-studio-muted hover:text-studio-text transition-colors py-2 cursor-pointer"
            >
              Skip / Continue as Guest (Python Local)
            </button>

            <button
              type="button"
              onClick={handleEnterStudio}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enter Post Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

