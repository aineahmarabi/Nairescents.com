"use client";
import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

export interface ProductOption { name: string; values: string[]; }
export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  barcode?: string;
  inventory: number;
  weight?: number;
  option1?: string;
  option2?: string;
}

interface Props {
  options: ProductOption[];
  variants: ProductVariant[];
  basePrice: number;
  onChange: (opts: ProductOption[], variants: ProductVariant[]) => void;
}

function buildVariants(options: ProductOption[], basePrice: number): ProductVariant[] {
  const valid = options.filter((o) => o.values.length > 0 && o.name.trim());
  if (valid.length === 0) return [];
  const [first, second] = valid;
  const out: ProductVariant[] = [];
  for (const v1 of first.values) {
    if (second?.values.length) {
      for (const v2 of second.values) {
        out.push({ id: `${v1}-${v2}`.toLowerCase().replace(/\s+/g, "-"), title: `${v1} / ${v2}`, price: basePrice, inventory: 0, option1: v1, option2: v2 });
      }
    } else {
      out.push({ id: v1.toLowerCase().replace(/\s+/g, "-"), title: v1, price: basePrice, inventory: 0, option1: v1 });
    }
  }
  return out;
}

export default function VariantsEditor({ options, variants, basePrice, onChange }: Props) {
  const [newVal, setNewVal] = useState<Record<number, string>>({});

  const ic = "border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] transition-colors bg-white";

  function addOption() {
    const opts = [...options, { name: "", values: [] }];
    onChange(opts, buildVariants(opts, basePrice));
  }

  function removeOption(i: number) {
    const opts = options.filter((_, idx) => idx !== i);
    onChange(opts, buildVariants(opts, basePrice));
  }

  function setName(i: number, name: string) {
    const opts = options.map((o, idx) => idx === i ? { ...o, name } : o);
    onChange(opts, variants);
  }

  function addValue(i: number) {
    const val = (newVal[i] ?? "").trim();
    if (!val) return;
    const opts = options.map((o, idx) => idx === i ? { ...o, values: [...o.values, val] } : o);
    setNewVal((v) => ({ ...v, [i]: "" }));
    onChange(opts, buildVariants(opts, basePrice));
  }

  function removeValue(oi: number, vi: number) {
    const opts = options.map((o, idx) => idx === oi ? { ...o, values: o.values.filter((_, j) => j !== vi) } : o);
    onChange(opts, buildVariants(opts, basePrice));
  }

  function patchVariant(id: string, field: keyof ProductVariant, val: unknown) {
    onChange(options, variants.map((v) => v.id === id ? { ...v, [field]: val } : v));
  }

  return (
    <div className="space-y-4">
      {options.map((opt, oi) => (
        <div key={oi} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <input value={opt.name} onChange={(e) => setName(oi, e.target.value)} className={ic + " flex-1"} placeholder="Option name (e.g. Size)" />
            <button type="button" onClick={() => removeOption(oi)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((val, vi) => (
              <span key={vi} className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
                {val}
                <button type="button" onClick={() => removeValue(oi, vi)} className="text-gray-400 hover:text-gray-700 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <div className="flex gap-1">
              <input
                value={newVal[oi] ?? ""}
                onChange={(e) => setNewVal((v) => ({ ...v, [oi]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addValue(oi); } }}
                placeholder="Add value…"
                className="border border-dashed border-gray-300 rounded-lg px-2.5 py-1 text-sm focus:outline-none focus:border-[#C9A96E] w-28"
              />
              <button type="button" onClick={() => addValue(oi)} className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 text-sm transition-colors">+</button>
            </div>
          </div>
        </div>
      ))}

      {options.length < 2 && (
        <button type="button" onClick={addOption} className="flex items-center gap-1.5 text-sm text-[#0B3D33] font-medium hover:opacity-70 transition-opacity">
          <Plus className="w-4 h-4" /> Add option
        </button>
      )}

      {variants.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {variants.length} Variant{variants.length !== 1 ? "s" : ""}
          </p>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Variant", "Price", "Compare at", "SKU", "Qty"].map((h) => (
                    <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {variants.map((v) => (
                  <tr key={v.id}>
                    <td className="px-3 py-2 font-medium text-gray-800">{v.title}</td>
                    <td className="px-3 py-2">
                      <input type="number" min="0" step="0.01" value={v.price}
                        onChange={(e) => patchVariant(v.id, "price", Number(e.target.value))}
                        className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-[#C9A96E]" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="number" min="0" step="0.01" value={v.compareAtPrice ?? ""}
                        onChange={(e) => patchVariant(v.id, "compareAtPrice", e.target.value ? Number(e.target.value) : undefined)}
                        className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-[#C9A96E]" />
                    </td>
                    <td className="px-3 py-2">
                      <input value={v.sku ?? ""} onChange={(e) => patchVariant(v.id, "sku", e.target.value)}
                        className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-[#C9A96E]" placeholder="SKU" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="number" min="0" value={v.inventory}
                        onChange={(e) => patchVariant(v.id, "inventory", Number(e.target.value))}
                        className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-[#C9A96E]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
