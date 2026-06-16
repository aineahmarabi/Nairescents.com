"use client";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { getOrders } from "@/lib/admin-api";
import type { Order } from "@/lib/types";
import { RANGE_KEYS, RangeKey, getRangeBounds, bucketWindows } from "@/lib/dateRanges";
import { TrendingUp, Users, ShoppingCart, Package, BarChart2 } from "lucide-react";

const COLORS = ["#C9A96E", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444"];

function EmptyState({ text }: { text: string }) {
  return (
    <div className="h-56 flex flex-col items-center justify-center gap-2 text-gray-300">
      <BarChart2 className="w-9 h-9" />
      <span className="text-sm text-gray-400">{text}</span>
    </div>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-gray-800">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("Last 7 days");
  const [orders, setOrders] = useState<Order[] | null>(null);

  const bounds = useMemo(() => getRangeBounds(range), [range]);
  const events = useQuery(api.analytics.eventsSince, { since: bounds.start });

  useEffect(() => {
    getOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  const data = useMemo(() => {
    const evts = (events ?? []).filter((e) => e._creationTime >= bounds.start && e._creationTime < bounds.end);
    const ordersList = (orders ?? []).filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= bounds.start && t < bounds.end;
    });

    // Sales over time
    const windows = bucketWindows(bounds.start, bounds.end);
    const salesSeries = windows.map((w) => ({
      label: w.label,
      sales: ordersList
        .filter((o) => { const t = new Date(o.createdAt).getTime(); return t >= w.start && t < w.end; })
        .reduce((s, o) => s + o.total, 0),
    }));
    const sessionsSeries = windows.map((w) => ({
      label: w.label,
      sessions: new Set(
        evts.filter((e) => e._creationTime >= w.start && e._creationTime < w.end).map((e) => e.sessionId)
      ).size,
    }));

    // Top products — views/add-to-carts from events, units/revenue from real orders
    const productStats: Record<string, { title: string; views: number; addToCarts: number; units: number; revenue: number }> = {};
    for (const e of evts) {
      if (!e.productId) continue;
      const key = e.productId;
      if (!productStats[key]) productStats[key] = { title: e.productTitle ?? "Unknown", views: 0, addToCarts: 0, units: 0, revenue: 0 };
      if (e.type === "product_view") productStats[key].views++;
      if (e.type === "add_to_cart") productStats[key].addToCarts++;
    }
    for (const o of ordersList) {
      for (const item of o.items) {
        if (!productStats[item.productId]) productStats[item.productId] = { title: item.title, views: 0, addToCarts: 0, units: 0, revenue: 0 };
        productStats[item.productId].units += item.quantity;
        productStats[item.productId].revenue += item.price * item.quantity;
      }
    }
    const topProducts = Object.values(productStats).sort((a, b) => b.revenue - a.revenue || b.views - a.views).slice(0, 8);

    // Traffic by page
    const pageCounts: Record<string, number> = {};
    for (const e of evts) {
      if (e.type !== "pageview" || !e.path) continue;
      pageCounts[e.path] = (pageCounts[e.path] ?? 0) + 1;
    }
    const traffic = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([path, views]) => ({ path, views }));

    // Conversion funnel — unique sessions reaching each stage
    const sessionsByStage = (type: string) => new Set(evts.filter((e) => e.type === type).map((e) => e.sessionId));
    const allSessions = new Set(evts.map((e) => e.sessionId));
    const funnel = [
      { stage: "Sessions", count: allSessions.size },
      { stage: "Product Views", count: sessionsByStage("product_view").size },
      { stage: "Add to Cart", count: sessionsByStage("add_to_cart").size },
      { stage: "Checkout Started", count: sessionsByStage("checkout_started").size },
      { stage: "Order Placed", count: sessionsByStage("order_placed").size },
    ];

    // Device breakdown
    const deviceSessions: Record<string, Set<string>> = {};
    for (const e of evts) {
      const d = e.device ?? "desktop";
      if (!deviceSessions[d]) deviceSessions[d] = new Set();
      deviceSessions[d].add(e.sessionId);
    }
    const devices = Object.entries(deviceSessions).map(([name, set]) => ({ name, value: set.size }));

    // Referrer breakdown
    const refSessions: Record<string, Set<string>> = {};
    for (const e of evts) {
      if (e.type !== "pageview") continue;
      const r = e.referrer ? new URL(e.referrer, "https://x.invalid").hostname || e.referrer : "Direct";
      if (!refSessions[r]) refSessions[r] = new Set();
      refSessions[r].add(e.sessionId);
    }
    const referrers = Object.entries(refSessions)
      .map(([name, set]) => ({ name, value: set.size }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const totalRevenue = ordersList.reduce((s, o) => s + o.total, 0);
    const avgOrder = ordersList.length ? Math.round(totalRevenue / ordersList.length) : 0;

    return { salesSeries, sessionsSeries, topProducts, traffic, funnel, devices, referrers, totalRevenue, avgOrder, ordersCount: ordersList.length, sessionsCount: allSessions.size };
  }, [events, orders, bounds]);

  const loading = events === undefined || orders === null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as RangeKey)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] bg-white"
        >
          {RANGE_KEYS.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `KES ${data.totalRevenue.toLocaleString()}`, icon: TrendingUp },
          { label: "Orders", value: String(data.ordersCount), icon: ShoppingCart },
          { label: "Avg. Order Value", value: `KES ${data.avgOrder.toLocaleString()}`, icon: TrendingUp },
          { label: "Sessions", value: String(data.sessionsCount), icon: Users },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <m.icon className="w-5 h-5 text-[#C9A96E]/60 mb-3" />
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{m.label}</p>
            <p className="text-xl font-bold text-gray-900">{loading ? "—" : m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card title="Sales over time">
          {data.salesSeries.every((d) => d.sales === 0) ? (
            <EmptyState text="No sales yet for this period." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data.salesSeries}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A96E" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#C9A96E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} width={48} />
                <Tooltip formatter={(v) => [`KES ${Number(v).toLocaleString()}`, "Sales"]} />
                <Area type="monotone" dataKey="sales" stroke="#C9A96E" strokeWidth={2} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Sessions / visitors over time">
          {data.sessionsSeries.every((d) => d.sessions === 0) ? (
            <EmptyState text="No visitor activity yet for this period." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.sessionsSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} width={36} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="sessions" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card title="Conversion funnel">
        {data.funnel[0].count === 0 ? (
          <EmptyState text="No sessions recorded yet for this period." />
        ) : (
          <div className="space-y-3">
            {data.funnel.map((f, i) => {
              const pct = data.funnel[0].count ? Math.round((f.count / data.funnel[0].count) * 100) : 0;
              const prev = i > 0 ? data.funnel[i - 1].count : f.count;
              const dropoff = i > 0 && prev > 0 ? Math.round(((prev - f.count) / prev) * 100) : 0;
              return (
                <div key={f.stage}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{f.stage}</span>
                    <span className="text-gray-500">
                      {f.count} ({pct}%){i > 0 && <span className="text-red-400 ml-2">-{dropoff}% drop-off</span>}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card title="Top products">
        {data.topProducts.length === 0 ? (
          <EmptyState text="No product activity yet for this period." />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="text-left py-2 font-semibold">Product</th>
                <th className="text-right py-2 font-semibold">Views</th>
                <th className="text-right py-2 font-semibold">Add to cart</th>
                <th className="text-right py-2 font-semibold">Units sold</th>
                <th className="text-right py-2 font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.topProducts.map((p, i) => (
                <tr key={i}>
                  <td className="py-2.5 text-gray-800 font-medium">{p.title}</td>
                  <td className="py-2.5 text-right text-gray-500">{p.views}</td>
                  <td className="py-2.5 text-right text-gray-500">{p.addToCarts}</td>
                  <td className="py-2.5 text-right text-gray-500">{p.units}</td>
                  <td className="py-2.5 text-right font-semibold text-gray-800">KES {p.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card title="Traffic by page">
          {data.traffic.length === 0 ? (
            <EmptyState text="No pageviews yet for this period." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.traffic} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                <YAxis type="category" dataKey="path" tick={{ fontSize: 11, fill: "#6b7280" }} width={110} />
                <Tooltip />
                <Bar dataKey="views" fill="#C9A96E" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Device breakdown">
          {data.devices.length === 0 ? (
            <EmptyState text="No session data yet." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.devices} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={(e) => `${e.name} (${e.value})`}>
                  {data.devices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Referrer breakdown">
          {data.referrers.length === 0 ? (
            <EmptyState text="No referrer data yet." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.referrers} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={(e) => `${e.name}`}>
                  {data.referrers.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {data.sessionsCount === 0 && data.ordersCount === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No data yet</p>
          <p className="text-sm text-gray-400 mt-1">Analytics will populate as visitors browse and orders come in.</p>
        </div>
      )}
    </div>
  );
}
