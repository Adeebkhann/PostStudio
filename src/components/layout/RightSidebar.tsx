import React from 'react';
import { StudioSettings } from '../../types/studio';

interface RightSidebarProps {
  settings: StudioSettings;
  onUpdateSettings: (updates: Partial<StudioSettings>) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  settings,
  onUpdateSettings
}) => {
  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6 pt-1 select-none">
      {/* A GOOD REMINDER CARD */}
      <div className="p-5 rounded-xl bg-studio-cardMuted border border-studio-border shadow-2xs flex flex-col gap-3">
        <span className="text-[11px] font-bold tracking-wider text-studio-subtle uppercase">
          A Good Reminder
        </span>

        {/* Large editorial quote symbol matching screenshot */}
        <div className="text-3xl font-serif text-[#8FA799] font-bold leading-none -mb-1">
          “
        </div>

        <p className="font-extrabold text-[15px] tracking-tight text-studio-text leading-snug">
          Useful beats impressive. Start with what you actually think.
        </p>

        <div className="w-8 h-[2px] bg-[#D2DDD0] rounded-full my-0.5" />

        <p className="text-xs leading-relaxed text-studio-muted">
          Generated copy is only a starting point. Review facts and add your perspective.
        </p>
      </div>
    </aside>
  );
};

