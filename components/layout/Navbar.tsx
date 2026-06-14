"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "./CartContext";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/products" },
  {
    label: "Shop by Brands",
    href: "#",
    dropdown: [
      { label: "Lattafa", href: "/brands?brand=Lattafa" },
      { label: "Fragrance World", href: "/brands?brand=Fragrance+World" },
      { label: "French Avenue", href: "/brands?brand=French+Avenue" },
      { label: "Maison Alhambra", href: "/brands?brand=Maison+Alhambra" },
      { label: "Ard Al Zaafaran", href: "/brands?brand=Ard+Al+Zaafaran" },
    ],
  },
  { label: "For Men", href: "/gender/men" },
  { label: "For Women", href: "/gender/women" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { openCart, itemCount, badgeBump } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [mobileBrandsOpen, setMobileBrandsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0B3D33] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          <Link href="/" className="shrink-0">
            <Image
              src="/logo-main.png"
              alt="Scents by Naire"
              width={220}
              height={88}
              className="h-12 md:h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1 text-sm font-medium">
            {NAV_LINKS.map((link) =>
              link.dropdown ? (
                <li key={link.label} className="relative">
                  <button
                    onMouseEnter={() => setBrandsOpen(true)}
                    onMouseLeave={() => setBrandsOpen(false)}
                    className="flex items-center gap-1 px-3 py-2 text-white hover:text-[#C9A96E] transition-colors"
                  >
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {brandsOpen && (
                    <div
                      onMouseEnter={() => setBrandsOpen(true)}
                      onMouseLeave={() => setBrandsOpen(false)}
                      className="absolute left-0 top-full mt-0 w-52 bg-[#0B3D33] border border-white/15 rounded-b-xl shadow-xl py-2 z-50"
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="block px-4 py-2 text-white hover:text-[#C9A96E] hover:bg-white/5 transition-colors text-sm"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ) : (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="px-3 py-2 text-white hover:text-[#C9A96E] transition-colors block"
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            <button className="text-white hover:text-[#C9A96E] transition-colors p-1">
              <Search className="w-5 h-5" />
            </button>

            <button
              id="navbar-cart-btn"
              onClick={openCart}
              className="relative text-white hover:text-[#C9A96E] transition-colors p-1"
            >
              <motion.div
                animate={badgeBump ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <ShoppingBag className="w-5 h-5" />
              </motion.div>
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute -top-1 -right-1 bg-[#C9A96E] text-[#0B3D33] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              className="md:hidden text-white hover:text-[#C9A96E] transition-colors p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#0B3D33] border-t border-white/10 px-4 pb-6 pt-2 overflow-hidden"
          >
            {NAV_LINKS.map((link) =>
              link.dropdown ? (
                <div key={link.label}>
                  <button
                    onClick={() => setMobileBrandsOpen(!mobileBrandsOpen)}
                    className="w-full flex items-center justify-between py-3 text-white hover:text-[#C9A96E] transition-colors border-b border-white/10 text-sm font-medium"
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${mobileBrandsOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileBrandsOpen &&
                    link.dropdown.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block pl-4 py-2.5 text-white/70 hover:text-[#C9A96E] transition-colors border-b border-white/5 text-sm"
                      >
                        {item.label}
                      </Link>
                    ))}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-white hover:text-[#C9A96E] transition-colors border-b border-white/10 text-sm font-medium"
                >
                  {link.label}
                </Link>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
