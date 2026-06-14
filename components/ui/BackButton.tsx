"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 text-[#C9A96E] text-xs font-semibold tracking-wider uppercase border border-[#C9A96E]/30 px-3 py-1.5 rounded-md hover:bg-[#C9A96E]/10 transition-colors mb-8"
    >
      <ChevronLeft className="w-3.5 h-3.5" />
      Back
    </button>
  );
}
