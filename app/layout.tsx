import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import CartDrawer from "@/components/layout/CartDrawer";
import CartFlyOverlay from "@/components/layout/CartFlyOverlay";
import { CartProvider } from "@/components/layout/CartContext";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Scents by Naire — Scent. Identity. Presence.",
  description:
    "Premium Arabic perfumes — discover your signature scent at Scents by Naire.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={jost.variable}>
        <body className="font-jost bg-[#0B3D33] text-white antialiased">
          <ConvexClientProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <CartFlyOverlay />
            </CartProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
