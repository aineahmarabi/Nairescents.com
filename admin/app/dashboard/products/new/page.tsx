import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "@/components/ui/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/products" className="p-2 rounded-xl text-gray-500 hover:bg-white hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Add product</h1>
      </div>
      <ProductForm />
    </div>
  );
}
