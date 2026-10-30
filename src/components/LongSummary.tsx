import React from 'react';

export const LongSummary: React.FC<{ text: string; minutes?: number }> = ({ text, minutes }) => {
  const blocks: React.ReactNode[] = []; let bullets: string[] = [];
  const flush = () => { if (bullets.length) { blocks.push(<ul key={`u${blocks.length}`} className="list-disc pl-5 space-y-1">{bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>); bullets = []; } };
  text.split('\n').map(l => l.trim()).filter(Boolean).forEach(l => {
    if (l.startsWith('## ')) { flush(); blocks.push(<h4 key={`h${blocks.length}`} className="font-serif font-semibold text-lg mt-6 text-[#16231f] dark:text-[#ece6d8]">{l.slice(3)}</h4>); }
    else if (/^[-*] /.test(l)) bullets.push(l.slice(2));
    else { flush(); blocks.push(<p key={`p${blocks.length}`}>{l}</p>); }
  });
  flush();
  return (
    <div className="pt-3 border-t border-[#ddd5c4] dark:border-[#2a3a34]">
      <span className="text-xs uppercase font-mono tracking-wider font-semibold text-[#e2522b] dark:text-[#f2916f] block mb-1">
        In-depth summary{minutes ? ` · ${minutes} min read` : ''}
      </span>
      <div className="text-base leading-7 space-y-4 text-[#16231f] dark:text-[#ece6d8]">{blocks}</div>
    </div>
  );
};
