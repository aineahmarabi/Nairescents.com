import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DynamicHero from "@/components/sections/DynamicHero";
import BestSellersSection from "@/components/sections/BestSellersSection";

export const metadata: Metadata = { title: "Scents by Naire — Scent. Identity. Presence." };

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <DynamicHero />
        <BestSellersSection />
      </main>
      <Footer />
    </>
  );
}
