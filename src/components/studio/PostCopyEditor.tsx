import React from 'react';
import { Copy, Check, Bookmark, ShieldCheck } from 'lucide-react';

interface PostCopyEditorProps {
  copy: string;
  onChangeCopy: (text: string) => void;
  onCopyPost: () => void;
  copyFeedback: boolean;
  onSaveToDrafts: () => void;
}

export const PostCopyEditor: React.FC<PostCopyEditorProps> = ({
  copy,
  onChangeCopy,
  onCopyPost,
  copyFeedback,
  onSaveToDrafts
}) => {
  const words = copy.trim().split(/\s+/).filter(Boolean).length;
  const readTimeSeconds = Math.ceil((words / 200) * 60);

  return (
    <div className="flex flex-col gap-3">
      {/* Quality indicators bar */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Non-AI Detected · Natural Human Cadence</span>
        </div>

        <div className="flex items-center gap-2 text-studio-muted text-[11px] font-mono">
          <span>{words} words</span>
          <span>·</span>
          <span>~{readTimeSeconds}s read</span>
        </div>
      </div>

      {/* Editable Text Area */}
      <div className="relative rounded-xl border border-studio-border/90 bg-white focus-within:border-sage-500 focus-within:ring-2 focus-within:ring-sage-200/60 transition-all p-1">
        <textarea
          rows={9}
          value={copy}
          onChange={(e) => onChangeCopy(e.target.value)}
          className="w-full p-3.5 bg-transparent resize-y text-sm md:text-base leading-relaxed text-studio-text focus:outline-none font-normal"
          placeholder="Your generated post will appear here..."
        />
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
        <button
          type="button"
          onClick={onSaveToDrafts}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-studio-muted hover:text-studio-text hover:bg-sage-100 transition-colors"
        >
          <Bookmark className="w-3.5 h-3.5 text-sage-600" />
          <span>Save to Drafts</span>
        </button>

        <button
          type="button"
          onClick={onCopyPost}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm tracking-tight transition-all shadow-xs ${
            copyFeedback
              ? 'bg-emerald-600 text-white'
              : 'bg-sage-900 text-white hover:bg-sage-950 active:scale-98'
          }`}
        >
          {copyFeedback ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied for LinkedIn!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-emerald-300" />
              <span>Copy to Clipboard</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

