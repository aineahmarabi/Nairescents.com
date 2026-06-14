"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Lock, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/layout/CartContext";
import { SHIPPING_ZONES, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

interface FormState {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  postalCode: string;
  shippingZoneId: string;
  billingSameAsShipping: boolean;
  billingAddress: string;
  billingCity: string;
  notes: string;
}

const INPUT = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors";

const POLICY_LINKS = [
  { label: "Refund policy", href: "/refund-policy" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of service", href: "/terms" },
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart, itemCount } = useCart();
  const [summaryOpen, setSummaryOpen] = useState(false);

  const [form, setForm] = useState<FormState>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    shippingZoneId: "cbd",
    billingSameAsShipping: true,
    billingAddress: "",
    billingCity: "",
    notes: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);

  const selectedZone = useMemo(
    () => SHIPPING_ZONES.find((z) => z.id === form.shippingZoneId) ?? SHIPPING_ZONES[1],
    [form.shippingZoneId]
  );

  const shippingCost = form.shippingZoneId === "pickup" ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : selectedZone.price;
  const total = subtotal + shippingCost;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setPlacing(false);
    setOrderPlaced(true);
    clearCart();
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#0B3D33] flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/40 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#C9A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold mb-3">Order Placed!</h1>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            Thank you, {form.firstName}. Your order has been received. We&apos;ll confirm via WhatsApp or email shortly.
          </p>
          <Link href="/" className="inline-block px-8 py-3 rounded-xl border border-[#C9A96E] text-[#C9A96E] text-sm font-semibold tracking-widest uppercase hover:bg-[#C9A96E]/10 active:scale-[0.98] transition-all">
            Back to Store
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B3D33]">

      {/* ── Minimal checkout header ── */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-main.png" alt="Naire Scents" width={140} height={56} className="h-10 w-auto object-contain" />
          </Link>

          {/* Breadcrumb */}
          <nav className="hidden sm:flex items-center gap-1 text-xs text-white/40">
            <Link href="/cart" className="hover:text-white/70 transition-colors">Cart</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#C9A96E] font-semibold">Information</span>
            <ChevronRight className="w-3 h-3" />
            <span>Payment</span>
          </nav>

          {/* Mobile cart toggle */}
          <button
            type="button"
            onClick={() => setSummaryOpen(!summaryOpen)}
            className="sm:hidden flex items-center gap-2 text-[#C9A96E] text-sm font-medium"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{summaryOpen ? "Hide" : "Show"} summary</span>
            {itemCount > 0 && (
              <span className="bg-[#C9A96E] text-[#0B3D33] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{itemCount}</span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile order summary (collapsible) */}
      <AnimatePresence>
        {summaryOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden overflow-hidden border-b border-white/10 bg-white/5"
          >
            <div className="px-4 py-4">
              <OrderSummary items={items} subtotal={subtotal} shippingCost={shippingCost} total={total} FREE_SHIPPING_THRESHOLD={FREE_SHIPPING_THRESHOLD} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handlePlaceOrder}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:flex lg:gap-16 lg:items-start">

          {/* ── LEFT: form ── */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* Contact */}
            <section>
              <h2 className="text-white text-base font-semibold mb-4">Contact</h2>
              <div className="space-y-3">
                <input required type="email" placeholder="Email or mobile phone number"
                  value={form.email} onChange={(e) => set("email", e.target.value)} className={INPUT} />
                <input required type="tel" placeholder="Phone (WhatsApp preferred)"
                  value={form.phone} onChange={(e) => set("phone", e.target.value)} className={INPUT} />
              </div>
            </section>

            {/* Delivery */}
            <section>
              <h2 className="text-white text-base font-semibold mb-4">Delivery</h2>
              <div className="space-y-3">
                {/* Country (locked to Kenya) */}
                <div className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-gray-900 text-sm">Kenya</span>
                  <span className="text-gray-400 text-xs">🇰🇪</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input required placeholder="First name"
                    value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className={INPUT} />
                  <input required placeholder="Last name"
                    value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className={INPUT} />
                </div>
                <input required placeholder="Address"
                  value={form.address} onChange={(e) => set("address", e.target.value)} className={INPUT} />
                <input placeholder="Apartment, suite, etc. (optional)"
                  value={form.apartment} onChange={(e) => set("apartment", e.target.value)} className={INPUT} />
                <div className="grid grid-cols-2 gap-3">
                  <input required placeholder="City"
                    value={form.city} onChange={(e) => set("city", e.target.value)} className={INPUT} />
                  <input placeholder="Postal code (optional)"
                    value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} className={INPUT} />
                </div>
                <input placeholder="Order notes (optional)"
                  value={form.notes} onChange={(e) => set("notes", e.target.value)} className={INPUT} />
              </div>
            </section>

            {/* Shipping method */}
            <section>
              <h2 className="text-white text-base font-semibold mb-4">Shipping method</h2>
              <div className="rounded-xl overflow-hidden border border-white/15 divide-y divide-white/10">
                {SHIPPING_ZONES.map((zone) => {
                  const selected = zone.id === form.shippingZoneId;
                  return (
                    <label
                      key={zone.id}
                      className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors ${
                        selected ? "bg-[#C9A96E]/15" : "bg-white/4 hover:bg-white/8"
                      }`}
                    >
                      <input type="radio" name="shippingZone" className="sr-only"
                        checked={selected} onChange={() => set("shippingZoneId", zone.id)} />
                      <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        selected ? "border-[#C9A96E]" : "border-white/30"
                      }`}>
                        {selected && <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                      </span>
                      <span className={`flex-1 text-sm leading-snug ${selected ? "text-[#C9A96E]" : "text-white/80"}`}>
                        {zone.name}
                      </span>
                      <span className="text-white text-sm font-semibold shrink-0">
                        {zone.price === 0 ? <span className="text-[#C9A96E]">Free</span> : `Ksh ${zone.price.toLocaleString()}.00`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-white text-base font-semibold mb-1">Payment</h2>
              <p className="text-white/40 text-xs mb-4">All transactions are secure and encrypted.</p>
              <div className="rounded-xl overflow-hidden border border-white/15 divide-y divide-white/10">
                {/* Cash on Delivery — active */}
                <label className="flex items-center gap-4 px-4 py-3.5 bg-[#C9A96E]/15 cursor-pointer">
                  <span className="w-4 h-4 rounded-full border-2 border-[#C9A96E] flex items-center justify-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />
                  </span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">Cash on Delivery</p>
                    <p className="text-white/40 text-xs">Pay when your order arrives</p>
                  </div>
                </label>
                {/* Paystack — coming soon */}
                <div className="flex items-center gap-4 px-4 py-3.5 bg-white/4 opacity-50 cursor-not-allowed">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">Paystack</p>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] bg-white/10 text-white/50 px-1.5 py-0.5 rounded">Mastercard</span>
                        <span className="text-[10px] bg-white/10 text-white/50 px-1.5 py-0.5 rounded">Visa</span>
                        <span className="text-[10px] bg-white/10 text-white/50 px-1.5 py-0.5 rounded">M-Pesa</span>
                      </div>
                    </div>
                    <p className="text-white/30 text-xs">Coming soon</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Billing address */}
            <section>
              <h2 className="text-white text-base font-semibold mb-4">Billing address</h2>
              <div className="rounded-xl overflow-hidden border border-white/15 divide-y divide-white/10">
                <label className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors ${form.billingSameAsShipping ? "bg-[#C9A96E]/15" : "bg-white/4 hover:bg-white/8"}`}>
                  <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${form.billingSameAsShipping ? "border-[#C9A96E]" : "border-white/30"}`}>
                    {form.billingSameAsShipping && <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                  </span>
                  <input type="radio" name="billing" className="sr-only" checked={form.billingSameAsShipping} onChange={() => set("billingSameAsShipping", true)} />
                  <p className="text-white/80 text-sm">Same as shipping address</p>
                </label>
                <label className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors ${!form.billingSameAsShipping ? "bg-[#C9A96E]/15" : "bg-white/4 hover:bg-white/8"}`}>
                  <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${!form.billingSameAsShipping ? "border-[#C9A96E]" : "border-white/30"}`}>
                    {!form.billingSameAsShipping && <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                  </span>
                  <input type="radio" name="billing" className="sr-only" checked={!form.billingSameAsShipping} onChange={() => set("billingSameAsShipping", false)} />
                  <p className="text-white/80 text-sm">Use a different billing address</p>
                </label>
              </div>
              <AnimatePresence>
                {!form.billingSameAsShipping && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-3 space-y-3"
                  >
                    <input placeholder="Billing address" value={form.billingAddress}
                      onChange={(e) => set("billingAddress", e.target.value)} className={INPUT} />
                    <input placeholder="City" value={form.billingCity}
                      onChange={(e) => set("billingCity", e.target.value)} className={INPUT} />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Submit — mobile */}
            <div className="lg:hidden">
              <PlaceOrderButton placing={placing} total={total} itemsCount={items.length} />
            </div>

            {/* Policy links */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-1 pb-12">
              {POLICY_LINKS.map(({ label, href }) => (
                <Link key={label} href={href} className="text-white/30 text-xs hover:text-white/60 transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          {/* ── RIGHT: sticky order summary (desktop) ── */}
          <aside className="hidden lg:block lg:w-[380px] shrink-0 lg:sticky lg:top-8">
            <div className="rounded-2xl border border-white/15 bg-white/4 p-6">
              <OrderSummary items={items} subtotal={subtotal} shippingCost={shippingCost} total={total} FREE_SHIPPING_THRESHOLD={FREE_SHIPPING_THRESHOLD} />
              <div className="mt-5">
                <PlaceOrderButton placing={placing} total={total} itemsCount={items.length} />
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}

function OrderSummary({ items, subtotal, shippingCost, total, FREE_SHIPPING_THRESHOLD }: {
  items: ReturnType<typeof useCart>["items"];
  subtotal: number;
  shippingCost: number;
  total: number;
  FREE_SHIPPING_THRESHOLD: number;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-4">Your cart is empty.</p>
        ) : items.map((item) => (
          <div key={`${item.productId}-${item.variantId ?? ""}`} className="flex gap-3 items-center">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/10 text-lg">✦</span>
                </div>
              )}
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#C9A96E] text-[#0B3D33] text-[9px] font-bold flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium leading-snug line-clamp-2">{item.title}</p>
            </div>
            <p className="text-white text-xs font-semibold shrink-0">Ksh {(item.price * item.quantity).toLocaleString()}.00</p>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Subtotal</span>
          <span className="text-white">Ksh {subtotal.toLocaleString()}.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Shipping</span>
          <span className={shippingCost === 0 ? "text-[#C9A96E]" : "text-white"}>
            {shippingCost === 0 ? "Free" : `Ksh ${shippingCost.toLocaleString()}.00`}
          </span>
        </div>
        {shippingCost > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
          <p className="text-white/30 text-xs">
            Add Ksh {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free shipping.
          </p>
        )}
      </div>

      <div className="border-t border-white/10 pt-4 flex justify-between items-baseline">
        <span className="text-white/60 text-sm">Total</span>
        <div className="text-right">
          <span className="text-white/30 text-xs mr-1">KES</span>
          <span className="text-white font-bold text-xl">Ksh {total.toLocaleString()}.00</span>
        </div>
      </div>
    </div>
  );
}

function PlaceOrderButton({ placing, total, itemsCount }: { placing: boolean; total: number; itemsCount: number }) {
  return (
    <button
      type="submit"
      disabled={placing || itemsCount === 0}
      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#C9A96E] text-[#0B3D33] font-bold text-sm tracking-wide uppercase hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {placing ? (
        <>
          <div className="w-4 h-4 border-2 border-[#0B3D33]/40 border-t-[#0B3D33] rounded-full animate-spin" />
          Placing order…
        </>
      ) : (
        <>
          <Lock className="w-4 h-4" />
          Finalize order — Ksh {total.toLocaleString()}.00
        </>
      )}
    </button>
  );
}
