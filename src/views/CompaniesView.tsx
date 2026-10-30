import React, { useState } from 'react';
import companiesData from '../../data/companies.json';
import { CompanyProfile, SectorKey } from '../types/index.ts';
import { SECTORS } from '../config/sectors.ts';
import { GeneratedCover } from '../components/GeneratedCover.tsx';
import { ExternalLink, DollarSign, MapPin, Calendar, ArrowLeft } from 'lucide-react';

export const CompaniesView: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);
  const [filterSector, setFilterSector] = useState<SectorKey | 'all'>('all');

  const filteredCompanies = (companiesData as CompanyProfile[]).filter(c => {
    if (filterSector === 'all') return true;
    return c.sector === filterSector;
  });

  if (selectedCompany) {
    const sectorMeta = SECTORS[selectedCompany.sector] || SECTORS.fintech;
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button
          type="button"
          onClick={() => setSelectedCompany(null)}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-mono text-[#e2522b] dark:text-[#f2916f] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to directory</span>
        </button>

        <div className="rounded-[12px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] p-6 sm:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#ddd5c4] dark:border-[#2a3a34]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: sectorMeta.color }}
                />
                <span
                  className="text-xs font-mono font-semibold uppercase tracking-wider"
                  style={{ color: sectorMeta.color }}
                >
                  {sectorMeta.label}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#16231f] dark:text-[#ece6d8]">
                {selectedCompany.name}
              </h1>
            </div>

            {selectedCompany.website && (
              <a
                href={selectedCompany.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] text-xs font-mono font-semibold hover:opacity-90 flex items-center gap-1.5"
              >
                <span>Visit Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Description */}
          <p className="font-serif text-lg text-[#16231f] dark:text-[#ece6d8] leading-relaxed">
            {selectedCompany.description}
          </p>

          {/* Meta facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-[8px] bg-[#f5f0e7]/60 dark:bg-[#0f1a17]/50 border border-[#ddd5c4]/60 dark:border-[#2a3a34] font-mono text-xs">
            <div>
              <span className="text-[#6b6a5f] dark:text-[#a3b0a9] block mb-1">FOUNDED</span>
              <span className="font-semibold text-[#16231f] dark:text-[#ece6d8]">{selectedCompany.founded || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#6b6a5f] dark:text-[#a3b0a9] block mb-1">LOCATION</span>
              <span className="font-semibold text-[#16231f] dark:text-[#ece6d8]">{selectedCompany.location || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#6b6a5f] dark:text-[#a3b0a9] block mb-1">TOTAL FUNDING</span>
              <span className="font-semibold text-[#16231f] dark:text-[#ece6d8]">{selectedCompany.totalFunding || 'Not disclosed'}</span>
            </div>
            <div>
              <span className="text-[#6b6a5f] dark:text-[#a3b0a9] block mb-1">LATEST ROUND</span>
              <span className="font-semibold text-[#16231f] dark:text-[#ece6d8]">{selectedCompany.latestRound || 'N/A'}</span>
            </div>
          </div>

          {/* Mentions Timeline */}
          <div>
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] mb-4">
              EDITORIAL MENTIONS
            </h3>
            <div className="space-y-3">
              {selectedCompany.mentions.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] flex items-center justify-between gap-4"
                >
                  <span className="font-serif text-sm font-medium text-[#16231f] dark:text-[#ece6d8]">
                    {m.headline}
                  </span>
                  <span className="text-xs font-mono text-[#e2522b] dark:text-[#f2916f] whitespace-nowrap">
                    Edition {m.editionDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] mb-2 block">
          INTELLIGENCE DIRECTORY
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#16231f] dark:text-[#ece6d8] mb-3">
          Tracked Companies
        </h1>
        <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] max-w-lg mx-auto">
          Entities identified, classified and monitored across daily pipeline runs.
        </p>
      </div>

      {/* Grid of Company Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCompanies.map(company => {
          const sectorMeta = SECTORS[company.sector] || SECTORS.fintech;
          return (
            <div
              key={company.slug}
              onClick={() => setSelectedCompany(company)}
              className="rounded-[10px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] hover:border-[#e2522b] dark:hover:border-[#f2916f] overflow-hidden cursor-pointer transition-all flex flex-col justify-between p-5 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: sectorMeta.color }}
                  />
                  <span
                    className="text-[11px] font-mono uppercase tracking-wider"
                    style={{ color: sectorMeta.color }}
                  >
                    {sectorMeta.label}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#16231f] dark:text-[#ece6d8] group-hover:text-[#e2522b] dark:group-hover:text-[#f2916f] mb-2">
                  {company.name}
                </h3>

                <p className="text-xs text-[#6b6a5f] dark:text-[#a3b0a9] line-clamp-3 leading-relaxed mb-4">
                  {company.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#ddd5c4]/60 dark:border-[#2a3a34]/60 flex items-center justify-between text-xs font-mono text-[#6b6a5f] dark:text-[#a3b0a9]">
                <span>{company.location || 'Global'}</span>
                <span className="font-semibold text-[#e2522b] dark:text-[#f2916f]">
                  {company.latestRound || 'Active'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
