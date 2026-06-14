import type { Metadata } from "next";
export const metadata: Metadata = { title: "For Women – Naire Scents" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
