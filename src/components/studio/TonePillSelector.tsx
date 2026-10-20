import React from 'react';
import { ToneMode } from '../../types/studio';

interface TonePillSelectorProps {
  currentTone: ToneMode;
  onSelectTone: (tone: ToneMode) => void;
}

const TONES: { id: ToneMode; label: string; icon: string }[] = [
  { id: 'auto', label: 'Auto (by role)', icon: '⚡' },
  { id: 'contrarian', label: 'Contrarian Hot Take', icon: '🔥' },
  { id: 'story', label: 'Vulnerable Story', icon: '📖' },
  { id: 'tactical', label: 'Tactical Breakdown', icon: '🛠️' },
  { id: 'observation', label: 'Quiet Observation', icon: '💡' }
];

export const TonePillSelector: React.FC<TonePillSelectorProps> = ({
  currentTone,
  onSelectTone
}) => {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[11px] font-bold text-studio-muted mr-1 uppercase tracking-wider">
        Tone:
      </span>
      {TONES.map((t) => {
        const isActive = currentTone === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectTone(t.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
              isActive
                ? 'bg-studio-text text-white border-studio-text shadow-sm ring-1 ring-studio-text'
                : 'bg-studio-bg/80 text-studio-muted hover:text-studio-text hover:bg-studio-activePill border-studio-border/70'
            }`}
          >
            <span className="text-sm">{t.icon}</span>
            <span className={isActive ? 'text-white font-bold' : ''}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

