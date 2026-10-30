import React, { useState } from 'react';
import { BankLensBullet } from '../types/index.ts';
import { Sparkles, ShieldAlert, TrendingUp, Handshake, Scale, ChevronDown, ChevronUp } from 'lucide-react';

interface BankLensProps {
  bullets: BankLensBullet[];
}

export const BankLens: React.FC<BankLensProps> = ({ bullets }) => {
  const [openSparks, setOpenSparks] = useState<Record<number, boolean>>({});

  const toggleSpark = (index: number) => {
    setOpenSparks(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getIcon = (type: BankLensBullet['type']) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'threat':
        return <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'partnership':
        return <Handshake className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'regulatory':
        return <Scale className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  const getLabel = (type: BankLensBullet['type']) => {
    switch (type) {
      case 'opportunity':
        return 'Commercial Opportunity';
      case 'threat':
        return 'Disintermediation Threat';
      case 'partnership':
        return 'Partnership Angle';
      case 'regulatory':
        return 'Regulatory & Model Governance';
    }
  };

  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs uppercase font-mono tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9]">
          06 · BANK LENS
        </span>
        <div className="h-px bg-[#ddd5c4] dark:bg-[#2a3a34] flex-1" />
      </div>

      <div className="rounded-[12px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] p-6 sm:p-8 space-y-6">
        <div className="max-w-2xl text-xs text-[#6b6a5f] dark:text-[#a3b0a9] font-mono leading-relaxed">
          Strategic interpretations tailored for banking product teams, corporate cash managers, and credit committees.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bullets.map((bullet, idx) => (
            <div
              key={idx}
              className="p-5 rounded-[10px] bg-[#f5f0e7]/60 dark:bg-[#0f1a17]/50 border border-[#ddd5c4]/60 dark:border-[#2a3a34] flex flex-col justify-between"
            >
              <div>
                {/* Type header */}
                <div className="flex items-center gap-2 mb-2">
                  {getIcon(bullet.type)}
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#e2522b] dark:text-[#f2916f]">
                    {getLabel(bullet.type)}
                  </span>
                </div>

                {/* One-line headline */}
                <h3 className="font-serif font-semibold text-lg text-[#16231f] dark:text-[#ece6d8] mb-2 leading-snug">
                  {bullet.headline}
                </h3>

                {/* Explanation */}
                <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] leading-relaxed mb-4">
                  {bullet.explanation}
                </p>
              </div>

              {/* Idea Spark toggle */}
              {bullet.ideaSpark && bullet.ideaSpark.length > 0 && (
                <div className="pt-3 border-t border-[#ddd5c4]/50 dark:border-[#2a3a34]/50">
                  <button
                    type="button"
                    onClick={() => toggleSpark(idx)}
                    className="w-full flex items-center justify-between text-xs font-mono text-[#e2522b] dark:text-[#f2916f] hover:underline"
                  >
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Idea Spark (AI Brainstorm)</span>
                    </span>
                    {openSparks[idx] ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {openSparks[idx] && (
                    <div className="mt-3 p-3 rounded bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] space-y-2 text-xs">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#6b6a5f] dark:text-[#a3b0a9] block">
                        Brainstorm Concepts (Not Investment Advice)
                      </span>
                      <ul className="list-disc list-inside space-y-1.5 text-[#16231f] dark:text-[#ece6d8]">
                        {bullet.ideaSpark.map((idea, sIdx) => (
                          <li key={sIdx} className="leading-relaxed">
                            {idea}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
