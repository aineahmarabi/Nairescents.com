"use client";

interface DataPoint { date: string; sales: number; }
interface Props { data: DataPoint[]; }

export default function SalesChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2" style={{ color: "#d1d5db" }}>
        <svg className="w-10 h-10" viewBox="0 0 40 30" fill="none">
          <polyline points="0,28 8,20 16,22 24,10 32,14 40,4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 13 }}>No data yet — sales appear once you receive orders.</span>
      </div>
    );
  }

  const W = 600; const H = 200;
  const PAD = { top: 16, right: 16, bottom: 32, left: 56 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;
  const maxV = Math.max(...data.map(d => d.sales), 1);
  const minV = Math.min(...data.map(d => d.sales));
  const rng = maxV - minV || 1;
  const toX = (i: number) => (i / (data.length - 1)) * cW;
  const toY = (v: number) => cH - ((v - minV) / rng) * cH;
  const pts = data.map((d, i) => `${toX(i)},${toY(d.sales)}`).join(" ");
  const area = `M0,${toY(data[0].sales)} ${data.map((d, i) => `L${toX(i)},${toY(d.sales)}`).join(" ")} L${toX(data.length - 1)},${cH} L0,${cH} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => ({ val: Math.round(minV + t * rng), y: cH - t * cH }));

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 280 }}>
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {ticks.map(t => (
            <g key={t.val}>
              <line x1={0} y1={t.y} x2={cW} y2={t.y} stroke="#f0ede8" strokeWidth="1" />
              <text x={-8} y={t.y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                {t.val >= 1000 ? `${Math.round(t.val / 1000)}k` : t.val}
              </text>
            </g>
          ))}
          <path d={area} fill="url(#sg)" />
          <polyline points={pts} fill="none" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {data.map((d, i) => (
            <g key={i}>
              <circle cx={toX(i)} cy={toY(d.sales)} r="3" fill="#C9A96E" />
              {(i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 6) === 0) && (
                <text x={toX(i)} y={cH + 16} textAnchor="middle" fontSize="10" fill="#9ca3af">{d.date}</text>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
