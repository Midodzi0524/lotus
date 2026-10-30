import React from 'react';
import { FundingEvent } from '../types/index.ts';
import { SECTORS } from '../config/sectors.ts';
import { ArrowUpRight } from 'lucide-react';

interface FundingListProps {
  funding: FundingEvent[];
  onNavigateToFunding?: () => void;
}

export const FundingList: React.FC<FundingListProps> = ({
  funding,
  onNavigateToFunding,
}) => {
  if (!funding || funding.length === 0) return null;
  const items = funding.slice(0, 8);

  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <span className="text-xs uppercase font-mono tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9]">
          04 · FUNDING HIGHLIGHTS
        </span>
        <button
          type="button"
          onClick={onNavigateToFunding}
          className="text-xs font-mono text-[#e2522b] dark:text-[#f2916f] hover:underline flex items-center gap-0.5"
        >
          <span>See all deals</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] divide-y divide-[#ddd5c4]/60 dark:divide-[#2a3a34]/60 overflow-hidden">
        {items.map(deal => {
          const sector = SECTORS[deal.sector];
          return (
            <div
              key={deal.id}
              className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-[#efe6d6]/20 dark:hover:bg-[#1f2f29]/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: sector?.color || '#A0674B' }}
                />
                <span className="font-serif font-semibold text-base text-[#16231f] dark:text-[#ece6d8]">
                  {deal.company}
                </span>
                <span className="text-xs font-mono text-[#6b6a5f] dark:text-[#a3b0a9] px-2 py-0.5 rounded bg-[#efe6d6]/40 dark:bg-[#1f2f29]">
                  {deal.round}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="font-semibold text-sm text-[#16231f] dark:text-[#ece6d8]">
                  {deal.amount}
                </span>
                <span className="text-[#6b6a5f] dark:text-[#a3b0a9] hidden sm:inline">
                  {sector?.label}
                </span>
                <a
                  href={deal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#e2522b] dark:text-[#f2916f] hover:underline"
                >
                  Source ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
