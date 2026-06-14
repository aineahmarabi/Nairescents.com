"use client";
import { useEffect, useState } from "react";
import { getProducts, deleteProduct, createProduct } from "@/lib/api";
import type { Product } from "@/lib/types";
import { Plus, Search, Package, Trash2, Pencil, Copy } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { setProducts(await getProducts()); } catch {}
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(id);
    await deleteProduct(id).catch(() => {});
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  }

  async function handleDuplicate(p: Product) {
    const dup = { ...p, id: undefined, title: `${p.title} (Copy)`, status: 'Draft' as const, createdAt: undefined, updatedAt: undefined };
    try {
      const created = await createProduct(dup);
      setProducts(prev => [created, ...prev]);
    } catch {}
  }

  const filtered = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-900">Products</h1>
        <Link href="/dashboard/products/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B3D33] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 bg-white">
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-[#C9A96E] border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">{search ? "No products match your search" : "No products yet"}</p>
            {!search && <Link href="/dashboard/products/new" className="inline-block mt-2 text-sm text-[#C9A96E] hover:underline">Add your first product →</Link>}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Product</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Brand</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Gender</th>
                <th className="text-right px-4 py-3 font-semibold">Price</th>
                <th className="text-right px-4 py-3 font-semibold hidden sm:table-cell">Stock</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        {p.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/dashboard/products/${p.id}`} className="font-medium text-gray-900 hover:text-[#0B3D33] truncate block max-w-[160px]">{p.title}</Link>
                        {p.size && <span className="text-xs text-gray-400">{p.size}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.brand}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.gender}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">KES {p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <span className={`text-xs font-medium ${p.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                      {p.inStock ? (p.trackInventory ? p.inventory : 'In stock') : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dashboard/products/${p.id}`} className="p-1.5 text-gray-400 hover:text-[#0B3D33] rounded-lg hover:bg-gray-100 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button onClick={() => handleDuplicate(p)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
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
