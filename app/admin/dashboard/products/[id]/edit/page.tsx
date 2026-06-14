"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ProductForm from "@/components/admin/ui/ProductForm";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = useQuery(api.products.get, { id: id as Id<"products"> });

  if (product === undefined) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="text-center py-16 text-gray-400">Product not found.</div>
  );

  return (
    <ProductForm
      initial={{
        _id: product._id,
        title: product.title,
        handle: product.handle,
        descriptionHtml: product.descriptionHtml,
        status: product.status,
        publishedOnlineStore: product.publishedOnlineStore,
        images: product.images,
        price: String(product.price),
        compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
        costPerItem: product.costPerItem ? String(product.costPerItem) : "",
        unitPrice: product.unitPrice ? String(product.unitPrice) : "",
        chargeTax: product.chargeTax,
        trackInventory: product.trackInventory,
        inventory: String(product.inventory),
        sku: product.sku ?? "",
        barcode: product.barcode ?? "",
        sellWhenOutOfStock: product.sellWhenOutOfStock,
        inStock: product.inStock,
        isPhysical: product.isPhysical,
        weight: product.weight ? String(product.weight) : "",
        weightUnit: product.weightUnit ?? "g",
        countryOfOrigin: product.countryOfOrigin ?? "",
        hsCode: product.hsCode ?? "",
        hasVariants: product.hasVariants,
        options: product.options,
        variants: product.variants,
        vendor: product.vendor,
        productType: product.productType ?? "",
        tags: product.tags.join(", "),
        category: product.category ?? "",
        seoTitle: product.seoTitle ?? "",
        seoDescription: product.seoDescription ?? "",
        brand: product.brand ?? "",
        gender: product.gender ?? "",
        whenToWear: product.whenToWear,
        size: product.size ?? "",
      }}
    />
  );
}
