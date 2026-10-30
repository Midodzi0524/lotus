import React from 'react';
import { DeepDive } from '../types/index.ts';
import { Sparkles, Calendar, BookOpen, ArrowLeft, ArrowUpRight } from 'lucide-react';

interface WeeklyViewProps {
  onBackToDaily: () => void;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({ onBackToDaily }) => {
  const sampleDeepDive: DeepDive = {
    title: "Weekly Deep Dive: The Rise of Autonomous Commercial Ledgers",
    weekEnding: "2026-10-25",
    summary: "A synthesis of this week's breakthrough developments across autonomous dealership financing, deterministic LLM sandboxes, and industrial battery capacity markets.",
    topStories: [
      { title: "Numa's $32M Series B: Vertical dealership cashflow monopolies", takeaway: "Controls the point-of-sale customer communication loop before selling balance-sheet lending." },
      { title: "Cognition's deterministic audit sandboxes", takeaway: "Removes tier-one bank regulatory barriers for autonomous code synthesis agents." },
      { title: "GridBeyond secures €52M equity for virtual power plants", takeaway: "Decentralized energy arbitrage creates fresh project finance underwriting collateral." },
      { title: "Atlar's direct real-time SEPA Instant treasury orchestrator", takeaway: "Compresses bank host-to-host file processing into bidirectional developer APIs." },
      { title: "Bilt Rewards expands residential rent acquisition pipeline", takeaway: "Converts primary tenant rental spend into an audited mortgage applicant funnel." },
      { title: "Aignostics closes $34M for multimodal precision pathology", takeaway: "Diagnostic algorithms reduce oncology drug trial duration and insurance claims." },
      { title: "Antora Energy starts commercial thermal battery deliveries", takeaway: "Decarbonizes heavy industrial plant heat without costly electrical grid overhauls." },
      { title: "Deel adds cross-border contractor phantom equity compliance", takeaway: "Unifies international contractor compensation and securities law withholding." },
      { title: "PolicyMe slashes municipal zoning approval lags by 80%", takeaway: "Accelerates commercial residential construction loan disbursements." },
      { title: "Einride deploys autonomous electric freight at Antwerp-Bruges", takeaway: "Autonomous heavy haulage proves commercially viable in dense port corridors." },
    ],
    trendAnalysis: {
      trendName: "Agent-to-Agent Micro-Settlement Rails",
      description: "As autonomous software agents begin purchasing cloud infrastructure, software licenses, and repair services directly, traditional card interchange fee schedules face margin pressure from dynamic token negotiations.",
      implication: "Banks must develop programmable machine-to-machine liquidity accounts with real-time cryptographic signature authorization.",
    },
    bankProductIdeas: [
      "1. Programmatic M2M Treasury APIs: Instant automated liquidity sweeping between overnight yield and operational agent accounts.",
      "2. Autonomous Dealership Repair Credit: Pre-approved point-of-sale installment micro-loans embedded in automotive dealer service messaging.",
      "3. First-Time Homebuyer Rent Loyalty Accounts: Down-payment matching escrow accounts tied to on-time monthly rental verification.",
      "4. Deterministic Code Governance Sandbox: Internal compliance scanning tool to speed OCC model risk approvals for synthetic engineering scripts.",
      "5. Industrial Transition Project Bonds: Securitized debt facilities backed by corporate thermal storage and energy arbitrage cashflows."
    ]
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      <button
        type="button"
        onClick={onBackToDaily}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#e2522b] dark:text-[#f2916f] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Today's Daily Brief</span>
      </button>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9]">
          <Calendar className="w-3.5 h-3.5" />
          <span>SUNDAY EDITION · WEEK ENDING {sampleDeepDive.weekEnding}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#16231f] dark:text-[#ece6d8] leading-snug">
          {sampleDeepDive.title}
        </h1>
        <p className="font-serif text-base text-[#6b6a5f] dark:text-[#a3b0a9] leading-relaxed max-w-xl mx-auto">
          {sampleDeepDive.summary}
        </p>
      </div>

      {/* Top 10 Stories of the Week */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] border-b border-[#ddd5c4] dark:border-[#2a3a34] pb-2">
          THE WEEK'S TOP 10 SIGNALS
        </h2>
        <div className="space-y-3">
          {sampleDeepDive.topStories.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] flex items-start gap-4"
            >
              <span className="font-mono text-xs font-bold text-[#e2522b] dark:text-[#f2916f] mt-0.5">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-serif font-semibold text-base text-[#16231f] dark:text-[#ece6d8] mb-1">
                  {s.title}
                </h3>
                <p className="text-xs text-[#6b6a5f] dark:text-[#a3b0a9] leading-relaxed">
                  <strong>Takeaway:</strong> {s.takeaway}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* One Macro Trend Explained */}
      <section className="p-6 rounded-[12px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#e2522b] dark:text-[#f2916f] font-semibold block">
          MACRO TREND DECONSTRUCTION
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#16231f] dark:text-[#ece6d8]">
          {sampleDeepDive.trendAnalysis.trendName}
        </h3>
        <p className="font-serif text-sm text-[#6b6a5f] dark:text-[#a3b0a9] leading-relaxed">
          {sampleDeepDive.trendAnalysis.description}
        </p>
        <div className="p-3 rounded bg-[#efe6d6]/40 dark:bg-[#1f2f29]/50 border-l-2 border-[#e2522b] dark:border-[#f2916f] text-xs font-mono text-[#16231f] dark:text-[#ece6d8]">
          <strong>Core Implication:</strong> {sampleDeepDive.trendAnalysis.implication}
        </div>
      </section>

      {/* 5 Ideas for a Bank Product Team */}
      <section className="p-6 rounded-[12px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#e2522b] dark:text-[#f2916f]" />
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] font-semibold">
            5 CONCRETE IDEAS FOR A BANK PRODUCT TEAM
          </h2>
        </div>
        <div className="space-y-2.5 text-sm font-serif text-[#16231f] dark:text-[#ece6d8]">
          {sampleDeepDive.bankProductIdeas.map((idea, idx) => (
            <div key={idx} className="p-3 rounded bg-[#f5f0e7]/70 dark:bg-[#0f1a17]/50 border border-[#ddd5c4]/60 dark:border-[#2a3a34] leading-relaxed">
              {idea}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
