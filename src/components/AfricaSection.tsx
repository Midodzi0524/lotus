import React from 'react';
import { Item } from '../types/index.ts';
import { ItemCard } from './ItemCard.tsx';
import { Globe, MapPin, Sparkles } from 'lucide-react';

interface AfricaSectionProps {
  items?: Item[];
  isExpandedGlobal?: boolean;
  onToggleSave?: (item: Item) => void;
  onOpenSearchGrounding?: (query: string, entityName: string) => void;
  savedItemIds?: Set<string>;
  readItemIds?: Set<string>;
  onMarkRead?: (id: string) => void;
}

export const AfricaSection: React.FC<AfricaSectionProps> = ({
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
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-mono tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9]">
            AFRICA TECH & INNOVATION
          </span>
          <span className="px-2 py-0.5 rounded bg-[#efe6d6]/80 dark:bg-[#1f2f29] text-[10px] font-mono text-[#e2522b] dark:text-[#f2916f] font-semibold">
            LEAPFROG SIGNALS
          </span>
        </div>
        <div className="h-px bg-[#ddd5c4] dark:bg-[#2a3a34] flex-1 ml-2" />
      </div>

      <p className="text-xs text-[#6b6a5f] dark:text-[#a3b0a9] font-mono mb-8 max-w-xl">
        Frontier fintech, agentic payments, off-grid energy, and supply chain digitization across key hubs (Nigeria, Kenya, Egypt, South Africa, Ghana, Rwanda).
      </p>

      {/* Grid of African Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {items.map(item => (
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
