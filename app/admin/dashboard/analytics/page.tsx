"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  RANGE_KEYS,
  RangeKey,
  getRangeBounds,
  pctChange,
  bucketWindows,
} from "@/lib/dateRanges";
import { BarChart2, TrendingUp, ShoppingCart, Package, Users } from "lucide-react";
import { Skeleton } from "@/components/admin/ui/Skeleton";

// ─── helpers ────────────────────────────────────────────────────────────────

function niceMax(value: number): number {
  if (value === 0) return 100;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;
  const nice =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

function PctBadge({ value }: { value: number | undefined }) {
  if (value === undefined) return null;
  const positive = value >= 0;
  return (
    <span
      className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
        positive
          ? "bg-emerald-50 text-emerald-600"
          : "bg-red-50 text-red-500"
      }`}
    >
      {positive ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

function periodLabel(start: number, end: number): string {
  const s = new Date(start);
  const e = new Date(end - 1);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const yearOpts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  if (
    s.getMonth() !== e.getMonth() ||
    s.getFullYear() !== e.getFullYear()
  ) {
    return `${s.toLocaleDateString("en-GB", opts)} – ${e.toLocaleDateString(
      "en-GB",
      yearOpts
    )}`;
  }
  return `${s.getDate()} – ${e.toLocaleDateString("en-GB", yearOpts)}`;
}

function fmt(n: number) {
  return `KES ${n.toLocaleString()}`;
}

// ─── sub-components ─────────────────────────────────────────────────────────

function EmptyState({ text }: { text: string }) {
  return (
    <div className="h-56 flex flex-col items-center justify-center gap-2 text-gray-300">
      <BarChart2 className="w-9 h-9" />
      <span className="text-sm text-gray-400">{text}</span>
    </div>
  );
}

function Card({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
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

// ─── types ──────────────────────────────────────────────────────────────────

interface ComparisonPoint {
  label: string;
  current: number;
  previous: number;
}

interface FunnelRow {
  stage: string;
  count: number;
  pct: number;
}

interface ProductRow {
  title: string;
  units: number;
  revenue: number;
}

interface LandingRow {
  path: string;
  sessions: number;
  pct: number;
}

interface DeviceRow {
  name: string;
  sessions: number;
  pct: number;
}

interface CohortRow {
  cohort: string;
  months: (number | null)[];
}

interface AnalyticsData {
  // summary
  grossSalesCur: number;
  grossSalesPrev: number;
  returningRateCur: number;
  returningRatePrev: number;
  fulfilledCur: number;
  fulfilledPrev: number;
  ordersCur: number;
  ordersPrev: number;
  // charts
  salesComparison: ComparisonPoint[];
  salesMax: number;
  sessionsComparison: ComparisonPoint[];
  sessionsMax: number;
  aovComparison: ComparisonPoint[];
  aovMax: number;
  conversionComparison: ComparisonPoint[];
  // tables
  salesBreakdown: {
    gross: number; grossPrev: number;
    shipping: number; shippingPrev: number;
    returns: number; returnsPrev: number;
    net: number; netPrev: number;
  };
  // products
  topProducts: ProductRow[];
  // sessions
  totalSessionsCur: number;
  deviceRows: DeviceRow[];
  funnelRows: FunnelRow[];
  landingRows: LandingRow[];
  // cohort
  cohortRows: CohortRow[];
  cohortMonths: string[];
}

// ─── main page ──────────────────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("Last 7 days");
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  useEffect(() => {
    const d = new Date();
    setLastRefreshed(
      d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    );
  }, []);

  const bounds = useMemo(() => getRangeBounds(range), [range]);

  const orders = useQuery(api.orders.list);
  const events = useQuery(api.analytics.eventsSince, { since: bounds.prevStart });

  const loading = orders === undefined || events === undefined;

  const data = useMemo((): AnalyticsData => {
    const allOrders = orders ?? [];
    const allEvents = events ?? [];

    // ── period filters ───────────────────────────────────────────────────────
    const curOrders = allOrders.filter(
      (o) => o._creationTime >= bounds.start && o._creationTime < bounds.end
    );
    const prevOrders = allOrders.filter(
      (o) => o._creationTime >= bounds.prevStart && o._creationTime < bounds.prevEnd
    );
    const curEvents = allEvents.filter(
      (e) => e._creationTime >= bounds.start && e._creationTime < bounds.end
    );
    const prevEvents = allEvents.filter(
      (e) => e._creationTime >= bounds.prevStart && e._creationTime < bounds.prevEnd
    );

    // ── summary cards ────────────────────────────────────────────────────────
    const grossSalesCur = curOrders.reduce((s, o) => s + o.total, 0);
    const grossSalesPrev = prevOrders.reduce((s, o) => s + o.total, 0);

    // returning customer rate: customer whose email has >1 order in ALL orders
    const emailCounts: Record<string, number> = {};
    for (const o of allOrders) {
      emailCounts[o.customer.email] = (emailCounts[o.customer.email] ?? 0) + 1;
    }
    const returningCur = curOrders.filter(
      (o) => emailCounts[o.customer.email] > 1
    ).length;
    const returningPrev = prevOrders.filter(
      (o) => emailCounts[o.customer.email] > 1
    ).length;
    const returningRateCur =
      curOrders.length > 0 ? (returningCur / curOrders.length) * 100 : 0;
    const returningRatePrev =
      prevOrders.length > 0 ? (returningPrev / prevOrders.length) * 100 : 0;

    const fulfilledCur = curOrders.filter(
      (o) => o.fulfillmentStatus === "Fulfilled"
    ).length;
    const fulfilledPrev = prevOrders.filter(
      (o) => o.fulfillmentStatus === "Fulfilled"
    ).length;

    const ordersCur = curOrders.length;
    const ordersPrev = prevOrders.length;

    // ── bucket windows ───────────────────────────────────────────────────────
    const curWindows = bucketWindows(bounds.start, bounds.end);
    const prevWindows = bucketWindows(bounds.prevStart, bounds.prevEnd);

    // helper to build comparison series
    function compareNumeric(
      curFn: (wStart: number, wEnd: number) => number,
      prevFn: (wStart: number, wEnd: number) => number
    ): ComparisonPoint[] {
      return curWindows.map((w, i) => ({
        label: w.label,
        current: curFn(w.start, w.end),
        previous:
          i < prevWindows.length
            ? prevFn(prevWindows[i].start, prevWindows[i].end)
            : 0,
      }));
    }

    // ── total sales over time ────────────────────────────────────────────────
    const salesComparison = compareNumeric(
      (ws, we) =>
        curOrders
          .filter((o) => o._creationTime >= ws && o._creationTime < we)
          .reduce((s, o) => s + o.total, 0),
      (ws, we) =>
        prevOrders
          .filter((o) => o._creationTime >= ws && o._creationTime < we)
          .reduce((s, o) => s + o.total, 0)
    );
    const salesMax = niceMax(
      Math.max(...salesComparison.map((d) => Math.max(d.current, d.previous)))
    );

    // ── sales breakdown ──────────────────────────────────────────────────────
    const shippingCur = curOrders.reduce(
      (s, o) => s + (o.shippingFee ?? o.total - o.subtotal),
      0
    );
    const shippingPrev = prevOrders.reduce(
      (s, o) => s + (o.shippingFee ?? o.total - o.subtotal),
      0
    );
    const returnsCur = curOrders
      .filter((o) => o.paymentStatus === "Refunded")
      .reduce((s, o) => s + o.total, 0);
    const returnsPrev = prevOrders
      .filter((o) => o.paymentStatus === "Refunded")
      .reduce((s, o) => s + o.total, 0);
    const netCur = curOrders.reduce((s, o) => s + o.subtotal, 0);
    const netPrev = prevOrders.reduce((s, o) => s + o.subtotal, 0);

    // ── sessions over time ───────────────────────────────────────────────────
    const sessionsComparison = compareNumeric(
      (ws, we) =>
        new Set(
          curEvents
            .filter((e) => e._creationTime >= ws && e._creationTime < we)
            .map((e) => e.sessionId)
        ).size,
      (ws, we) =>
        new Set(
          prevEvents
            .filter((e) => e._creationTime >= ws && e._creationTime < we)
            .map((e) => e.sessionId)
        ).size
    );
    const sessionsMax = niceMax(
      Math.max(
        ...sessionsComparison.map((d) => Math.max(d.current, d.previous))
      )
    );

    // ── average order value ──────────────────────────────────────────────────
    const aovComparison = compareNumeric(
      (ws, we) => {
        const w = curOrders.filter(
          (o) => o._creationTime >= ws && o._creationTime < we
        );
        return w.length ? w.reduce((s, o) => s + o.total, 0) / w.length : 0;
      },
      (ws, we) => {
        const w = prevOrders.filter(
          (o) => o._creationTime >= ws && o._creationTime < we
        );
        return w.length ? w.reduce((s, o) => s + o.total, 0) / w.length : 0;
      }
    );
    const aovMax = niceMax(
      Math.max(...aovComparison.map((d) => Math.max(d.current, d.previous)))
    );

    // ── conversion rate ──────────────────────────────────────────────────────
    const conversionComparison = compareNumeric(
      (ws, we) => {
        const windowEvts = curEvents.filter(
          (e) => e._creationTime >= ws && e._creationTime < we
        );
        const allSess = new Set(windowEvts.map((e) => e.sessionId)).size;
        const converted = new Set(
          windowEvts
            .filter((e) => e.type === "order_placed")
            .map((e) => e.sessionId)
        ).size;
        return allSess > 0 ? (converted / allSess) * 100 : 0;
      },
      (ws, we) => {
        const windowEvts = prevEvents.filter(
          (e) => e._creationTime >= ws && e._creationTime < we
        );
        const allSess = new Set(windowEvts.map((e) => e.sessionId)).size;
        const converted = new Set(
          windowEvts
            .filter((e) => e.type === "order_placed")
            .map((e) => e.sessionId)
        ).size;
        return allSess > 0 ? (converted / allSess) * 100 : 0;
      }
    );

    // ── top products ─────────────────────────────────────────────────────────
    const productMap: Record<string, ProductRow> = {};
    for (const o of curOrders) {
      for (const item of o.items) {
        if (!productMap[item.title]) {
          productMap[item.title] = { title: item.title, units: 0, revenue: 0 };
        }
        productMap[item.title].units += item.quantity;
        productMap[item.title].revenue += item.quantity * item.price;
      }
    }
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // ── device breakdown ─────────────────────────────────────────────────────
    const deviceSessions: Record<string, Set<string>> = {};
    for (const e of curEvents) {
      const d = e.device ?? "unknown";
      if (!deviceSessions[d]) deviceSessions[d] = new Set();
      deviceSessions[d].add(e.sessionId);
    }
    const totalSessionsCur = new Set(curEvents.map((e) => e.sessionId)).size;
    const deviceRows: DeviceRow[] = Object.entries(deviceSessions)
      .map(([name, s]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        sessions: s.size,
        pct: totalSessionsCur > 0 ? Math.round((s.size / totalSessionsCur) * 100) : 0,
      }))
      .sort((a, b) => b.sessions - a.sessions);

    // ── conversion funnel ─────────────────────────────────────────────────────
    const allCurSessions = new Set(curEvents.map((e) => e.sessionId)).size;
    const stageSessions = (type: string) =>
      new Set(
        curEvents.filter((e) => e.type === type).map((e) => e.sessionId)
      ).size;
    const funnelSteps = [
      { stage: "Sessions", count: allCurSessions },
      { stage: "Product Views", count: stageSessions("product_view") },
      { stage: "Added to Cart", count: stageSessions("add_to_cart") },
      { stage: "Reached Checkout", count: stageSessions("checkout_started") },
      { stage: "Orders Placed", count: stageSessions("order_placed") },
    ];
    const funnelRows: FunnelRow[] = funnelSteps.map((f) => ({
      ...f,
      pct:
        allCurSessions > 0
          ? Math.round((f.count / allCurSessions) * 100)
          : 0,
    }));

    // ── sessions by landing page ──────────────────────────────────────────────
    // first pageview per session
    const firstPageview: Record<string, { path: string; time: number }> = {};
    for (const e of curEvents) {
      if (e.type !== "pageview" || !e.path) continue;
      const existing = firstPageview[e.sessionId];
      if (!existing || e._creationTime < existing.time) {
        firstPageview[e.sessionId] = { path: e.path, time: e._creationTime };
      }
    }
    const landingCounts: Record<string, number> = {};
    for (const v of Object.values(firstPageview)) {
      landingCounts[v.path] = (landingCounts[v.path] ?? 0) + 1;
    }
    const totalLandingSessions = Object.values(landingCounts).reduce(
      (s, n) => s + n,
      0
    );
    const landingRows: LandingRow[] = Object.entries(landingCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, sessions]) => ({
        path,
        sessions,
        pct:
          totalLandingSessions > 0
            ? Math.round((sessions / totalLandingSessions) * 100)
            : 0,
      }));

    // ── customer cohort analysis ──────────────────────────────────────────────
    // group each customer's first order month
    const customerFirstMonth: Record<string, string> = {};
    const customerOrderMonths: Record<string, Set<string>> = {};
    for (const o of allOrders) {
      const email = o.customer.email;
      const d = new Date(o._creationTime);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!customerFirstMonth[email] || monthKey < customerFirstMonth[email]) {
        customerFirstMonth[email] = monthKey;
      }
      if (!customerOrderMonths[email]) customerOrderMonths[email] = new Set();
      customerOrderMonths[email].add(monthKey);
    }

    // collect unique cohort months, take last 6
    const uniqueCohortMonths = Array.from(
      new Set(Object.values(customerFirstMonth))
    )
      .sort()
      .slice(-6);

    const cohortRows: CohortRow[] = uniqueCohortMonths.map((cohortMonth) => {
      const customers = Object.entries(customerFirstMonth)
        .filter(([, m]) => m === cohortMonth)
        .map(([email]) => email);
      const total = customers.length;

      // month 0 = cohort month, month 1 = +1 month, etc.
      const months: (number | null)[] = [0, 1, 2, 3].map((offset) => {
        const [y, m] = cohortMonth.split("-").map(Number);
        const targetDate = new Date(y, m - 1 + offset);
        const targetKey = `${targetDate.getFullYear()}-${String(
          targetDate.getMonth() + 1
        ).padStart(2, "0")}`;
        const now = new Date();
        const nowKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        // Don't show future months
        if (targetKey > nowKey) return null;
        if (offset === 0) return 100;
        const retained = customers.filter((email) =>
          customerOrderMonths[email]?.has(targetKey)
        ).length;
        return total > 0 ? Math.round((retained / total) * 100) : 0;
      });

      return { cohort: cohortMonth, months };
    });

    return {
      grossSalesCur,
      grossSalesPrev,
      returningRateCur,
      returningRatePrev,
      fulfilledCur,
      fulfilledPrev,
      ordersCur,
      ordersPrev,
      salesComparison,
      salesMax,
      sessionsComparison,
      sessionsMax,
      aovComparison,
      aovMax,
      conversionComparison,
      salesBreakdown: {
        gross: grossSalesCur,
        grossPrev: grossSalesPrev,
        shipping: shippingCur,
        shippingPrev,
        returns: returnsCur,
        returnsPrev,
        net: netCur,
        netPrev,
      },
      topProducts,
      totalSessionsCur,
      deviceRows,
      funnelRows,
      landingRows,
      cohortRows,
      cohortMonths: ["Month 0", "Month 1", "Month 2", "Month 3+"],
    };
  }, [orders, events, bounds]);

  // ── cohort cell color ───────────────────────────────────────────────────
  function cohortColor(pct: number | null): string {
    if (pct === null) return "bg-gray-50 text-gray-300";
    if (pct === 0) return "bg-gray-50 text-gray-400";
    if (pct >= 100) return "bg-emerald-700 text-white";
    if (pct >= 50) return "bg-emerald-500 text-white";
    if (pct >= 20) return "bg-emerald-200 text-emerald-800";
    return "bg-emerald-50 text-emerald-700";
  }

  const GOLD = "#C9A96E";
  const GRAY_LINE = "#d1d5db";

  return (
    <div className="space-y-5">
      {/* ── header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
          {lastRefreshed && (
            <p className="text-xs text-gray-400 mt-0.5">
              Last refreshed: {lastRefreshed}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <p className="text-xs text-gray-500">
            {periodLabel(bounds.start, bounds.end)}{" "}
            <span className="text-gray-300">vs</span>{" "}
            {periodLabel(bounds.prevStart, bounds.prevEnd)}
          </p>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as RangeKey)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] bg-white cursor-pointer"
          >
            {RANGE_KEYS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── 1. Summary cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <Skeleton className="h-5 w-5 mb-3" />
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))
        ) : (
          <>
            {/* Gross sales */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <TrendingUp className="w-5 h-5 text-[#C9A96E]/60 mb-3" />
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                Gross Sales
              </p>
              <p className="text-xl font-bold text-gray-900 mb-1">
                {fmt(data.grossSalesCur)}
              </p>
              <PctBadge value={pctChange(data.grossSalesCur, data.grossSalesPrev)} />
            </div>

            {/* Returning customer rate */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <Users className="w-5 h-5 text-[#C9A96E]/60 mb-3" />
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                Returning Rate
              </p>
              <p className="text-xl font-bold text-gray-900 mb-1">
                {data.returningRateCur.toFixed(1)}%
              </p>
              <PctBadge
                value={pctChange(data.returningRateCur, data.returningRatePrev)}
              />
            </div>

            {/* Orders fulfilled */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <Package className="w-5 h-5 text-[#C9A96E]/60 mb-3" />
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                Fulfilled
              </p>
              <p className="text-xl font-bold text-gray-900 mb-1">
                {data.fulfilledCur}
              </p>
              <PctBadge
                value={pctChange(data.fulfilledCur, data.fulfilledPrev)}
              />
            </div>

            {/* Orders */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <ShoppingCart className="w-5 h-5 text-[#C9A96E]/60 mb-3" />
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                Orders
              </p>
              <p className="text-xl font-bold text-gray-900 mb-1">
                {data.ordersCur}
              </p>
              <PctBadge value={pctChange(data.ordersCur, data.ordersPrev)} />
            </div>
          </>
        )}
      </div>

      {/* ── 2. Total sales over time + breakdown ───────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Card title="Total Sales over Time">
          {loading ? (
            <Skeleton className="h-[240px]" />
          ) : data.salesComparison.every(
              (d) => d.current === 0 && d.previous === 0
            ) ? (
            <EmptyState text="No sales data for this period." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={data.salesComparison}
                margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradCur" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GOLD} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GRAY_LINE} stopOpacity={0.1} />
                    <stop offset="100%" stopColor={GRAY_LINE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0ede8"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  width={52}
                  domain={[0, data.salesMax]}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  formatter={(v, name) => [
                    fmt(Math.round(Number(v ?? 0))),
                    name === "current" ? "Current period" : "Previous period",
                  ]}
                />
                <Legend
                  formatter={(v) =>
                    v === "current" ? "Current period" : "Previous period"
                  }
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="previous"
                  stroke={GRAY_LINE}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  fill="url(#gradPrev)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke={GOLD}
                  strokeWidth={2}
                  fill="url(#gradCur)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Sales breakdown table */}
        <Card title="Total Sales Breakdown">
          {loading ? (
            <Skeleton className="h-[240px]" />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wider">
                  <th className="text-left py-2 font-semibold">Line item</th>
                  <th className="text-right py-2 font-semibold">Value</th>
                  <th className="text-right py-2 font-semibold">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  {
                    label: "Gross sales",
                    cur: data.salesBreakdown.gross,
                    prev: data.salesBreakdown.grossPrev,
                  },
                  {
                    label: "Shipping charges",
                    cur: data.salesBreakdown.shipping,
                    prev: data.salesBreakdown.shippingPrev,
                  },
                  { label: "Discounts", cur: null, prev: null },
                  {
                    label: "Returns / Refunds",
                    cur: -data.salesBreakdown.returns,
                    prev: -data.salesBreakdown.returnsPrev,
                  },
                  {
                    label: "Net sales",
                    cur: data.salesBreakdown.net,
                    prev: data.salesBreakdown.netPrev,
                  },
                ].map((row) => (
                  <tr key={row.label}>
                    <td className="py-2.5 text-gray-600">{row.label}</td>
                    <td className="py-2.5 text-right text-gray-800 font-medium">
                      {row.cur === null ? "—" : fmt(Math.round(Math.abs(row.cur)))}
                    </td>
                    <td className="py-2.5 text-right">
                      {row.cur !== null && row.prev !== null ? (
                        <PctBadge value={pctChange(row.cur, row.prev)} />
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {/* Total row */}
                <tr className="border-t-2 border-gray-200">
                  <td className="py-3 font-bold text-gray-900 text-base">
                    Total sales
                  </td>
                  <td className="py-3 text-right font-bold text-gray-900 text-base">
                    {fmt(data.salesBreakdown.gross)}
                  </td>
                  <td className="py-3 text-right">
                    <PctBadge
                      value={pctChange(
                        data.salesBreakdown.gross,
                        data.salesBreakdown.grossPrev
                      )}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </Card>
      </div>

      {/* ── 3. Sessions over time + AOV ────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Card title="Sessions over Time">
          {loading ? (
            <Skeleton className="h-[240px]" />
          ) : data.sessionsComparison.every(
              (d) => d.current === 0 && d.previous === 0
            ) ? (
            <EmptyState text="No session data for this period." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={data.sessionsComparison}
                margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradSessCur" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GOLD} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradSessPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GRAY_LINE} stopOpacity={0.1} />
                    <stop offset="100%" stopColor={GRAY_LINE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0ede8"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  width={36}
                  domain={[0, data.sessionsMax]}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(v, name) => [
                    Number(v ?? 0),
                    name === "current" ? "Current period" : "Previous period",
                  ]}
                />
                <Legend
                  formatter={(v) =>
                    v === "current" ? "Current period" : "Previous period"
                  }
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="previous"
                  stroke={GRAY_LINE}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  fill="url(#gradSessPrev)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke={GOLD}
                  strokeWidth={2}
                  fill="url(#gradSessCur)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Average Order Value over Time">
          {loading ? (
            <Skeleton className="h-[240px]" />
          ) : data.aovComparison.every(
              (d) => d.current === 0 && d.previous === 0
            ) ? (
            <EmptyState text="No order data for this period." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={data.aovComparison}
                margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0ede8"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  width={52}
                  domain={[0, data.aovMax]}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  formatter={(v, name) => [
                    fmt(Math.round(Number(v ?? 0))),
                    name === "current" ? "Current period" : "Previous period",
                  ]}
                />
                <Legend
                  formatter={(v) =>
                    v === "current" ? "Current period" : "Previous period"
                  }
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke={GRAY_LINE}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke={GOLD}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* ── 4. Conversion rate over time ──────────────────────────────────── */}
      <Card title="Conversion Rate over Time">
        {loading ? (
          <Skeleton className="h-[200px]" />
        ) : data.conversionComparison.every(
            (d) => d.current === 0 && d.previous === 0
          ) ? (
          <EmptyState text="No conversion data for this period." />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={data.conversionComparison}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0ede8"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                width={40}
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(v, name) => [
                  `${Number(v ?? 0).toFixed(1)}%`,
                  name === "current" ? "Current period" : "Previous period",
                ]}
              />
              <Legend
                formatter={(v) =>
                  v === "current" ? "Current period" : "Previous period"
                }
                wrapperStyle={{ fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke={GRAY_LINE}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke={GOLD}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* ── 5. Sales by channel ────────────────────────────────────────────── */}
      <Card title="Total Sales by Channel">
        {loading ? (
          <Skeleton className="h-16" />
        ) : (
          <>
            <div className="flex items-center gap-4 py-2">
              <span className="text-sm text-gray-700 font-medium w-32">
                Online Store
              </span>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-[#C9A96E] w-full" />
              </div>
              <span className="text-sm font-semibold text-gray-800 w-28 text-right">
                {fmt(data.salesBreakdown.gross)}
              </span>
              <span className="text-xs text-gray-400 w-12 text-right">
                100%
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Additional channels appear here if configured.
            </p>
          </>
        )}
      </Card>

      {/* ── 6. Top products ────────────────────────────────────────────────── */}
      <Card title="Total Sales by Product">
        {loading ? (
          <Skeleton className="h-64" />
        ) : data.topProducts.length === 0 ? (
          <EmptyState text="No product sales for this period." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider">
                <th className="text-left py-2 font-semibold w-8">#</th>
                <th className="text-left py-2 font-semibold">Product</th>
                <th className="text-right py-2 font-semibold">Units sold</th>
                <th className="text-right py-2 font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.topProducts.map((p, i) => (
                <tr key={p.title}>
                  <td className="py-2.5 text-gray-400 text-xs">{i + 1}</td>
                  <td className="py-2.5 text-gray-800 font-medium">{p.title}</td>
                  <td className="py-2.5 text-right text-gray-500">{p.units}</td>
                  <td className="py-2.5 text-right font-semibold text-gray-800">
                    {fmt(p.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* ── 7. Sessions by device + landing page ──────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Card title="Sessions by Device Type">
          {loading ? (
            <Skeleton className="h-[200px]" />
          ) : data.deviceRows.length === 0 ? (
            <EmptyState text="No session data for this period." />
          ) : (
            <div className="space-y-3">
              {data.deviceRows.map((d, i) => (
                <div key={d.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{d.name}</span>
                    <span className="text-gray-500">
                      {d.sessions} sessions ({d.pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${d.pct}%`,
                        background:
                          i === 0
                            ? GOLD
                            : i === 1
                            ? "#6b7280"
                            : "#d1d5db",
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={data.deviceRows}
                      dataKey="sessions"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={68}
                      innerRadius={36}
                    >
                      {data.deviceRows.map((_, i) => (
                        <Cell
                          key={i}
                          fill={
                            i === 0
                              ? GOLD
                              : i === 1
                              ? "#6b7280"
                              : "#d1d5db"
                          }
                        />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(v, name) => [
                        `${Number(v ?? 0)} sessions`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </Card>

        <Card title="Sessions by Landing Page">
          {loading ? (
            <Skeleton className="h-[200px]" />
          ) : data.landingRows.length === 0 ? (
            <EmptyState text="No session landing page data for this period." />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wider">
                  <th className="text-left py-2 font-semibold">Page</th>
                  <th className="text-right py-2 font-semibold">Sessions</th>
                  <th className="text-right py-2 font-semibold">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.landingRows.map((row) => (
                  <tr key={row.path}>
                    <td className="py-2.5 text-gray-700 font-medium truncate max-w-[180px]">
                      {row.path}
                    </td>
                    <td className="py-2.5 text-right text-gray-500">
                      {row.sessions}
                    </td>
                    <td className="py-2.5 text-right text-gray-400">
                      {row.pct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      {/* ── 8. Sessions by location (graceful empty) ──────────────────────── */}
      <Card title="Sessions by Location">
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <BarChart2 className="w-8 h-8 text-gray-200" />
          <p className="text-sm text-gray-500 font-medium">
            Location data is not yet collected.
          </p>
          <p className="text-xs text-gray-400 max-w-md">
            Sessions by location will appear here once geo-IP tracking is
            enabled.
          </p>
        </div>
      </Card>

      {/* ── 9. Conversion funnel ──────────────────────────────────────────── */}
      <Card title="Conversion Funnel">
        {loading ? (
          <Skeleton className="h-[200px]" />
        ) : data.funnelRows[0].count === 0 ? (
          <EmptyState text="No sessions recorded yet for this period." />
        ) : (
          <div className="space-y-0">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={data.funnelRows}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0ede8"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="stage"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  width={120}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v, _name, props) => [
                    `${Number(v ?? 0)} (${(props.payload as FunnelRow).pct}% of sessions)`,
                    "Count",
                  ]}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.funnelRows.map((_, i) => (
                    <Cell
                      key={i}
                      fill={GOLD}
                      fillOpacity={1 - i * 0.15}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-5 gap-1 mt-2">
              {data.funnelRows.map((f, i) => (
                <div key={f.stage} className="text-center">
                  <p className="text-xs font-bold text-gray-800">{f.count}</p>
                  <p className="text-xs text-gray-400">{f.pct}%</p>
                  {i > 0 && (
                    <p className="text-xs text-red-400 mt-0.5">
                      {data.funnelRows[i - 1].count > 0
                        ? `-${Math.round(
                            ((data.funnelRows[i - 1].count - f.count) /
                              data.funnelRows[i - 1].count) *
                              100
                          )}%`
                        : ""}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* ── 10. Customer cohort analysis ──────────────────────────────────── */}
      <Card title="Customer Cohort Analysis">
        {loading ? (
          <Skeleton className="h-48" />
        ) : data.cohortRows.length < 3 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <Users className="w-8 h-8 text-gray-200" />
            <p className="text-sm text-gray-500 font-medium">
              Cohort data builds up over time.
            </p>
            <p className="text-xs text-gray-400 max-w-md">
              As more customers place repeat orders, their retention cohorts will
              appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="text-left py-2 pr-4 text-xs text-gray-400 uppercase tracking-wider font-semibold whitespace-nowrap">
                    Cohort
                  </th>
                  {data.cohortMonths.map((m) => (
                    <th
                      key={m}
                      className="text-center py-2 text-xs text-gray-400 uppercase tracking-wider font-semibold"
                    >
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.cohortRows.map((row) => (
                  <tr key={row.cohort}>
                    <td className="py-1 pr-4 text-xs text-gray-600 font-medium whitespace-nowrap">
                      {row.cohort}
                    </td>
                    {row.months.map((pct, i) => (
                      <td key={i} className="py-1 text-center">
                        <span
                          className={`inline-block w-14 py-1.5 rounded-lg text-xs font-semibold ${cohortColor(
                            pct
                          )}`}
                        >
                          {pct === null ? "—" : pct === 0 ? "—" : `${pct}%`}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className="text-xs text-gray-400">Retention key:</span>
              {[
                { label: "100%", cls: "bg-emerald-700 text-white" },
                { label: "50%+", cls: "bg-emerald-500 text-white" },
                { label: "20%+", cls: "bg-emerald-200 text-emerald-800" },
                { label: "<20%", cls: "bg-emerald-50 text-emerald-700" },
                { label: "0%", cls: "bg-gray-50 text-gray-400" },
              ].map((k) => (
                <span
                  key={k.label}
                  className={`text-xs px-2 py-0.5 rounded font-semibold ${k.cls}`}
                >
                  {k.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
