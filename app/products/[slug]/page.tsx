"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { useCart } from "@/components/layout/CartContext";
import { useTrackEvent } from "@/lib/analytics";
import type { Product } from "@/lib/types";

function toProductCard(p: any): Product {
  return {
    id: p._id,
    handle: p.handle ?? "",
    title: p.title,
    description: p.descriptionHtml ?? "",
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: p.images.map((img: any) => img.url).filter(Boolean),
    brand: (p.brand ?? "") as Product["brand"],
    gender: (p.gender ?? "") as Product["gender"],
    whenToWear: (p.whenToWear ?? []) as Product["whenToWear"],
    size: p.size ?? "",
    sku: p.sku ?? "",
    inventory: p.inventory ?? 0,
    trackInventory: p.trackInventory ?? false,
    inStock: p.inStock ?? true,
    sellWhenOutOfStock: p.sellWhenOutOfStock ?? false,
    status: p.status as "Active" | "Draft",
    tags: {
      bestSeller: p.tags.includes("Best Seller"),
      newIn: p.tags.includes("New In"),
      featured: p.tags.includes("Featured"),
    },
    hasVariants: p.hasVariants ?? false,
    options: p.options ?? [],
    variants: p.variants ?? [],
    createdAt: "",
    updatedAt: "",
  };
}

const ease = [0.16, 1, 0.3, 1] as const;

interface Props {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: Props) {
  const { slug } = params;
  const router = useRouter();
  const { addItem, triggerFly } = useCart();
  const track = useTrackEvent();
  const imgRef = useRef<HTMLDivElement>(null);
  const [qty, setQty] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const [thumbFailed, setThumbFailed] = useState<Record<number, boolean>>({});

  const rawProduct = useQuery(api.products.getByHandle, { handle: slug });
  const allRaw = useQuery(api.products.list, { status: "Active" });

  const product = rawProduct ? toProductCard(rawProduct) : null;

  useEffect(() => {
    if (product) {
      track("product_view", { productId: product.id, productTitle: product.title, value: product.price });
      if (product.hasVariants && product.variants?.length && !selectedVariantId) {
        setSelectedVariantId(product.variants[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const related = useMemo(() => {
    if (!allRaw || !product) return [];
    const pool = allRaw.filter((p) => p.handle !== slug).map(toProductCard);
    const sameBrand = pool.filter((p) => p.brand === product.brand).slice(0, 2);
    const bestSellers = pool
      .filter((p) => p.tags.bestSeller && p.brand !== product.brand)
      .slice(0, 2);
    const usedIds = new Set([...sameBrand, ...bestSellers].map((p) => p.id));
    const extras = pool.filter((p) => !usedIds.has(p.id)).slice(0, 4 - sameBrand.length - bestSellers.length);
    return [...sameBrand, ...bestSellers, ...extras].slice(0, 4);
  }, [allRaw, product, slug]);

  // Loading
  if (rawProduct === undefined) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <div className="flex items-center justify-center py-40 gap-3">
          <div className="w-5 h-5 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
          <span className="text-white/30 text-sm">Loading…</span>
        </div>
        <Footer />
      </>
    );
  }

  // Not found
  if (rawProduct === null) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <div className="py-40 text-center">
          <p className="text-white/30 text-lg">Product not found.</p>
          <Link href="/products" className="mt-4 inline-block text-[#C9A96E] text-sm hover:opacity-70">
            ← Back to all products
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const allImages = product?.images || [];
  const img = allImages[activeImageIndex] || allImages[0];

  const canBuy = !!product;

  const currentVariant = useMemo(() => {
    if (!product?.hasVariants || !product?.variants?.length || !selectedVariantId) return null;
    return product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
  }, [product, selectedVariantId]);

  const displayPrice = currentVariant ? currentVariant.price : (product?.price ?? 0);
  const displayComparePrice = currentVariant ? currentVariant.compareAtPrice : product?.compareAtPrice;

  function handleAddToCart() {
    if (!canBuy) return;
    const itemTitle = currentVariant ? `${product!.title} - ${currentVariant.title}` : product!.title;
    addItem({ productId: product!.id, variantId: currentVariant?.id, title: itemTitle, price: displayPrice, imageUrl: img, quantity: qty });
    if (imgRef.current) triggerFly(img ?? "", imgRef.current.getBoundingClientRect());
  }

  function handleBuyNow() {
    if (!canBuy) return;
    const itemTitle = currentVariant ? `${product!.title} - ${currentVariant.title}` : product!.title;
    addItem({ productId: product!.id, variantId: currentVariant?.id, title: itemTitle, price: displayPrice, imageUrl: img, quantity: qty });
    router.push("/checkout");
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs text-white/40">
          <Link href="/products" className="hover:text-white/70 transition-colors">All Products</Link>
          <span>/</span>
          <span className="text-white/60 line-clamp-1">{product!.title}</span>
        </nav>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-20 items-start">

          {/* LEFT — product image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <div ref={imgRef} className="relative aspect-[3/4] rounded-2xl overflow-hidden max-h-[480px]">
              {img && !imgFailed ? (
                <Image
                  src={img}
                  alt={product!.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                  <span className="text-white/10 text-5xl">✦</span>
                </div>
              )}
              {product!.tags?.newIn && (
                <span className="absolute top-4 left-4 bg-[#C9A96E] text-[#0B3D33] text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                  New
                </span>
              )}
              {product!.tags?.bestSeller && !product!.tags?.newIn && (
                <span className="absolute top-4 left-4 bg-white/10 text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full">
                  Best Seller
                </span>
              )}
            </div>

            {/* Thumbnail strip if multiple images */}
            {product!.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {product!.images.slice(0, 6).map((url, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative w-16 h-20 flex-none rounded-lg overflow-hidden border transition-all ${
                      activeImageIndex === i ? 'border-[#C9A96E] opacity-100' : 'border-white/10 opacity-60 hover:opacity-100'
                    } bg-white/5`}
                  >
                    {!thumbFailed[i] ? (
                      <Image src={url} alt={`${product!.title} view ${i + 1}`} fill className="object-cover" sizes="64px" onError={() => setThumbFailed(p => ({ ...p, [i]: true }))} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white/10 text-[10px]">✦</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT — product info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.08 }}
            className="flex flex-col gap-5 lg:pt-2"
          >
            {/* Brand */}
            <p className="text-[#C9A96E] text-xs tracking-[0.25em] uppercase font-semibold">
              {product!.brand}
            </p>

            {/* Title */}
            <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              {product!.title}
            </h1>

            {/* Size / variant info */}
            {product!.size && (
              <p className="text-white/40 text-sm">{product!.size}</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-[#C9A96E] text-2xl font-bold">
                KES {displayPrice.toLocaleString()}
              </span>
              {displayComparePrice && displayComparePrice > displayPrice && (
                <span className="text-white/30 text-lg line-through">
                  KES {displayComparePrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Variant Selector */}
            {product!.hasVariants && product!.variants && product!.variants.length > 0 && (
              <div className="space-y-4 pt-2">
                {product!.options?.map((option, idx) => (
                  <div key={idx}>
                    <p className="text-white/60 text-sm mb-2">{option.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {product!.variants?.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                            selectedVariantId === v.id
                              ? "border-[#C9A96E] text-[#0B3D33] bg-[#C9A96E]"
                              : "border-white/20 text-white hover:border-white/50 bg-white/5"
                          }`}
                        >
                          {v.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Stepper + Add to Cart */}
            <div className="flex items-center gap-3">
              {/* Pill stepper */}
              <div className="flex items-center bg-[#0e4a3d] rounded-full px-1 py-1 gap-0.5 flex-none">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="w-8 text-center text-white font-semibold text-sm select-none">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Add to Cart — outlined button */}
              <button
                onClick={handleAddToCart}
                disabled={!canBuy}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold tracking-widest uppercase transition-all ${
                  canBuy
                    ? "border border-[#C9A96E]/50 text-[#C9A96E] hover:bg-[#C9A96E]/10 active:scale-[0.98]"
                    : "border border-white/10 text-white/20 cursor-not-allowed"
                }`}
              >
                <ShoppingBag size={16} strokeWidth={1.5} />
                Add to Cart
              </button>
            </div>

            {/* Buy it now — solid gold button */}
            {canBuy && (
              <button
                onClick={handleBuyNow}
                className="px-8 py-3 rounded-xl bg-[#C9A96E] text-[#0B3D33] text-sm font-bold tracking-widest uppercase hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Buy it now
              </button>
            )}

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Description */}
            {product!.description && (
              <div
                className="text-white/55 text-sm leading-relaxed space-y-3 [&_strong]:text-white/80 [&_em]:italic [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mt-1"
                dangerouslySetInnerHTML={{ __html: product!.description }}
              />
            )}

            {/* Tags */}
            {(product!.whenToWear?.length > 0 || product!.gender) && (
              <div className="flex flex-wrap gap-2 pt-2">
                {product!.gender && (
                  <span className="px-3 py-1 rounded-full border border-white/10 text-white/40 text-[11px] tracking-widest uppercase">
                    {product!.gender}
                  </span>
                )}
                {product!.whenToWear?.map((w) => (
                  <span key={w} className="px-3 py-1 rounded-full border border-white/10 text-white/40 text-[11px] tracking-widest uppercase">
                    {w}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* You may also like */}
        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
            className="mt-20"
          >
            <h2 className="text-white text-2xl font-bold tracking-tight mb-8">
              You may also like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </motion.section>
        )}
      </main>
      <Footer />
    </>
  );
}
