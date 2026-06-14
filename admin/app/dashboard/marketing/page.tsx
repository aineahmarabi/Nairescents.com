import { Megaphone, ArrowRight } from "lucide-react";
import Link from "next/link";

const TOOLS = [
  {
    title: "Discount Codes",
    desc: "Create percentage or fixed-amount codes to share with customers.",
    href: "/dashboard/discounts",
    cta: "Manage discounts",
  },
  {
    title: "Content / Hero",
    desc: "Update the homepage hero panels, headings, and links.",
    href: "/dashboard/content",
    cta: "Edit content",
  },
];

export default function MarketingPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Marketing</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOOLS.map(t => (
          <div key={t.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <Megaphone className="w-8 h-8 text-[#C9A96E]/50 mb-4" />
            <h2 className="font-semibold text-gray-800 mb-1">{t.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{t.desc}</p>
            <Link href={t.href} className="inline-flex items-center gap-1 text-sm text-[#0B3D33] font-semibold hover:gap-2 transition-all">
              {t.cta} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
