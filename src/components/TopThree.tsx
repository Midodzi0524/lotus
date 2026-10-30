import React from 'react';
import { Item } from '../types/index.ts';
import { ItemCard } from './ItemCard.tsx';

interface TopThreeProps {
  items: Item[];
  isExpandedGlobal?: boolean;
  onToggleSave?: (item: Item) => void;
  onOpenSearchGrounding?: (query: string, entityName: string) => void;
  savedItemIds?: Set<string>;
  readItemIds?: Set<string>;
  onMarkRead?: (id: string) => void;
}

export const TopThree: React.FC<TopThreeProps> = ({
  items,
  isExpandedGlobal,
  onToggleSave,
  onOpenSearchGrounding,
  savedItemIds,
  readItemIds,
  onMarkRead,
}) => {
  if (!items || items.length === 0) return null;

  const first = items[0];
  const second = items[1];
  const third = items[2];

  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs uppercase font-mono tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9]">
          01 · TOP SIGNALS
        </span>
        <div className="h-px bg-[#ddd5c4] dark:bg-[#2a3a34] flex-1" />
      </div>

      {/* First story: Lead 16:9 large card */}
      {first && (
        <div className="mb-10">
          <ItemCard
            item={first}
            isExpandedGlobal={isExpandedGlobal}
            onToggleSave={onToggleSave}
            onOpenSearchGrounding={onOpenSearchGrounding}
            isSaved={savedItemIds?.has(first.id)}
            isRead={readItemIds?.has(first.id)}
            onMarkRead={onMarkRead}
            leadCard={true}
          />
        </div>
      )}

      {/* Next two stories: side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {second && (
          <ItemCard
            item={second}
            isExpandedGlobal={isExpandedGlobal}
            onToggleSave={onToggleSave}
            onOpenSearchGrounding={onOpenSearchGrounding}
            isSaved={savedItemIds?.has(second.id)}
            isRead={readItemIds?.has(second.id)}
            onMarkRead={onMarkRead}
          />
        )}
        {third && (
          <ItemCard
            item={third}
            isExpandedGlobal={isExpandedGlobal}
            onToggleSave={onToggleSave}
            onOpenSearchGrounding={onOpenSearchGrounding}
            isSaved={savedItemIds?.has(third.id)}
            isRead={readItemIds?.has(third.id)}
            onMarkRead={onMarkRead}
          />
        )}
      </div>
    </section>
  );
};
