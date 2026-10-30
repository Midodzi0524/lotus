import React, { useState } from 'react';
import glossaryData from '../../data/glossary.json';
import { GlossaryItem, SectorKey } from '../types/index.ts';
import { SECTORS } from '../config/sectors.ts';
import { BookOpen, Search } from 'lucide-react';

export const GlossaryView: React.FC = () => {
  const [search, setSearch] = useState('');
  const items = glossaryData as GlossaryItem[];

  const filtered = items.filter(
    i =>
      i.term.toLowerCase().includes(search.toLowerCase()) ||
      i.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] mb-2 block">
          TERMINOLOGY & DEFINITIONS
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#16231f] dark:text-[#ece6d8] mb-3">
          Jargon Glossary
        </h1>
        <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] max-w-lg mx-auto">
          Plain-English explanations (under 25 words) of emerging technical, financial, and regulatory terms.
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6a5f] dark:text-[#a3b0a9]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search glossary terms..."
            className="w-full pl-9 pr-4 py-2 rounded-[8px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] text-sm text-[#16231f] dark:text-[#ece6d8] placeholder:text-[#6b6a5f]/70 outline-none focus:border-[#e2522b] dark:focus:border-[#f2916f]"
          />
        </div>
      </div>

      {/* Grid of Definitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => {
          const sector = item.sector ? SECTORS[item.sector] : null;
          return (
            <div
              key={item.term}
              className="p-5 rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] hover:border-[#e2522b] dark:hover:border-[#f2916f] transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-serif font-bold text-lg text-[#16231f] dark:text-[#ece6d8]">
                  {item.term}
                </h3>
                {sector && (
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider"
                    style={{
                      backgroundColor: `${sector.color}15`,
                      color: sector.color,
                    }}
                  >
                    {sector.label}
                  </span>
                )}
              </div>

              <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] leading-relaxed">
                {item.definition}
              </p>

              {item.firstSeenDate && (
                <div className="mt-3 pt-2 border-t border-[#ddd5c4]/50 dark:border-[#2a3a34]/50 text-[11px] font-mono text-[#6b6a5f]/80 dark:text-[#a3b0a9]/80">
                  Tracked since {item.firstSeenDate}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
