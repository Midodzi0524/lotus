import React from 'react';
import { SectorKey } from '../types/index.ts';
import { SECTORS } from '../config/sectors.ts';

interface GeneratedCoverProps {
  entityName: string;
  sector: SectorKey;
  className?: string;
  aspectRatio?: '16/9' | '3/2' | '1/1';
}

export const GeneratedCover: React.FC<GeneratedCoverProps> = ({
  entityName,
  sector,
  className = '',
  aspectRatio = '16/9',
}) => {
  const sectorMeta = SECTORS[sector] || SECTORS.fintech;
  const initials = entityName
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .substring(0, 3)
    .toUpperCase();

  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '3/2'
      ? 'aspect-[3/2]'
      : 'aspect-square';

  return (
    <div
      className={`relative overflow-hidden flex flex-col justify-between p-6 select-none ${aspectClass} ${className}`}
      style={{
        backgroundColor: `${sectorMeta.color}15`,
        border: `1px solid ${sectorMeta.color}30`,
      }}
    >
      {/* Background typographic watermark */}
      <div
        className="absolute -right-4 -bottom-8 text-8xl font-serif font-black opacity-10 pointer-events-none select-none tracking-tighter"
        style={{ color: sectorMeta.color }}
      >
        {initials}
      </div>

      {/* Top sector badge */}
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: sectorMeta.color }}
        />
        <span
          className="text-xs font-semibold uppercase tracking-wider font-mono"
          style={{ color: sectorMeta.color }}
        >
          {sectorMeta.label}
        </span>
      </div>

      {/* Center initials & name */}
      <div className="my-auto z-10">
        <div
          className="text-3xl font-serif font-semibold tracking-tight text-[#16231f] dark:text-[#ece6d8]"
        >
          {entityName}
        </div>
      </div>

      {/* Bottom accent indicator */}
      <div className="flex items-center justify-between text-[11px] text-[#6b6a5f] dark:text-[#a3b0a9] font-mono">
        <span>LOTUS EDITORIAL ARCHIVE</span>
        <span>•</span>
      </div>
    </div>
  );
};
