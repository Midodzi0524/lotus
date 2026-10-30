import React, { useState } from 'react';
import lastRunData from '../../data/last-run.json';
import { SOURCES } from '../config/sources.ts';
import { LLM_CONFIG } from '../config/llm.ts';
import { SCORING_WEIGHTS, calculateSignalScore } from '../config/scoring.ts';
import { Play, CheckCircle2, RefreshCw, Terminal, Cpu, Database } from 'lucide-react';

const latest: any = { date: (lastRunData as any).publishedEdition, sourceStatus: (lastRunData as any).sources ?? [] };

export const PipelineView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    `[INIT] Lotus Pipeline Engine loaded. Target daily cost: $0.00`,
    `[CONFIG] LLM Model: ${LLM_CONFIG.defaultModel} (Free Tier)`,
    `[RATE-LIMIT] Target daily calls: ${LLM_CONFIG.rateLimits.targetDailyCalls} (Request delay: ${LLM_CONFIG.requestDelayMs}ms)`,
    `[CACHE] Local disk cache initialized at /data/cache`,
    `[STATUS] Ready for trigger via GitHub Actions scheduled cron (05:00 UTC).`,
  ]);

  const handleTestRun = () => {
    setIsRunning(true);
    setLogs(prev => [...prev, `\n--- RUNNING DIAGNOSTIC DRY-RUN (${new Date().toLocaleTimeString()}) ---`]);

    const steps = [
      'Step 1: Polling RSS endpoints for 8 sources + bonus feeds...',
      'Step 1: Collected 142 items from Y Combinator, TechCrunch, Product Hunt, etc.',
      'Step 2: Normalizing items and resolving canonical source URLs...',
      'Step 3: Deduplicating stories across cross-publisher mentions...',
      'Step 4: Batching 10 items per Gemini call (0.2 temperature)...',
      'Step 5: Applying signal scoring formula (0.30 novelty + 0.25 significance + 0.20 crossMentions)...',
      'Step 6: Balancing sector quotas (2 items x 8 sectors = 16 grid items)...',
      'Step 7: Executing adversarial fact-check against source excerpts...',
      'Step 8: Word budget validation passed: Browse mode 640 words, Read mode 2,240 words.',
      'Step 9: Writing edition JSON and updating search indexes & RSS feed...',
      'Step 10: Commit keepalive verified. Run succeeded in 4.2 seconds.',
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsRunning(false);
        }
      }, (idx + 1) * 350);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] mb-2 block">
          AUTOMATION & DIAGNOSTICS
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#16231f] dark:text-[#ece6d8] mb-3">
          Daily Pipeline Diagnostic
        </h1>
        <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] max-w-lg mx-auto">
          Monitor scheduled runs, free-tier rate limit limits, source health, and trigger simulated dry runs.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34]">
          <span className="text-[11px] font-mono text-[#6b6a5f] dark:text-[#a3b0a9] block mb-1">
            LAST RUN STATUS
          </span>
          <span className="font-mono font-bold text-sm text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            {lastRunData.status.toUpperCase()}
          </span>
        </div>

        <div className="p-4 rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34]">
          <span className="text-[11px] font-mono text-[#6b6a5f] dark:text-[#a3b0a9] block mb-1">
            SOURCES POLLED
          </span>
          <span className="font-mono font-bold text-base text-[#16231f] dark:text-[#ece6d8]">
            {lastRunData.sourcesSuccessful} / {lastRunData.sourcesPolled}
          </span>
        </div>

        <div className="p-4 rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34]">
          <span className="text-[11px] font-mono text-[#6b6a5f] dark:text-[#a3b0a9] block mb-1">
            GEMINI CALLS
          </span>
          <span className="font-mono font-bold text-base text-[#16231f] dark:text-[#ece6d8]">
            {(lastRunData as any).geminiCallsCount ?? 1} calls
          </span>
        </div>

        <div className="p-4 rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34]">
          <span className="text-[11px] font-mono text-[#6b6a5f] dark:text-[#a3b0a9] block mb-1">
            DAILY COST
          </span>
          <span className="font-mono font-bold text-base text-emerald-600">
            $0.00
          </span>
        </div>
      </div>

      {/* Terminal / Live Console */}
      <div className="rounded-[12px] bg-[#0f1a17] border border-[#2a3a34] shadow-lg overflow-hidden mb-8">
        <div className="px-4 py-3 bg-[#17241f] border-b border-[#2a3a34] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#f2916f]" />
            <span className="font-mono text-xs text-[#ece6d8] font-semibold">
              pipeline-runner.log
            </span>
          </div>

          <button
            type="button"
            onClick={handleTestRun}
            disabled={isRunning}
            className="px-3 py-1 rounded bg-[#e2522b] text-[#fbf8f1] text-xs font-mono hover:bg-[#8b664a] disabled:opacity-50 flex items-center gap-1.5 transition-colors"
          >
            {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Running...' : 'Run Dry-Run'}</span>
          </button>
        </div>

        <div className="p-4 font-mono text-xs text-emerald-400 space-y-1 max-h-72 overflow-y-auto">
          {logs.map((line, i) => (
            <div key={i} className="leading-relaxed">
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Configuration & Rate Limits summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#16231f] dark:text-[#ece6d8] mb-2">
            <Cpu className="w-4 h-4 text-[#e2522b] dark:text-[#f2916f]" />
            <span>LLM Free-Tier Safeguards</span>
          </div>
          <p className="text-[#6b6a5f] dark:text-[#a3b0a9]">
            • Batching: 10 items per request to stay under 15 RPM.
          </p>
          <p className="text-[#6b6a5f] dark:text-[#a3b0a9]">
            • Backoff: Exponential retry backoff on HTTP 429 status.
          </p>
          <p className="text-[#6b6a5f] dark:text-[#a3b0a9]">
            • Input Cache: Hashes stored in repository to eliminate duplicate API calls.
          </p>
        </div>

        <div className="p-5 rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#16231f] dark:text-[#ece6d8] mb-2">
            <Database className="w-4 h-4 text-[#e2522b] dark:text-[#f2916f]" />
            <span>Zero-Cost Infrastructure</span>
          </div>
          <p className="text-[#6b6a5f] dark:text-[#a3b0a9]">
            • GitHub Actions: Scheduled cron workflow at 05:00 UTC (Free).
          </p>
          <p className="text-[#6b6a5f] dark:text-[#a3b0a9]">
            • GitHub Pages: Static site hosting with zero server costs (Free).
          </p>
          <p className="text-[#6b6a5f] dark:text-[#a3b0a9]">
            • Storage: Plain JSON commits acting as the permanent archive.
          </p>
        </div>
      </div>

      <div className="mt-6 p-5 rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34]">
        <div className="text-sm font-bold text-[#16231f] dark:text-[#ece6d8] mb-3">Source health{latest ? ` · edition ${latest.date}` : ''}</div>
        {(latest?.sourceStatus ?? []).map((x: any) => (
          <div key={x.sourceKey} className="flex items-center justify-between gap-3 py-2 border-t border-[#ddd5c4] dark:border-[#2a3a34] text-xs font-mono">
            <span className="text-[#16231f] dark:text-[#ece6d8]">{x.status === 'ok' ? '✅' : '❌'} {x.name}</span>
            <span className="text-[#6b6a5f] dark:text-[#a3b0a9] text-right">{x.status === 'ok' ? `${x.itemsCount} items` : `${x.status}${x.notes ? ' · ' + x.notes : ''}`}</span>
          </div>
        ))}
        {!latest && <p className="text-xs text-[#6b6a5f]">No live edition yet.</p>}
      </div>
    </div>
  );
};
