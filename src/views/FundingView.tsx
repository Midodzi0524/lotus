import React, { useState } from 'react';
import fundingData from '../../data/funding.json';
import { FundingEvent, SectorKey } from '../types/index.ts';
import { SECTORS } from '../config/sectors.ts';
import { Download, ArrowUpDown, ExternalLink } from 'lucide-react';
import { getSafeSourceUrl } from '../utils/sourceUrl.ts';

export const FundingView: React.FC = () => {
  const [deals, setDeals] = useState<FundingEvent[]>(fundingData as FundingEvent[]);
  const [sortField, setSortField] = useState<'date' | 'amount' | 'company'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  const handleSort = (field: 'date' | 'amount' | 'company') => {
    const isAsc = sortField === field ? !sortAsc : false;
    setSortField(field);
    setSortAsc(isAsc);

    const sorted = [...deals].sort((a, b) => {
      if (field === 'company') {
        return isAsc ? a.company.localeCompare(b.company) : b.company.localeCompare(a.company);
      }
      if (field === 'date') {
        return isAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
      }
      if (field === 'amount') {
        const numA = parseFloat(a.amount.replace(/[^0-9.]/g, '')) || 0;
        const numB = parseFloat(b.amount.replace(/[^0-9.]/g, '')) || 0;
        return isAsc ? numA - numB : numB - numA;
      }
      return 0;
    });
    setDeals(sorted);
  };

  const handleDownloadCSV = () => {
    const headers = ['Company', 'Round', 'Amount', 'Sector', 'Lead Investors', 'Location', 'Date', 'Source URL'];
    const rows = deals.map(d => [
      `"${d.company}"`,
      `"${d.round}"`,
      `"${d.amount}"`,
      `"${SECTORS[d.sector]?.label || d.sector}"`,
      `"${(d.leadInvestors || []).join('; ')}"`,
      `"${d.location || ''}"`,
      `"${d.date}"`,
      `"${d.sourceUrl}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lotus-venture-funding-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Funding by sector aggregate
  const sectorTotals: Record<string, number> = {};
  deals.forEach(d => {
    const num = parseFloat(d.amount.replace(/[^0-9.]/g, '')) || 0;
    sectorTotals[d.sector] = (sectorTotals[d.sector] || 0) + num;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9] mb-2 block">
          VENTURE CAPITAL TRACKER
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#16231f] dark:text-[#ece6d8] mb-3">
          Funding Rounds & Transactions
        </h1>
        <p className="text-sm text-[#6b6a5f] dark:text-[#a3b0a9] max-w-lg mx-auto">
          Fact-checked venture financing deals verified against primary publisher sources and regulatory disclosures.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="inline-flex rounded border border-[#ddd5c4] dark:border-[#2a3a34] p-0.5 bg-[#fbf8f1] dark:bg-[#17241f] text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded transition-colors ${
              viewMode === 'table'
                ? 'bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] font-semibold'
                : 'text-[#6b6a5f] dark:text-[#a3b0a9]'
            }`}
          >
            Table View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1 rounded transition-colors ${
              viewMode === 'chart'
                ? 'bg-[#e2522b] text-[#fbf8f1] dark:bg-[#f2916f] dark:text-[#0f1a17] font-semibold'
                : 'text-[#6b6a5f] dark:text-[#a3b0a9]'
            }`}
          >
            Sector Breakdown Bar
          </button>
        </div>

        <button
          type="button"
          onClick={handleDownloadCSV}
          className="px-3.5 py-1.5 rounded bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] text-xs font-mono font-medium text-[#16231f] dark:text-[#ece6d8] hover:border-[#e2522b] dark:hover:border-[#f2916f] flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-[#e2522b] dark:text-[#f2916f]" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* View: Chart */}
      {viewMode === 'chart' && (
        <div className="mb-8 p-6 rounded-[12px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#6b6a5f] dark:text-[#a3b0a9]">
            Capital Distribution by Sector (Millions USD/EUR)
          </h3>
          <div className="space-y-3 pt-2">
            {Object.entries(sectorTotals).map(([sectorKey, total]) => {
              const sector = SECTORS[sectorKey as SectorKey];
              const maxTotal = Math.max(...Object.values(sectorTotals));
              const pct = (total / maxTotal) * 100;
              return (
                <div key={sectorKey} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-[#16231f] dark:text-[#ece6d8]">
                    <span>{sector?.label || sectorKey}</span>
                    <span className="font-semibold">${total}M</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#ddd5c4]/40 dark:bg-[#2a3a34]/50 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: sector?.color || '#e2522b',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View: Table */}
      <div className="rounded-[12px] bg-[#fbf8f1] dark:bg-[#17241f] border border-[#ddd5c4] dark:border-[#2a3a34] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#efe6d6]/30 dark:bg-[#1f2f29]/40 border-b border-[#ddd5c4] dark:border-[#2a3a34] font-mono text-[#6b6a5f] dark:text-[#a3b0a9] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 cursor-pointer hover:text-[#16231f] dark:hover:text-[#ece6d8]" onClick={() => handleSort('company')}>
                <span className="flex items-center gap-1">Company <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              <th className="py-3 px-4">Round</th>
              <th className="py-3 px-4 cursor-pointer hover:text-[#16231f] dark:hover:text-[#ece6d8]" onClick={() => handleSort('amount')}>
                <span className="flex items-center gap-1">Amount <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              <th className="py-3 px-4">Sector</th>
              <th className="py-3 px-4">Lead Investors</th>
              <th className="py-3 px-4 cursor-pointer hover:text-[#16231f] dark:hover:text-[#ece6d8]" onClick={() => handleSort('date')}>
                <span className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              <th className="py-3 px-4 text-right">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ddd5c4]/60 dark:divide-[#2a3a34]/60 font-mono">
            {deals.map(deal => {
              const sector = SECTORS[deal.sector];
              return (
                <tr key={deal.id} className="hover:bg-[#efe6d6]/20 dark:hover:bg-[#1f2f29]/20 transition-colors">
                  <td className="py-3.5 px-4 font-serif font-semibold text-sm text-[#16231f] dark:text-[#ece6d8]">
                    {deal.company}
                  </td>
                  <td className="py-3.5 px-4 text-[#6b6a5f] dark:text-[#a3b0a9]">
                    {deal.round}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#16231f] dark:text-[#ece6d8]">
                    {deal.amount}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px]"
                      style={{
                        backgroundColor: `${sector?.color}15`,
                        color: sector?.color,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sector?.color }} />
                      {sector?.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#6b6a5f] dark:text-[#a3b0a9] max-w-xs truncate">
                    {(deal.leadInvestors || []).join(', ') || 'Undisclosed'}
                  </td>
                  <td className="py-3.5 px-4 text-[#6b6a5f] dark:text-[#a3b0a9]">
                    {deal.date}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={getSafeSourceUrl(deal.sourceUrl, deal.company, `${deal.company} ${deal.round} ${deal.amount}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#e2522b] dark:text-[#f2916f] hover:underline inline-flex items-center gap-0.5"
                    >
                      Verify
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
