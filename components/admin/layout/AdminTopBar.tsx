"use client";
import { Bell, Search, Menu } from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Props { onMenuClick: () => void; }

export default function AdminTopBar({ onMenuClick }: Props) {
  const { user } = useUser();
  const settings = useQuery(api.settings.getAll);
  const storeName = settings?.storeName ?? "Naire Scents";
  const adminName = user?.fullName ?? user?.firstName ?? storeName;

  return (
    <header className="sticky top-0 z-30 h-16 md:h-20 flex items-center gap-6 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100 shadow-sm shrink-0">
      <button onClick={onMenuClick} className="md:hidden text-gray-500 hover:text-gray-800 transition-colors shrink-0">
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 max-w-sm hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything…"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-gray-200" />

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B3D33] flex items-center justify-center shrink-0 overflow-hidden p-1">
            <Image
              src="/footer-logos/logo-08.png"
              alt={storeName}
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-gray-800">{adminName}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
