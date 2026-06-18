"use client";
import { Suspense } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FilterBar from "@/components/ui/FilterBar";
import ProductCard from "@/components/ui/ProductCard";
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
    createdAt: "",
    updatedAt: "",
  };
}

function ForMenContent() {
  const sp = useSearchParams();
  const all = useQuery(api.products.list, { status: "Active", gender: "Men" });

  const products = useMemo(() => {
    if (!all) return null;
    let list = all.map(toProductCard);
    const brand = sp.get("brand");
    const whenToWear = sp.get("whenToWear");
    const inStock = sp.get("inStock");
    const sort = sp.get("sort");
    if (brand) list = list.filter((p) => p.brand === brand);
    if (whenToWear) list = list.filter((p) => p.whenToWear.includes(whenToWear as Product["whenToWear"][number]));
    if (inStock !== null && inStock !== "") list = list.filter((p) => p.inStock === (inStock === "true"));
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [all, sp]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight mb-8">For Him</h1>
      <FilterBar total={products?.length ?? 0} hideGender />
      {products === null ? (
        <div className="py-24 text-center">
          <p className="text-white/30 text-lg">Loading...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-white/30 text-lg">No products yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </main>
  );
}

export default function ForMenPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <Suspense fallback={<div className="py-24 text-center text-white/30">Loading...</div>}>
        <ForMenContent />
      </Suspense>
      <Footer />
    </>
  );
}
