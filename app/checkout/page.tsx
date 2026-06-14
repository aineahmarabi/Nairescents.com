"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/layout/CartContext";
import { SHIPPING_ZONES, FREE_SHIPPING_THRESHOLD, type ShippingZone } from "@/lib/shipping";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface FormState {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  county: string;
  shippingZoneId: string;
  billingSameAsShipping: boolean;
  billingAddress: string;
  billingCity: string;
  billingCounty: string;
  notes: string;
}

const INPUT =
  "w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors";

const POLICY_LINKS = [
  { label: "Refund policy", href: "/refund-policy" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of service", href: "/terms" },
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<FormState>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    county: "",
    shippingZoneId: "nairobi-cbd",
    billingSameAsShipping: true,
    billingAddress: "",
    billingCity: "",
    billingCounty: "",
    notes: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);

  const selectedZone: ShippingZone = useMemo(
    () => SHIPPING_ZONES.find((z) => z.id === form.shippingZoneId) ?? SHIPPING_ZONES[0],
    [form.shippingZoneId]
  );

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : selectedZone.price;
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
      <>
        <AnnouncementBar />
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
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
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              Thank you, {form.firstName}. Your order has been received. We&apos;ll confirm via WhatsApp or email shortly.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-xl border border-[#C9A96E] text-[#C9A96E] text-sm font-semibold tracking-widest uppercase hover:bg-[#C9A96E]/10 active:scale-[0.98] transition-all"
            >
              Back to Store
            </Link>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <form onSubmit={handlePlaceOrder}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:flex lg:gap-12 lg:items-start">

          {/* ── LEFT ── */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* Contact */}
            <section>
              <h2 className="text-white text-xl font-bold tracking-tight mb-5">Contact</h2>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-xs font-medium uppercase tracking-widest">Email</label>
                  <input required type="email" placeholder="your@email.com"
                    value={form.email} onChange={(e) => set("email", e.target.value)}
                    className={INPUT} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-xs font-medium uppercase tracking-widest">Phone (WhatsApp preferred)</label>
                  <input required type="tel" placeholder="+254 ..."
                    value={form.phone} onChange={(e) => set("phone", e.target.value)}
                    className={INPUT} />
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section>
              <h2 className="text-white text-xl font-bold tracking-tight mb-5">Delivery</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/60 text-xs font-medium uppercase tracking-widest">First name</label>
                    <input required placeholder="First name"
                      value={form.firstName} onChange={(e) => set("firstName", e.target.value)}
                      className={INPUT} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/60 text-xs font-medium uppercase tracking-widest">Last name</label>
                    <input required placeholder="Last name"
                      value={form.lastName} onChange={(e) => set("lastName", e.target.value)}
                      className={INPUT} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-xs font-medium uppercase tracking-widest">Address</label>
                  <input required placeholder="Street address"
                    value={form.address} onChange={(e) => set("address", e.target.value)}
                    className={INPUT} />
                </div>
                <input placeholder="Apartment, suite, etc. (optional)"
                  value={form.apartment} onChange={(e) => set("apartment", e.target.value)}
                  className={INPUT} />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/60 text-xs font-medium uppercase tracking-widest">City</label>
                    <input required placeholder="City"
                      value={form.city} onChange={(e) => set("city", e.target.value)}
                      className={INPUT} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/60 text-xs font-medium uppercase tracking-widest">County</label>
                    <input required placeholder="County"
                      value={form.county} onChange={(e) => set("county", e.target.value)}
                      className={INPUT} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-xs font-medium uppercase tracking-widest">Order notes (optional)</label>
                  <textarea rows={2} placeholder="Any special instructions..."
                    value={form.notes} onChange={(e) => set("notes", e.target.value)}
                    className={`${INPUT} resize-none`} />
                </div>
              </div>
            </section>

            {/* Shipping method */}
            <section>
              <h2 className="text-white text-xl font-bold tracking-tight mb-5">Shipping method</h2>
              <div className="rounded-xl border border-white/20 overflow-hidden divide-y divide-white/10">
                {SHIPPING_ZONES.map((zone) => {
                  const selected = zone.id === form.shippingZoneId;
                  const cost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : zone.price;
                  return (
                    <label
                      key={zone.id}
                      className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors ${
                        selected ? "bg-[#C9A96E]/10" : "hover:bg-white/5"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingZone"
                        className="sr-only"
                        checked={selected}
                        onChange={() => set("shippingZoneId", zone.id)}
                      />
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selected ? "border-[#C9A96E]" : "border-white/30"
                      }`}>
                        {selected && <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${selected ? "text-[#C9A96E]" : "text-white"}`}>{zone.name}</p>
                        <p className="text-white/40 text-xs truncate">{zone.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-white text-sm font-semibold">
                          {cost === 0 ? <span className="text-[#C9A96E]">Free</span> : `KES ${zone.price.toLocaleString()}`}
                        </p>
                        <p className="text-white/40 text-xs">{zone.eta}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              {subtotal >= FREE_SHIPPING_THRESHOLD && (
                <p className="text-[#C9A96E] text-xs mt-2">
                  Free shipping applied — orders over KES {FREE_SHIPPING_THRESHOLD.toLocaleString()}.
                </p>
              )}
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-white text-xl font-bold tracking-tight mb-5">Payment</h2>
              <div className="rounded-xl border border-white/20 overflow-hidden divide-y divide-white/10">
                <label className="flex items-center gap-4 px-4 py-3.5 bg-[#C9A96E]/10 cursor-pointer">
                  <span className="w-4 h-4 rounded-full border-2 border-[#C9A96E] flex items-center justify-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />
                  </span>
                  <div>
                    <p className="text-white text-sm font-medium">Cash on Delivery</p>
                    <p className="text-white/40 text-xs">Pay when your order arrives</p>
                  </div>
                </label>
                <div className="flex items-center gap-4 px-4 py-3.5 opacity-35 cursor-not-allowed">
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">Paystack — Card / M-Pesa</p>
                    <p className="text-white/30 text-xs">Coming soon</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Billing address */}
            <section>
              <h2 className="text-white text-xl font-bold tracking-tight mb-5">Billing address</h2>
              <div className="rounded-xl border border-white/20 overflow-hidden divide-y divide-white/10">
                <label className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors ${form.billingSameAsShipping ? "bg-[#C9A96E]/10" : "hover:bg-white/5"}`}>
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${form.billingSameAsShipping ? "border-[#C9A96E]" : "border-white/30"}`}>
                    {form.billingSameAsShipping && <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                  </span>
                  <input type="radio" name="billing" className="sr-only" checked={form.billingSameAsShipping} onChange={() => set("billingSameAsShipping", true)} />
                  <p className="text-white text-sm">Same as shipping address</p>
                </label>
                <label className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors ${!form.billingSameAsShipping ? "bg-[#C9A96E]/10" : "hover:bg-white/5"}`}>
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${!form.billingSameAsShipping ? "border-[#C9A96E]" : "border-white/30"}`}>
                    {!form.billingSameAsShipping && <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                  </span>
                  <input type="radio" name="billing" className="sr-only" checked={!form.billingSameAsShipping} onChange={() => set("billingSameAsShipping", false)} />
                  <p className="text-white text-sm">Use a different billing address</p>
                </label>
              </div>

              <AnimatePresence>
                {!form.billingSameAsShipping && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-4 space-y-4"
                  >
                    <input placeholder="Billing address"
                      value={form.billingAddress} onChange={(e) => set("billingAddress", e.target.value)}
                      className={INPUT} />
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="City"
                        value={form.billingCity} onChange={(e) => set("billingCity", e.target.value)}
                        className={INPUT} />
                      <input placeholder="County"
                        value={form.billingCounty} onChange={(e) => set("billingCounty", e.target.value)}
                        className={INPUT} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Place Order — mobile */}
            <div className="lg:hidden">
              <PlaceOrderButton placing={placing} total={total} itemsCount={items.length} />
            </div>

            {/* Policy links */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-1">
              {POLICY_LINKS.map(({ label, href }) => (
                <Link key={label} href={href} className="text-white/30 text-xs hover:text-white/60 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── RIGHT: sticky order summary ── */}
          <aside className="lg:w-[380px] shrink-0 lg:sticky lg:top-24 mt-12 lg:mt-0">
            <div className="rounded-2xl border border-white/20 p-6 space-y-5">
              <h2 className="text-white font-bold text-lg tracking-tight">Order summary</h2>

              {/* Items */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <p className="text-white/30 text-sm text-center py-6">Your cart is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={`${item.productId}-${item.variantId ?? ""}`} className="flex gap-3 items-center">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white/10 text-xl">✦</span>
                          </div>
                        )}
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#C9A96E] text-[#0B3D33] text-[9px] font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium leading-tight truncate">{item.title}</p>
                        <p className="text-white/40 text-xs mt-0.5">KES {item.price.toLocaleString()} × {item.quantity}</p>
                      </div>
                      <p className="text-white text-xs font-semibold shrink-0">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal</span>
                  <span className="text-white font-medium">KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Shipping</span>
                  <span className={shippingCost === 0 ? "text-[#C9A96E] font-medium" : "text-white font-medium"}>
                    {shippingCost === 0 ? "Free" : `KES ${shippingCost.toLocaleString()}`}
                  </span>
                </div>
                {shippingCost > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-white/30 text-xs">
                    Add KES {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free shipping.
                  </p>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                <span className="text-white font-bold">Total</span>
                <div className="text-right">
                  <span className="text-[#C9A96E] font-bold text-xl">KES {total.toLocaleString()}</span>
                  <p className="text-white/30 text-[10px]">Including taxes</p>
                </div>
              </div>

              <div className="hidden lg:block pt-1">
                <PlaceOrderButton placing={placing} total={total} itemsCount={items.length} />
              </div>
            </div>
          </aside>
        </div>
      </form>

      <Footer />
    </>
  );
}

function PlaceOrderButton({ placing, total, itemsCount }: { placing: boolean; total: number; itemsCount: number }) {
  return (
    <button
      type="submit"
      disabled={placing || itemsCount === 0}
      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-[#C9A96E] text-[#C9A96E] font-bold text-sm tracking-widest uppercase hover:bg-[#C9A96E]/10 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {placing ? (
        <>
          <div className="w-4 h-4 border-2 border-[#C9A96E]/40 border-t-[#C9A96E] rounded-full animate-spin" />
          Placing order…
        </>
      ) : (
        <>
          <Lock className="w-4 h-4" />
          Place order — KES {total.toLocaleString()}
        </>
      )}
    </button>
  );
}
