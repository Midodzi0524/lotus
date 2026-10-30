import React, { useState, useEffect, useMemo, useRef } from 'react';
import editionsIndex from '../data/index.json';
const editionLoaders = import.meta.glob('../data/editions/*.json', { import: 'default' }) as Record<string, () => Promise<Edition>>;
const DATES = Object.keys(editionLoaders).map(k => k.match(/\d{4}-\d{2}-\d{2}/)![0]).sort().reverse();
const LATEST = DATES.find(d => !(editionsIndex as any[]).find(e => e.date === d)?.isDemo) ?? DATES[0];
const loadEd = (d: string) => editionLoaders[`../data/editions/${d}.json`]();
import { Edition, Item } from './types/index.ts';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { Masthead } from './components/Masthead.tsx';
import { TopThree } from './components/TopThree.tsx';
import { Spotlight } from './components/Spotlight.tsx';
import { SectorGrid } from './components/SectorGrid.tsx';
import { FundingList } from './components/FundingList.tsx';
import { RisingCards } from './components/RisingCards.tsx';
import { AfricaSection } from './components/AfricaSection.tsx';
import { GhanaSection } from './components/GhanaSection.tsx';
import { BankLens } from './components/BankLens.tsx';
import { QuickLinks } from './components/QuickLinks.tsx';
import { SourceStatus } from './components/SourceStatus.tsx';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal.tsx';
import { useScrollReveal } from './components/Motion.tsx';
import { SearchGroundingModal } from './components/SearchGroundingModal.tsx';

// Views
import { ArchiveView } from './views/ArchiveView.tsx';
import { SearchView } from './views/SearchView.tsx';
import { CompaniesView } from './views/CompaniesView.tsx';
import { FundingView } from './views/FundingView.tsx';
import { JobsView } from './views/JobsView.tsx';
import { TrendsView } from './views/TrendsView.tsx';
import { SavedView } from './views/SavedView.tsx';
import { WatchlistView } from './views/WatchlistView.tsx';
import { GlossaryView } from './views/GlossaryView.tsx';
import { SettingsView } from './views/SettingsView.tsx';
import { AboutView } from './views/AboutView.tsx';
import { WeeklyView } from './views/WeeklyView.tsx';
import { PipelineView } from './views/PipelineView.tsx';

function AppInner({ initial }: { initial: Edition }) {
  const [currentView, setCurrentView] = useState<string>('today');
  const [edition, setEdition] = useState<Edition>(initial);
  const [mode, setMode] = useState<'browse' | 'read'>('browse');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'standard' | 'relaxed' | 'large'>('standard');
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Search Grounding modal state
  const [isGroundingOpen, setIsGroundingOpen] = useState<boolean>(false);
  const [groundingQuery, setGroundingQuery] = useState<string>('');
  const [groundingEntity, setGroundingEntity] = useState<string>('');

  const handleOpenSearchGrounding = (query: string = '', entityName: string = '') => {
    setGroundingQuery(query);
    setGroundingEntity(entityName);
    setIsGroundingOpen(true);
  };

  // Local storage state
  const [savedItems, setSavedItems] = useState<Item[]>(() => {
    try {
      const stored = localStorage.getItem('lotus_saved_items');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [readItemIds, setReadItemIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('lotus_read_ids');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('lotus_watchlist');
      return stored ? JSON.parse(stored) : ['Stripe', 'SEPA', 'Battery', 'AI Agent'];
    } catch {
      return ['Stripe', 'SEPA', 'Battery', 'AI Agent'];
    }
  });

  useScrollReveal(currentView + edition.date);

  const savedItemIds = useMemo(() => new Set(savedItems.map(i => i.id)), [savedItems]);

  // Sync dark mode class
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('lotus_theme');
      if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDark(false);
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // Safe fallback
    }
  }, []);

  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('lotus_theme', 'dark'); } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('lotus_theme', 'light'); } catch {}
    }
  };

  // Reading progress scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setReadingProgress(0);
        return;
      }
      const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save / Bookmark handler
  const handleToggleSave = (item: Item) => {
    setSavedItems(prev => {
      const exists = prev.some(i => i.id === item.id);
      const next = exists ? prev.filter(i => i.id !== item.id) : [item, ...prev];
      try {
        localStorage.setItem('lotus_saved_items', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleMarkRead = (id: string) => {
    setReadItemIds(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem('lotus_read_ids', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  // Watchlist handlers
  const handleAddKeyword = (kw: string) => {
    if (!watchlist.includes(kw)) {
      const next = [...watchlist, kw];
      setWatchlist(next);
      try { localStorage.setItem('lotus_watchlist', JSON.stringify(next)); } catch {}
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    const next = watchlist.filter(k => k !== kw);
    setWatchlist(next);
    try { localStorage.setItem('lotus_watchlist', JSON.stringify(next)); } catch {}
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setIsHelpOpen(prev => !prev);
      } else if (e.key === '/') {
        e.preventDefault();
        setCurrentView('search');
      } else if (e.key.toLowerCase() === 'b') {
        setMode('browse');
      } else if (e.key.toLowerCase() === 'r') {
        setMode('read');
      } else if (e.key === 'Escape') {
        setIsHelpOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Browser Text-To-Speech (Web Speech API)
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${edition.todayInOneSentence}. Top signals today: ${edition.topThree.map(t => `${t.headline}. ${t.teaser}`).join('. ')}. Company spotlight: ${edition.spotlight.entityName}. ${edition.spotlight.pitch}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // All items pool for search
  const allItems = useMemo(() => {
    const pool: Item[] = [...edition.topThree];
    Object.values(edition.sectors).forEach(secItems => {
      pool.push(...secItems);
    });
    pool.push(...edition.rising);
    if (edition.africa) {
      pool.push(...edition.africa);
    }
    if (edition.ghana) {
      pool.push(...edition.ghana);
    }
    return pool;
  }, [edition]);

  return (
    <div className={`min-h-screen flex flex-col bg-[#f5f0e7] dark:bg-[#0f1a17] text-[#16231f] dark:text-[#ece6d8] transition-colors duration-200 ${
      fontSize === 'relaxed' ? 'text-[17px]' : fontSize === 'large' ? 'text-[18px]' : 'text-[16px]'
    }`}>
      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={view => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        mode={mode}
        onToggleMode={setMode}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenSearchGrounding={handleOpenSearchGrounding}
        readingProgress={readingProgress}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 w-full pt-8">
        {currentView === 'today' && (
          <div className="max-w-4xl mx-auto">
            {/* Masthead */}
            <Masthead
              edition={edition}
              mode={mode}
              onToggleMode={setMode}
              isSpeaking={isSpeaking}
              onToggleSpeech={handleToggleSpeech}
              onPrevEdition={DATES[DATES.indexOf(edition.date) + 1] ? () => loadEd(DATES[DATES.indexOf(edition.date) + 1]).then(e => { setEdition(e); window.scrollTo(0, 0); }) : undefined}
              onNextEdition={DATES[DATES.indexOf(edition.date) - 1] ? () => loadEd(DATES[DATES.indexOf(edition.date) - 1]).then(e => { setEdition(e); window.scrollTo(0, 0); }) : undefined}
            />

            {/* Sunday Deep Dive Banner if applicable */}
            <div className="mb-12 p-4 rounded-[10px] bg-[#efe6d6]/40 dark:bg-[#1f2f29]/50 border border-[#ddd5c4] dark:border-[#2a3a34] flex items-center justify-between text-xs font-mono">
              <span className="text-[#6b6a5f] dark:text-[#a3b0a9]">
                Sunday Edition Available · Read the full weekly synthesis
              </span>
              <button
                type="button"
                onClick={() => setCurrentView('weekly')}
                className="font-semibold text-[#e2522b] dark:text-[#f2916f] hover:underline"
              >
                Weekly Deep Dive →
              </button>
            </div>

            {/* 01 · Top 3 Large Image Cards */}
            <TopThree
              items={edition.topThree}
              isExpandedGlobal={mode === 'read'}
              onToggleSave={handleToggleSave}
              onOpenSearchGrounding={handleOpenSearchGrounding}
              savedItemIds={savedItemIds}
              readItemIds={readItemIds}
              onMarkRead={handleMarkRead}
            />

            {/* 02 · Company Spotlight */}
            <Spotlight
              spotlight={edition.spotlight}
              isExpandedGlobal={mode === 'read'}
              onOpenSearchGrounding={handleOpenSearchGrounding}
            />

            {/* 03 · By Sector Grid (16 image cards, 2 per sector) */}
            <SectorGrid
              sectors={edition.sectors}
              isExpandedGlobal={mode === 'read'}
              onToggleSave={handleToggleSave}
              onOpenSearchGrounding={handleOpenSearchGrounding}
              savedItemIds={savedItemIds}
              readItemIds={readItemIds}
              onMarkRead={handleMarkRead}
            />

            {/* 04 · Funding Highlights List */}
            <FundingList
              funding={edition.funding}
              onNavigateToFunding={() => setCurrentView('funding')}
            />

            {/* 05 · Rising Cards (3 trends/launches) */}
            <RisingCards
              items={edition.rising}
              isExpandedGlobal={mode === 'read'}
              onToggleSave={handleToggleSave}
              onOpenSearchGrounding={handleOpenSearchGrounding}
              savedItemIds={savedItemIds}
              readItemIds={readItemIds}
              onMarkRead={handleMarkRead}
            />

            {/* Africa Tech & Innovation (Frontier Leapfrog Signals) */}
            {edition.africa && edition.africa.length > 0 && (
              <AfricaSection
                items={edition.africa}
                isExpandedGlobal={mode === 'read'}
                onToggleSave={handleToggleSave}
                onOpenSearchGrounding={handleOpenSearchGrounding}
                savedItemIds={savedItemIds}
                readItemIds={readItemIds}
                onMarkRead={handleMarkRead}
              />
            )}

            {/* Ghana Innovation Spotlight (Bank of Ghana Sandbox, GhIPSS, Agtech) */}
            {edition.ghana && edition.ghana.length > 0 && (
              <GhanaSection
                items={edition.ghana}
                isExpandedGlobal={mode === 'read'}
                onToggleSave={handleToggleSave}
                onOpenSearchGrounding={handleOpenSearchGrounding}
                savedItemIds={savedItemIds}
                readItemIds={readItemIds}
                onMarkRead={handleMarkRead}
              />
            )}

            {/* 06 · Bank Lens with Idea Spark brainstorm */}
            <BankLens bullets={edition.bankLens} />

            {/* 07 · Quick Links (closed disclosure) */}
            <QuickLinks links={edition.quickLinks} />

            {/* Source Status & Pipeline Transparency */}
            <SourceStatus statusList={edition.sourceStatus} />
          </div>
        )}

        {currentView === 'archive' && (
          <ArchiveView
            onSelectEdition={date => {
              setCurrentView('today');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'search' && (
          <SearchView
            items={allItems}
            onToggleSave={handleToggleSave}
            savedItemIds={savedItemIds}
          />
        )}

        {currentView === 'companies' && <CompaniesView />}

        {currentView === 'funding' && <FundingView />}
        {currentView === 'jobs' && <JobsView />}

        {currentView === 'trends' && <TrendsView />}

        {currentView === 'saved' && (
          <SavedView
            savedItems={savedItems}
            onToggleSave={handleToggleSave}
            onClearAll={() => {
              setSavedItems([]);
              try { localStorage.removeItem('lotus_saved_items'); } catch {}
            }}
            onImportItems={items => {
              setSavedItems(items);
              try { localStorage.setItem('lotus_saved_items', JSON.stringify(items)); } catch {}
            }}
          />
        )}

        {currentView === 'watchlist' && (
          <WatchlistView
            watchlist={watchlist}
            onAddKeyword={handleAddKeyword}
            onRemoveKeyword={handleRemoveKeyword}
          />
        )}

        {currentView === 'glossary' && <GlossaryView />}

        {currentView === 'settings' && (
          <SettingsView
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
            defaultMode={mode}
            onSetDefaultMode={setMode}
            fontSize={fontSize}
            onSetFontSize={setFontSize}
            onClearStorage={() => {
              setSavedItems([]);
              setReadItemIds(new Set());
              setWatchlist([]);
              try {
                localStorage.clear();
              } catch {}
              alert('Local storage cleared successfully.');
            }}
          />
        )}

        {currentView === 'about' && <AboutView />}

        {currentView === 'weekly' && (
          <WeeklyView onBackToDaily={() => setCurrentView('today')} />
        )}

        {currentView === 'pipeline' && <PipelineView />}
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentView} />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Google Search Grounding Modal (gemini-3.8-flash) */}
      <SearchGroundingModal
        isOpen={isGroundingOpen}
        onClose={() => setIsGroundingOpen(false)}
        initialQuery={groundingQuery}
        entityName={groundingEntity}
      />

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#fbf8f1]/95 dark:bg-[#17241f]/95 backdrop-blur-md border-t border-[#ddd5c4] dark:border-[#2a3a34] flex items-center justify-around text-xs font-mono z-40">
        <button
          type="button"
          onClick={() => {
            setCurrentView('today');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center ${
            currentView === 'today' ? 'text-[#e2522b] dark:text-[#f2916f] font-bold' : 'text-[#6b6a5f] dark:text-[#a3b0a9]'
          }`}
        >
          <span>Today</span>
        </button>
        <button
          type="button"
          onClick={() => setCurrentView('archive')}
          className={`flex flex-col items-center ${
            currentView === 'archive' ? 'text-[#e2522b] dark:text-[#f2916f] font-bold' : 'text-[#6b6a5f] dark:text-[#a3b0a9]'
          }`}
        >
          <span>Archive</span>
        </button>
        <button
          type="button"
          onClick={() => setCurrentView('search')}
          className={`flex flex-col items-center ${
            currentView === 'search' ? 'text-[#e2522b] dark:text-[#f2916f] font-bold' : 'text-[#6b6a5f] dark:text-[#a3b0a9]'
          }`}
        >
          <span>Search</span>
        </button>
        <button
          type="button"
          onClick={() => setCurrentView('saved')}
          className={`flex flex-col items-center ${
            currentView === 'saved' ? 'text-[#e2522b] dark:text-[#f2916f] font-bold' : 'text-[#6b6a5f] dark:text-[#a3b0a9]'
          }`}
        >
          <span>Saved</span>
        </button>
        <button
          type="button"
          onClick={() => setCurrentView('about')}
          className={`flex flex-col items-center ${
            currentView === 'about' ? 'text-[#e2522b] dark:text-[#f2916f] font-bold' : 'text-[#6b6a5f] dark:text-[#a3b0a9]'
          }`}
        >
          <span>About</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [ed, setEd] = useState<Edition | null>(null);
  useEffect(() => { loadEd(LATEST).then(setEd); }, []);
  return ed ? <AppInner initial={ed} /> : <div className="min-h-screen grid place-items-center font-mono text-sm text-[#6b6a5f]">Loading today's brief…</div>;
}
