"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/api";
import { BRANDS, GENDERS, WHEN_TO_WEAR } from "@/lib/types";
import type { Product } from "@/lib/types";
import { Plus, X } from "lucide-react";

interface Props {
  initial?: Partial<Product>;
  isEdit?: boolean;
}

const blank: Partial<Product> = {
  title: "", description: "", price: 0, compareAtPrice: undefined, costPerItem: undefined,
  images: [], brand: BRANDS[0], gender: GENDERS[0], whenToWear: [], size: "",
  sku: "", inventory: 0, trackInventory: true, inStock: true,
  status: "Active", tags: { bestSeller: false, featured: false, newIn: false },
};

export default function ProductForm({ initial, isEdit }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Product>>({ ...blank, ...initial });
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof Product, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  function toggleWear(w: string) {
    const cur = form.whenToWear ?? [];
    set('whenToWear', cur.includes(w as never) ? cur.filter(x => x !== w) : [...cur, w]);
  }

  function addImage() {
    if (!imageUrl.trim()) return;
    set('images', [...(form.images ?? []), imageUrl.trim()]);
    setImageUrl("");
  }

  function removeImage(idx: number) {
    set('images', (form.images ?? []).filter((_, i) => i !== idx));
  }

  async function handleSave(status: 'Active' | 'Draft') {
    if (!form.title?.trim()) { setError("Title is required."); return; }
    if (!form.price || form.price <= 0) { setError("Price must be greater than 0."); return; }
    setSaving(true); setError("");
    try {
      const payload = { ...form, status };
      if (isEdit && initial?.id) {
        await updateProduct(initial.id, payload);
      } else {
        await createProduct(payload);
      }
      router.push("/dashboard/products");
      router.refresh();
    } catch {
      setError("Failed to save product. Make sure the storefront (port 3000) is running.");
      setSaving(false);
    }
  }

  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] transition-colors bg-white";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main column */}
      <div className="lg:col-span-2 space-y-4">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input value={form.title ?? ""} onChange={e => set('title', e.target.value)} className={inputClass} placeholder="e.g. Oud Noir Intense 100ml" />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.description ?? ""} onChange={e => set('description', e.target.value)} rows={4} className={inputClass + " resize-none"} placeholder="Describe the fragrance…" />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className={labelClass}>Images</label>
          <div className="flex gap-2 mb-3">
            <input
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
              className={inputClass + " flex-1"}
              placeholder="Paste image URL and press Enter"
            />
            <button onClick={addImage} className="shrink-0 px-3 py-2.5 bg-[#0B3D33] text-white rounded-xl hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {(form.images ?? []).length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {(form.images ?? []).map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Pricing</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Price (KES)</label>
              <input type="number" value={form.price ?? ""} onChange={e => set('price', Number(e.target.value))} className={inputClass} placeholder="0" min="0" />
            </div>
            <div>
              <label className={labelClass}>Compare-at</label>
              <input type="number" value={form.compareAtPrice ?? ""} onChange={e => set('compareAtPrice', e.target.value ? Number(e.target.value) : undefined)} className={inputClass} placeholder="0" min="0" />
            </div>
            <div>
              <label className={labelClass}>Cost per item</label>
              <input type="number" value={form.costPerItem ?? ""} onChange={e => set('costPerItem', e.target.value ? Number(e.target.value) : undefined)} className={inputClass} placeholder="0" min="0" />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Inventory</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>SKU</label>
              <input value={form.sku ?? ""} onChange={e => set('sku', e.target.value)} className={inputClass} placeholder="e.g. LATT-ONI-100" />
            </div>
            <div>
              <label className={labelClass}>Size</label>
              <input value={form.size ?? ""} onChange={e => set('size', e.target.value)} className={inputClass} placeholder="e.g. 100ml" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.trackInventory} onChange={e => set('trackInventory', e.target.checked)} className="w-4 h-4 rounded accent-[#C9A96E]" />
              <span className="text-sm text-gray-700">Track quantity</span>
            </label>
            {form.trackInventory && (
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500">Qty:</label>
                <input type="number" value={form.inventory ?? 0} onChange={e => set('inventory', Number(e.target.value))} className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30" min="0" />
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer ml-auto">
              <input type="checkbox" checked={form.inStock} onChange={e => set('inStock', e.target.checked)} className="w-4 h-4 rounded accent-[#C9A96E]" />
              <span className="text-sm text-gray-700">In stock</span>
            </label>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        {/* Status + save */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Status</h3>
          <select value={form.status} onChange={e => set('status', e.target.value)} className={inputClass + " mb-4"}>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <div className="flex flex-col gap-2">
            <button onClick={() => handleSave('Active')} disabled={saving} className="w-full py-2.5 bg-[#0B3D33] text-white rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60">
              {saving ? "Saving…" : isEdit ? "Save changes" : "Save product"}
            </button>
            <button onClick={() => handleSave('Draft')} disabled={saving} className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              Save as draft
            </button>
            <button onClick={() => router.back()} className="w-full py-2.5 text-gray-400 rounded-xl text-sm hover:text-gray-600 transition-colors">
              Discard
            </button>
          </div>
        </div>

        {/* Brand & Gender */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div>
            <label className={labelClass}>Brand</label>
            <select value={form.brand} onChange={e => set('brand', e.target.value)} className={inputClass}>
              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select value={form.gender} onChange={e => set('gender', e.target.value)} className={inputClass}>
              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* When to Wear */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className={labelClass}>When to Wear</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {WHEN_TO_WEAR.map(w => {
              const active = (form.whenToWear ?? []).includes(w as never);
              return (
                <button key={w} onClick={() => toggleWear(w)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? 'border-[#C9A96E] bg-[#C9A96E]/10 text-[#9a7a4e]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  {w}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className={labelClass}>Tags</label>
          <div className="space-y-2.5 mt-2">
            {[
              { key: 'bestSeller', label: 'Best Seller — shows in Best Sellers section' },
              { key: 'newIn', label: 'New In — shows "New" badge' },
              { key: 'featured', label: 'Featured — highlighted in collections' },
            ].map(t => (
              <label key={t.key} className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.tags?.[t.key as keyof typeof form.tags] ?? false}
                  onChange={e => set('tags', { ...form.tags, [t.key]: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded accent-[#C9A96E]"
                />
                <span className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-800">{t.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
