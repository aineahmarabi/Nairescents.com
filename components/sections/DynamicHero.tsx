"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const BRAND_LOGOS = [
  { slug: "lattafa", name: "Lattafa" },
  { slug: "fragrance-world", name: "Fragrance World" },
  { slug: "french-avenue", name: "French Avenue" },
  { slug: "maison-alhambra", name: "Maison Alhambra" },
  { slug: "ard-al-zaafaran", name: "Ard Al Zaafaran" },
];

// Default cinematic rotation for the featured panel, used until an admin sets a custom rotation
const DEFAULT_HERO_IMAGES = [
  "/hero/hero-02-smoke-emerald-1200x1800.jpg",
  "/hero/hero-01-amber-bottle-oud-smoke-1200x1800.jpg",
  "/hero/hero-06-spray-mist-1200x1800.jpg",
  "/hero/hero-05-dune-shadow-1200x1800.jpg",
  "/hero/hero-03-gold-dust-oud-1200x1800.jpg",
  "/hero/hero-07-majlis-still-life-1200x1800.jpg",
  "/hero/hero-04-crystal-macro-1200x1800.jpg",
];

const ease = [0.16, 1, 0.3, 1] as const;
// Expo-out easing string for native CSS transitions on layout props
const PANEL_TRANSITION = "flex-grow 0.6s cubic-bezier(0.16, 1, 0.3, 1)";

interface DoorPanel {
  id: string;
  label: string;
  name: string;
  sub: string;
  href: string;
  fallbackBg: string;
}

const PANELS: DoorPanel[] = [
  { id: "men",    label: "SHOP",     name: "For Him",      sub: "Bold. Woody. Powerful.",   href: "/gender/men",    fallbackBg: "linear-gradient(160deg,#1a2a20,#0B3D33)" },
  { id: "women",  label: "SHOP",     name: "For Her",      sub: "Soft. Floral. Timeless.",  href: "/gender/women",  fallbackBg: "linear-gradient(160deg,#2a1520,#3d1a2a)" },
  { id: "best",   label: "TRENDING", name: "Best Sellers", sub: "Our most-loved scents.",   href: "/products",      fallbackBg: "linear-gradient(160deg,#1a1508,#2a2010)" },
  { id: "new",    label: "JUST IN",  name: "New In",       sub: "Fresh arrivals.",          href: "/products",      fallbackBg: "linear-gradient(160deg,#08101a,#0a1a2e)" },
];

// Collect all product images for a given filter
function usePanelImages(gender?: string, tag?: string): string[] {
  const all = useQuery(api.products.list, {});
  return useMemo(() => {
    if (!all) return [];
    let filtered = all.filter((p) => p.status === "Active" && p.images.length > 0);
    if (gender) filtered = filtered.filter((p) => p.gender === gender);
    if (tag)    filtered = filtered.filter((p) => p.tags.includes(tag));
    const seen = new Set<string>();
    const imgs: string[] = [];
    for (const p of filtered) {
      for (const img of p.images) {
        if (img.url && !seen.has(img.url)) { seen.add(img.url); imgs.push(img.url); }
      }
    }
    return imgs;
  }, [all, gender, tag]);
}

// Cycles through an image array at a given interval
function useCycleIndex(count: number, ms = 3000) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % count), ms);
    return () => clearInterval(t);
  }, [count, ms]);
  return count === 0 ? -1 : idx;
}

// Each panel gets its own image cycle — accepts pre-computed idx so dots stay in sync
function PanelBackground({ images, idx, bg }: { images: string[]; idx: number; bg: string }) {
  const current = images[idx] ?? "";

  if (!current) return <div className="absolute inset-0" style={{ background: bg }} />;

  return (
    <>
      <div className="absolute inset-0" style={{ background: bg }} />
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 bg-center bg-contain bg-no-repeat"
          style={{ backgroundImage: `url(${current})` }}
        />
      </AnimatePresence>
    </>
  );
}

// Dots showing which image is active
function CycleDots({ total, active }: { total: number; active: number }) {
  if (total <= 1) return null;
  return (
    <div className="flex gap-1 mb-2">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`block h-0.5 rounded-full transition-all duration-500 ${i === active ? "w-4 bg-[#C9A96E]" : "w-1.5 bg-white/20"}`} />
      ))}
    </div>
  );
}

function PanelContent({ panel, images, isHot }: { panel: DoorPanel; images: string[]; isHot: boolean }) {
  const idx = useCycleIndex(images.length, 3000);
  return (
    <>
      <PanelBackground images={images} idx={idx < 0 ? 0 : idx} bg={panel.fallbackBg} />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(0,0,0,0.7)_0%,transparent_65%)]" />
      {isHot && <div className="absolute inset-0 bg-black/10 transition-all duration-300" />}
      <span className="shine-repeat" aria-hidden="true" />

      {/* Text */}
      <div className="relative z-10 space-y-1">
        <CycleDots total={images.length} active={idx < 0 ? 0 : idx} />
        <p className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase font-semibold">{panel.label}</p>
        <motion.h2
          animate={{ opacity: isHot ? 1 : 0.8 }}
          transition={{ duration: 0.35, delay: isHot ? 0.12 : 0 }}
          className="text-white font-bold tracking-tight leading-tight"
          style={{
            fontSize: isHot ? "1.35rem" : "1.1rem",
            writingMode: isHot ? "horizontal-tb" : "vertical-rl",
            textOrientation: "mixed",
            transition: "font-size 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {panel.name}
        </motion.h2>
        <motion.p
          animate={{ opacity: isHot ? 1 : 0, y: isHot ? 0 : 4 }}
          transition={{ duration: 0.35, delay: isHot ? 0.2 : 0 }}
          className="text-white/70 text-xs mt-1 max-w-[160px] leading-relaxed"
        >
          {panel.sub}
        </motion.p>
        <motion.div animate={{ opacity: isHot ? 1 : 0, y: isHot ? 0 : 6 }} transition={{ duration: 0.35, delay: isHot ? 0.28 : 0 }}>
          <Link
            href={panel.href}
            className="inline-flex items-center gap-1.5 mt-3 text-[#C9A96E] text-xs font-semibold tracking-widest uppercase border-b border-[#C9A96E]/50 hover:border-[#C9A96E] transition-colors pb-0.5"
          >
            Explore →
          </Link>
        </motion.div>
      </div>
    </>
  );
}

function MobilePanelCard({ panel, images }: { panel: DoorPanel; images: string[] }) {
  const idx = useCycleIndex(images.length, 3000);
  return (
    <Link href={panel.href} className="relative flex flex-col justify-end p-4 overflow-hidden" style={{ minHeight: "180px" }}>
      <PanelBackground images={images} idx={idx < 0 ? 0 : idx} bg={panel.fallbackBg} />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(0,0,0,0.7)_0%,transparent_65%)]" />
      <span className="shine-repeat" aria-hidden="true" />
      <div className="relative z-10">
        <p className="text-[#C9A96E] text-[9px] tracking-[0.2em] uppercase font-semibold">{panel.label}</p>
        <p className="text-white text-sm font-bold mt-0.5">{panel.name}</p>
      </div>
    </Link>
  );
}

interface DynamicHeroProps {
  initialPanelImages?: string[][];
}

export default function DynamicHero({ initialPanelImages }: DynamicHeroProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const featuredSlot = useQuery(api.hero.getBySlot, { slot: "featured" });
  const featuredImages =
    featuredSlot?.rotationImages && featuredSlot.rotationImages.length > 0
      ? featuredSlot.rotationImages
      : DEFAULT_HERO_IMAGES;
  const featuredIdx = useCycleIndex(featuredImages.length, 5000);
  const rawMen    = usePanelImages(undefined, "Men");
  const rawWomen  = usePanelImages(undefined, "Women");
  const rawBest   = usePanelImages(undefined, "Best Seller");
  const rawNew    = usePanelImages(undefined, "New In");

  // Use server-prefetched images immediately; switch to live Convex data once it loads
  const menImages   = rawMen.length   > 0 ? rawMen   : (initialPanelImages?.[0] ?? []);
  const womenImages = rawWomen.length > 0 ? rawWomen : (initialPanelImages?.[1] ?? []);
  const bestImages  = rawBest.length  > 0 ? rawBest  : (initialPanelImages?.[2] ?? []);
  const newImages   = rawNew.length   > 0 ? rawNew   : (initialPanelImages?.[3] ?? []);

  const panelImages = [menImages, womenImages, bestImages, newImages];

  return (
    <>
      {/* ── DESKTOP ── */}
      <section className="hidden md:flex w-full" style={{ height: "calc(100vh - 113px)", minHeight: "500px" }}>
        {/* Featured left panel — 32% */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease }}
          className="relative flex-none flex flex-col justify-center p-10 overflow-hidden"
          style={{ width: "32%" }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #0B3D33 0%, #081f1a 100%)" }} />
          <AnimatePresence mode="sync">
            <motion.div
              key={featuredImages[featuredIdx]}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1.15 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 1.2, ease: "easeInOut" },
                scale: { duration: 6, ease: "easeOut" },
              }}
              className="absolute inset-0 bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${featuredImages[featuredIdx]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-[#0B3D33]/55" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_#C9A96E_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,0,0,0.5)_0%,transparent_60%)]" />
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}
            className="absolute top-6 left-10 z-10 flex flex-wrap items-center gap-4"
          >
            {BRAND_LOGOS.map((b) => (
              <motion.div
                key={b.slug}
                variants={{ hidden: { opacity: 0, x: -50 }, show: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.55, ease }}
              >
                <Image
                  src={`/brand-logos/${b.slug}-gold-transparent.png`}
                  alt={b.name}
                  width={100}
                  height={70}
                  className="h-12 sm:h-14 w-auto object-contain opacity-95"
                />
              </motion.div>
            ))}
          </motion.div>
          <div className="relative z-10">
            <p className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase font-semibold mb-3">Luxury Arabian Fragrances</p>
            <h1 className="text-white text-5xl xl:text-6xl font-bold tracking-tighter leading-none mb-5">
              Scents<br />by Naire
            </h1>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-[260px]">
              Scents that speak before you do.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#C9A96E] text-[#C9A96E] text-sm font-semibold tracking-widest uppercase hover:bg-[#C9A96E]/10 active:scale-[0.98] transition-all rounded-xl"
            >
              Shop All
            </Link>
          </div>
        </motion.div>

        {/* 4 expanding door panels — 68% */}
        <div className="flex flex-1 gap-[1px] bg-[#C9A96E]/15 overflow-hidden">
          {PANELS.map((panel, i) => {
            const isHot     = hovered === i;
            const isDimmed  = hovered !== null && hovered !== i;
            return (
              <motion.div
                key={panel.id}
                initial={{ opacity: 0, x: 28, flexGrow: 1 }}
                animate={{ opacity: 1, x: 0, flexGrow: isHot ? 3.5 : isDimmed ? 0.5 : 1 }}
                transition={{
                  opacity:  { duration: 0.55, ease, delay: 0.15 + i * 0.08 },
                  x:        { duration: 0.55, ease, delay: 0.15 + i * 0.08 },
                  flexGrow: { type: "spring", stiffness: 120, damping: 22, mass: 1 },
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="relative flex flex-col justify-end p-6 overflow-hidden cursor-pointer"
              >
                <PanelContent panel={panel} images={panelImages[i]} isHot={isHot} />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── MOBILE ── */}
      <section className="md:hidden flex flex-col" style={{ minHeight: "calc(100vh - 97px)" }}>
        {/* Featured */}
        <div
          className="flex flex-col justify-between px-6 py-6 relative overflow-hidden"
          style={{ height: "46%" }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #0B3D33 0%, #081f1a 100%)" }} />
          <AnimatePresence mode="sync">
            <motion.div
              key={featuredImages[featuredIdx]}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1.15 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 1.2, ease: "easeInOut" },
                scale: { duration: 6, ease: "easeOut" },
              }}
              className="absolute inset-0 bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${featuredImages[featuredIdx]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-[#0B3D33]/55" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_#C9A96E_0%,_transparent_60%)]" />
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } } }}
            className="relative z-10 flex flex-wrap items-center gap-3"
          >
            {BRAND_LOGOS.map((b) => (
              <motion.div
                key={b.slug}
                variants={{ hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.5, ease }}
              >
                <Image
                  src={`/brand-logos/${b.slug}-gold-transparent.png`}
                  alt={b.name}
                  width={90}
                  height={60}
                  className="h-7 w-auto object-contain opacity-95"
                />
              </motion.div>
            ))}
          </motion.div>
          <div className="relative z-10">
            <p className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase font-semibold mb-2">Luxury Arabian Fragrances</p>
            <h1 className="text-white text-4xl font-bold tracking-tighter leading-none mb-3">Scents by Naire</h1>
            <p className="text-white/50 text-sm leading-relaxed mb-5">Fine perfumery for those who leave an impression.</p>
            <Link href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#C9A96E] text-[#C9A96E] text-xs font-semibold tracking-widest uppercase hover:bg-[#C9A96E]/10 rounded-xl">
              Shop All
            </Link>
          </div>
        </div>

        {/* 2×2 panels */}
        <div className="grid grid-cols-2 flex-1 gap-[1px] bg-[#C9A96E]/15">
          {PANELS.map((panel, i) => (
            <MobilePanelCard key={panel.id} panel={panel} images={panelImages[i]} />
          ))}
        </div>
      </section>
    </>
  );
}
