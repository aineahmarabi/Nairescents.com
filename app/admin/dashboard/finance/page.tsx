"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { RANGE_KEYS, RangeKey, getRangeBounds, pctChange, bucketWindows } from "@/lib/dateRanges";
import { Wallet, TrendingUp, TrendingDown, Receipt, Plus, Trash2, X } from "lucide-react";
import { Skeleton } from "@/components/admin/ui/Skeleton";

const EXPENSE_CATEGORIES = [
  "Rent",
  "Utilities",
  "Packaging & Shipping",
  "Marketing",
  "Salaries & Wages",
  "Supplies & Inventory",
  "Transport",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Rent": "#0B3D33",
  "Utilities": "#C9A96E",
  "Packaging & Shipping": "#10b981",
  "Marketing": "#6366f1",
  "Salaries & Wages": "#f59e0b",
  "Supplies & Inventory": "#0ea5e9",
  "Transport": "#f87171",
  "Other": "#9ca3af",
};

function fmt(n: number) {
  return `KES ${n.toLocaleString()}`;
}

function periodLabel(start: number, end: number): string {
  const s = new Date(start);
  const e = new Date(end - 1);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const yearOpts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  if (s.getMonth() !== e.getMonth() || s.getFullYear() !== e.getFullYear()) {
    return `${s.toLocaleDateString("en-GB", opts)} – ${e.toLocaleDateString("en-GB", yearOpts)}`;
  }
  return `${s.getDate()} – ${e.toLocaleDateString("en-GB", yearOpts)}`;
}

function PctBadge({ value, invert }: { value: number | undefined; invert?: boolean }) {
  if (value === undefined) return null;
  const positive = invert ? value <= 0 : value >= 0;
  return (
    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
      {value >= 0 ? "+" : ""}
      {value.toFixed(1)}%
    </span>
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

export default function AdminFinancePage() {
  const [range, setRange] = useState<RangeKey>("Last 30 days");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ description: "", category: EXPENSE_CATEGORIES[0], amount: "", date: new Date().toISOString().slice(0, 10), notes: "" });
  const [saving, setSaving] = useState(false);

  const bounds = useMemo(() => {
    if (range === "Custom" && customFrom && customTo) {
      const from = new Date(customFrom);
      const to = new Date(customTo);
      if (from > to) return getRangeBounds("Last 30 days");
      return getRangeBounds("Custom", { from, to });
    }
    return getRangeBounds(range);
  }, [range, customFrom, customTo]);

  const orders = useQuery(api.orders.list);
  const expenses = useQuery(api.expenses.list);
  const createExpense = useMutation(api.expenses.create);
  const removeExpense = useMutation(api.expenses.remove);

  const loading = orders === undefined || expenses === undefined;

  const data = useMemo(() => {
    const zero = { incomeCur: 0, incomePrev: 0, expensesCur: 0, expensesPrev: 0, profitCur: 0, profitPrev: 0, chartData: [] as { label: string; income: number; expenses: number }[], rangeExpenses: [] as NonNullable<typeof expenses>, categoryBreakdown: [] as { category: string; amount: number; pct: number }[] };
    if (!orders || !expenses) return zero;

    const paidOrders = orders.filter((o) => o.paymentStatus === "Paid");
    const incomeCur = paidOrders.filter((o) => o._creationTime >= bounds.start && o._creationTime < bounds.end).reduce((s, o) => s + o.total, 0);
    const incomePrev = paidOrders.filter((o) => o._creationTime >= bounds.prevStart && o._creationTime < bounds.prevEnd).reduce((s, o) => s + o.total, 0);

    const rangeExpenses = expenses.filter((e) => e.date >= bounds.start && e.date < bounds.end);
    const prevRangeExpenses = expenses.filter((e) => e.date >= bounds.prevStart && e.date < bounds.prevEnd);
    const expensesCur = rangeExpenses.reduce((s, e) => s + e.amount, 0);
    const expensesPrev = prevRangeExpenses.reduce((s, e) => s + e.amount, 0);

    const windows = bucketWindows(bounds.start, bounds.end);
    const chartData = windows.map((w) => ({
      label: w.label,
      income: paidOrders.filter((o) => o._creationTime >= w.start && o._creationTime < w.end).reduce((s, o) => s + o.total, 0),
      expenses: expenses.filter((e) => e.date >= w.start && e.date < w.end).reduce((s, e) => s + e.amount, 0),
    }));

    const categoryTotals = new Map<string, number>();
    for (const e of rangeExpenses) {
      categoryTotals.set(e.category, (categoryTotals.get(e.category) ?? 0) + e.amount);
    }
    const categoryBreakdown = Array.from(categoryTotals.entries())
      .map(([category, amount]) => ({ category, amount, pct: expensesCur > 0 ? (amount / expensesCur) * 100 : 0 }))
      .sort((a, b) => b.amount - a.amount);

    return {
      incomeCur,
      incomePrev,
      expensesCur,
      expensesPrev,
      profitCur: incomeCur - expensesCur,
      profitPrev: incomePrev - expensesPrev,
      chartData,
      rangeExpenses: rangeExpenses.sort((a, b) => b.date - a.date),
      categoryBreakdown,
    };
  }, [orders, expenses, bounds]);

  const marginCur = data.incomeCur > 0 ? (data.profitCur / data.incomeCur) * 100 : 0;
  const marginPrev = data.incomePrev > 0 ? (data.profitPrev / data.incomePrev) * 100 : 0;

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!form.description.trim() || !form.amount || Number(form.amount) <= 0) return;
    setSaving(true);
    try {
      await createExpense({
        description: form.description.trim(),
        category: form.category,
        amount: Number(form.amount),
        date: new Date(form.date).getTime(),
        notes: form.notes.trim() || undefined,
      });
      setForm({ description: "", category: EXPENSE_CATEGORIES[0], amount: "", date: new Date().toISOString().slice(0, 10), notes: "" });
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"expenses">) {
    if (!confirm("Delete this expense?")) return;
    await removeExpense({ id });
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] transition-colors bg-white";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-5">
      {/* ── header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Finance</h1>
          <p className="text-xs text-gray-400 mt-0.5">Track expenses against sales income to see your real profit.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <p className="text-xs text-gray-500">
            {periodLabel(bounds.start, bounds.end)} <span className="text-gray-300">vs</span> {periodLabel(bounds.prevStart, bounds.prevEnd)}
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
          {range === "Custom" && (
            <div className="flex items-center gap-2 flex-wrap">
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 bg-white" />
              <span className="text-gray-400 text-sm">to</span>
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} min={customFrom} className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 bg-white" />
            </div>
          )}
        </div>
      </div>

      {/* ── summary cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <Skeleton className="h-5 w-5 mb-3" />
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <TrendingUp className="w-5 h-5 text-emerald-500/70 mb-3" />
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Sales Income</p>
              <p className="text-xl font-bold text-gray-900 mb-1">{fmt(data.incomeCur)}</p>
              <PctBadge value={pctChange(data.incomeCur, data.incomePrev)} />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <TrendingDown className="w-5 h-5 text-red-400/70 mb-3" />
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Expenses</p>
              <p className="text-xl font-bold text-gray-900 mb-1">{fmt(data.expensesCur)}</p>
              <PctBadge value={pctChange(data.expensesCur, data.expensesPrev)} invert />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <Wallet className="w-5 h-5 text-[#C9A96E]/70 mb-3" />
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Net Profit · {marginCur.toFixed(1)}% margin</p>
              <p className={`text-xl font-bold mb-1 ${data.profitCur >= 0 ? "text-gray-900" : "text-red-500"}`}>{fmt(data.profitCur)}</p>
              <PctBadge value={pctChange(data.profitCur, data.profitPrev)} />
            </div>
          </>
        )}
      </div>

      {/* ── chart (3/4) + expenses (1/4) ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
        <div className="lg:col-span-3">
          <Card title="Income vs Expenses">
            {loading ? (
              <Skeleton className="h-[260px]" />
            ) : data.chartData.every((d) => d.income === 0 && d.expenses === 0) ? (
              <div className="h-56 flex flex-col items-center justify-center gap-2 text-gray-300">
                <Wallet className="w-9 h-9" />
                <span className="text-sm text-gray-400">No income or expenses recorded for this period.</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data.chartData}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v) => fmt(Math.round(Number(v ?? 0)))} contentStyle={{ borderRadius: 12, border: "1px solid #f1f1f1", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" fill="url(#incomeGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" fill="url(#expenseGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* ── expenses by category ────────────────────────────────────────── */}
          <div className="mt-5">
            <Card title="Expenses by Category">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : data.categoryBreakdown.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center gap-2 text-gray-300">
                  <Receipt className="w-8 h-8" />
                  <span className="text-sm text-gray-400">No expenses recorded for this period.</span>
                </div>
              ) : (
                <ul className="space-y-4">
                  {data.categoryBreakdown.map((c) => (
                    <li key={c.category}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[c.category] ?? "#9ca3af" }} />
                          <span className="text-sm text-gray-700 font-medium">{c.category}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-gray-400">{c.pct.toFixed(1)}%</span>
                          <span className="text-sm font-semibold text-gray-900">{fmt(c.amount)}</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${c.pct}%`, backgroundColor: CATEGORY_COLORS[c.category] ?? "#9ca3af" }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>

        {/* ── expenses panel ──────────────────────────────────────────────── */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-2">
            <h2 className="font-semibold text-gray-800">Expenses</h2>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0B3D33] text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Record
            </button>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data.rangeExpenses.length === 0 ? (
            <div className="py-12 text-center px-4">
              <Receipt className="w-8 h-8 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">No expenses for this period.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 max-h-[420px] overflow-y-auto">
              {data.rangeExpenses.map((e) => (
                <li key={e._id} className="p-4 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-800 font-medium leading-tight">{e.description}</p>
                    <button onClick={() => handleDelete(e._id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg text-[11px]">{e.category}</span>
                    <span className="text-sm font-semibold text-gray-900">{fmt(e.amount)}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">{new Date(e.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── record expense modal ───────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowForm(false)}>
          <form
            onSubmit={handleAddExpense}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4"
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-gray-800">Record expense</h2>
              <button type="button" onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={inputClass} placeholder="e.g. Warehouse rent, August" />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inputClass}>
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Amount (KES)</label>
                <input type="number" min="0" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} className={inputClass} placeholder="0" />
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Notes (optional)</label>
              <input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className={inputClass} placeholder="Optional" />
            </div>
            <button type="submit" disabled={saving} className="w-full px-5 py-2.5 bg-[#0B3D33] text-white rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60">
              {saving ? "Saving…" : "Save expense"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
