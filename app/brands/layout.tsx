import type { Metadata } from "next";
export const metadata: Metadata = { title: "Products – Naire Scents" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
