import React, { useState } from 'react';
import { Bookmark, Check, Clock, Copy, ExternalLink, Flag, Globe, Info } from 'lucide-react';
import { Item } from '../types/index.ts';
import { SECTORS } from '../config/sectors.ts';
import { ImageWithFallback } from './ImageWithFallback.tsx';
import { calculateCardReadingTime } from '../utils/readingTime.ts';
import { LongSummary } from './LongSummary.tsx';
import { getSafeSourceUrl } from '../utils/sourceUrl.ts';

interface ItemCardProps {
  item: Item;
  isExpandedGlobal?: boolean;
  onToggleSave?: (item: Item) => void;
  onOpenSearchGrounding?: (query: string, entityName: string) => void;
  isSaved?: boolean;
  isRead?: boolean;
  onMarkRead?: (id: string) => void;
  className?: string;
  leadCard?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isExpandedGlobal,
  onToggleSave,
  onOpenSearchGrounding,
  isSaved = false,
  isRead = false,
  onMarkRead,
  className = '',
  leadCard = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSignalDetails, setShowSignalDetails] = useState(false);
  const [isLocalOpen, setIsLocalOpen] = useState(false);
  const sectorMeta = SECTORS[item.sector] || SECTORS.fintech;

  const isExpanded = Boolean(isExpandedGlobal || isLocalOpen);
  const readingTime = calculateCardReadingTime(item, isExpanded);

  const copyDeepLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#item-${item.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReportError = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const title = encodeURIComponent(`Correction report: ${item.headline} (${item.id})`);
    const body = encodeURIComponent(
      `Issue with item:\nID: ${item.id}\nEntity: ${item.entityName}\nHeadline: ${item.headline}\n\nPlease describe the correction and provide verification source:`
    );
    window.open(`https://github.com/daily-brief/daily-brief/issues/new?title=${title}&body=${body}`, '_blank');
  };

  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const isOpen = (e.target as HTMLDetailsElement).open;
    setIsLocalOpen(isOpen);
    if (isOpen && onMarkRead) {
      onMarkRead(item.id);
    }
  };

  const primarySource = item.sources[0];

  return (
    <article
      id={`item-${item.id}`}
      className={`group relative transition-all duration-200 ${
        isRead ? 'opacity-85' : 'opacity-100'
      } ${className}`}
    >
      <details
        open={isExpandedGlobal}
        onToggle={handleToggle}
        className="cursor-pointer select-none"
      >
        <summary className="list-none outline-none">
          {/* Card Image */}
          <div className="mb-3 overflow-hidden rounded-[10px]">
            <ImageWithFallback
              src={item.imageUrl}
              alt={item.imageAlt || item.headline}
              credit={item.imageCredit}
              creditUrl={primarySource ? getSafeSourceUrl(primarySource.url, item.entityName, item.headline, primarySource.name) : undefined}
              sector={item.sector}
              entityName={item.entityName}
              aspectRatio={leadCard ? '16/9' : '16/9'}
            />
          </div>

          {/* Sector Tag & Actions */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: sectorMeta.color }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-wider font-mono text-[#6b6a5f] dark:text-[#a3b0a9]"
                style={{ color: sectorMeta.color }}
              >
                {sectorMeta.label}
              </span>
              <span className="text-[#ddd5c4] dark:text-[#2a3a34] font-mono text-[10px]">·</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#6b6a5f] dark:text-[#a3b0a9]">
                <Clock className="w-3 h-3 text-[#e2522b] dark:text-[#f2916f]" />
                {readingTime.label}
              </span>
              {item.correctedDate && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#efe6d6] dark:bg-[#1f2f29] text-[#e2522b] dark:text-[#f2916f] font-mono">
                  Corrected {item.correctedDate}
                </span>
              )}
            </div>

            {/* Quick action buttons (hover on desktop, always visible on mobile) */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 sm:opacity-0 md:opacity-0 focus-within:opacity-100">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  onToggleSave?.(item);
                }}
                title={isSaved ? 'Remove from saved' : 'Save for later (S)'}
                className="p-1 rounded hover:bg-[#efe6d6]/60 dark:hover:bg-[#1f2f29] text-[#6b6a5f] dark:text-[#a3b0a9]"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#e2522b] text-[#e2522b] dark:fill-[#f2916f] dark:text-[#f2916f]' : ''}`} />
              </button>
              <button
                type="button"
                onClick={copyDeepLink}
                title="Copy link"
                className="p-1 rounded hover:bg-[#efe6d6]/60 dark:hover:bg-[#1f2f29] text-[#6b6a5f] dark:text-[#a3b0a9]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleReportError}
                title="Report correction"
                className="p-1 rounded hover:bg-[#efe6d6]/60 dark:hover:bg-[#1f2f29] text-[#6b6a5f] dark:text-[#a3b0a9]"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Headline (Max 12 words) */}
          <h3
            className={`font-serif font-semibold tracking-tight leading-snug text-[#16231f] dark:text-[#ece6d8] mb-2 ${
              leadCard ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
            }`}
          >
            {item.headline}
          </h3>

          {/* One-sentence Teaser (Max 20 words) */}
          <p className="text-sm sm:text-base text-[#6b6a5f] dark:text-[#a3b0a9] leading-relaxed mb-3">
            {item.teaser}
          </p>

          <div className="flex items-center justify-between text-xs text-[#e2522b] dark:text-[#f2916f] font-medium pt-1">
            <span className="flex items-center gap-1 hover:underline">
              {isExpanded ? 'Hide details' : item.longSummary ? 'Read full summary ▾' : 'Read more ▾'}
            </span>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#6b6a5f]/75 dark:text-[#a3b0a9]/75">
              <span>{item.summaryMinutes ? `${item.summaryMinutes} min read` : `${readingTime.wordCount} words`}</span>
              <span>·</span>
              <span>Score {item.signalScore.totalScore}/100</span>
            </div>
          </div>
        </summary>

        {/* Expanded View in place */}
        <div className="mt-4 pt-4 border-t border-[#ddd5c4] dark:border-[#2a3a34] space-y-3 cursor-default select-text">
          {/* Reading time metric banner in expanded mode */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#6b6a5f] dark:text-[#a3b0a9] pb-1 border-b border-[#ddd5c4]/40 dark:border-[#2a3a34]/40">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#e2522b] dark:text-[#f2916f]" />
              <span>Full read: {item.summaryMinutes ? `~${item.summaryMinutes} min` : readingTime.seconds >= 60 ? `~${readingTime.minutes} min` : `${readingTime.seconds} sec`}</span>
            </span>
            <span>200 wpm standard</span>
          </div>
          {/* What it is */}
          <div>
            <span className="text-xs uppercase font-mono tracking-wider font-semibold text-[#6b6a5f] dark:text-[#a3b0a9] block mb-1">
              What it is
            </span>
            <p className="text-sm text-[#16231f] dark:text-[#ece6d8] leading-relaxed font-serif">
              {item.whatItIs}
            </p>
          </div>

          {/* Why it matters */}
          <div>
            <span className="text-xs uppercase font-mono tracking-wider font-semibold text-[#6b6a5f] dark:text-[#a3b0a9] block mb-1">
              Why it matters
            </span>
            <p className="text-sm text-[#16231f] dark:text-[#ece6d8] leading-relaxed font-serif">
              {item.whyItMatters}
            </p>
          </div>

          {item.longSummary && <LongSummary text={item.longSummary} minutes={item.summaryMinutes} />}

          {/* Quiet Key Facts Line */}
          {item.keyFacts && (
            <div className="py-2 px-3 rounded bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4]/60 dark:border-[#2a3a34] text-xs text-[#6b6a5f] dark:text-[#a3b0a9] font-mono flex flex-wrap gap-x-4 gap-y-1">
              {item.keyFacts.fundingAmount && (
                <span><strong>Funding:</strong> {item.keyFacts.fundingAmount}</span>
              )}
              {item.keyFacts.round && (
                <span><strong>Round:</strong> {item.keyFacts.round}</span>
              )}
              {item.keyFacts.location && (
                <span><strong>Location:</strong> {item.keyFacts.location}</span>
              )}
              {item.keyFacts.leadInvestors && item.keyFacts.leadInvestors.length > 0 && (
                <span><strong>Investors:</strong> {item.keyFacts.leadInvestors.join(', ')}</span>
              )}
              {item.keyFacts.traction && (
                <span><strong>Traction:</strong> {item.keyFacts.traction}</span>
              )}
            </div>
          )}

          {/* Bank Lens Angle */}
          {item.bankAngle && (
            <div className="p-2.5 rounded bg-[#efe6d6]/30 dark:bg-[#1f2f29]/40 border-l-2 border-[#e2522b] dark:border-[#f2916f]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#e2522b] dark:text-[#f2916f] font-semibold block mb-0.5">
                Bank Lens
              </span>
              <p className="text-xs italic text-[#16231f] dark:text-[#ece6d8]">
                {item.bankAngle}
              </p>
            </div>
          )}

          {/* Why this is here (Signal score breakdown toggle) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowSignalDetails(!showSignalDetails)}
              className="text-xs font-mono text-[#6b6a5f] dark:text-[#a3b0a9] flex items-center gap-1 hover:text-[#e2522b] dark:hover:text-[#f2916f]"
            >
              <Info className="w-3 h-3" />
              <span>{showSignalDetails ? 'Hide signal breakdown' : 'Why this is here (signal score)'}</span>
            </button>

            {showSignalDetails && (
              <div className="mt-2 p-2.5 rounded bg-[#fbf8f1] dark:bg-[#17241f] text-xs font-mono border border-[#ddd5c4] dark:border-[#2a3a34] space-y-1.5">
                <p className="text-[#16231f] dark:text-[#ece6d8] mb-2">{item.signalScore.rationale}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#6b6a5f] dark:text-[#a3b0a9]">
                  <div>Novelty: <span className="font-semibold text-[#16231f] dark:text-[#ece6d8]">{item.signalScore.novelty}/100</span> (30%)</div>
                  <div>Significance: <span className="font-semibold text-[#16231f] dark:text-[#ece6d8]">{item.signalScore.significance}/100</span> (25%)</div>
                  <div>Cross-mentions: <span className="font-semibold text-[#16231f] dark:text-[#ece6d8]">{item.signalScore.crossSourceMentions}/100</span> (20%)</div>
                  <div>Traction: <span className="font-semibold text-[#16231f] dark:text-[#ece6d8]">{item.signalScore.traction}/100</span> (15%)</div>
                  <div className="col-span-2">Banking relevance: <span className="font-semibold text-[#16231f] dark:text-[#ece6d8]">{item.signalScore.relevanceToFinancialServices}/100</span> (10%)</div>
                </div>
              </div>
            )}
          </div>

          {/* Sources and actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#ddd5c4]/50 dark:border-[#2a3a34]/50">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6b6a5f] dark:text-[#a3b0a9]">Source:</span>
              {item.sources.map((s, idx) => (
                <a
                  key={idx}
                  href={getSafeSourceUrl(s.url, item.entityName, item.headline, s.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-[#e2522b] dark:text-[#f2916f] hover:underline"
                >
                  {s.name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {onOpenSearchGrounding && (
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    onOpenSearchGrounding(
                      `What are the latest developments, funding, and news about ${item.entityName}?`,
                      item.entityName
                    );
                  }}
                  className="text-xs px-2.5 py-1 rounded bg-[#efe6d6]/70 text-[#e2522b] dark:bg-[#1f2f29] dark:text-[#f2916f] font-medium hover:opacity-90 inline-flex items-center gap-1 font-mono transition-opacity"
                  title="Verify and get live Google Search information with gemini-3.8-flash"
                >
                  <Globe className="w-3 h-3" />
                  <span>Google Search Grounding</span>
                </button>
              )}

              {primarySource && (
                <a
                  href={getSafeSourceUrl(primarySource.url, item.entityName, item.headline, primarySource.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2.5 py-1 rounded bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] font-medium hover:opacity-90 inline-flex items-center gap-1"
                >
                  Read original
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </details>
    </article>
  );
};
