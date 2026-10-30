import React, { useState } from 'react';
import editionsIndex from '../../data/index.json';
import { Calendar, Search } from 'lucide-react';

interface ArchiveViewProps {
  onSelectEdition: (date: string) => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({ onSelectEdition }) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredEditions = editionsIndex.filter(e =>
    e.todayInOneSentence.toLowerCase().includes(filterQuery.toLowerCase()) ||
    e.date.includes(filterQuery) ||
    String(e.number).includes(filterQuery)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] mb-2 block">
          EDITIONS ARCHIVE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#16231f] dark:text-[#ece6d8] mb-3">
          Daily Intelligence Archive
        </h1>
        <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] max-w-lg mx-auto">
          Every edition committed permanently as immutable historical records of startup and venture innovation.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6a5f] dark:text-[#a3b0a9]" />
          <input
            type="text"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            placeholder="Search past editions by theme or date..."
            className="w-full pl-9 pr-4 py-2 rounded-[8px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] text-sm text-[#16231f] dark:text-[#ece6d8] placeholder:text-[#6b6a5f]/70 outline-none focus:border-[#e2522b] dark:focus:border-[#f2916f]"
          />
        </div>
      </div>

      {/* List of Editions */}
      <div className="space-y-4">
        {filteredEditions.map(ed => (
          <div
            key={ed.date}
            onClick={() => onSelectEdition(ed.date)}
            className="p-5 rounded-[12px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] hover:border-[#e2522b] dark:hover:border-[#f2916f] cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-[#6b6a5f] dark:text-[#a3b0a9]">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-semibold text-[#e2522b] dark:text-[#f2916f]">{ed.date}</span>
                <span>·</span>
                <span>Edition #{ed.number}</span>
                {ed.isDemo && (
                  <span className="px-1.5 py-0.2 rounded bg-[#efe6d6] text-[#e2522b] text-[10px]">
                    DEMO
                  </span>
                )}
              </div>

              <h3 className="font-serif text-lg font-semibold text-[#16231f] dark:text-[#ece6d8] group-hover:text-[#e2522b] dark:group-hover:text-[#f2916f] transition-colors leading-snug">
                {ed.todayInOneSentence}
              </h3>

              <div className="mt-2 flex items-center gap-4 text-xs font-mono text-[#6b6a5f] dark:text-[#a3b0a9]">
                <span>{ed.companiesCount} entities</span>
                <span>·</span>
                <span>{ed.sectorsCount} sectors covered</span>
                <span>·</span>
                <span>Funding: {ed.fundingTotalUsd || 'N/A'}</span>
              </div>
            </div>

            <div className="flex-shrink-0 self-start sm:self-center">
              <span className="text-xs font-mono text-[#e2522b] dark:text-[#f2916f] group-hover:underline flex items-center gap-1 font-semibold">
                Read edition →
              </span>
            </div>
          </div>
        ))}

        {filteredEditions.length === 0 && (
          <div className="py-12 text-center text-[#6b6a5f] dark:text-[#a3b0a9] font-mono text-sm">
            No past editions found matching "{filterQuery}".
          </div>
        )}
      </div>
    </div>
  );
};
