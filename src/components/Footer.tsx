import React from 'react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-24 border-t border-[#ddd5c4] dark:border-[#2a3a34] pt-12 pb-20 text-xs text-[#6b6a5f] dark:text-[#a3b0a9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Disclaimers & Ethics */}
        <div className="space-y-3 font-mono text-[11px] leading-relaxed">
          <p>
            <strong className="text-[#16231f] dark:text-[#ece6d8]">EMPLOYER NOTE:</strong> Personal learning and industry intelligence tool. Do not use this tool with confidential bank information. Summaries and perspectives do not represent any employer or institution.
          </p>
          <p>
            <strong className="text-[#16231f] dark:text-[#ece6d8]">AI DISCLOSURE:</strong> Summaries are autonomously generated from public RSS feeds and directories via Gemini Free Tier. AI outputs may contain factual inaccuracies; always verify with original sources before making commercial decisions.
          </p>
          <p>
            <strong className="text-[#16231f] dark:text-[#ece6d8]">NO INVESTMENT ADVICE:</strong> Content is strictly informational and educational. Never make equity investments or credit underwriting commitments based solely on automated summaries.
          </p>
        </div>

        {/* Links row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#ddd5c4]/60 dark:border-[#2a3a34]/60 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="hover:text-[#e2522b] dark:hover:text-[#f2916f] underline"
            >
              Methodology & Sources
            </button>
            <button
              type="button"
              onClick={() => onNavigate('glossary')}
              className="hover:text-[#e2522b] dark:hover:text-[#f2916f] underline"
            >
              Glossary
            </button>
            <a
              href="https://github.com/daily-brief/daily-brief/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e2522b] dark:hover:text-[#f2916f] underline"
            >
              Corrections & Takedowns
            </a>
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e2522b] dark:hover:text-[#f2916f] underline"
            >
              RSS Feed
            </a>
          </div>

          <div className="text-[11px] text-[#6b6a5f]/80 dark:text-[#a3b0a9]/80">
            Lotus Daily Brief · Zero-Cost Architecture ($0/month)
          </div>
        </div>
      </div>
    </footer>
  );
};
