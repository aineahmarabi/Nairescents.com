"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProduct } from "@/lib/api";
import type { Product } from "@/lib/types";
import ProductForm from "@/components/ui/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-5 h-5 rounded-full border-2 border-[#C9A96E] border-t-transparent animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Product not found.</p>
      <Link href="/dashboard/products" className="text-[#C9A96E] text-sm hover:underline mt-2 inline-block">← Back to products</Link>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/products" className="p-2 rounded-xl text-gray-500 hover:bg-white hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900 truncate">{product?.title}</h1>
      </div>
      {product && <ProductForm initial={product} isEdit />}
    </div>
  );
}
