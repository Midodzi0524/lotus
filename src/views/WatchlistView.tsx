import React, { useState } from 'react';
import { Plus, Trash2, Eye, Bell } from 'lucide-react';

interface WatchlistViewProps {
  watchlist: string[];
  onAddKeyword: (kw: string) => void;
  onRemoveKeyword: (kw: string) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  watchlist,
  onAddKeyword,
  onRemoveKeyword,
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onAddKeyword(inputVal.trim());
      setInputVal('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] mb-2 block">
          ENTITY MONITORING
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#16231f] dark:text-[#ece6d8] mb-3">
          Custom Keyword Watchlist
        </h1>
        <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] max-w-lg mx-auto">
          Follow specific competitors, companies, or emerging terms. Stories matching these keywords highlight automatically.
        </p>
      </div>

      {/* Add Keyword Form */}
      <form onSubmit={handleSubmit} className="mb-8 max-w-md mx-auto flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="e.g. Stripe, SEPA, battery, AI agent..."
          className="flex-1 px-4 py-2 rounded-[8px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] text-sm text-[#16231f] dark:text-[#ece6d8] placeholder:text-[#6b6a5f]/70 outline-none focus:border-[#e2522b] dark:focus:border-[#f2916f]"
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="px-4 py-2 rounded bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] text-xs font-mono font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Watchlist Chips */}
      <div className="rounded-[12px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] p-6 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[#6b6a5f] dark:text-[#a3b0a9] pb-2 border-b border-[#ddd5c4]/60 dark:border-[#2a3a34]/60">
          <span>Active Terms ({watchlist.length})</span>
          <span>Stored privately on device</span>
        </div>

        {watchlist.length === 0 ? (
          <div className="py-12 text-center text-[#6b6a5f] dark:text-[#a3b0a9] font-mono text-sm">
            No keywords added yet. Add company names or concepts above to track them.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-2">
            {watchlist.map(kw => (
              <span
                key={kw}
                className="px-3 py-1.5 rounded-full bg-[#efe6d6]/60 dark:bg-[#1f2f29] border border-[#ddd5c4] dark:border-[#2a3a34] text-xs font-mono text-[#16231f] dark:text-[#ece6d8] flex items-center gap-2 group"
              >
                <Eye className="w-3.5 h-3.5 text-[#e2522b] dark:text-[#f2916f]" />
                <span className="font-semibold">{kw}</span>
                <button
                  type="button"
                  onClick={() => onRemoveKeyword(kw)}
                  className="hover:text-rose-600 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
