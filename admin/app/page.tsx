"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    const session = localStorage.getItem("naire_admin_session");
    router.replace(session === "true" ? "/dashboard" : "/login");
  }, [router]);
  return null;
}
