import React from 'react';
import { GeneratedPost } from '../../types/studio';
import { Copy, Trash2, Calendar, Sparkles } from 'lucide-react';
import { storageAdapter } from '../../services/storageAdapter';

interface DraftsViewProps {
  drafts: GeneratedPost[];
  onSelectDraft: (post: GeneratedPost) => void;
  onDeleteDraft: (id: string) => void;
}

export const DraftsView: React.FC<DraftsViewProps> = ({
  drafts,
  onSelectDraft,
  onDeleteDraft
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = async (e: React.MouseEvent, post: GeneratedPost) => {
    e.stopPropagation();
    await storageAdapter.copyToClipboard(post.copy);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteDraft(id);
  };

  if (drafts.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-studio-card border border-studio-border/90 text-center flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center text-sage-700">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="font-extrabold text-lg text-studio-text">No Saved Drafts Yet</h3>
        <p className="text-xs text-studio-muted max-w-sm">
          When you generate a post that you like, click "Save to Drafts" to keep it stored right here on your device.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-xl text-studio-text">
          Saved Post Drafts ({drafts.length})
        </h3>
        <span className="text-xs text-studio-muted">
          Stored securely in local browser storage
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {drafts.map((draft) => (
          <div
            key={draft.id}
            onClick={() => onSelectDraft(draft)}
            className="p-5 rounded-2xl bg-studio-card border border-studio-border/90 hover:border-sage-400 hover:shadow-xs transition-all cursor-pointer flex flex-col gap-3 group"
          >
            <div className="flex items-center justify-between text-xs text-studio-muted border-b border-studio-border/50 pb-2.5">
              <span className="flex items-center gap-1 font-semibold text-sage-800">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(draft.createdAt).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleCopy(e, draft)}
                  className="p-1.5 rounded-lg hover:bg-sage-100 text-studio-muted hover:text-studio-text transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4 text-sage-700" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, draft.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-studio-muted hover:text-red-600 transition-colors"
                  title="Delete draft"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              {draft.imageUrl && (
                <img
                  src={draft.imageUrl}
                  alt={draft.imageAlt}
                  className="w-24 h-16 rounded-lg object-cover shrink-0 border border-studio-border"
                />
              )}
              <div className="flex flex-col gap-1 overflow-hidden">
                <h4 className="font-bold text-sm text-studio-text truncate">
                  "{draft.thought}"
                </h4>
                <p className="text-xs text-studio-muted line-clamp-2 leading-relaxed">
                  {draft.copy}
                </p>
              </div>
            </div>

            {copiedId === draft.id && (
              <span className="text-[11px] font-bold text-emerald-600">
                ✓ Copied post text to clipboard!
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

