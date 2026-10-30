import React from 'react';
import trendsData from '../../data/trends.json';
import { TrendItem } from '../types/index.ts';
import { SECTORS } from '../config/sectors.ts';
import { TrendingUp, Activity, Check } from 'lucide-react';

export const TrendsView: React.FC = () => {
  const trends = trendsData as TrendItem[];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] mb-2 block">
          SIGNAL RADAR
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#16231f] dark:text-[#ece6d8] mb-3">
          Tracked Macro Trends
        </h1>
        <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] max-w-lg mx-auto">
          Longitudinal patterns, cross-sector convergence signals, and emergent technological paradigms.
        </p>
      </div>

      <div className="space-y-6">
        {trends.map(trend => {
          const sector = SECTORS[trend.sector];
          return (
            <div
              key={trend.slug}
              className="p-6 rounded-[12px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] hover:border-[#e2522b] dark:hover:border-[#f2916f] transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: sector?.color }}
                  />
                  <span
                    className="text-xs font-mono font-semibold uppercase tracking-wider"
                    style={{ color: sector?.color }}
                  >
                    {sector?.label}
                  </span>
                  <span className="text-xs font-mono text-[#6b6a5f] dark:text-[#a3b0a9]">
                    · First seen {trend.firstSeen}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#efe6d6]/60 dark:bg-[#1f2f29] text-xs font-mono font-semibold text-[#e2522b] dark:text-[#f2916f] uppercase flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {trend.trajectory}
                  </span>
                  <span className="text-xs font-mono text-[#6b6a5f] dark:text-[#a3b0a9]">
                    {trend.mentionsCount} citations
                  </span>
                </div>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#16231f] dark:text-[#ece6d8]">
                {trend.name}
              </h3>

              <p className="text-sm sm:text-base text-[#6b6a5f] dark:text-[#a3b0a9] leading-relaxed">
                {trend.description}
              </p>

              <div className="p-3.5 rounded bg-[#f5f0e7]/60 dark:bg-[#0f1a17]/50 border-l-2 border-[#e2522b] dark:border-[#f2916f] text-xs">
                <span className="font-mono font-semibold text-[#e2522b] dark:text-[#f2916f] uppercase tracking-wider block mb-1">
                  Why it matters for banking & corporate strategy
                </span>
                <p className="text-[#16231f] dark:text-[#ece6d8] italic font-serif">
                  {trend.whyItMatters}
                </p>
              </div>

              {trend.relatedCompanies.length > 0 && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#6b6a5f] dark:text-[#a3b0a9] pt-2">
                  <span>Related entities:</span>
                  {trend.relatedCompanies.map(c => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] text-[#16231f] dark:text-[#ece6d8]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
