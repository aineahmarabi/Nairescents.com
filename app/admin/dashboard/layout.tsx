"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminTopBar from "@/components/admin/layout/AdminTopBar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) { router.replace("/admin/login"); return; }
    const email = user.emailAddresses[0]?.emailAddress;
    if (email !== adminEmail) { router.replace("/"); }
  }, [user, isLoaded, router, adminEmail]);

  if (!isLoaded || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F3EE" }}>
      <div className="w-6 h-6 rounded-full border-2 border-[#C9A96E] border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F5F3EE", fontFamily: "'Jost', sans-serif" }}>
      <AdminSidebar isMobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-auto">
        <AdminTopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
