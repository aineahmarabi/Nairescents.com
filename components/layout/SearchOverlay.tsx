"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1] as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: Props) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const all = useQuery(api.products.list, { status: "Active" });

  useEffect(() => {
    if (open) {
      setQ("");
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term || !all) return [];
    return all
      .filter((p) => p.status === "Active")
      .filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          (p.brand ?? "").toLowerCase().includes(term)
      )
      .slice(0, 6);
  }, [q, all]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease }}
            className="fixed top-0 left-0 right-0 z-[70] bg-[#0B3D33] border-b border-white/10 shadow-2xl"
          >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-[#C9A96E] flex-none" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search for a fragrance, brand…"
                  className="flex-1 bg-transparent text-white placeholder:text-white/30 text-lg outline-none"
                />
                <button
                  onClick={onClose}
                  aria-label="Close search"
                  className="text-white/50 hover:text-white transition-colors p-1 flex-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {q.trim() && (
                <div className="mt-5 max-h-[60vh] overflow-y-auto">
                  {all === undefined ? (
                    <p className="text-white/30 text-sm py-6 text-center">Searching…</p>
                  ) : results.length === 0 ? (
                    <p className="text-white/30 text-sm py-6 text-center">
                      No products found for "{q}".
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-1">
                      {results.map((p) => {
                        const img = p.images?.[0]?.url;
                        return (
                          <li key={p._id}>
                            <Link
                              href={p.handle ? `/products/${p.handle}` : "/products"}
                              onClick={onClose}
                              className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                            >
                              <div className="relative w-12 h-16 flex-none rounded-lg overflow-hidden bg-white/5 border border-white/8">
                                {img ? (
                                  <Image src={img} alt={p.title} fill className="object-cover" sizes="48px" />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white/10 text-lg">✦</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white/40 text-[10px] tracking-widest uppercase">{p.brand}</p>
                                <p className="text-white text-sm font-semibold truncate">{p.title}</p>
                              </div>
                              <span className="text-[#C9A96E] text-sm font-semibold flex-none">
                                KES {p.price.toLocaleString()}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
