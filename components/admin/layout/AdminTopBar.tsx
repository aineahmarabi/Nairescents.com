"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Search, Menu, Package, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Props { onMenuClick: () => void; }

export default function AdminTopBar({ onMenuClick }: Props) {
  const { user } = useUser();
  const settings = useQuery(api.settings.getAll);
  const storeName = settings?.storeName ?? "Naire Scents";
  const adminName = user?.fullName ?? user?.firstName ?? storeName;

  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const products = useQuery(api.products.list, {});
  const orders = useQuery(api.orders.list);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { products: [], orders: [] };
    const matchedProducts = (products ?? [])
      .filter((p) => p.title.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q))
      .slice(0, 5);
    const matchedOrders = (orders ?? [])
      .filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q)
      )
      .slice(0, 5);
    return { products: matchedProducts, orders: matchedOrders };
  }, [query, products, orders]);

  const hasResults = results.products.length > 0 || results.orders.length > 0;

  function goTo(href: string) {
    setQuery("");
    setOpen(false);
    router.push(href);
  }

  return (
    <header className="sticky top-0 z-30 h-16 md:h-20 flex items-center gap-3 sm:gap-6 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100 shadow-sm shrink-0">
      <button onClick={onMenuClick} className="md:hidden text-gray-500 hover:text-gray-800 transition-colors shrink-0">
        <Menu className="w-5 h-5" />
      </button>

      <div ref={boxRef} className="flex-1 min-w-0 max-w-sm relative">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search products, orders…"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-9 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] transition-colors"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setOpen(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {open && query.trim() && (
          <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg max-h-[60vh] overflow-y-auto z-40">
            {!hasResults ? (
              <p className="px-4 py-6 text-sm text-gray-400 text-center">No matches for &ldquo;{query}&rdquo;</p>
            ) : (
              <>
                {results.products.length > 0 && (
                  <div className="py-2">
                    <p className="px-4 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Products</p>
                    {results.products.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => goTo(`/admin/dashboard/products/${p._id}/edit`)}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                          {p.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-3.5 h-3.5 text-gray-300" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700 truncate">{p.title}</span>
                      </button>
                    ))}
                  </div>
                )}
                {results.orders.length > 0 && (
                  <div className="py-2 border-t border-gray-50">
                    <p className="px-4 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Orders</p>
                    {results.orders.map((o) => (
                      <button
                        key={o._id}
                        onClick={() => goTo(`/admin/dashboard/orders/${o._id}`)}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <ShoppingCart className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-700 truncate">{o.orderNumber} — {o.customer.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 ml-auto shrink-0">
        <Link href="/admin/dashboard/messages" className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <Bell className="w-4 h-4" />
        </Link>

        <div className="h-6 w-px bg-gray-200 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B3D33] flex items-center justify-center shrink-0 overflow-hidden p-1">
            <Image
              src="/footer-logos/logo-08.png"
              alt={storeName}
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-gray-800">{adminName}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
