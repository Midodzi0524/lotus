import React, { useState } from 'react';
import { Item } from '../types/index.ts';
import { ItemCard } from '../components/ItemCard.tsx';
import { Bookmark, Download, Upload, Trash2 } from 'lucide-react';

interface SavedViewProps {
  savedItems: Item[];
  onToggleSave: (item: Item) => void;
  onClearAll: () => void;
  onImportItems: (items: Item[]) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedItems,
  onToggleSave,
  onClearAll,
  onImportItems,
}) => {
  const [importError, setImportError] = useState<string | null>(null);

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lotus-saved-bookmarks-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportItems(parsed);
          setImportError(null);
        } else {
          setImportError('Invalid format: JSON file must contain an array of items.');
        }
      } catch (err) {
        setImportError('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] mb-2 block">
          LOCAL DEVICE STORAGE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#16231f] dark:text-[#ece6d8] mb-3">
          Saved Bookmarks & Notes
        </h1>
        <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] max-w-lg mx-auto">
          Private to your browser. Stored offline in localStorage with zero tracking and full export capability.
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#ddd5c4] dark:border-[#2a3a34] text-xs font-mono">
        <span className="text-[#6b6a5f] dark:text-[#a3b0a9]">
          {savedItems.length} item{savedItems.length === 1 ? '' : 's'} saved
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExport}
            disabled={savedItems.length === 0}
            className="px-3 py-1.5 rounded bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] hover:border-[#e2522b] text-[#16231f] dark:text-[#ece6d8] flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-[#e2522b] dark:text-[#f2916f]" />
            <span>Export JSON</span>
          </button>

          <label className="px-3 py-1.5 rounded bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] hover:border-[#e2522b] text-[#16231f] dark:text-[#ece6d8] flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-[#e2522b] dark:text-[#f2916f]" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {savedItems.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-3 py-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 border border-transparent hover:border-rose-300 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          )}
        </div>
      </div>

      {importError && (
        <div className="mb-6 p-3 rounded bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-mono">
          {importError}
        </div>
      )}

      {/* Items List */}
      {savedItems.length === 0 ? (
        <div className="py-20 text-center text-[#6b6a5f] dark:text-[#a3b0a9] font-mono text-sm border border-dashed border-[#ddd5c4] dark:border-[#2a3a34] rounded-[12px] space-y-3">
          <Bookmark className="w-8 h-8 mx-auto opacity-40 text-[#e2522b] dark:text-[#f2916f]" />
          <p>No saved stories yet.</p>
          <p className="text-xs text-[#6b6a5f]/75">
            Click the bookmark icon on any card or press <kbd className="px-1.5 py-0.5 rounded bg-[#efe6d6] text-[#e2522b]">s</kbd> while browsing to save stories for later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {savedItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              isExpandedGlobal={true}
              onToggleSave={onToggleSave}
              isSaved={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
