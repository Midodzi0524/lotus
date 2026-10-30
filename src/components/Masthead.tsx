import React from 'react';
import { Edition } from '../types/index.ts';
import { Volume2, VolumeX } from 'lucide-react';
import { SignalMap, Ticker } from './Motion.tsx';

interface MastheadProps {
  edition: Edition;
  mode: 'browse' | 'read';
  onToggleMode: (mode: 'browse' | 'read') => void;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
  onPrevEdition?: () => void;
  onNextEdition?: () => void;
}

export const Masthead: React.FC<MastheadProps> = ({
  edition,
  mode,
  onToggleMode,
  isSpeaking,
  onToggleSpeech,
  onPrevEdition,
  onNextEdition,
}) => {
  // Format date nicely: SUNDAY · 25 OCTOBER 2026
  const dateObj = new Date(edition.date + 'T00:00:00');
  const formattedDate = dateObj
    .toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .toUpperCase();

  const all = [...edition.topThree, ...edition.rising, ...(edition.africa ?? []), ...(edition.ghana ?? []), ...Object.values(edition.sectors).flat()];
  const storyLabel = `${all.length} STORIES${all.some(i => i.longSummary) ? ' · 3–5 MIN EACH' : ''}`;

  return (
    <header className="mb-14 text-center max-w-3xl mx-auto px-4">
      {/* Demo Mode Notice */}
      {edition.isDemo && (
        <div className="inline-block mb-4 px-3 py-1 rounded bg-[#efe6d6] dark:bg-[#1f2f29] text-xs font-mono tracking-wider font-semibold text-[#e2522b] dark:text-[#f2916f] border border-[#ddd5c4] dark:border-[#2a3a34]">
          DEMO DATA — Switched off automatically upon first real GitHub run
        </div>
      )}

      {/* Date, Edition & Read Time */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] uppercase mb-4">
        <span>{formattedDate}</span>
        <span>·</span>
        <span>EDITION #{edition.number}</span>
        <span>·</span>
        <span className="font-semibold text-[#e2522b] dark:text-[#f2916f]">
          {storyLabel}
        </span>
      </div>

      {/* Today in one sentence (large serif) */}
      <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-snug text-[#16231f] dark:text-[#ece6d8] mb-6 tracking-tight">
        {edition.todayInOneSentence}
      </h1>

      {/* Interactive Toolbar under masthead */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono border-y border-[#ddd5c4] dark:border-[#2a3a34] py-2.5">
        {/* Browse / Read Toggle */}
        <div className="inline-flex rounded border border-[#ddd5c4] dark:border-[#2a3a34] p-0.5 bg-[#fbf8f1] dark:bg-[#17241f]">
          <button
            type="button"
            onClick={() => onToggleMode('browse')}
            className={`px-3 py-1 rounded text-xs transition-all ${
              mode === 'browse'
                ? 'bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] font-semibold'
                : 'text-[#6b6a5f] dark:text-[#a3b0a9] hover:text-[#16231f] dark:hover:text-[#ece6d8]'
            }`}
          >
            Headlines
          </button>
          <button
            type="button"
            onClick={() => onToggleMode('read')}
            className={`px-3 py-1 rounded text-xs transition-all ${
              mode === 'read'
                ? 'bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] font-semibold'
                : 'text-[#6b6a5f] dark:text-[#a3b0a9] hover:text-[#16231f] dark:hover:text-[#ece6d8]'
            }`}
          >
            Full summaries
          </button>
        </div>

        {/* Listen button */}
        <button
          type="button"
          onClick={onToggleSpeech}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#ddd5c4] dark:border-[#2a3a34] text-xs transition-all ${
            isSpeaking
              ? 'bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17]'
              : 'bg-[#fbf8f1] dark:bg-[#17241f] text-[#6b6a5f] dark:text-[#a3b0a9] hover:text-[#16231f]'
          }`}
          title="Listen to today's summary via browser speech"
        >
          {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span>{isSpeaking ? 'Stop listening' : 'Listen'}</span>
        </button>

        {/* Edition Navigation */}
        <div className="flex items-center gap-2 text-[#6b6a5f] dark:text-[#a3b0a9]">
          {onPrevEdition && (
            <button
              type="button"
              onClick={onPrevEdition}
              className="hover:text-[#e2522b] dark:hover:text-[#f2916f] transition-colors"
            >
              ← Yesterday
            </button>
          )}
          {onNextEdition && (
            <>
              <span>·</span>
              <button
                type="button"
                onClick={onNextEdition}
                className="hover:text-[#e2522b] dark:hover:text-[#f2916f] transition-colors"
              >
                Tomorrow →
              </button>
            </>
          )}
        </div>
      </div>
      <Ticker text={`${edition.stats.companies} companies · ${edition.stats.fundingTotalUsd ?? ''} raised · ${edition.stats.sourcesOk}/${edition.stats.sourcesTotal} sources live · ${edition.stats.sectors} sectors`} />
      <SignalMap edition={edition} />
    </header>
  );
};
