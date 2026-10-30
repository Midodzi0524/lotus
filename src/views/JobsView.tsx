import React, { useMemo, useState } from 'react';
import jobsData from '../../data/jobs.json';
import { ExternalLink, MapPin, Building2, Clock } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  url: string;
  source: string;
  postedAt?: string;
  tags?: string[];
}

export const JobsView: React.FC = () => {
  const data = jobsData as { updatedAt: string; jobs: Job[] };
  const [query, setQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');

  const sources = useMemo(() => {
    const s = new Set(data.jobs.map(j => j.source));
    return ['all', ...Array.from(s)];
  }, [data.jobs]);

  const filtered = useMemo(() => {
    return data.jobs.filter(j => {
      const q = query.toLowerCase();
      const matchesQuery = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q);
      const matchesSource = sourceFilter === 'all' || j.source === sourceFilter;
      return matchesQuery && matchesSource;
    });
  }, [data.jobs, query, sourceFilter]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-[#16231f] dark:text-[#ece6d8] mb-2">
          Remote Product Jobs
        </h1>
        <p className="text-[#6b6a5f] dark:text-[#a3b0a9]">
          Global remote roles in product development and product marketing. Updated {data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : 'recently'}.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search title or company..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-[#ddd5c4] dark:border-[#2a3a34] bg-white dark:bg-[#17241f] text-[#16231f] dark:text-[#ece6d8] focus:outline-none focus:ring-2 focus:ring-[#e2522b]/30"
        />
        <select
          value={sourceFilter}
          onChange={e => setSourceFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-[#ddd5c4] dark:border-[#2a3a34] bg-white dark:bg-[#17241f] text-[#16231f] dark:text-[#ece6d8]"
        >
          {sources.map(s => <option key={s} value={s}>{s === 'all' ? 'All sources' : s}</option>)}
        </select>
      </div>

      <div className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] mb-4">
        {filtered.length} role{filtered.length !== 1 ? 's' : ''}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#6b6a5f] dark:text-[#a3b0a9]">
            No jobs match your filters. Check back after the next daily run.
          </div>
        )}
        {filtered.map(job => (
          <div
            key={job.id}
            className="p-5 rounded-xl border border-[#ddd5c4] dark:border-[#2a3a34] bg-white dark:bg-[#17241f] hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[#16231f] dark:text-[#ece6d8] mb-1">
                  {job.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#6b6a5f] dark:text-[#a3b0a9]">
                  <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#e2522b]/10 text-[#e2522b] text-xs font-medium">{job.source}</span>
                  {job.postedAt && (
                    <span className="flex items-center gap-1 text-xs"><Clock className="w-3.5 h-3.5" /> {new Date(job.postedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#e2522b] hover:bg-[#c94524] text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                Apply here <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
