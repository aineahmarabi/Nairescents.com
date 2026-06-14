import { Metadata } from 'next';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackButton from '@/components/ui/BackButton';
import FilterBar from '@/components/ui/FilterBar';
import ProductCard from '@/components/ui/ProductCard';
import { readDb } from '@/lib/db';
import { BRANDS } from '@/lib/types';
import type { Product } from '@/lib/types';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Products – Naire Scents' };

interface Props {
  searchParams: { brand?: string; gender?: string; whenToWear?: string; inStock?: string; sort?: string };
}

export default async function BrandsPage({ searchParams }: Props) {
  const db = await readDb();
  let products: Product[] = db.products.filter(p => p.status === 'Active');

  if (searchParams.brand) products = products.filter(p => p.brand === searchParams.brand);
  if (searchParams.gender) products = products.filter(p => p.gender === searchParams.gender);
  if (searchParams.whenToWear) products = products.filter(p => p.whenToWear?.includes(searchParams.whenToWear as never));
  if (searchParams.inStock !== undefined) products = products.filter(p => p.inStock === (searchParams.inStock === 'true'));
  if (searchParams.sort === 'price_asc') products = [...products].sort((a, b) => a.price - b.price);
  if (searchParams.sort === 'price_desc') products = [...products].sort((a, b) => b.price - a.price);

  const activeBrand = searchParams.brand;

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BackButton />
        <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight mb-8">Shop by Brands</h1>

        {/* Brand pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/brands"
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
              !activeBrand
                ? 'bg-[#C9A96E] border-[#C9A96E] text-[#0B3D33]'
                : 'border-white/20 text-white/60 hover:border-[#C9A96E] hover:text-[#C9A96E]'
            }`}
          >
            All Brands
          </Link>
          {BRANDS.map(b => (
            <Link
              key={b}
              href={`/brands?brand=${encodeURIComponent(b)}`}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                activeBrand === b
                  ? 'bg-[#C9A96E] border-[#C9A96E] text-[#0B3D33]'
                  : 'border-white/20 text-white/60 hover:border-[#C9A96E] hover:text-[#C9A96E]'
              }`}
            >
              {b}
            </Link>
          ))}
        </div>

        <FilterBar total={products.length} hideBrand />
        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-white/30 text-lg">
              {activeBrand ? `No products for ${activeBrand} yet.` : 'No products yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
