"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Lock, Truck, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/layout/CartContext";
import { SHIPPING_ZONES, FREE_SHIPPING_THRESHOLD, type ShippingZone } from "@/lib/shipping";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

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
  const [zonesOpen, setZonesOpen] = useState(false);

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
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            Thank you, {form.firstName}. Your order has been received. We&apos;ll confirm via WhatsApp or email shortly.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-xl border border-[#C9A96E]/40 text-[#C9A96E] text-sm font-semibold tracking-widest uppercase hover:bg-[#C9A96E]/10 transition-colors"
          >
            Back to Store
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B3D33]">
      <AnnouncementBar />

      {/* Header */}
      <header className="border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/logo-main.png" alt="Scents by Naire" width={160} height={64} className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-1 text-white/30 text-xs">
            <span className="text-white/60">Cart</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#C9A96E] font-semibold">Information</span>
            <ChevronRight className="w-3 h-3" />
            <span>Payment</span>
          </div>
        </div>
      </header>

      <form onSubmit={handlePlaceOrder}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:flex lg:gap-12 lg:items-start">

          {/* ── LEFT: scrollable form ── */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* Contact */}
            <section>
              <h2 className="text-white font-semibold text-lg mb-4">Contact</h2>
              <div className="space-y-3">
                <input
                  required type="email" placeholder="Email"
                  value={form.email} onChange={(e) => set("email", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A96E]/60 transition-colors"
                />
                <input
                  required type="tel" placeholder="Phone (WhatsApp preferred)"
                  value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A96E]/60 transition-colors"
                />
              </div>
            </section>

            {/* Delivery */}
            <section>
              <h2 className="text-white font-semibold text-lg mb-4">Delivery</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required placeholder="First name"
                    value={form.firstName} onChange={(e) => set("firstName", e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A96E]/60 transition-colors"
                  />
                  <input
                    required placeholder="Last name"
                    value={form.lastName} onChange={(e) => set("lastName", e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A96E]/60 transition-colors"
                  />
                </div>
                <input
                  required placeholder="Address"
                  value={form.address} onChange={(e) => set("address", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A96E]/60 transition-colors"
                />
                <input
                  placeholder="Apartment, suite, etc. (optional)"
                  value={form.apartment} onChange={(e) => set("apartment", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A96E]/60 transition-colors"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required placeholder="City"
                    value={form.city} onChange={(e) => set("city", e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A96E]/60 transition-colors"
                  />
                  <input
                    required placeholder="County"
                    value={form.county} onChange={(e) => set("county", e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A96E]/60 transition-colors"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Order notes (optional)"
                  value={form.notes} onChange={(e) => set("notes", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A96E]/60 transition-colors resize-none"
                />
              </div>
            </section>

            {/* Shipping method */}
            <section>
              <h2 className="text-white font-semibold text-lg mb-4">Shipping method</h2>
              <div className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/10">
                {/* Selected zone display */}
                <button
                  type="button"
                  onClick={() => setZonesOpen(!zonesOpen)}
                  className="w-full flex items-center justify-between px-4 py-3.5 bg-white/5 hover:bg-white/8 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-[#C9A96E]" />
                    <div className="text-left">
                      <p className="text-white text-sm font-medium">{selectedZone.name}</p>
                      <p className="text-white/40 text-xs">{selectedZone.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-white text-sm font-semibold">
                        {shippingCost === 0 ? <span className="text-[#C9A96E]">Free</span> : `KES ${selectedZone.price.toLocaleString()}`}
                      </p>
                      <p className="text-white/40 text-xs">{selectedZone.eta}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${zonesOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {/* Zone dropdown */}
                <AnimatePresence>
                  {zonesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="max-h-72 overflow-y-auto">
                        {SHIPPING_ZONES.map((zone) => (
                          <button
                            key={zone.id}
                            type="button"
                            onClick={() => { set("shippingZoneId", zone.id); setZonesOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                              zone.id === form.shippingZoneId
                                ? "bg-[#C9A96E]/10"
                                : "hover:bg-white/5"
                            }`}
                          >
                            <div>
                              <p className={`text-sm font-medium ${zone.id === form.shippingZoneId ? "text-[#C9A96E]" : "text-white"}`}>
                                {zone.name}
                              </p>
                              <p className="text-white/30 text-xs">{zone.description}</p>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              <p className="text-white text-sm">KES {zone.price.toLocaleString()}</p>
                              <p className="text-white/30 text-xs">{zone.eta}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {subtotal >= FREE_SHIPPING_THRESHOLD && (
                <p className="text-[#C9A96E] text-xs mt-2">
                  You qualify for free shipping on orders over KES {FREE_SHIPPING_THRESHOLD.toLocaleString()}.
                </p>
              )}
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-white font-semibold text-lg mb-4">Payment</h2>
              <div className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/10">
                {/* Cash on Delivery — active */}
                <label className="flex items-center gap-3 px-4 py-3.5 cursor-pointer bg-[#C9A96E]/10">
                  <span className="w-4 h-4 rounded-full border-2 border-[#C9A96E] flex items-center justify-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />
                  </span>
                  <div>
                    <p className="text-white text-sm font-medium">Cash on Delivery</p>
                    <p className="text-white/40 text-xs">Pay when your order arrives</p>
                  </div>
                </label>

                {/* Paystack — disabled */}
                <div className="flex items-center gap-3 px-4 py-3.5 opacity-40 cursor-not-allowed">
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
              <h2 className="text-white font-semibold text-lg mb-4">Billing address</h2>
              <div className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/10">
                <label className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer ${form.billingSameAsShipping ? "bg-[#C9A96E]/10" : "hover:bg-white/5"} transition-colors`}>
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${form.billingSameAsShipping ? "border-[#C9A96E]" : "border-white/20"}`}>
                    {form.billingSameAsShipping && <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                  </span>
                  <input type="radio" name="billing" className="sr-only" checked={form.billingSameAsShipping} onChange={() => set("billingSameAsShipping", true)} />
                  <p className="text-white text-sm">Same as shipping address</p>
                </label>
                <label className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer ${!form.billingSameAsShipping ? "bg-[#C9A96E]/10" : "hover:bg-white/5"} transition-colors`}>
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${!form.billingSameAsShipping ? "border-[#C9A96E]" : "border-white/20"}`}>
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
                    className="overflow-hidden mt-3 space-y-3"
                  >
                    <input
                      placeholder="Billing address"
                      value={form.billingAddress} onChange={(e) => set("billingAddress", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A96E]/60 transition-colors"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        placeholder="City"
                        value={form.billingCity} onChange={(e) => set("billingCity", e.target.value)}
                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A96E]/60 transition-colors"
                      />
                      <input
                        placeholder="County"
                        value={form.billingCounty} onChange={(e) => set("billingCounty", e.target.value)}
                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A96E]/60 transition-colors"
                      />
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
            <footer className="pt-4 border-t border-white/10 flex flex-wrap gap-x-4 gap-y-1">
              {["Refund policy", "Privacy policy", "Terms of service"].map((label) => (
                <Link key={label} href="#" className="text-white/30 text-xs hover:text-white/50 transition-colors">{label}</Link>
              ))}
            </footer>
          </div>

          {/* ── RIGHT: sticky order summary ── */}
          <aside className="lg:w-96 shrink-0 lg:sticky lg:top-6 mt-10 lg:mt-0">
            <div className="rounded-2xl border border-white/10 bg-white/3 p-6 space-y-4">
              <h2 className="text-white font-semibold">Order summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <p className="text-white/30 text-sm text-center py-6">Your cart is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={`${item.productId}-${item.variantId ?? ""}`} className="flex gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10">
                        {item.imageUrl && (
                          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="56px" />
                        )}
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white/20 text-white text-[9px] font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium leading-tight truncate">{item.title}</p>
                        <p className="text-white/40 text-xs mt-0.5">KES {item.price.toLocaleString()} × {item.quantity}</p>
                      </div>
                      <p className="text-white text-xs font-semibold shrink-0">KES {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal</span>
                  <span className="text-white">KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Shipping</span>
                  <span className={shippingCost === 0 ? "text-[#C9A96E]" : "text-white"}>
                    {shippingCost === 0 ? "Free" : `KES ${shippingCost.toLocaleString()}`}
                  </span>
                </div>
                {shippingCost > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-white/30 text-xs">
                    Add KES {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free shipping.
                  </p>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <div className="text-right">
                  <span className="text-[#C9A96E] font-bold text-lg">KES {total.toLocaleString()}</span>
                  <p className="text-white/30 text-[10px]">Including taxes</p>
                </div>
              </div>

              {/* Place Order — desktop */}
              <div className="hidden lg:block">
                <PlaceOrderButton placing={placing} total={total} itemsCount={items.length} />
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}

function PlaceOrderButton({ placing, total, itemsCount }: { placing: boolean; total: number; itemsCount: number }) {
  return (
    <button
      type="submit"
      disabled={placing || itemsCount === 0}
      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#C9A96E] text-[#0B3D33] font-bold text-sm tracking-wider uppercase hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {placing ? (
        <>
          <div className="w-4 h-4 border-2 border-[#0B3D33]/40 border-t-[#0B3D33] rounded-full animate-spin" />
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
