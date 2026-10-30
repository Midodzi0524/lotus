import React from 'react';
import { Item } from '../types/index.ts';
import { ItemCard } from './ItemCard.tsx';

interface RisingCardsProps {
  items: Item[];
  isExpandedGlobal?: boolean;
  onToggleSave?: (item: Item) => void;
  onOpenSearchGrounding?: (query: string, entityName: string) => void;
  savedItemIds?: Set<string>;
  readItemIds?: Set<string>;
  onMarkRead?: (id: string) => void;
}

export const RisingCards: React.FC<RisingCardsProps> = ({
  items,
  isExpandedGlobal,
  onToggleSave,
  onOpenSearchGrounding,
  savedItemIds,
  readItemIds,
  onMarkRead,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs uppercase font-mono tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9]">
          05 · RISING & LAUNCHES
        </span>
        <div className="h-px bg-[#ddd5c4] dark:bg-[#2a3a34] flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {items.slice(0, 3).map(item => (
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
    </section>
  );
};
