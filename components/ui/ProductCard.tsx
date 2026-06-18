"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/layout/CartContext";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem, triggerFly } = useCart();
  const imgRef = useRef<HTMLDivElement>(null);
  const img = product.images?.[0];

  function handleAddToCart() {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      imageUrl: img,
    });
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      triggerFly(img ?? "", rect);
    }
  }

  const href = product.handle ? `/products/${product.handle}` : null;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group flex flex-col">
      {/* Image + info — link to detail page */}
      {href ? (
        <Link href={href} className="flex flex-col">
          <div ref={imgRef} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-white/8 mb-3">
            {img ? (
              <Image src={img} alt={product.title} fill className="object-contain" sizes="(max-width: 640px) 50vw, 25vw" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                  <span className="text-white/10 text-2xl">✦</span>
                </div>
              </div>
            )}
            {product.tags?.newIn && (
              <span className="absolute top-2 left-2 bg-[#C9A96E] text-[#0B3D33] text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full">New</span>
            )}
            {product.tags?.bestSeller && !product.tags?.newIn && (
              <span className="absolute top-2 left-2 bg-white/10 text-white text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full">Best Seller</span>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <p className="text-white/40 text-[10px] tracking-widest uppercase">{product.brand}</p>
            <h3 className="text-white text-sm font-semibold leading-tight line-clamp-2">{product.title}</h3>
            {product.size && <p className="text-white/30 text-xs">{product.size}</p>}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#C9A96E] font-semibold text-sm">KES {product.price.toLocaleString()}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-white/30 text-xs line-through">KES {product.compareAtPrice.toLocaleString()}</span>
              )}
            </div>
          </div>
        </Link>
      ) : (
        <>
          <div ref={imgRef} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-white/8 mb-3">
            {img ? (
              <Image src={img} alt={product.title} fill className="object-contain" sizes="(max-width: 640px) 50vw, 25vw" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                  <span className="text-white/10 text-2xl">✦</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <p className="text-white/40 text-[10px] tracking-widest uppercase">{product.brand}</p>
            <h3 className="text-white text-sm font-semibold leading-tight line-clamp-2">{product.title}</h3>
            {product.size && <p className="text-white/30 text-xs">{product.size}</p>}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#C9A96E] font-semibold text-sm">KES {product.price.toLocaleString()}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-white/30 text-xs line-through">KES {product.compareAtPrice.toLocaleString()}</span>
              )}
            </div>
          </div>
        </>
      )}

      <button
        onClick={handleAddToCart}
        className="mt-3 w-full py-2.5 rounded-xl text-xs font-semibold tracking-widest uppercase transition-all border border-[#C9A96E]/40 text-[#C9A96E] hover:bg-[#C9A96E]/10 active:scale-[0.98]"
      >
        Add to Cart
      </button>
    </motion.div>
  );
}
