"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";

const ease = [0.16, 1, 0.3, 1] as const;
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function BestSellersSection() {
  const products = useQuery(api.products.list, { tag: "Best Seller", status: "Active" });

  const mapped = (products ?? []).slice(0, 8).map((p) => ({
    id: p._id,
    handle: p.handle ?? "",
    title: p.title,
    description: p.descriptionHtml ?? "",
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: p.images.map((img) => img.url).filter(Boolean),
    brand: (p.brand ?? "") as never,
    gender: (p.gender ?? "") as never,
    whenToWear: (p.whenToWear ?? []) as never,
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
    createdAt: "",
    updatedAt: "",
  }));

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase font-semibold mb-2">Curated for you</p>
            <h2 className="text-white text-3xl sm:text-4xl font-bold tracking-tight">Best Sellers</h2>
          </div>
          <Link href="/products" className="text-[#C9A96E] text-sm font-semibold tracking-wider uppercase border-b border-[#C9A96E]/40 hover:border-[#C9A96E] transition-colors pb-0.5">
            View all
          </Link>
        </motion.div>

        {products === undefined ? (
          /* Loading skeleton */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 animate-pulse">
                <div className="aspect-[3/4] rounded-xl bg-white/5" />
                <div className="h-3 w-2/3 rounded bg-white/5" />
                <div className="h-3 w-1/2 rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : mapped.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl">
            <p className="text-white/20 text-lg">No best sellers yet.</p>
            <p className="text-white/10 text-sm mt-1">Tag products as Best Seller in the admin to show them here.</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10"
          >
            {mapped.map((p) => (
              <motion.div key={p.id} variants={item}>
                <ProductCard product={p as never} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
