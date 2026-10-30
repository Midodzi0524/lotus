import React, { useState, useEffect } from 'react';
import { Sun, Moon, MoreHorizontal, Search, Bookmark, HelpCircle, Globe } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, params?: Record<string, string>) => void;
  mode: 'browse' | 'read';
  onToggleMode: (mode: 'browse' | 'read') => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenHelp: () => void;
  onOpenSearchGrounding?: (query: string, entityName: string) => void;
  readingProgress: number; // 0 to 100
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  mode,
  onToggleMode,
  isDark,
  onToggleTheme,
  onOpenHelp,
  onOpenSearchGrounding,
  readingProgress,
}) => {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleDocClick = () => setMoreMenuOpen(false);
    if (moreMenuOpen) {
      window.addEventListener('click', handleDocClick);
      return () => window.removeEventListener('click', handleDocClick);
    }
  }, [moreMenuOpen]);

  return (
    <>
      {/* 2px Cocoa Reading Progress line */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-[#e2522b] dark:bg-[#f2916f] z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />

      <header className="sticky top-0 z-40 bg-[#f5f0e7]/90 dark:bg-[#0f1a17]/90 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Wordmark: Lotus in serif with small cocoa dot */}
          <button
            type="button"
            onClick={() => onNavigate('today')}
            className="flex items-center gap-1.5 group text-left cursor-pointer outline-none"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-[#16231f] dark:text-[#ece6d8] group-hover:opacity-85 transition-opacity">
              Lotus
            </span>
            <span className="w-2 h-2 rounded-full bg-[#e2522b] dark:bg-[#f2916f] inline-block mb-1 group-hover:scale-125 transition-transform" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#6b6a5f] dark:text-[#a3b0a9] hidden sm:inline ml-2 pl-2 border-l border-[#ddd5c4] dark:border-[#2a3a34]">
              Daily Brief
            </span>
          </button>

          {/* Primary Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#6b6a5f] dark:text-[#a3b0a9]">
            <button
              type="button"
              onClick={() => onNavigate('today')}
              className={`hover:text-[#16231f] dark:hover:text-[#ece6d8] transition-colors ${
                currentView === 'today' ? 'text-[#e2522b] dark:text-[#f2916f] font-semibold' : ''
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => onNavigate('archive')}
              className={`hover:text-[#16231f] dark:hover:text-[#ece6d8] transition-colors ${
                currentView === 'archive' ? 'text-[#e2522b] dark:text-[#f2916f] font-semibold' : ''
              }`}
            >
              Archive
            </button>
            <button
              type="button"
              onClick={() => onNavigate('search')}
              className={`hover:text-[#16231f] dark:hover:text-[#ece6d8] transition-colors flex items-center gap-1.5 ${
                currentView === 'search' ? 'text-[#e2522b] dark:text-[#f2916f] font-semibold' : ''
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('jobs')}
              className={`hover:text-[#16231f] dark:hover:text-[#ece6d8] transition-colors ${
                currentView === 'jobs' ? 'text-[#e2522b] dark:text-[#f2916f] font-semibold' : ''
              }`}
            >
              Jobs
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Browse / Read Toggle */}
            <div className="hidden sm:inline-flex rounded border border-[#ddd5c4] dark:border-[#2a3a34] p-0.5 bg-[#fbf8f1] dark:bg-[#17241f] text-xs font-mono">
              <button
                type="button"
                onClick={() => onToggleMode('browse')}
                className={`px-2.5 py-1 rounded transition-all ${
                  mode === 'browse'
                    ? 'bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] font-semibold'
                    : 'text-[#6b6a5f] dark:text-[#a3b0a9]'
                }`}
              >
                Browse
              </button>
              <button
                type="button"
                onClick={() => onToggleMode('read')}
                className={`px-2.5 py-1 rounded transition-all ${
                  mode === 'read'
                    ? 'bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] font-semibold'
                    : 'text-[#6b6a5f] dark:text-[#a3b0a9]'
                }`}
              >
                Full summaries
              </button>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded hover:bg-[#fbf8f1] dark:hover:bg-[#17241f] text-[#6b6a5f] dark:text-[#a3b0a9] transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick Saved link */}
            <button
              type="button"
              onClick={() => onNavigate('saved')}
              title="Saved items"
              className="p-2 rounded hover:bg-[#fbf8f1] dark:hover:bg-[#17241f] text-[#6b6a5f] dark:text-[#a3b0a9] transition-colors relative"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Google Search Grounding Trigger */}
            {onOpenSearchGrounding && (
              <button
                type="button"
                onClick={() => onOpenSearchGrounding('', '')}
                title="Google Search Grounding (gemini-3.8-flash)"
                className="p-2 rounded hover:bg-[#fbf8f1] dark:hover:bg-[#17241f] text-[#6b6a5f] dark:text-[#a3b0a9] hover:text-[#e2522b] dark:hover:text-[#f2916f] transition-colors"
              >
                <Globe className="w-4 h-4" />
              </button>
            )}

            {/* Keyboard Shortcuts (?) */}
            <button
              type="button"
              onClick={onOpenHelp}
              title="Keyboard shortcuts (?)"
              className="hidden lg:block p-2 rounded hover:bg-[#fbf8f1] dark:hover:bg-[#17241f] text-[#6b6a5f] dark:text-[#a3b0a9] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* More Menu Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setMoreMenuOpen(!moreMenuOpen);
                }}
                title="More pages & tools"
                className="p-2 rounded hover:bg-[#fbf8f1] dark:hover:bg-[#17241f] text-[#6b6a5f] dark:text-[#a3b0a9] transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {moreMenuOpen && (
                <div
                  onClick={e => e.stopPropagation()}
                  className="absolute right-0 mt-2 w-56 rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] shadow-lg py-2 text-xs font-mono z-50 divide-y divide-[#ddd5c4]/40 dark:divide-[#2a3a34]/40"
                >
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('today');
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#efe6d6]/30 dark:hover:bg-[#1f2f29] text-[#16231f] dark:text-[#ece6d8]"
                    >
                      Today's Brief
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('archive');
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#efe6d6]/30 dark:hover:bg-[#1f2f29] text-[#16231f] dark:text-[#ece6d8]"
                    >
                      Archive & Editions
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('search');
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#efe6d6]/30 dark:hover:bg-[#1f2f29] text-[#16231f] dark:text-[#ece6d8]"
                    >
                      Search Intelligence
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('jobs');
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#efe6d6]/30 dark:hover:bg-[#1f2f29] text-[#16231f] dark:text-[#ece6d8]"
                    >
                      Jobs
                    </button>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('companies');
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#efe6d6]/30 dark:hover:bg-[#1f2f29] text-[#16231f] dark:text-[#ece6d8]"
                    >
                      Companies Directory
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('funding');
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#efe6d6]/30 dark:hover:bg-[#1f2f29] text-[#16231f] dark:text-[#ece6d8]"
                    >
                      Funding Deals & CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('trends');
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#efe6d6]/30 dark:hover:bg-[#1f2f29] text-[#16231f] dark:text-[#ece6d8]"
                    >
                      Tracked Trends
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('glossary');
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#efe6d6]/30 dark:hover:bg-[#1f2f29] text-[#16231f] dark:text-[#ece6d8]"
                    >
                      Jargon Glossary
                    </button>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('saved');
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#efe6d6]/30 dark:hover:bg-[#1f2f29] text-[#16231f] dark:text-[#ece6d8]"
                    >
                      Saved Items & Notes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('watchlist');
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#efe6d6]/30 dark:hover:bg-[#1f2f29] text-[#16231f] dark:text-[#ece6d8]"
                    >
                      Entity Watchlist
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('settings');
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#efe6d6]/30 dark:hover:bg-[#1f2f29] text-[#16231f] dark:text-[#ece6d8]"
                    >
                      Settings & Device Data
                    </button>
                  </div>

                  <div className="py-1">
                    {onOpenSearchGrounding && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenSearchGrounding('', '');
                          setMoreMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-1.5 hover:bg-[#efe6d6]/30 dark:hover:bg-[#1f2f29] text-[#e2522b] dark:text-[#f2916f] font-semibold flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5" />
                          <span>Google Search Grounding</span>
                        </span>
                        <span className="text-[10px] bg-[#efe6d6] dark:bg-[#1f2f29] px-1.5 py-0.2 rounded font-mono">LIVE</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('pipeline');
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#efe6d6]/30 dark:hover:bg-[#1f2f29] text-[#e2522b] dark:text-[#f2916f] font-semibold"
                    >
                      Pipeline Diagnostic / Runner
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('about');
                        setMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#efe6d6]/30 dark:hover:bg-[#1f2f29] text-[#16231f] dark:text-[#ece6d8]"
                    >
                      About & Methodology
                    </button>
                    <a
                      href="/feed.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-1.5 hover:bg-[#efe6d6]/30 dark:hover:bg-[#1f2f29] text-[#16231f] dark:text-[#ece6d8]"
                    >
                      RSS / Atom Feed ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
