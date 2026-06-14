"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRootPage() {
  const router = useRouter();
  useEffect(() => {
    const session = localStorage.getItem("naire_admin_session");
    router.replace(session === "true" ? "/admin/dashboard" : "/admin/login");
  }, [router]);
  return null;
}
