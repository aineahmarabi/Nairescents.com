import { TrendingUp, TrendingDown } from "lucide-react";
import type { ReactNode } from "react";
import { Skeleton } from "./Skeleton";

interface Props {
  label: string;
  value: string;
  sub?: string;
  change?: number;
  icon?: ReactNode;
  color?: string;
  data?: { v: number }[];
  sparkData?: number[];
  loading?: boolean;
}

function Sparkline({ data, color = "#C9A96E" }: { data: number[]; color?: string }) {
  if (data.length < 2) return null;
  const W = 64; const H = 28;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const rng = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / rng) * H}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MetricCard({ label, value, sub, change, icon, color = "#C9A96E", data, sparkData, loading }: Props) {
  const up = (change ?? 0) >= 0;
  const sparkValues = sparkData ?? data?.map((d) => d.v) ?? [];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <Skeleton className="h-3 w-16 mb-3" />
        <Skeleton className="h-7 w-24 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          {icon && <span style={{ color }} className="opacity-60">{icon}</span>}
          {sparkValues.length > 1 && <Sparkline data={sparkValues} color={color} />}
        </div>
      </div>
      {change !== undefined ? (
        <div className={`flex items-center gap-1 text-xs font-medium ${up ? "text-emerald-600" : "text-red-500"}`}>
          {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(change)}% vs last period</span>
        </div>
      ) : sub ? null : (
        <p className="text-xs text-gray-300">No comparison data</p>
      )}
    </div>
  );
}
