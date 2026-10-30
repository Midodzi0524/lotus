import React, { useEffect, useRef, useState } from 'react';
import { Edition } from '../types/index.ts';
import { SECTORS, SECTOR_KEYS } from '../config/sectors.ts';

function useSeen(t = 0.4): [React.RefObject<any>, boolean] {
  const r = useRef<any>(null); const [s, set] = useState(false);
  useEffect(() => { const o = new IntersectionObserver(([e]) => e.isIntersecting && set(true), { threshold: t }); r.current && o.observe(r.current); return () => o.disconnect(); }, []);
  return [r, s];
}
/* Odometer: digits roll into place when scrolled into view */
export const Roll = ({ v }: { v: string }) => {
  const [r, s] = useSeen();
  return <span ref={r} className="qroll" aria-label={v}>{[...v].map((c, i) => /\d/.test(c)
    ? <span key={i} className="qcol"><span style={{ transform: `translateY(${s ? -(+c) * 10 : 0}%)`, transitionDuration: `${1100 + i * 110}ms` }}>{[...'0123456789'].map(d => <i key={d}>{d}</i>)}</span></span>
    : <span key={i}>{c}</span>)}</span>;
};
export const Ticker = ({ text }: { text: string }) =>
  <div className="qticker" aria-hidden><div>{[0, 1, 2, 3].map(i => <span key={i}>{text}<b> ● </b></span>)}</div></div>;

/* Scroll-reveal: fades sections/cards in as they enter the viewport */
export function useScrollReveal(dep: unknown) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('main section, main article, main details, main > div > div'));
    const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } }), { threshold: 0.08 });
    els.forEach((el, i) => { if (!el.classList.contains('rv')) { el.classList.add('rv'); el.style.transitionDelay = `${(i % 4) * 60}ms`; } o.observe(el); });
    return () => o.disconnect();
  }, [dep]);
}
/* Hero imagery: each sector is a port; lanes carry moving signals */
const POS = [[40, 120], [95, 60], [165, 100], [225, 45], [290, 95], [330, 150], [250, 160], [150, 165]];
const LANES = [[0, 1], [1, 3], [2, 4], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [2, 7], [1, 2]];
export function SignalMap({ edition }: { edition: Edition }) {
  const heads = edition.topThree.map(i => i.headline);
  const [m, setM] = useState(0);
  useEffect(() => { const t = setInterval(() => setM(x => (x + 1) % Math.max(1, heads.length)), 3200); return () => clearInterval(t); }, [heads.length]);
  const d = (a: number, b: number, i: number) => { const [x1, y1] = POS[a], [x2, y2] = POS[b]; return `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 30 - i * 3} ${x2} ${y2}`; };
  const st = edition.stats;
  return <div className="qmap"><div className="flex justify-between font-mono text-[11px] uppercase tracking-wider text-[#6b6a5f] dark:text-[#a3b0a9] mb-3"><span>Live signals</span><span>Edition #{edition.number} · {st.sectors} sectors</span></div>
    <svg viewBox="0 0 370 200" role="img" aria-label="Signals moving between sectors" className="text-[#16231f] dark:text-[#ece6d8]">
      {LANES.map(([a, b], i) => <g key={i}><path id={`l${i}`} d={d(a, b, i)} className="qlane" />
        <circle r="3.2" fill="#e2522b"><animateMotion dur={`${5 + (i % 4)}s`} begin={`${-i}s`} repeatCount="indefinite"><mpath href={`#l${i}`} /></animateMotion></circle></g>)}
      {SECTOR_KEYS.map((k, i) => { const [x, y] = POS[i]; const n = edition.sectors[k]?.length ?? 0; return <g key={k}><circle cx={x} cy={y} r="5" fill={SECTORS[k].color} /><circle cx={x} cy={y} r="5" stroke={SECTORS[k].color} className="qping" /><text x={x + 8} y={y + 14} fontSize="8" fontFamily="JetBrains Mono" fill="currentColor">{SECTORS[k].label.split(' ')[0].toUpperCase()} {n}</text></g>; })}
    </svg>
    {heads[m] && <div key={m} className="qtoast"><i className="qdot" />{heads[m].length > 70 ? heads[m].slice(0, 68) + '…' : heads[m]}</div>}
    <div className="grid grid-cols-3 gap-2 mt-1">{[['Companies', String(st.companies)], ['Raised', st.fundingTotalUsd ?? '—'], ['Sources live', `${st.sourcesOk}/${st.sourcesTotal}`]].map(([k, v]) =>
      <div key={k}><div className="font-mono text-[11px] uppercase tracking-wider text-[#6b6a5f] dark:text-[#a3b0a9]">{k}</div><div className="text-2xl font-semibold tracking-tight"><Roll v={v} /></div></div>)}</div></div>;
}
