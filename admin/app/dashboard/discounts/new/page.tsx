"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDiscount } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewDiscountPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    code: "", type: "percentage" as "percentage" | "fixed",
    value: "", usageLimit: "", expiresAt: "", active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: unknown) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code.trim()) { setError("Code is required."); return; }
    if (!form.value || Number(form.value) <= 0) { setError("Value must be greater than 0."); return; }
    setSaving(true); setError("");
    try {
      await createDiscount({
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: Number(form.value),
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        expiresAt: form.expiresAt || undefined,
        active: form.active,
        usageCount: 0,
      });
      router.push("/dashboard/discounts");
      router.refresh();
    } catch {
      setError("Failed to create discount. Make sure the storefront is running.");
      setSaving(false);
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] transition-colors bg-white";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-5 max-w-xl">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/discounts" className="p-2 rounded-xl text-gray-500 hover:bg-white hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Create discount</h1>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <label className={labelClass}>Discount code</label>
          <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} className={inputClass} placeholder="e.g. WELCOME20" />
          <p className="text-xs text-gray-400 mt-1">Customers enter this at checkout.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Type</label>
            <select value={form.type} onChange={e => set('type', e.target.value)} className={inputClass}>
              <option value="percentage">Percentage off</option>
              <option value="fixed">Fixed amount off</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Value ({form.type === 'percentage' ? '%' : 'KES'})</label>
            <input type="number" value={form.value} onChange={e => set('value', e.target.value)} className={inputClass} placeholder="0" min="0" max={form.type === 'percentage' ? "100" : undefined} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Usage limit</label>
            <input type="number" value={form.usageLimit} onChange={e => set('usageLimit', e.target.value)} className={inputClass} placeholder="Unlimited" min="1" />
          </div>
          <div>
            <label className={labelClass}>Expiry date</label>
            <input type="date" value={form.expiresAt} onChange={e => set('expiresAt', e.target.value)} className={inputClass} />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer pt-1">
          <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="w-4 h-4 rounded accent-[#C9A96E]" />
          <span className="text-sm text-gray-700">Make active immediately</span>
        </label>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="px-5 py-2.5 bg-[#0B3D33] text-white rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60">
            {saving ? "Creating…" : "Create discount"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
