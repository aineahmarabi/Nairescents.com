"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { HeroPanel } from "@/lib/types";

const ease = [0.16, 1, 0.3, 1] as const;
const panelEase = [0.4, 0, 0.2, 1] as const;

const DEFAULT_PANELS: HeroPanel[] = [
  { id: "1", label: "SHOP", name: "For Him", sub: "Bold. Woody. Powerful.", href: "/gender/men", bg: "linear-gradient(135deg, #1a2a20 0%, #0B3D33 50%, #0a2e27 100%)", image: "" },
  { id: "2", label: "SHOP", name: "For Her", sub: "Soft. Floral. Timeless.", href: "/gender/women", bg: "linear-gradient(135deg, #2a1a1a 0%, #3d1a1a 100%)", image: "" },
  { id: "3", label: "TRENDING", name: "Best Sellers", sub: "Our most-loved scents.", href: "/products", bg: "linear-gradient(135deg, #1a1508 0%, #2a2010 100%)", image: "" },
  { id: "4", label: "JUST IN", name: "New In", sub: "Fresh arrivals.", href: "/products", bg: "linear-gradient(135deg, #08101a 0%, #0a1a2e 100%)", image: "" },
];

interface Props {
  panels?: HeroPanel[];
}

export default function Hero({ panels }: Props) {
  const doors = panels && panels.length >= 4 ? panels : DEFAULT_PANELS;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      {/* ── DESKTOP ── */}
      <section className="hidden md:flex w-full" style={{ height: "85vh" }}>
        {/* Featured left panel */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease }}
          className="relative flex-none flex flex-col justify-end p-10 overflow-hidden"
          style={{ width: "40%", background: "linear-gradient(160deg, #0B3D33 0%, #081f1a 100%)" }}
        >
          <div className="relative z-10">
            <p className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase font-semibold mb-3">Luxury Arabian Fragrances</p>
            <h1 className="text-white text-5xl xl:text-6xl font-bold tracking-tighter leading-none mb-5">Scents<br />by Naire</h1>
            <p className="text-white/50 text-base leading-relaxed mb-8 max-w-xs">
              Discover the art of fine perfumery — crafted for those who leave an impression.
            </p>
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 border border-[#C9A96E] text-[#C9A96E] text-sm font-semibold tracking-widest uppercase hover:bg-[#C9A96E]/10 active:scale-[0.98] transition-all rounded-xl">
              Shop All
            </Link>
          </div>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_#C9A96E_0%,_transparent_60%)]" />
        </motion.div>

        {/* 4 expanding door panels */}
        <div className="flex flex-1 gap-[1px] bg-[#C9A96E]/20 overflow-hidden">
          {doors.slice(0, 4).map((door, i) => {
            const isHot = hovered === i;
            const isDimmed = hovered !== null && hovered !== i;
            return (
              <motion.div
                key={door.id}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0, flexGrow: isHot ? 3 : isDimmed ? 0.5 : 1 }}
                transition={{
                  opacity: { duration: 0.55, ease, delay: 0.2 + i * 0.09 },
                  x: { duration: 0.55, ease, delay: 0.2 + i * 0.09 },
                  flexGrow: { duration: 0.42, ease: panelEase },
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="relative flex flex-col justify-end p-6 overflow-hidden cursor-pointer"
                style={{ background: door.image ? `url(${door.image}) center/cover` : door.bg }}
              >
                {door.image && <div className="absolute inset-0 bg-black/40" />}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(0,0,0,0.6)_0%,transparent_70%)]" />
                <div className="relative z-10 space-y-1">
                  <p className="text-[#C9A96E] text-[10px] tracking-[0.25em] uppercase font-semibold">{door.label}</p>
                  <motion.h2
                    animate={{ opacity: isHot ? 1 : 0.7 }}
                    transition={{ duration: 0.25 }}
                    className="text-white text-xl font-bold tracking-tight leading-tight"
                    style={{ writingMode: isHot ? "horizontal-tb" : "vertical-rl", textOrientation: "mixed" }}
                  >
                    {door.name}
                  </motion.h2>
                  <motion.p animate={{ opacity: isHot ? 1 : 0 }} transition={{ duration: 0.25 }} className="text-white/60 text-xs mt-2 max-w-[140px]">
                    {door.sub}
                  </motion.p>
                  <motion.div animate={{ opacity: isHot ? 1 : 0 }} transition={{ duration: 0.25 }}>
                    <Link href={door.href} className="inline-block mt-3 text-[#C9A96E] text-xs font-semibold tracking-widest uppercase border-b border-[#C9A96E]/40 hover:border-[#C9A96E] transition-colors">
                      Explore →
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── MOBILE ── */}
      <section className="md:hidden flex flex-col" style={{ minHeight: "85vh" }}>
        <div className="flex flex-col justify-end px-6 py-8 relative overflow-hidden" style={{ height: "44%", background: "linear-gradient(160deg, #0B3D33 0%, #081f1a 100%)" }}>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_#C9A96E_0%,_transparent_60%)]" />
          <div className="relative z-10">
            <p className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase font-semibold mb-2">Luxury Arabian Fragrances</p>
            <h1 className="text-white text-4xl font-bold tracking-tighter leading-none mb-3">Scents by Naire</h1>
            <p className="text-white/50 text-sm leading-relaxed mb-5">Fine perfumery for those who leave an impression.</p>
            <Link href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#C9A96E] text-[#C9A96E] text-xs font-semibold tracking-widest uppercase hover:bg-[#C9A96E]/10 rounded-xl">
              Shop All
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 flex-1 gap-[1px] bg-[#C9A96E]/20">
          {doors.slice(0, 4).map((door) => (
            <Link key={door.id} href={door.href} className="relative flex flex-col justify-end p-4 overflow-hidden" style={{ background: door.image ? `url(${door.image}) center/cover` : door.bg, minHeight: "140px" }}>
              {door.image && <div className="absolute inset-0 bg-black/40" />}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(0,0,0,0.6)_0%,transparent_70%)]" />
              <div className="relative z-10">
                <p className="text-[#C9A96E] text-[9px] tracking-[0.2em] uppercase font-semibold">{door.label}</p>
                <p className="text-white text-sm font-bold">{door.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
