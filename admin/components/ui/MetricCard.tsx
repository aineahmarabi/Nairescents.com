import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  label: string;
  value: string;
  change?: number;
  data?: { v: number }[];
}

function Sparkline({ data }: { data: { v: number }[] }) {
  if (data.length < 2) return null;
  const W = 80;
  const H = 36;
  const max = Math.max(...data.map(d => d.v), 1);
  const min = Math.min(...data.map(d => d.v));
  const range = max - min || 1;
  const toX = (i: number) => (i / (data.length - 1)) * W;
  const toY = (v: number) => H - ((v - min) / range) * H;
  const pts = data.map((d, i) => `${toX(i)},${toY(d.v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="shrink-0">
      <polyline points={pts} fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MetricCard({ label, value, change, data = [] }: Props) {
  const up = (change ?? 0) >= 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {data.length > 1 && <Sparkline data={data} />}
      </div>
      {change !== undefined ? (
        <div className={`flex items-center gap-1 text-xs font-medium ${up ? "text-emerald-600" : "text-red-500"}`}>
          {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(change)}% vs last period</span>
        </div>
      ) : (
        <p className="text-xs text-gray-300">No comparison data</p>
      )}
    </div>
  );
}
