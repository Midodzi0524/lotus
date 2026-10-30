import React, { useState, useMemo } from 'react';
import { Search, Filter, ExternalLink, Bookmark, Clock } from 'lucide-react';
import { Item, SectorKey } from '../types/index.ts';
import { SECTORS, SECTOR_KEYS } from '../config/sectors.ts';
import { calculateCardReadingTime } from '../utils/readingTime.ts';
import { getSafeSourceUrl } from '../utils/sourceUrl.ts';

interface SearchViewProps {
  items: Item[];
  onToggleSave?: (item: Item) => void;
  savedItemIds?: Set<string>;
}

export const SearchView: React.FC<SearchViewProps> = ({
  items,
  onToggleSave,
  savedItemIds,
}) => {
  const [query, setQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<SectorKey | 'all'>('all');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSector = selectedSector === 'all' || item.sector === selectedSector;
      if (!matchesSector) return false;

      if (!query.trim()) return true;

      const q = query.toLowerCase();
      return (
        item.headline.toLowerCase().includes(q) ||
        item.teaser.toLowerCase().includes(q) ||
        item.whatItIs.toLowerCase().includes(q) ||
        item.whyItMatters.toLowerCase().includes(q) ||
        item.entityName.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    });
  }, [items, query, selectedSector]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] mb-2 block">
          FULL-TEXT INTELLIGENCE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#16231f] dark:text-[#ece6d8] mb-3">
          Search Intelligence Feed
        </h1>
        <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] max-w-lg mx-auto">
          Instant client-side indexed search across all headlines, summaries, company names, and signal rationale.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6a5f] dark:text-[#a3b0a9]" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by company, technology, regulation (e.g. SEPA, sandbox, battery, Deel)..."
            className="w-full pl-12 pr-4 py-3 rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] text-base text-[#16231f] dark:text-[#ece6d8] placeholder:text-[#6b6a5f]/70 outline-none focus:border-[#e2522b] dark:focus:border-[#f2916f] shadow-xs"
          />
        </div>
      </div>

      {/* Sector filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 text-xs font-mono uppercase tracking-wider scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedSector('all')}
          className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
            selectedSector === 'all'
              ? 'bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] font-semibold'
              : 'bg-[#fbf8f1] dark:bg-[#17241f] text-[#6b6a5f] dark:text-[#a3b0a9] border border-[#ddd5c4] dark:border-[#2a3a34]'
          }`}
        >
          All ({items.length})
        </button>
        {SECTOR_KEYS.map(key => {
          const count = items.filter(i => i.sector === key).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedSector(key)}
              className={`px-3 py-1 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedSector === key
                  ? 'bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] font-semibold'
                  : 'bg-[#fbf8f1] dark:bg-[#17241f] text-[#6b6a5f] dark:text-[#a3b0a9] border border-[#ddd5c4] dark:border-[#2a3a34]'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: SECTORS[key].color }}
              />
              <span>{SECTORS[key].label} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <div className="text-xs font-mono text-[#6b6a5f] dark:text-[#a3b0a9] mb-2">
          Showing {filteredItems.length} matching insights
        </div>

        {filteredItems.map(item => {
          const sector = SECTORS[item.sector];
          const isSaved = savedItemIds?.has(item.id);
          return (
            <div
              key={item.id}
              className="p-5 rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] hover:border-[#e2522b] dark:hover:border-[#f2916f] transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: sector?.color }}
                  />
                  <span
                    className="text-xs font-mono font-semibold uppercase tracking-wider"
                    style={{ color: sector?.color }}
                  >
                    {sector?.label}
                  </span>
                  <span className="text-xs font-mono text-[#6b6a5f] dark:text-[#a3b0a9]">
                    · {item.entityName}
                  </span>
                  <span className="text-[#ddd5c4] dark:text-[#2a3a34] font-mono text-[10px]">·</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#6b6a5f] dark:text-[#a3b0a9]">
                    <Clock className="w-3 h-3 text-[#e2522b] dark:text-[#f2916f]" />
                    {calculateCardReadingTime(item).label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleSave?.(item)}
                    className="p-1 rounded text-[#6b6a5f] dark:text-[#a3b0a9] hover:bg-[#efe6d6]/50 dark:hover:bg-[#1f2f29]"
                    title={isSaved ? 'Saved' : 'Save'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#e2522b] text-[#e2522b] dark:fill-[#f2916f]' : ''}`} />
                  </button>
                </div>
              </div>

              <h3 className="font-serif text-lg font-semibold text-[#16231f] dark:text-[#ece6d8] mb-2 leading-snug">
                {item.headline}
              </h3>

              <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] leading-relaxed mb-3">
                {item.teaser}
              </p>

              <div className="pt-2 border-t border-[#ddd5c4]/50 dark:border-[#2a3a34]/50 flex items-center justify-between text-xs font-mono text-[#6b6a5f] dark:text-[#a3b0a9]">
                <span>Score: {item.signalScore.totalScore}/100</span>
                {item.sources[0] && (
                  <a
                    href={getSafeSourceUrl(item.sources[0].url, item.entityName, item.headline, item.sources[0].name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e2522b] dark:text-[#f2916f] hover:underline flex items-center gap-1 font-sans"
                  >
                    {item.sources[0].name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="py-16 text-center text-[#6b6a5f] dark:text-[#a3b0a9] font-mono text-sm border border-dashed border-[#ddd5c4] dark:border-[#2a3a34] rounded-[10px]">
            No insights found matching your search. Try broader terms or select All Sectors.
          </div>
        )}
      </div>
    </div>
  );
};
