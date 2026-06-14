import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import FooterLogo from "./FooterLogo";

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.84 4.84 0 01-1.01-.08z" />
    </svg>
  );
}

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/products" },
  { label: "Shop by Brands", href: "/products" },
  { label: "For Men", href: "/gender/men" },
  { label: "For Women", href: "/gender/women" },
  { label: "Contact", href: "/contact" },
];

const HELP_LINKS = [
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms and Conditions", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0B3D33] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">

          {/* Col 1 — Rotating logo (6-hour cycle) */}
          <div className="flex flex-col gap-3">
            <FooterLogo />
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h3 className="text-[#C9A96E] font-semibold text-sm tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[#C9A96E] hover:text-[#d4b87a] transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Help Center */}
          <div>
            <h3 className="text-[#C9A96E] font-semibold text-sm tracking-wider uppercase mb-4">
              Help Center
            </h3>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[#C9A96E] hover:text-[#d4b87a] transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h3 className="text-[#C9A96E] font-semibold text-sm tracking-wider uppercase mb-4">
              Contact Us
            </h3>
            <div className="space-y-1 text-sm text-white/80 mb-4">
              <p>Stanbank House Shop A604,</p>
              <p>Wing A 6th floor, Nairobi</p>
              <p className="pt-2">Monday – Saturday</p>
              <p>9AM – 5PM</p>
              <a
                href="https://wa.me/254758333996"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[#C9A96E] hover:text-[#d4b87a] transition-colors pt-1"
              >
                +254 758 333 996
              </a>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://www.facebook.com/people/Naire-Scents/61589345817950/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A96E] hover:text-[#d4b87a] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/naire_scents"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A96E] hover:text-[#d4b87a] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@naire_scents"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A96E] hover:text-[#d4b87a] transition-colors"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs pt-8">
          © {new Date().getFullYear()} Scents by Naire. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
