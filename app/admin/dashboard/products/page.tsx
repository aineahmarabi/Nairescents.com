"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { exportToCsv } from "@/lib/csv";
import Link from "next/link";
import {
  Plus, Search, Package, Trash2, Pencil, Upload, Download, Filter,
} from "lucide-react";

export default function AdminProductsPage() {
  const products = useQuery(api.products.list, {});
  const removeProduct = useMutation(api.products.remove);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Draft">("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = (products ?? []).filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.vendor ?? "").toLowerCase().includes(q) || (p.sku ?? "").toLowerCase().includes(q);
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function toggleSelect(id: string) {
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((p) => p._id)));
  }

  async function handleDelete(id: Id<"products">) {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    await removeProduct({ id });
    setDeleting(null);
    setSelected((s) => { const n = new Set(s); n.delete(id); return n; });
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selected.size} products?`)) return;
    for (const id of Array.from(selected)) await removeProduct({ id: id as Id<"products"> });
    setSelected(new Set());
  }

  function handleExport() {
    const toExport = filtered.filter((p) => selected.size === 0 || selected.has(p._id));
    const csv = exportToCsv(toExport as Parameters<typeof exportToCsv>[0]);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nairescents-products.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const total = products?.length ?? 0;
  const active = products?.filter((p) => p.status === "Active").length ?? 0;
  const draft = products?.filter((p) => p.status === "Draft").length ?? 0;
  const lowStock = products?.filter((p) => p.inventory === 0).length ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-400 text-sm mt-0.5">{total} total · {active} active · {draft} draft</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <Link href="/admin/dashboard/products/import"
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <Upload className="w-3.5 h-3.5" /> Import
          </Link>
          <Link href="/admin/dashboard/products/new"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#0B3D33] text-white rounded-xl hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add product
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: total, color: "text-gray-800" },
          { label: "Active", value: active, color: "text-green-600" },
          { label: "Draft", value: draft, color: "text-gray-500" },
          { label: "Out of stock", value: lowStock, color: lowStock > 0 ? "text-red-500" : "text-gray-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-gray-400">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] bg-white" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "" | "Active" | "Draft")}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] bg-white">
          <option value="">All status</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
        </select>
        {selected.size > 0 && (
          <button onClick={handleBulkDelete}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete ({selected.size})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {products === undefined ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">{search || statusFilter ? "No products match your filters." : "No products yet. Add your first product."}</p>
            {!search && !statusFilter && (
              <Link href="/admin/dashboard/products/new" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#0B3D33] hover:opacity-70 transition-opacity">
                <Plus className="w-4 h-4" /> Add product
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll} className="rounded accent-[#C9A96E]" />
                </th>
                {["Product", "Status", "Inventory", "Category", "Vendor", "Price", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p._id} className={`hover:bg-gray-50 transition-colors ${selected.has(p._id) ? "bg-[#C9A96E]/5" : ""}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(p._id)} onChange={() => toggleSelect(p._id)} className="rounded accent-[#C9A96E]" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0].url} alt={p.title} className="w-10 h-10 rounded-xl object-cover bg-gray-100 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate max-w-[200px]">{p.title}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">{p.sku ?? p.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${p.inventory === 0 ? "text-red-500" : "text-gray-700"}`}>
                      {p.trackInventory ? `${p.inventory} in stock` : "Not tracked"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{p.category ?? p.gender ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[120px]">{p.vendor || "—"}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    KES {p.price.toLocaleString()}
                    {p.compareAtPrice && <span className="line-through text-gray-300 text-xs ml-1">{p.compareAtPrice.toLocaleString()}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Link href={`/admin/dashboard/products/${p._id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-[#0B3D33] hover:bg-gray-100 rounded-lg transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button onClick={() => handleDelete(p._id as Id<"products">)} disabled={deleting === p._id}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
