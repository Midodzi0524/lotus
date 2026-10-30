import React from 'react';
import { Settings, Sun, Moon, Monitor, Trash2 } from 'lucide-react';

interface SettingsViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
  defaultMode: 'browse' | 'read';
  onSetDefaultMode: (mode: 'browse' | 'read') => void;
  fontSize: 'standard' | 'relaxed' | 'large';
  onSetFontSize: (size: 'standard' | 'relaxed' | 'large') => void;
  onClearStorage: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDark,
  onToggleTheme,
  defaultMode,
  onSetDefaultMode,
  fontSize,
  onSetFontSize,
  onClearStorage,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] mb-2 block">
          PREFERENCES
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#16231f] dark:text-[#ece6d8] mb-3">
          Reader Settings
        </h1>
        <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] max-w-lg mx-auto">
          Personalize your layout, typography, and local device preferences. All values persist offline.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Theme */}
        <div className="p-6 rounded-[12px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#16231f] dark:text-[#ece6d8] mb-1">
              Color Palette Theme
            </h3>
            <p className="text-xs text-[#6b6a5f] dark:text-[#a3b0a9]">
              Switch between warm cream paper and rich espresso night mode.
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className="px-4 py-2 rounded bg-[#f5f0e7] dark:bg-[#0f1a17] border border-[#ddd5c4] dark:border-[#2a3a34] text-xs font-mono text-[#16231f] dark:text-[#ece6d8] flex items-center gap-2 hover:border-[#e2522b] transition-colors self-start sm:self-auto"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#f2916f]" /> : <Moon className="w-4 h-4 text-[#e2522b]" />}
            <span>{isDark ? 'Espresso (Dark)' : 'Warm Cream (Light)'}</span>
          </button>
        </div>

        {/* Default View Mode */}
        <div className="p-6 rounded-[12px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#16231f] dark:text-[#ece6d8] mb-1">
              Default Reading Mode
            </h3>
            <p className="text-xs text-[#6b6a5f] dark:text-[#a3b0a9]">
              Choose whether editions load in fast Browse view (2 min) or expanded Read view (10 min).
            </p>
          </div>

          <div className="inline-flex rounded border border-[#ddd5c4] dark:border-[#2a3a34] p-0.5 bg-[#f5f0e7] dark:bg-[#0f1a17] text-xs font-mono self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onSetDefaultMode('browse')}
              className={`px-3 py-1.5 rounded transition-all ${
                defaultMode === 'browse'
                  ? 'bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] font-semibold'
                  : 'text-[#6b6a5f] dark:text-[#a3b0a9]'
              }`}
            >
              Browse (2m)
            </button>
            <button
              type="button"
              onClick={() => onSetDefaultMode('read')}
              className={`px-3 py-1.5 rounded transition-all ${
                defaultMode === 'read'
                  ? 'bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] font-semibold'
                  : 'text-[#6b6a5f] dark:text-[#a3b0a9]'
              }`}
            >
              Read (10m)
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div className="p-6 rounded-[12px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#16231f] dark:text-[#ece6d8] mb-1">
              Reading Typography Scale
            </h3>
            <p className="text-xs text-[#6b6a5f] dark:text-[#a3b0a9]">
              Adjust editorial body font sizing for long-form comfort.
            </p>
          </div>

          <div className="inline-flex rounded border border-[#ddd5c4] dark:border-[#2a3a34] p-0.5 bg-[#f5f0e7] dark:bg-[#0f1a17] text-xs font-mono self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onSetFontSize('standard')}
              className={`px-3 py-1.5 rounded transition-all ${
                fontSize === 'standard'
                  ? 'bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] font-semibold'
                  : 'text-[#6b6a5f] dark:text-[#a3b0a9]'
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => onSetFontSize('relaxed')}
              className={`px-3 py-1.5 rounded transition-all ${
                fontSize === 'relaxed'
                  ? 'bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] font-semibold'
                  : 'text-[#6b6a5f] dark:text-[#a3b0a9]'
              }`}
            >
              Relaxed
            </button>
            <button
              type="button"
              onClick={() => onSetFontSize('large')}
              className={`px-3 py-1.5 rounded transition-all ${
                fontSize === 'large'
                  ? 'bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] font-semibold'
                  : 'text-[#6b6a5f] dark:text-[#a3b0a9]'
              }`}
            >
              Large
            </button>
          </div>
        </div>

        {/* Clear Local Data */}
        <div className="p-6 rounded-[12px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-rose-700 dark:text-rose-400 mb-1">
              Reset Local Storage
            </h3>
            <p className="text-xs text-[#6b6a5f] dark:text-[#a3b0a9]">
              Clears saved bookmarks, read history, and custom keyword watchlists from this browser.
            </p>
          </div>

          <button
            type="button"
            onClick={onClearStorage}
            className="px-4 py-2 rounded bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-mono font-semibold hover:bg-rose-100 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset All Local Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
