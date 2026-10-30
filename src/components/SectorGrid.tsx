import React, { useState } from 'react';
import { Item, SectorKey } from '../types/index.ts';
import { SECTORS, SECTOR_KEYS } from '../config/sectors.ts';
import { ItemCard } from './ItemCard.tsx';
import { SectorPills } from './SectorPills.tsx';

interface SectorGridProps {
  sectors: Record<SectorKey, Item[]>;
  isExpandedGlobal?: boolean;
  onToggleSave?: (item: Item) => void;
  onOpenSearchGrounding?: (query: string, entityName: string) => void;
  savedItemIds?: Set<string>;
  readItemIds?: Set<string>;
  onMarkRead?: (id: string) => void;
}

export const SectorGrid: React.FC<SectorGridProps> = ({
  sectors,
  isExpandedGlobal,
  onToggleSave,
  onOpenSearchGrounding,
  savedItemIds,
  readItemIds,
  onMarkRead,
}) => {
  const [selectedSector, setSelectedSector] = useState<SectorKey | 'all'>('all');

  // Collect items to display
  let displayedItems: Item[] = [];
  if (selectedSector === 'all') {
    SECTOR_KEYS.forEach(key => {
      const items = sectors[key] || [];
      displayedItems.push(...items);
    });
  } else {
    displayedItems = sectors[selectedSector] || [];
  }

  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs uppercase font-mono tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9]">
          03 · BY SECTOR
        </span>
        <div className="h-px bg-[#ddd5c4] dark:bg-[#2a3a34] flex-1" />
      </div>

      {/* Sector filter pills */}
      <div className="mb-8">
        <SectorPills
          activeSector={selectedSector}
          onSelectSector={setSelectedSector}
        />
      </div>

      {/* Items Grid */}
      {displayedItems.length === 0 ? (
        <div className="py-12 text-center text-[#6b6a5f] dark:text-[#a3b0a9] font-mono text-sm border border-dashed border-[#ddd5c4] dark:border-[#2a3a34] rounded-[10px]">
          Quiet day in this sector.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10">
          {displayedItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              isExpandedGlobal={isExpandedGlobal}
              onToggleSave={onToggleSave}
              onOpenSearchGrounding={onOpenSearchGrounding}
              isSaved={savedItemIds?.has(item.id)}
              isRead={readItemIds?.has(item.id)}
              onMarkRead={onMarkRead}
            />
          ))}
        </div>
      )}
    </section>
  );
};
