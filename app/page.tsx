import { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DynamicHero from "@/components/sections/DynamicHero";
import LattafaSection from "@/components/sections/LattafaSection";
import WomenSection from "@/components/sections/WomenSection";

export const metadata: Metadata = { title: "Scents by Naire — Scent. Identity. Presence." };

function extractImages(products: any[], gender?: string, tag?: string): string[] {
  let filtered = products.filter((p) => p.status === "Active" && p.images.length > 0);
  if (gender) filtered = filtered.filter((p) => p.gender === gender);
  if (tag) filtered = filtered.filter((p) => p.tags.includes(tag));
  const seen = new Set<string>();
  const imgs: string[] = [];
  for (const p of filtered) {
    for (const img of p.images as { url: string }[]) {
      if (img.url && !seen.has(img.url)) { seen.add(img.url); imgs.push(img.url); }
    }
  }
  return imgs;
}

export default async function HomePage() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const allProducts = await convex.query(api.products.list, {}).catch(() => [] as any[]);

  const initialPanelImages: string[][] = [
    extractImages(allProducts, "Men"),
    extractImages(allProducts, "Women"),
    extractImages(allProducts, undefined, "Best Seller"),
    extractImages(allProducts, undefined, "New In"),
  ];

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <DynamicHero initialPanelImages={initialPanelImages} />
        <LattafaSection />
        <WomenSection />
      </main>
      <Footer />
    </>
  );
}
