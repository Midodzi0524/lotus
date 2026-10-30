import React, { useState, useEffect } from 'react';
import { Search, Globe, ExternalLink, X, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface GroundingSource {
  title: string;
  uri: string;
}

interface SearchGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  entityName?: string;
}

export const SearchGroundingModal: React.FC<SearchGroundingModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  entityName = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  if (!isOpen) return null;

  async function handleSearch(searchPrompt?: string) {
    const q = searchPrompt || query;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    setResultText(null);
    setSources([]);
    setSearchQueries([]);

    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Research and provide verified real-time facts using Google Search: ${q}`,
          entityName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch grounded intelligence');
      }

      setResultText(data.text);
      setSources(data.sources || []);
      setSearchQueries(data.webSearchQueries || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while connecting to Google Search');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[14px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#ddd5c4] dark:border-[#2a3a34] flex items-center justify-between bg-[#f5f0e7]/50 dark:bg-[#0f1a17]/50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-full bg-[#efe6d6] dark:bg-[#1f2f29] text-[#e2522b] dark:text-[#f2916f]">
              <Globe className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-[#16231f] dark:text-[#ece6d8]">
                  Google Search Grounded Intelligence
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#efe6d6]/70 dark:bg-[#1f2f29] text-[10px] font-mono text-[#e2522b] dark:text-[#f2916f] font-semibold">
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#6b6a5f] dark:text-[#a3b0a9]">
                Live web verification & latest developments via Google Search
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#efe6d6]/60 dark:hover:bg-[#1f2f29] text-[#6b6a5f] dark:text-[#a3b0a9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Query Input */}
        <form onSubmit={handleSubmit} className="p-4 border-b border-[#ddd5c4]/60 dark:border-[#2a3a34]/60 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6a5f] dark:text-[#a3b0a9]" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask anything to verify with live Google Search (e.g. latest funding, valuation, competitors)..."
              className="w-full pl-9 pr-3 py-2 rounded-[8px] bg-[#f5f0e7] dark:bg-[#0f1a17] border border-[#ddd5c4] dark:border-[#2a3a34] text-xs font-mono text-[#16231f] dark:text-[#ece6d8] outline-none focus:border-[#e2522b] dark:focus:border-[#f2916f]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 py-2 rounded bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] text-xs font-mono font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 transition-opacity"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Ground with Search</span>
          </button>
        </form>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#e2522b] dark:text-[#f2916f]" />
              <p className="text-xs font-mono text-[#6b6a5f] dark:text-[#a3b0a9]">
                Querying Google Search & synthesizing latest web intelligence with gemini-3.8-flash...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-[8px] bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs font-mono text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          {!loading && resultText && (
            <div className="space-y-5">
              {/* Grounded Response */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Google Search Grounded Analysis</span>
                </div>
                <div className="p-4 rounded-[10px] bg-[#f5f0e7]/70 dark:bg-[#0f1a17]/60 border border-[#ddd5c4] dark:border-[#2a3a34] font-serif text-sm leading-relaxed text-[#16231f] dark:text-[#ece6d8] whitespace-pre-line">
                  {resultText}
                </div>
              </div>

              {/* Verified Sources from Grounding Chunks */}
              {sources.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] font-semibold block">
                    Verified Google Search Web Sources ({sources.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] hover:border-[#e2522b] dark:hover:border-[#f2916f] flex items-center justify-between gap-2 text-xs font-mono group transition-all"
                      >
                        <span className="truncate text-[#16231f] dark:text-[#ece6d8] group-hover:text-[#e2522b] dark:group-hover:text-[#f2916f]">
                          {src.title || src.uri}
                        </span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0 text-[#6b6a5f] dark:text-[#a3b0a9] group-hover:text-[#e2522b] dark:group-hover:text-[#f2916f]" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Web Search Queries */}
              {searchQueries.length > 0 && (
                <div className="pt-2 text-[11px] font-mono text-[#6b6a5f] dark:text-[#a3b0a9] flex items-center gap-2">
                  <span>Google Queries:</span>
                  <div className="flex flex-wrap gap-1">
                    {searchQueries.map((sq, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-[#efe6d6]/50 dark:bg-[#1f2f29] text-[#16231f] dark:text-[#ece6d8]">
                        "{sq}"
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !resultText && !error && (
            <div className="py-12 text-center space-y-2 text-xs font-mono text-[#6b6a5f] dark:text-[#a3b0a9]">
              <Globe className="w-8 h-8 mx-auto opacity-40 text-[#e2522b] dark:text-[#f2916f]" />
              <p>Type a question or entity name above to pull real-time Google Search information.</p>
              <p className="text-[11px] opacity-75">Grounded using gemini-3.8-flash and official Google Search tool.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#ddd5c4] dark:border-[#2a3a34] bg-[#f5f0e7]/40 dark:bg-[#0f1a17]/40 flex items-center justify-between text-[11px] font-mono text-[#6b6a5f] dark:text-[#a3b0a9]">
          <span>Grounded with Google Search tool</span>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-[#16231f] dark:hover:text-[#ece6d8]"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
