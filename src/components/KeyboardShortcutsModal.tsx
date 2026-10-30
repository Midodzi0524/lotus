import React from 'react';
import { X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'j', description: 'Next story card' },
    { key: 'k', description: 'Previous story card' },
    { key: 'Enter / Space', description: 'Expand or collapse highlighted card' },
    { key: 's', description: 'Bookmark / save highlighted story' },
    { key: 'o', description: 'Open primary source article in new tab' },
    { key: '/', description: 'Focus search input' },
    { key: 'b', description: 'Show headlines only' },
    { key: 'r', description: 'Show full summaries' },
    { key: '?', description: 'Show this keyboard shortcuts guide' },
    { key: 'Esc', description: 'Close dialog / dismiss focus' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-[12px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] shadow-2xl p-6 text-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#ddd5c4] dark:border-[#2a3a34] mb-4">
          <h3 className="font-serif font-bold text-lg text-[#16231f] dark:text-[#ece6d8]">
            Keyboard Shortcuts
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-[#efe6d6]/50 dark:hover:bg-[#1f2f29] text-[#6b6a5f] dark:text-[#a3b0a9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {shortcuts.map(sc => (
            <div key={sc.key} className="flex items-center justify-between py-1">
              <span className="text-[#6b6a5f] dark:text-[#a3b0a9] font-sans text-sm">
                {sc.description}
              </span>
              <kbd className="px-2 py-1 rounded bg-[#efe6d6]/60 dark:bg-[#1f2f29] border border-[#ddd5c4] dark:border-[#2a3a34] text-[#e2522b] dark:text-[#f2916f] font-semibold text-[11px]">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#ddd5c4] dark:border-[#2a3a34] text-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] font-medium text-xs font-mono"
          >
            Got it (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
