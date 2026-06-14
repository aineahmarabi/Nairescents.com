"use client";
import { useEffect, useState } from "react";
import { getDiscounts, deleteDiscount, updateDiscount } from "@/lib/admin-api";
import type { Discount } from "@/lib/types";
import { Plus, Search, Tag, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDiscounts().then(setDiscounts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this discount code?")) return;
    await deleteDiscount(id).catch(() => {});
    setDiscounts(prev => prev.filter(d => d.id !== id));
  }

  async function toggleActive(d: Discount) {
    const next = !d.active;
    setDiscounts(prev => prev.map(x => x.id === d.id ? { ...x, active: next } : x));
    await updateDiscount(d.id, { active: next }).catch(() => {});
  }

  const filtered = discounts.filter(d => d.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Discounts</h1>
        <Link href="/admin/dashboard/discounts/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B3D33] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Create discount
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search codes…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30" />
          </div>
        </div>
        {loading ? (
          <div className="py-16 flex items-center justify-center"><div className="w-5 h-5 rounded-full border-2 border-[#C9A96E] border-t-transparent animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Tag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">{search ? "No matching codes" : "No discount codes yet"}</p>
            {!search && <Link href="/admin/dashboard/discounts/new" className="inline-block mt-2 text-sm text-[#C9A96E] hover:underline">Create your first discount →</Link>}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Code</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Value</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Used / Limit</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Expires</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-[#0B3D33] bg-[#0B3D33]/5 px-2 py-0.5 rounded-lg text-xs">{d.code}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 hidden sm:table-cell">{d.type === "percentage" ? `${d.value}% off` : `KES ${d.value} off`}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{d.usageCount} / {d.usageLimit ?? "∞"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{d.expiresAt ? new Date(d.expiresAt).toLocaleDateString("en-GB") : "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(d)} className="flex items-center gap-1.5 text-xs font-medium">
                      {d.active ? <><ToggleRight className="w-4 h-4 text-emerald-500" /><span className="text-emerald-600">Active</span></> : <><ToggleLeft className="w-4 h-4 text-gray-400" /><span className="text-gray-400">Inactive</span></>}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(d.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
