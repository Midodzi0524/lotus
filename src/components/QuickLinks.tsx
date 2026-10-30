import React from 'react';
import { QuickLink } from '../types/index.ts';
import { SECTORS } from '../config/sectors.ts';
import { ExternalLink } from 'lucide-react';

interface QuickLinksProps {
  links: QuickLink[];
}

export const QuickLinks: React.FC<QuickLinksProps> = ({ links }) => {
  if (!links || links.length === 0) return null;

  return (
    <div className="mb-12">
      <details className="group rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] p-5">
        <summary className="text-xs uppercase font-mono tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] cursor-pointer hover:text-[#e2522b] dark:hover:text-[#f2916f] flex items-center justify-between outline-none">
          <span>07 · QUICK LINKS ({links.length} HEADLINES)</span>
          <span className="text-sm font-sans group-open:rotate-180 transition-transform">▾</span>
        </summary>

        <div className="mt-4 pt-4 border-t border-[#ddd5c4]/60 dark:border-[#2a3a34]/60 divide-y divide-[#ddd5c4]/40 dark:divide-[#2a3a34]/40">
          {links.map((link, idx) => {
            const sector = SECTORS[link.sector];
            return (
              <div
                key={idx}
                className="py-2.5 flex items-center justify-between gap-4 text-xs hover:bg-[#efe6d6]/10 dark:hover:bg-[#1f2f29]/20 px-2 rounded"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sector?.color || '#A0674B' }}
                  />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#16231f] dark:text-[#ece6d8] hover:underline font-serif text-sm"
                  >
                    {link.title}
                  </a>
                </div>
                <span className="font-mono text-[11px] text-[#6b6a5f] dark:text-[#a3b0a9] flex-shrink-0 flex items-center gap-1">
                  {link.source}
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
};
