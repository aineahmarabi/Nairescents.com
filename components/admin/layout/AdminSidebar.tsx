"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Megaphone,
  BarChart2, Settings, Globe, LogOut, ChevronRight, X, Layers, MessageSquare,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/dashboard/orders", icon: ShoppingCart },
  { label: "Messages", href: "/admin/dashboard/messages", icon: MessageSquare },
  { label: "Products", href: "/admin/dashboard/products", icon: Package },
  { label: "Customers", href: "/admin/dashboard/customers", icon: Users },
];
const MARKETING_NAV = [
  { label: "Marketing", href: "/admin/dashboard/marketing", icon: Megaphone },
  { label: "Discounts", href: "/admin/dashboard/discounts", icon: Tag },
  { label: "Content", href: "/admin/dashboard/content", icon: Layers },
  { label: "Analytics", href: "/admin/dashboard/analytics", icon: BarChart2 },
];
const BOTTOM_NAV = [
  { label: "Settings", href: "/admin/dashboard/settings", icon: Settings },
];

function NavItem({ href, icon: Icon, label, onClick, badge }: { href: string; icon: React.ElementType; label: string; onClick?: () => void; badge?: number }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
  return (
    <Link href={href} onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
        active ? "bg-[#C9A96E]/15 text-[#C9A96E]" : "text-white/50 hover:text-white/90 hover:bg-white/5"
      }`}>
      <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#C9A96E]" : "text-white/40 group-hover:text-white/70"}`} />
      <span>{label}</span>
      {!!badge && (
        <span className="ml-auto bg-[#C9A96E] text-[#0B3D33] text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
          {badge}
        </span>
      )}
      {active && !badge && <ChevronRight className="w-3 h-3 ml-auto text-[#C9A96E]/60" />}
    </Link>
  );
}

interface Props { isMobileOpen: boolean; onClose: () => void; }

export default function AdminSidebar({ isMobileOpen, onClose }: Props) {
  const { signOut } = useClerk();
  const unreadMessages = useQuery(api.messages.unreadCount);
  const newOrders = useQuery(api.orders.newCount);

  function handleLogout() {
    signOut({ redirectUrl: "/admin/login" });
  }

  const content = (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <Image
          src="/logo-main.png"
          alt="Naire Scents"
          width={140}
          height={56}
          className="h-12 w-auto object-contain"
          priority
        />
        <p className="text-white/30 text-xs mt-2">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(n => <NavItem key={n.href} {...n} onClick={onClose} badge={n.label === "Messages" ? unreadMessages : n.label === "Orders" ? newOrders : undefined} />)}

        <div className="pt-4 pb-1">
          <p className="px-3 text-[10px] text-white/20 tracking-wider uppercase font-semibold mb-1">Marketing</p>
          {MARKETING_NAV.map(n => <NavItem key={n.href} {...n} onClick={onClose} />)}
        </div>

        <div className="pt-4 pb-1">
          <p className="px-3 text-[10px] text-white/20 tracking-wider uppercase font-semibold mb-1">Sales Channels</p>
          <a href="/" target="_blank" rel="noopener" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/90 hover:bg-white/5 transition-all">
            <Globe className="w-4 h-4 text-white/40" />
            <span>Online Store</span>
          </a>
        </div>
      </nav>

      <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-0.5">
        {BOTTOM_NAV.map(n => <NavItem key={n.href} {...n} onClick={onClose} />)}
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all">
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0" style={{ background: "#0B3D33" }}>
        {content}
      </aside>
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
