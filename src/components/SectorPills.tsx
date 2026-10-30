import React from 'react';
import { SectorKey } from '../types/index.ts';
import { SECTORS, SECTOR_KEYS } from '../config/sectors.ts';

interface SectorPillsProps {
  activeSector: SectorKey | 'all';
  onSelectSector: (sector: SectorKey | 'all') => void;
}

export const SectorPills: React.FC<SectorPillsProps> = ({
  activeSector,
  onSelectSector,
}) => {
  return (
    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-mono uppercase tracking-wider">
      <button
        type="button"
        onClick={() => onSelectSector('all')}
        className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
          activeSector === 'all'
            ? 'font-bold text-[#e2522b] dark:text-[#f2916f] border-b-2 border-[#e2522b] dark:border-[#f2916f]'
            : 'text-[#6b6a5f] dark:text-[#a3b0a9] hover:text-[#16231f] dark:hover:text-[#ece6d8]'
        }`}
      >
        All Sectors
      </button>

      {SECTOR_KEYS.map(key => {
        const sector = SECTORS[key];
        const isActive = activeSector === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelectSector(key)}
            className={`px-3 py-1.5 rounded transition-all whitespace-nowrap flex items-center gap-1.5 ${
              isActive
                ? 'font-bold text-[#e2522b] dark:text-[#f2916f] border-b-2 border-[#e2522b] dark:border-[#f2916f]'
                : 'text-[#6b6a5f] dark:text-[#a3b0a9] hover:text-[#16231f] dark:hover:text-[#ece6d8]'
            }`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: sector.color }}
            />
            <span>{sector.label}</span>
          </button>
        );
      })}
    </div>
  );
};
