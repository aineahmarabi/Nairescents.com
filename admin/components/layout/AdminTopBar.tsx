"use client";
import { Bell, Search, Menu, User } from "lucide-react";

interface Props {
  onMenuClick: () => void;
}

export default function AdminTopBar({ onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-30 h-14 flex items-center gap-4 px-4 sm:px-6 bg-white border-b border-gray-100 shadow-sm">
      {/* Mobile menu button */}
      <button onClick={onMenuClick} className="md:hidden text-gray-500 hover:text-gray-800 transition-colors">
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search…"
            className="w-full bg-gray-100 border-0 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-xl bg-[#0B3D33] flex items-center justify-center">
            <User className="w-4 h-4 text-[#C9A96E]" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-800 leading-tight">Naire Scents</p>
            <p className="text-[10px] text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
