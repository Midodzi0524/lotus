import React from 'react';
import { Spotlight as SpotlightType, SourceReference } from '../types/index.ts';
import { SECTORS } from '../config/sectors.ts';
import { ImageWithFallback } from './ImageWithFallback.tsx';
import { ExternalLink, Globe } from 'lucide-react';
import { getSafeSourceUrl } from '../utils/sourceUrl.ts';

interface SpotlightProps {
  spotlight: SpotlightType;
  isExpandedGlobal?: boolean;
  onOpenSearchGrounding?: (query: string, entityName: string) => void;
}

export const Spotlight: React.FC<SpotlightProps> = ({
  spotlight,
  isExpandedGlobal,
  onOpenSearchGrounding,
}) => {
  const sectorMeta = SECTORS[spotlight.sector] || SECTORS.fintech;

  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs uppercase font-mono tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9]">
          02 · COMPANY SPOTLIGHT
        </span>
        <div className="h-px bg-[#ddd5c4] dark:bg-[#2a3a34] flex-1" />
      </div>

      <div className="rounded-[12px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] overflow-hidden p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Spotlight Image (3:2) */}
          <div className="md:col-span-5">
            <ImageWithFallback
              src={spotlight.imageUrl}
              alt={spotlight.imageAlt || spotlight.entityName}
              credit={spotlight.imageCredit}
              sector={spotlight.sector}
              entityName={spotlight.entityName}
              aspectRatio="3/2"
              rounded="rounded-[8px]"
            />
          </div>

          {/* Header & 2-sentence pitch */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: sectorMeta.color }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-wider font-mono"
                style={{ color: sectorMeta.color }}
              >
                {sectorMeta.label}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#16231f] dark:text-[#ece6d8] mb-3">
              {spotlight.entityName}
            </h2>

            <p className="text-base text-[#6b6a5f] dark:text-[#a3b0a9] leading-relaxed font-serif">
              {spotlight.pitch}
            </p>
          </div>
        </div>

        {/* Structured Profile (in place native details) */}
        <details
          open={isExpandedGlobal}
          className="mt-6 pt-6 border-t border-[#ddd5c4] dark:border-[#2a3a34]"
        >
          <summary className="text-xs font-mono font-medium text-[#e2522b] dark:text-[#f2916f] cursor-pointer hover:underline mb-4 flex items-center justify-between">
            <span>{isExpandedGlobal ? 'Detailed Company Profile' : 'Expand full company profile ▾'}</span>
            <span className="text-[11px] text-[#6b6a5f] dark:text-[#a3b0a9]">
              Score {spotlight.signalScore.totalScore}/100
            </span>
          </summary>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-sm leading-relaxed">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#6b6a5f] dark:text-[#a3b0a9] font-semibold mb-1">
                The Problem
              </h4>
              <p className="text-[#16231f] dark:text-[#ece6d8]">{spotlight.problem}</p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#6b6a5f] dark:text-[#a3b0a9] font-semibold mb-1">
                The Product
              </h4>
              <p className="text-[#16231f] dark:text-[#ece6d8]">{spotlight.product}</p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#6b6a5f] dark:text-[#a3b0a9] font-semibold mb-1">
                Target Customer
              </h4>
              <p className="text-[#16231f] dark:text-[#ece6d8]">{spotlight.customer}</p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#6b6a5f] dark:text-[#a3b0a9] font-semibold mb-1">
                Business Model
              </h4>
              <p className="text-[#16231f] dark:text-[#ece6d8]">{spotlight.businessModel}</p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#6b6a5f] dark:text-[#a3b0a9] font-semibold mb-1">
                Funding & Valuation
              </h4>
              <p className="text-[#16231f] dark:text-[#ece6d8]">{spotlight.funding}</p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#6b6a5f] dark:text-[#a3b0a9] font-semibold mb-1">
                Competitive Landscape
              </h4>
              <p className="text-[#16231f] dark:text-[#ece6d8]">{spotlight.competition}</p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#6b6a5f] dark:text-[#a3b0a9] font-semibold mb-1">
                Risks & Vulnerabilities
              </h4>
              <p className="text-[#16231f] dark:text-[#ece6d8]">{spotlight.risks}</p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#6b6a5f] dark:text-[#a3b0a9] font-semibold mb-1">
                What to Watch
              </h4>
              <p className="text-[#16231f] dark:text-[#ece6d8]">{spotlight.whatToWatch}</p>
            </div>
          </div>

          {/* Sources and Search Grounding */}
          <div className="mt-6 pt-4 border-t border-[#ddd5c4] dark:border-[#2a3a34] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[#6b6a5f] dark:text-[#a3b0a9]">Verified in:</span>
              {spotlight.sources && spotlight.sources.map((s: SourceReference, idx: number) => (
                <a
                  key={idx}
                  href={getSafeSourceUrl(s.url, spotlight.entityName, spotlight.pitch, s.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-[#e2522b] dark:text-[#f2916f] hover:underline"
                >
                  {s.name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>

            {onOpenSearchGrounding && (
              <button
                type="button"
                onClick={() => onOpenSearchGrounding(
                  `Provide a live 2026 update on ${spotlight.entityName}: latest funding, metrics, customer count, and major competitors.`,
                  spotlight.entityName
                )}
                className="px-3 py-1.5 rounded bg-[#efe6d6]/70 text-[#e2522b] dark:bg-[#1f2f29] dark:text-[#f2916f] font-mono text-xs font-semibold hover:opacity-90 inline-flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Verify with Google Search</span>
              </button>
            )}
          </div>
        </details>
      </div>
    </section>
  );
};
