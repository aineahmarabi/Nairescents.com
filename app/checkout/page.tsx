"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Lock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/components/layout/CartContext";
import { useTrackEvent } from "@/lib/analytics";
import { SHIPPING_ZONES, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

/* ── shared classes ── */
const INPUT =
  "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors";

function RadioDot({ on }: { on: boolean }) {
  return (
    <span
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
        on ? "border-[#C9A96E]" : "border-gray-300"
      }`}
    >
      {on && <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
    </span>
  );
}

/* ── Payment brand badges — local SVG assets from /public/payment-icons/ */
function PayBadge({ src, label }: { src: string; label: string }) {
  return (
    <span
      aria-label={label}
      className="inline-flex h-[32px] w-[52px] items-center justify-center rounded bg-white ring-1 ring-inset ring-gray-200 p-1.5 shrink-0"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} className="h-full w-full object-contain" />
    </span>
  );
}

function VisaBadge() { return <PayBadge src="/payment-icons/visacard.svg" label="Visa" />; }
function MastercardBadge() { return <PayBadge src="/payment-icons/mastercard.svg" label="Mastercard" />; }
function MPesaBadge() { return <PayBadge src="/payment-icons/mpesacard.svg" label="M-Pesa" />; }
function AirtelMoneyBadge() { return <PayBadge src="/payment-icons/airtel_moneycard.svg" label="Airtel Money" />; }

interface FormState {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  postalCode: string;
  saveInfo: boolean;
  shippingZoneId: string;
  billingSameAsShipping: boolean;
  billingAddress: string;
  billingCity: string;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart, openCart, itemCount } = useCart();
  const track = useTrackEvent();
  const createOrder = useMutation(api.orders.create);

  const [form, setForm] = useState<FormState>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    saveInfo: false,
    shippingZoneId: "pickup",
    billingSameAsShipping: true,
    billingAddress: "",
    billingCity: "",
  });
  const [emailError, setEmailError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "paystack">("cod");
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [payError, setPayError] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [placedDetails, setPlacedDetails] = useState<{
    subtotal: number;
    shippingCost: number;
    total: number;
    firstName: string;
    shippingZoneName: string;
  } | null>(null);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  useEffect(() => {
    if (items.length > 0) track("checkout_started", { value: subtotal });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedZone = useMemo(
    () => SHIPPING_ZONES.find((z) => z.id === form.shippingZoneId) ?? SHIPPING_ZONES[0],
    [form.shippingZoneId]
  );
  const shippingCost = selectedZone.price;
  const total = subtotal + shippingCost;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPayError("");

    const newErrors: Record<string, boolean> = {};

    // Validate email/phone
    const trimmedEmail = form.email.trim();
    if (!trimmedEmail) {
      newErrors.email = true;
      setEmailError(true);
    } else if (paymentMethod === "paystack" && !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      newErrors.email = true;
      setEmailError(true);
      setPayError("Enter a valid email address to pay with Paystack.");
    } else {
      setEmailError(false);
    }

    // Validate delivery details
    if (!form.firstName.trim()) newErrors.firstName = true;
    if (!form.lastName.trim()) newErrors.lastName = true;
    if (!form.address.trim()) newErrors.address = true;
    if (!form.city.trim()) newErrors.city = true;

    // Validate billing details if different
    if (!form.billingSameAsShipping) {
      if (!form.billingAddress.trim()) newErrors.billingAddress = true;
      if (!form.billingCity.trim()) newErrors.billingCity = true;
    }

    setErrors(newErrors);

    // Find first invalid key and scroll/focus
    const firstInvalidId = Object.keys(newErrors)[0];
    if (firstInvalidId) {
      const el = document.getElementById(firstInvalidId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
      return;
    }

    if (items.length === 0) return;
    setPlacing(true);

    const orderId = await createOrder({
      customer: { name: `${form.firstName} ${form.lastName}`.trim(), email: form.email, phone: "" },
      items: items.map((i) => ({ productId: i.productId, title: i.title, quantity: i.quantity, price: i.price })),
      shippingAddress: [form.address, form.apartment, form.city, form.postalCode].filter(Boolean).join(", "),
      subtotal,
      shippingFee: shippingCost,
      shippingZoneName: selectedZone.name,
      total,
      paymentMethod: paymentMethod === "paystack" ? "Paystack" : "Cash on Delivery",
    }).catch(() => null);

    if (!orderId) {
      setPlacing(false);
      setPayError("Could not create your order. Please try again.");
      return;
    }

    if (paymentMethod === "paystack") {
      try {
        const res = await fetch("/api/paystack/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, email: form.email, amount: total }),
        });
        const data = await res.json();
        if (!res.ok || !data.authorizationUrl) throw new Error(data.error ?? "Failed to start payment");
        window.location.href = data.authorizationUrl;
        return;
      } catch (err) {
        setPlacing(false);
        setPayError(err instanceof Error ? err.message : "Failed to start payment. Please try again.");
        return;
      }
    }

    await new Promise((r) => setTimeout(r, 1200));
    setPlacedDetails({
      subtotal,
      shippingCost,
      total,
      firstName: form.firstName,
      shippingZoneName: selectedZone.name,
    });
    setPlacing(false);
    setOrderPlaced(true);
    track("order_placed", { value: total });
    clearCart();
    fetch("/api/notify/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: String(orderId), trigger: "new_order" }),
    }).catch(() => {});
  }

  /* ── success screen ── */
  if (orderPlaced && placedDetails) {
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
          <p className="text-white/60 text-sm leading-relaxed mb-5">
            Thank you, {placedDetails.firstName}. Your order has been received. We&apos;ll confirm via WhatsApp or email shortly.
          </p>
          <div className="text-left rounded-xl border border-white/10 bg-white/5 p-4 mb-8 space-y-2 text-sm">
            <div className="flex justify-between text-white/60">
              <span>Subtotal</span><span>Ksh {placedDetails.subtotal.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Shipping{placedDetails.shippingCost === 0 ? " (Free)" : ` — ${placedDetails.shippingZoneName.split(",")[0]}`}</span>
              <span>{placedDetails.shippingCost === 0 ? "FREE" : `Ksh ${placedDetails.shippingCost.toLocaleString()}.00`}</span>
            </div>
            <div className="flex justify-between text-white font-semibold border-t border-white/10 pt-2">
              <span>Total</span><span>Ksh {placedDetails.total.toLocaleString()}.00</span>
            </div>
          </div>
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-xl border border-[#C9A96E] text-[#C9A96E] text-sm font-semibold tracking-widest uppercase hover:bg-[#C9A96E]/10 active:scale-[0.98] transition-all"
          >
            Back to Store
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B3D33]">

      {/* ── Header: logo + cart icon only ── */}
      <header>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo-main.png" alt="Naire Scents" width={200} height={80} className="h-14 w-auto object-contain" />
          </Link>
          <button type="button" onClick={openCart} className="relative text-[#C9A96E] hover:opacity-80 transition-opacity p-1">
            <ShoppingBag className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C9A96E] text-[#0B3D33] text-[9px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
        <div className="border-b border-white/15" />
      </header>

      {/* ── Two-column body ── */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row">

          {/* ════ LEFT COLUMN ════ */}
          <div className="lg:w-[58%] px-4 sm:px-8 py-10 lg:border-r lg:border-white/15 space-y-10 lg:pr-14">

            {/* Contact */}
            <section className="space-y-3">
              <h2 className="text-white font-bold text-lg">Contact</h2>
              <div>
                <input
                  id="email"
                  type="text"
                  placeholder="Email or mobile phone number"
                  value={form.email}
                  onChange={(e) => {
                    set("email", e.target.value);
                    setEmailError(false);
                    setErrors((errs) => ({ ...errs, email: false }));
                  }}
                  className={`${INPUT} ${emailError ? "border-red-400" : ""}`}
                />
                {emailError && <p className="text-red-400 text-xs mt-1">Enter an email or phone number.</p>}
              </div>
            </section>

            {/* Delivery */}
            <section className="space-y-3">
              <h2 className="text-white font-bold text-lg">Delivery</h2>

              {/* Country dropdown (locked) */}
              <div className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between cursor-default">
                <div>
                  <p className="text-gray-400 text-[10px] leading-none mb-0.5">Country/Region</p>
                  <p className="text-gray-900 text-sm font-medium">Kenya</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    id="firstName"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={(e) => {
                      set("firstName", e.target.value);
                      setErrors((errs) => ({ ...errs, firstName: false }));
                    }}
                    className={`${INPUT} ${errors.firstName ? "border-red-400" : ""}`}
                  />
                  {errors.firstName && <p className="text-red-400 text-xs mt-1">Enter a first name.</p>}
                </div>
                <div>
                  <input
                    id="lastName"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={(e) => {
                      set("lastName", e.target.value);
                      setErrors((errs) => ({ ...errs, lastName: false }));
                    }}
                    className={`${INPUT} ${errors.lastName ? "border-red-400" : ""}`}
                  />
                  {errors.lastName && <p className="text-red-400 text-xs mt-1">Enter a last name.</p>}
                </div>
              </div>
              <div>
                <input
                  id="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => {
                    set("address", e.target.value);
                    setErrors((errs) => ({ ...errs, address: false }));
                  }}
                  className={`${INPUT} ${errors.address ? "border-red-400" : ""}`}
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">Enter an address.</p>}
              </div>
              <input placeholder="Apartment, suite, etc. (optional)" value={form.apartment}
                onChange={(e) => set("apartment", e.target.value)} className={INPUT} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    id="city"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => {
                      set("city", e.target.value);
                      setErrors((errs) => ({ ...errs, city: false }));
                    }}
                    className={`${INPUT} ${errors.city ? "border-red-400" : ""}`}
                  />
                  {errors.city && <p className="text-red-400 text-xs mt-1">Enter a city.</p>}
                </div>
                <input placeholder="Postal code (optional)" value={form.postalCode}
                  onChange={(e) => set("postalCode", e.target.value)} className={INPUT} />
              </div>

              {/* Save checkbox — sits directly on dark green */}
              <label className="flex items-center gap-3 cursor-pointer pt-1">
                <span
                  onClick={() => set("saveInfo", !form.saveInfo)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    form.saveInfo ? "bg-[#C9A96E] border-[#C9A96E]" : "border-white/40 bg-transparent"
                  }`}
                >
                  {form.saveInfo && (
                    <svg className="w-2.5 h-2.5 text-[#0B3D33]" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </span>
                <input type="checkbox" className="sr-only" checked={form.saveInfo} onChange={(e) => set("saveInfo", e.target.checked)} />
                <span className="text-white/70 text-sm">Save this information for next time</span>
              </label>
            </section>

            {/* Shipping method */}
            <section className="space-y-3">
              <h2 className="text-white font-bold text-lg">Shipping method</h2>
              <div className="rounded-lg border border-gray-200 overflow-hidden divide-y divide-gray-100">
                {SHIPPING_ZONES.map((zone) => {
                  const on = zone.id === form.shippingZoneId;
                  return (
                    <label
                      key={zone.id}
                      className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors ${
                        on ? "bg-[#FDF6EC]" : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <input type="radio" name="zone" className="sr-only" checked={on} onChange={() => set("shippingZoneId", zone.id)} />
                      <RadioDot on={on} />
                      <span className="flex-1 text-gray-800 text-sm leading-snug">{zone.name}</span>
                      <span className="text-gray-900 text-sm font-semibold shrink-0 ml-4">
                        {zone.price === 0 ? "FREE" : `Ksh ${zone.price.toLocaleString()}.00`}
                      </span>
                    </label>
                  );
                })}
              </div>
              {subtotal >= FREE_SHIPPING_THRESHOLD && (
                <p className="text-[#C9A96E] text-xs">Free shipping applied on orders over Ksh {FREE_SHIPPING_THRESHOLD.toLocaleString()}.</p>
              )}
            </section>

            {/* Payment */}
            <section className="space-y-3">
              <h2 className="text-white font-bold text-lg">Payment</h2>
              <p className="text-white/40 text-xs -mt-1">All transactions are secure and encrypted.</p>
              <div className="rounded-lg border border-gray-200 overflow-hidden divide-y divide-gray-100">
                <label className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors ${paymentMethod === "cod" ? "bg-[#FDF6EC]" : "bg-white hover:bg-gray-50"}`}>
                  <input type="radio" name="payment" className="sr-only" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                  <RadioDot on={paymentMethod === "cod"} />
                  <div>
                    <p className="text-gray-900 text-sm font-medium">Cash on Delivery</p>
                    <p className="text-gray-400 text-xs">Pay when your order arrives</p>
                  </div>
                </label>
                <label className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors ${paymentMethod === "paystack" ? "bg-[#FDF6EC]" : "bg-white hover:bg-gray-50"}`}>
                  <input type="radio" name="payment" className="sr-only" checked={paymentMethod === "paystack"} onChange={() => setPaymentMethod("paystack")} />
                  <RadioDot on={paymentMethod === "paystack"} />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium">Paystack — Card / Mobile Money</p>
                    <p className="text-gray-400 text-xs">Pay securely online, instantly confirmed</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <VisaBadge />
                    <MastercardBadge />
                    <MPesaBadge />
                    <AirtelMoneyBadge />
                  </div>
                </label>
              </div>
              {payError && <p className="text-red-400 text-xs">{payError}</p>}
            </section>

            {/* Billing address */}
            <section className="space-y-3">
              <h2 className="text-white font-bold text-lg">Billing address</h2>
              <div className="rounded-lg border border-gray-200 overflow-hidden divide-y divide-gray-100">
                <label className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors ${form.billingSameAsShipping ? "bg-[#FDF6EC]" : "bg-white hover:bg-gray-50"}`}>
                  <RadioDot on={form.billingSameAsShipping} />
                  <input type="radio" name="billing" className="sr-only" checked={form.billingSameAsShipping} onChange={() => set("billingSameAsShipping", true)} />
                  <span className="text-gray-800 text-sm">Same as shipping address</span>
                </label>
                <label className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors ${!form.billingSameAsShipping ? "bg-[#FDF6EC]" : "bg-white hover:bg-gray-50"}`}>
                  <RadioDot on={!form.billingSameAsShipping} />
                  <input type="radio" name="billing" className="sr-only" checked={!form.billingSameAsShipping} onChange={() => set("billingSameAsShipping", false)} />
                  <span className="text-gray-800 text-sm">Use a different billing address</span>
                </label>
              </div>
              <AnimatePresence>
                {!form.billingSameAsShipping && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden space-y-3"
                  >
                    <div>
                      <input
                        id="billingAddress"
                        placeholder="Billing address"
                        value={form.billingAddress}
                        onChange={(e) => {
                          set("billingAddress", e.target.value);
                          setErrors((errs) => ({ ...errs, billingAddress: false }));
                        }}
                        className={`${INPUT} ${errors.billingAddress ? "border-red-400" : ""}`}
                      />
                      {errors.billingAddress && <p className="text-red-400 text-xs mt-1">Enter a billing address.</p>}
                    </div>
                    <div>
                      <input
                        id="billingCity"
                        placeholder="City"
                        value={form.billingCity}
                        onChange={(e) => {
                          set("billingCity", e.target.value);
                          setErrors((errs) => ({ ...errs, billingCity: false }));
                        }}
                        className={`${INPUT} ${errors.billingCity ? "border-red-400" : ""}`}
                      />
                      {errors.billingCity && <p className="text-red-400 text-xs mt-1">Enter a billing city.</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Place Order */}
            <button
              type="submit"
              disabled={placing || items.length === 0}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#C9A96E] text-[#0B3D33] font-bold text-sm tracking-widest uppercase hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {placing ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0B3D33]/30 border-t-[#0B3D33] rounded-full animate-spin" />
                  {paymentMethod === "paystack" ? "Redirecting to Paystack…" : "Placing order…"}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {paymentMethod === "paystack" ? "Pay with Paystack — " : "Place order — "}KES {total.toLocaleString()}
                </>
              )}
            </button>

            {/* Policy links */}
            <div className="flex flex-wrap gap-x-5 gap-y-1 pb-12">
              <Link href="/refund-policy" className="text-[#C9A96E] text-xs hover:opacity-80 transition-opacity">Refund policy</Link>
              <Link href="/privacy-policy" className="text-[#C9A96E] text-xs hover:opacity-80 transition-opacity">Privacy policy</Link>
              <Link href="/terms" className="text-[#C9A96E] text-xs hover:opacity-80 transition-opacity">Terms of service</Link>
            </div>
          </div>

          {/* ════ RIGHT COLUMN (sticky) ════ */}
          <div className="lg:w-[42%] shrink-0">
            <div className="lg:sticky lg:top-0 px-4 sm:px-8 lg:pl-14 py-10 space-y-5">
              <h2 className="text-white font-bold text-xl">Order summary</h2>

              {/* Items */}
              <div className="space-y-5 max-h-80 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <p className="text-white/30 text-base py-4">Your cart is empty.</p>
                ) : items.map((item) => (
                  <div key={`${item.productId}-${item.variantId ?? ""}`} className="flex gap-4 items-start">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/10 shrink-0 border border-white/15">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white/20 text-xl">✦</span>
                        </div>
                      )}
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white/30 text-white text-[10px] font-bold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold leading-snug line-clamp-2">{item.title}</p>
                      <p className="text-white/40 text-sm mt-1">Ksh {item.price.toLocaleString()} × {item.quantity}</p>
                    </div>
                    <p className="text-white text-sm font-bold shrink-0">Ksh {(item.price * item.quantity).toLocaleString()}.00</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/15 pt-4 space-y-3">
                <div className="flex justify-between text-base">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-white font-medium">Ksh {subtotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-white/60">Shipping</span>
                  <span className="text-white font-medium">
                    {shippingCost === 0 ? "FREE" : `Ksh ${shippingCost.toLocaleString()}.00`}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/15 pt-4 flex justify-between items-start">
                <span className="text-white font-bold text-lg">Total</span>
                <div className="text-right">
                  <p className="text-white/40 text-xs uppercase tracking-wide">KES</p>
                  <p className="text-[#C9A96E] font-bold text-3xl leading-none">Ksh {total.toLocaleString()}.00</p>
                  <p className="text-white/30 text-xs mt-1">Including taxes</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
