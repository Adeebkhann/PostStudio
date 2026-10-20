import React from 'react';
import { Mic, MicOff, Sparkles, CornerDownLeft } from 'lucide-react';
import { ToneMode } from '../../types/studio';
import { TonePillSelector } from './TonePillSelector';
import { useSpeechToText } from '../../hooks/useSpeechToText';

interface ThoughtInputCardProps {
  thought: string;
  onChangeThought: (text: string) => void;
  tone: ToneMode;
  onSelectTone: (tone: ToneMode) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ThoughtInputCard: React.FC<ThoughtInputCardProps> = ({
  thought,
  onChangeThought,
  tone,
  onSelectTone,
  onGenerate,
  isGenerating
}) => {
  const { isListening, toggleListening, isSupported } = useSpeechToText((transcript) => {
    onChangeThought(thought ? `${thought} ${transcript}` : transcript);
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onGenerate();
    }
  };

  const charCount = thought.length;
  const maxChars = 500;

  return (
    <div className="p-6 md:p-7 rounded-xl bg-white border border-studio-border shadow-2xs flex flex-col gap-4 relative">
      {/* Top Header metadata */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-studio-text text-xs">
            01
          </span>
          <span className="font-bold tracking-wider text-studio-subtle text-[11px] uppercase">
            Start with you
          </span>
        </div>
        <span className="text-studio-subtle font-medium text-xs">
          A sentence is plenty
        </span>
      </div>

      {/* Card Title */}
      <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-studio-text">
        What’s on your mind today?
      </h2>

      {/* Input container matching screenshot */}
      <div className="relative flex flex-col rounded-xl border border-studio-border bg-white focus-within:border-studio-accent focus-within:ring-1 focus-within:ring-studio-accent transition-all">
        <textarea
          rows={3}
          maxLength={maxChars}
          value={thought}
          onChange={(e) => onChangeThought(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="artificial intelligence"
          className="w-full p-4 pb-2 bg-transparent resize-none text-base font-medium text-studio-text placeholder:text-studio-muted/50 focus:outline-none"
        />

        {/* Bottom bar inside text area */}
        <div className="flex items-center justify-between px-4 pb-3 pt-1">
          {/* Voice memo */}
          <div className="flex items-center gap-2">
            {isSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-studio-muted hover:text-studio-text hover:bg-studio-bg'
                }`}
                title={isListening ? 'Stop listening' : 'Voice dictation'}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isListening ? 'Listening...' : 'Voice memo'}</span>
              </button>
            )}
          </div>

          {/* Character counter */}
          <span className="text-xs font-mono text-studio-subtle">
            {charCount} / {maxChars}
          </span>
        </div>
      </div>

      {/* Helper text below input */}
      <p className="text-xs text-studio-subtle -mt-1">
        Your words are context. The AI is instructed not to invent personal stories.
      </p>

      {/* Dual Tone selector */}
      <div className="pt-2 border-t border-studio-border/60">
        <TonePillSelector currentTone={tone} onSelectTone={onSelectTone} />
      </div>

      {/* Primary Action Button */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-studio-subtle hidden sm:inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-studio-bg border border-studio-border text-[10px] font-mono text-studio-text">
            ⌘
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-studio-bg border border-studio-border text-[10px] font-mono text-studio-text">
            Enter
          </kbd>
          <span className="ml-1">to generate</span>
        </span>

        <button
          type="button"
          onClick={onGenerate}
          disabled={!thought.trim() || isGenerating}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm tracking-tight text-white transition-all shadow-2xs ${
            !thought.trim() || isGenerating
              ? 'bg-studio-muted/50 cursor-not-allowed opacity-70'
              : 'bg-studio-accent hover:bg-studio-accentHover active:scale-98 cursor-pointer'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Crafting human post...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Generate Post</span>
              <CornerDownLeft className="w-3.5 h-3.5 text-white/70 hidden sm:inline" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
