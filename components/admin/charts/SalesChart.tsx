"use client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { BarChart2 } from "lucide-react";

interface DataPoint { date: string; sales: number; }
interface Props { data: DataPoint[]; }

function niceMax(value: number): number {
  if (value === 0) return 100;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

export default function SalesChart({ data }: Props) {
  if (data.length === 0 || data.every((d) => d.sales === 0)) {
    return (
      <div className="h-48 flex flex-col items-center justify-center gap-2 text-gray-300">
        <BarChart2 className="w-8 h-8" />
        <span className="text-sm text-gray-400">No sales yet — orders will appear here.</span>
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.sales));
  const yMax = niceMax(max);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 8 }}>
        <defs>
          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A96E" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#C9A96E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          domain={[0, yMax]}
          tickFormatter={(v: number) => v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)}
          width={38}
        />
        <Tooltip
          formatter={(v) => [`KES ${Number(v ?? 0).toLocaleString()}`, "Revenue"]}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
          cursor={{ stroke: "#C9A96E", strokeWidth: 1, strokeDasharray: "4 2" }}
        />
        <Area
          type="monotone"
          dataKey="sales"
          stroke="#C9A96E"
          strokeWidth={2}
          fill="url(#salesGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#C9A96E", stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
