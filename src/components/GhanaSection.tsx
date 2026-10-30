import React from 'react';
import { Item } from '../types/index.ts';
import { ItemCard } from './ItemCard.tsx';
import { Landmark, Sparkles, ShieldCheck } from 'lucide-react';

interface GhanaSectionProps {
  items?: Item[];
  isExpandedGlobal?: boolean;
  onToggleSave?: (item: Item) => void;
  onOpenSearchGrounding?: (query: string, entityName: string) => void;
  savedItemIds?: Set<string>;
  readItemIds?: Set<string>;
  onMarkRead?: (id: string) => void;
}

export const GhanaSection: React.FC<GhanaSectionProps> = ({
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
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs uppercase font-mono tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9]">
            GHANA INNOVATION SPOTLIGHT
          </span>
          <span className="px-2 py-0.5 rounded bg-[#C8933E]/15 dark:bg-[#C8933E]/25 text-[10px] font-mono text-[#9B6D20] dark:text-[#E2BA72] font-semibold border border-[#C8933E]/30">
            ACCRA & REGIONAL HUBS
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#2D5A43]/10 dark:bg-[#2D5A43]/20 text-[10px] font-mono text-[#2D5A43] dark:text-[#76B894] font-medium">
            <ShieldCheck className="w-3 h-3" />
            BOG SANDBOX & GHIPSS
          </span>
        </div>
        <div className="h-px bg-[#ddd5c4] dark:bg-[#2a3a34] flex-1 ml-2" />
      </div>

      <div className="p-4 mb-8 rounded-[10px] bg-[#fbf8f1] dark:bg-[#25201B] border border-[#ddd5c4] dark:border-[#2a3a34]">
        <div className="flex items-start gap-3">
          <span className="p-2 rounded-md bg-[#C8933E]/15 dark:bg-[#C8933E]/20 text-[#9B6D20] dark:text-[#E2BA72] shrink-0 mt-0.5">
            <Landmark className="w-4 h-4" />
          </span>
          <div className="text-xs">
            <p className="font-serif font-semibold text-[#16231f] dark:text-[#ece6d8] mb-1">
              West Africa's Interoperability Pioneer
            </p>
            <p className="font-mono text-[#6b6a5f] dark:text-[#a3b0a9] leading-relaxed">
              Ghana operates one of the continent's most integrated digital payment architectures via GhIPSS, pioneering universal GhQR standardization, Bank of Ghana regulatory sandboxing, cross-border remittance termination, and cocoa agri-supply chain intelligence across Accra, Kumasi, and Takoradi.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Ghanaian Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
