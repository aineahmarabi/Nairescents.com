"use client";
import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import MetricCard from "@/components/admin/ui/MetricCard";
import SalesChart from "@/components/admin/charts/SalesChart";
import { RANGE_KEYS, RangeKey, getRangeBounds, pctChange, bucketCounts, bucketWindows } from "@/lib/dateRanges";
import { Package, CheckCircle, Clock, Users, ShoppingCart, TrendingUp, Percent } from "lucide-react";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function AdminDashboardPage() {
  const { user } = useUser();
  const products = useQuery(api.products.list, {});
  const settings = useQuery(api.settings.getAll);
  const [range, setRange] = useState<RangeKey>("Last 7 days");
  const orders = useQuery(api.orders.list);

  const bounds = useMemo(() => getRangeBounds(range), [range]);
  const events = useQuery(api.analytics.eventsSince, { since: bounds.prevStart });
  const liveVisitors = useQuery(api.analytics.liveVisitors);

  const storeName = settings?.storeName ?? "Naire Scents";
  const adminName = user?.firstName ?? user?.fullName ?? storeName;

  const totalProducts = products?.length ?? 0;
  const activeProducts = products?.filter((p) => p.status === "Active").length ?? 0;
  const lowStock = products?.filter((p) => p.inventory === 0 && p.trackInventory).length ?? 0;

  const loading = products === undefined;

  const stats = useMemo(() => {
    const evts = events ?? [];
    const cur = evts.filter((e) => e._creationTime >= bounds.start && e._creationTime < bounds.end);
    const prev = evts.filter((e) => e._creationTime >= bounds.prevStart && e._creationTime < bounds.prevEnd);

    const sessionsCur = new Set(cur.map((e) => e.sessionId)).size;
    const sessionsPrev = new Set(prev.map((e) => e.sessionId)).size;
    const sessionsSpark = bucketCounts(cur.map((e) => e._creationTime), bounds.start, bounds.end);

    const ordersList = orders ?? [];
    const ordersCur = ordersList.filter((o) => {
      const t = o._creationTime;
      return t >= bounds.start && t < bounds.end;
    });
    const ordersPrev = ordersList.filter((o) => {
      const t = o._creationTime;
      return t >= bounds.prevStart && t < bounds.prevEnd;
    });
    const salesCur = ordersCur.reduce((s, o) => s + o.total, 0);
    const salesPrev = ordersPrev.reduce((s, o) => s + o.total, 0);
    const salesSpark = bucketCounts(
      ordersCur.map((o) => o._creationTime),
      bounds.start,
      bounds.end
    );

    const conversionCur = sessionsCur > 0 ? (ordersCur.length / sessionsCur) * 100 : 0;
    const conversionPrev = sessionsPrev > 0 ? (ordersPrev.length / sessionsPrev) * 100 : 0;

    const chartData = bucketWindows(bounds.start, bounds.end).map((w) => ({
      date: w.label,
      sales: ordersCur
        .filter((o) => o._creationTime >= w.start && o._creationTime < w.end)
        .reduce((s, o) => s + o.total, 0),
    }));

    return {
      sessionsCur, sessionsPrev, sessionsSpark,
      ordersCur: ordersCur.length, ordersPrev: ordersPrev.length,
      salesCur, salesPrev, salesSpark,
      conversionCur, conversionPrev,
      chartData,
    };
  }, [events, orders, bounds]);

  return (
    <div>
      {/* Greeting */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {greeting()}, {adminName}
          </h1>
          <p className="text-gray-400 text-sm mt-1">Here is what is happening in your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm text-gray-600">
              {liveVisitors === undefined ? "—" : liveVisitors} live now
            </span>
          </div>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as RangeKey)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] bg-white"
          >
            {RANGE_KEYS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Sessions"
          value={events === undefined ? "—" : String(stats.sessionsCur)}
          change={events === undefined ? undefined : pctChange(stats.sessionsCur, stats.sessionsPrev)}
          icon={<Users className="w-5 h-5" />}
          color="#3b82f6"
          sparkData={stats.sessionsSpark}
          loading={events === undefined}
        />
        <MetricCard
          label="Total Sales"
          value={orders === undefined ? "—" : `KES ${stats.salesCur.toLocaleString()}`}
          change={orders === undefined ? undefined : pctChange(stats.salesCur, stats.salesPrev)}
          icon={<TrendingUp className="w-5 h-5" />}
          color="#C9A96E"
          sparkData={stats.salesSpark}
          loading={orders === undefined}
        />
        <MetricCard
          label="Orders"
          value={orders === undefined ? "—" : String(stats.ordersCur)}
          change={orders === undefined ? undefined : pctChange(stats.ordersCur, stats.ordersPrev)}
          icon={<ShoppingCart className="w-5 h-5" />}
          color="#8b5cf6"
          sparkData={[]}
          loading={orders === undefined}
        />
        <MetricCard
          label="Conversion Rate"
          value={orders === undefined || events === undefined ? "—" : `${stats.conversionCur.toFixed(1)}%`}
          change={orders === undefined || events === undefined ? undefined : pctChange(stats.conversionCur, stats.conversionPrev)}
          icon={<Percent className="w-5 h-5" />}
          color="#f59e0b"
          sparkData={[]}
          loading={orders === undefined || events === undefined}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <MetricCard
          label="Total Products"
          value={loading ? "—" : String(totalProducts)}
          sub={loading ? "" : `${activeProducts} active`}
          icon={<Package className="w-5 h-5" />}
          color="#C9A96E"
          sparkData={[0, 0, 0, 0, 0, 0, totalProducts]}
          loading={loading}
        />
        <MetricCard
          label="Active Listings"
          value={loading ? "—" : String(activeProducts)}
          sub="Online store"
          icon={<CheckCircle className="w-5 h-5" />}
          color="#22c55e"
          sparkData={[0, 0, 0, 0, 0, 0, activeProducts]}
          loading={loading}
        />
        <MetricCard
          label="Out of Stock"
          value={loading ? "—" : String(lowStock)}
          sub={lowStock > 0 ? "Needs attention" : "All good"}
          icon={<Clock className="w-5 h-5" />}
          color={lowStock > 0 ? "#ef4444" : "#6b7280"}
          sparkData={[0, 0, 0, 0, 0, 0, lowStock]}
          loading={loading}
        />
      </div>

      {/* Sales chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Revenue</p>
            <p className="text-3xl font-bold text-gray-800 mt-0.5">KES {stats.salesCur.toLocaleString()}</p>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{range}</span>
        </div>
        <SalesChart data={stats.chartData} />
      </div>

      {/* Recent products */}
      {products && products.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="font-semibold text-gray-700">Recent Products</p>
            <a href="/admin/dashboard/products" className="text-xs text-[#C9A96E] hover:underline">View all</a>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Product", "Status", "Price", "Inventory"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.slice(0, 6).map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0].url} alt={p.title} className="w-8 h-8 rounded-lg object-cover bg-gray-100" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center"><Package className="w-3.5 h-3.5 text-gray-300" /></div>
                      )}
                      <span className="font-medium text-gray-800 truncate max-w-[180px]">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">KES {p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{p.trackInventory ? p.inventory : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
