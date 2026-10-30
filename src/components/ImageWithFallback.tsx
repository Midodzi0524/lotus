import React, { useState, useMemo } from 'react';
import { SectorKey } from '../types/index.ts';
import { GeneratedCover } from './GeneratedCover.tsx';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
  sector: SectorKey;
  entityName: string;
  aspectRatio?: '16/9' | '3/2' | '1/1';
  className?: string;
  rounded?: string;
}

// Guess a domain from the company name for Clearbit Logo API (free, no key)
function guessDomain(name: string): string {
  const clean = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+(inc|llc|ltd|corp|corporation|company|co|ai|labs)$/i, '')
    .trim()
    .replace(/\s+/g, '');
  return clean ? `${clean}.com` : 'example.com';
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  credit,
  creditUrl,
  sector,
  entityName,
  aspectRatio = '16/9',
  className = '',
  rounded = 'rounded-[10px]',
}) => {
  const [stage, setStage] = useState<'original' | 'logo' | 'cover'>(
    src ? 'original' : 'logo'
  );

  const logoUrl = useMemo(() => {
    const domain = guessDomain(entityName || 'company');
    return `https://logo.clearbit.com/${domain}`;
  }, [entityName]);

  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '3/2'
      ? 'aspect-[3/2]'
      : 'aspect-square';

  if (stage === 'cover') {
    return (
      <div className={`overflow-hidden ${rounded} ${className}`}>
        <GeneratedCover
          entityName={entityName}
          sector={sector}
          aspectRatio={aspectRatio}
        />
      </div>
    );
  }

  const currentSrc = stage === 'original' ? src! : logoUrl;
  const showCredit = stage === 'original' && credit;

  return (
    <div className={`relative group overflow-hidden bg-[#ddd5c4]/30 dark:bg-[#2a3a34]/30 ${rounded} ${className}`}>
      <img
        src={currentSrc}
        alt={alt || entityName}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setStage(stage === 'original' ? 'logo' : 'cover')}
        className={`w-full h-full object-contain p-6 bg-white dark:bg-[#1a2420] ${aspectClass}`}
      />
      {showCredit && (
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#0f1a17]/75 backdrop-blur-sm text-[10px] text-[#ece6d8]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {creditUrl ? (
            <a
              href={creditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              onClick={e => e.stopPropagation()}
            >
              {credit}
            </a>
          ) : (
            <span>{credit}</span>
          )}
        </div>
      )}
    </div>
  );
};
