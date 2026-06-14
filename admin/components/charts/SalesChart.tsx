"use client";

interface DataPoint {
  date: string;
  sales: number;
}

interface Props {
  data: DataPoint[];
}

export default function SalesChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-300 text-sm gap-2">
        <svg className="w-10 h-10 text-gray-100" viewBox="0 0 40 30" fill="none">
          <polyline points="0,28 8,20 16,22 24,10 32,14 40,4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        No data yet — sales will appear here once you receive orders.
      </div>
    );
  }

  const W = 600;
  const H = 200;
  const PAD = { top: 16, right: 16, bottom: 32, left: 56 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...data.map(d => d.sales), 1);
  const minVal = Math.min(...data.map(d => d.sales));
  const range = maxVal - minVal || 1;

  const toX = (i: number) => (i / (data.length - 1)) * chartW;
  const toY = (v: number) => chartH - ((v - minVal) / range) * chartH;

  const points = data.map((d, i) => `${toX(i)},${toY(d.sales)}`).join(" ");
  const areaPath = `M0,${toY(data[0].sales)} ${data.map((d, i) => `L${toX(i)},${toY(d.sales)}`).join(" ")} L${toX(data.length - 1)},${chartH} L0,${chartH} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    val: Math.round(minVal + t * range),
    y: chartH - t * chartH,
  }));

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 280 }}>
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {/* Grid + Y labels */}
          {yTicks.map(t => (
            <g key={t.val}>
              <line x1={0} y1={t.y} x2={chartW} y2={t.y} stroke="#f0ede8" strokeWidth="1" />
              <text x={-8} y={t.y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                {t.val >= 1000 ? `${Math.round(t.val / 1000)}k` : t.val}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#salesGradient)" />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#C9A96E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots + X labels */}
          {data.map((d, i) => (
            <g key={i}>
              <circle cx={toX(i)} cy={toY(d.sales)} r="3" fill="#C9A96E" />
              {(i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 6) === 0) && (
                <text x={toX(i)} y={chartH + 16} textAnchor="middle" fontSize="10" fill="#9ca3af">
                  {d.date}
                </text>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
