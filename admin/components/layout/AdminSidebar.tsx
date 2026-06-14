"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Megaphone,
  BarChart2, Settings, Globe, LogOut, ChevronRight, Menu, X,
  Layers
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
];
const MARKETING_NAV = [
  { label: "Marketing", href: "/dashboard/marketing", icon: Megaphone },
  { label: "Discounts", href: "/dashboard/discounts", icon: Tag },
  { label: "Content", href: "/dashboard/content", icon: Layers },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
];
const BOTTOM_NAV = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function NavItem({ href, icon: Icon, label, onClick }: { href: string; icon: React.ElementType; label: string; onClick?: () => void }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
        active
          ? "bg-[#C9A96E]/15 text-[#C9A96E]"
          : "text-white/50 hover:text-white/90 hover:bg-white/5"
      }`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#C9A96E]" : "text-white/40 group-hover:text-white/70"}`} />
      <span>{label}</span>
      {active && <ChevronRight className="w-3 h-3 ml-auto text-[#C9A96E]/60" />}
    </Link>
  );
}

interface Props {
  isMobileOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isMobileOpen, onClose }: Props) {
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C9A96E]/20 border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
            <span className="text-[#C9A96E] text-sm font-bold">N</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Naire Scents</p>
            <p className="text-white/30 text-xs">Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(n => <NavItem key={n.href} {...n} onClick={onClose} />)}

        <div className="pt-4 pb-1">
          <p className="px-3 text-[10px] text-white/20 tracking-wider uppercase font-semibold mb-1">Marketing</p>
          {MARKETING_NAV.map(n => <NavItem key={n.href} {...n} onClick={onClose} />)}
        </div>

        <div className="pt-4 pb-1">
          <p className="px-3 text-[10px] text-white/20 tracking-wider uppercase font-semibold mb-1">Sales Channels</p>
          <a href="http://localhost:3000" target="_blank" rel="noopener" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/90 hover:bg-white/5 transition-all">
            <Globe className="w-4 h-4 text-white/40" />
            <span>Online Store</span>
          </a>
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-white/8 pt-3 space-y-0.5">
        {BOTTOM_NAV.map(n => <NavItem key={n.href} {...n} onClick={onClose} />)}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0" style={{ background: "#0B3D33" }}>
        {content}
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 z-50 w-60 flex flex-col md:hidden" style={{ background: "#0B3D33" }}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            {content}
          </aside>
        </>
      )}
    </>
  );
}
