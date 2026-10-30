import React from 'react';
import { SourceStatusItem } from '../types/index.ts';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface SourceStatusProps {
  statusList: SourceStatusItem[];
}

export const SourceStatus: React.FC<SourceStatusProps> = ({ statusList }) => {
  if (!statusList || statusList.length === 0) return null;

  return (
    <div className="mb-14">
      <details className="group rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] p-5">
        <summary className="text-xs uppercase font-mono tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] cursor-pointer hover:text-[#e2522b] dark:hover:text-[#f2916f] flex items-center justify-between outline-none">
          <span>SOURCE STATUS & PIPELINE HEALTH ({statusList.length} SOURCES POLLED)</span>
          <span className="text-sm font-sans group-open:rotate-180 transition-transform">▾</span>
        </summary>

        <div className="mt-4 pt-4 border-t border-[#ddd5c4]/60 dark:border-[#2a3a34]/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {statusList.map(s => {
              const isOk = s.status === 'ok';
              return (
                <div
                  key={s.sourceKey}
                  className="p-3 rounded bg-[#f5f0e7]/50 dark:bg-[#0f1a17]/40 border border-[#ddd5c4]/50 dark:border-[#2a3a34] text-xs font-mono"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-[#16231f] dark:text-[#ece6d8]">
                      {s.name}
                    </span>
                    {isOk ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                  </div>
                  <div className="text-[11px] text-[#6b6a5f] dark:text-[#a3b0a9] flex justify-between">
                    <span>{s.itemsCount} items parsed</span>
                    <span className="uppercase">{s.status.replace('_', ' ')}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-[11px] font-mono text-[#6b6a5f] dark:text-[#a3b0a9] flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>Polled daily at 05:00 UTC via scheduled GitHub Action with rate-limit backoff.</span>
          </div>
        </div>
      </details>
    </div>
  );
};
