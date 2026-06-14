"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { BRANDS, GENDERS, WHEN_TO_WEAR } from "@/lib/types";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  total: number;
  hideBrand?: boolean;
  hideGender?: boolean;
}

export default function FilterBar({ total, hideBrand, hideGender }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(sp.toString());
    if (value === '') { params.delete(key); } else { params.set(key, value); }
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, sp]);

  const current = (key: string) => sp.get(key) ?? '';

  const selClass = "bg-white/5 border border-white/15 text-white/70 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-[#C9A96E] appearance-none cursor-pointer hover:border-white/30 transition-colors";

  const hasFilters = ['brand','gender','whenToWear','inStock','sort'].some(k => sp.get(k));

  return (
    <div className="flex flex-wrap items-center gap-3 mb-2">
      <div className="flex items-center gap-2 text-white/30 text-xs mr-1">
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>{total} product{total !== 1 ? 's' : ''}</span>
      </div>

      {!hideBrand && (
        <select value={current('brand')} onChange={e => update('brand', e.target.value)} className={selClass}>
          <option value="">All Brands</option>
          {BRANDS.map(b => <option key={b} value={b} className="bg-[#0B3D33]">{b}</option>)}
        </select>
      )}

      {!hideGender && (
        <select value={current('gender')} onChange={e => update('gender', e.target.value)} className={selClass}>
          <option value="">All Genders</option>
          {GENDERS.map(g => <option key={g} value={g} className="bg-[#0B3D33]">{g}</option>)}
        </select>
      )}

      <select value={current('whenToWear')} onChange={e => update('whenToWear', e.target.value)} className={selClass}>
        <option value="">When to Wear</option>
        {WHEN_TO_WEAR.map(w => <option key={w} value={w} className="bg-[#0B3D33]">{w}</option>)}
      </select>

      <select value={current('inStock')} onChange={e => update('inStock', e.target.value)} className={selClass}>
        <option value="">Availability</option>
        <option value="true" className="bg-[#0B3D33]">In Stock</option>
        <option value="false" className="bg-[#0B3D33]">Out of Stock</option>
      </select>

      <select value={current('sort')} onChange={e => update('sort', e.target.value)} className={selClass}>
        <option value="">Sort by</option>
        <option value="newest" className="bg-[#0B3D33]">Newest</option>
        <option value="price_asc" className="bg-[#0B3D33]">Price: Low → High</option>
        <option value="price_desc" className="bg-[#0B3D33]">Price: High → Low</option>
      </select>

      {hasFilters && (
        <button onClick={() => router.push(pathname)} className="text-[#C9A96E] text-xs underline underline-offset-2 hover:text-white transition-colors">
          Clear filters
        </button>
      )}
    </div>
  );
}
