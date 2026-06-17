"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/lib/types";

const ease = [0.16, 1, 0.3, 1] as const;
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } };

interface Props {
  products: Product[];
}

export default function BestSellers({ products }: Props) {
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
            View All
          </Link>
        </motion.div>

        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="py-20 text-center border border-dashed border-white/10 rounded-2xl"
          >
            <p className="text-white/20 text-lg">No best sellers yet.</p>
            <p className="text-white/10 text-sm mt-1">Tag products as Best Seller in the admin to show them here.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {products.slice(0, 5).map((p) => (
              <motion.div key={p.id} variants={item}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
