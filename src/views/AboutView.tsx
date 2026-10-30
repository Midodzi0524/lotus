import React from 'react';
import { ShieldCheck, Scale, Cpu, Globe, Lock, ExternalLink } from 'lucide-react';
import { SOURCES } from '../config/sources.ts';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-12 text-[#16231f] dark:text-[#ece6d8]">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] block">
          ABOUT & METHODOLOGY
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">
          Lotus Daily Intelligence Brief
        </h1>
        <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9]">
          An autonomous, zero-cost pipeline producing calm, factual 10-minute innovation digests.
        </p>
      </div>

      {/* Mission / Bank Lens Concept */}
      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-bold border-b border-[#ddd5c4] dark:border-[#2a3a34] pb-2">
          Purpose & Audience
        </h2>
        <p className="font-serif text-base text-[#6b6a5f] dark:text-[#a3b0a9] leading-relaxed">
          Lotus is built for banking and tech product leaders who require a calm, daily 10-minute synthesis of what fintechs, AI labs, and startups are deploying. Rather than endless doom-scrolling through algorithmically boosted social media feeds, Lotus reads the top 8 startup repositories every morning, extracts sourced factual points, balances coverage equally across 8 sectors, and translates technical launches into concrete commercial and regulatory implications.
        </p>
      </section>

      {/* Sourced Data Ingestion */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-bold border-b border-[#ddd5c4] dark:border-[#2a3a34] pb-2">
          The 8 Monitored Sources
        </h2>
        <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] leading-relaxed">
          All data is ingested via public RSS feeds and authorized public endpoints with polite rate-limiting, honoring robots.txt and zero paywall circumvention:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          {SOURCES.map(s => (
            <div
              key={s.key}
              className="p-3 rounded bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] flex items-center justify-between"
            >
              <div>
                <span className="font-bold block text-[#16231f] dark:text-[#ece6d8]">{s.name}</span>
                <span className="text-[11px] text-[#6b6a5f] dark:text-[#a3b0a9]">{s.category === 'core' ? 'Core Source' : 'Fintech / Banking / Regional Feed'}</span>
              </div>
              <a
                href={s.homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e2522b] dark:text-[#f2916f] hover:underline"
              >
                Visit ↗
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Signal Scoring Formula */}
      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-bold border-b border-[#ddd5c4] dark:border-[#2a3a34] pb-2">
          Signal Scoring Methodology
        </h2>
        <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] leading-relaxed">
          Every ingested item is evaluated using a rigorous composite signal score from 0 to 100:
        </p>
        <div className="p-4 rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] font-mono text-xs space-y-2">
          <div className="font-bold text-[#e2522b] dark:text-[#f2916f]">
            signalScore = 0.30*novelty + 0.25*significance + 0.20*crossSourceMentions + 0.15*traction + 0.10*relevanceToBanking
          </div>
          <ul className="list-disc list-inside space-y-1 text-[#6b6a5f] dark:text-[#a3b0a9] pt-2">
            <li><strong>Novelty (30%):</strong> New technological paradigm vs incremental iteration.</li>
            <li><strong>Significance (25%):</strong> Capital scale, institutional syndication, or regulatory barrier crossed.</li>
            <li><strong>Cross-Source Mentions (20%):</strong> Corroboration across independent publishers.</li>
            <li><strong>Traction (15%):</strong> Verifiable customer volume, revenue or community metrics.</li>
            <li><strong>Banking Relevance (10%):</strong> Direct impact on payments, credit, risk, or compliance.</li>
          </ul>
        </div>
      </section>

      {/* Mandatory Legal & Ethical Disclosures */}
      <section className="space-y-4 pt-4 border-t border-[#ddd5c4] dark:border-[#2a3a34]">
        <h2 className="font-serif text-2xl font-bold">
          Policies & Disclosures
        </h2>

        <div className="space-y-4 text-xs font-mono leading-relaxed text-[#6b6a5f] dark:text-[#a3b0a9]">
          <div className="p-4 rounded bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] space-y-1.5">
            <span className="font-bold uppercase text-[#e2522b] dark:text-[#f2916f] flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              Employer Notice
            </span>
            <p>
              This is an independent personal educational and intelligence utility. <strong>Do not use this tool with confidential bank or enterprise information.</strong> Content, summaries, and editorial interpretations do not reflect the views or positions of any employer.
            </p>
          </div>

          <div className="p-4 rounded bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] space-y-1.5">
            <span className="font-bold uppercase text-[#e2522b] dark:text-[#f2916f] flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              Artificial Intelligence & Fact-Checking
            </span>
            <p>
              Summaries are produced by large language models (Gemini Flash) with automated adversarial fact-checking against source excerpts. LLMs can occasionally hallucinate; all users must verify critical facts against original sources before relying on them.
            </p>
          </div>

          <div className="p-4 rounded bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] space-y-1.5">
            <span className="font-bold uppercase text-[#e2522b] dark:text-[#f2916f] flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              Privacy & Zero-Tracking Guarantee
            </span>
            <p>
              Lotus collects zero tracking telemetry, analytics, cookies, or user logs. Bookmarks and watchlists remain entirely stored on your browser device. Total operating cost is $0 per month.
            </p>
          </div>

          <div className="p-4 rounded bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] space-y-1.5">
            <span className="font-bold uppercase text-[#e2522b] dark:text-[#f2916f] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Corrections & Takedowns
            </span>
            <p>
              Found a mistake or represent a copyright holder? Report corrections instantly via GitHub Issues. Corrected items display a permanent public "Corrected" tag with the verification date.
            </p>
            <a
              href="https://github.com/daily-brief/daily-brief/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e2522b] dark:text-[#f2916f] underline inline-block pt-1"
            >
              Open a Correction or Takedown Notice ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
