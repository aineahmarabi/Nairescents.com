"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/components/layout/CartContext";
import { useTrackEvent } from "@/lib/analytics";

type Status = "verifying" | "success" | "failed" | "error";

interface OrderSummary {
  orderNumber: string;
  subtotal: number;
  shippingFee?: number;
  shippingZoneName?: string;
  total: number;
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessContent() {
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref");
  const { clearCart } = useCart();
  const track = useTrackEvent();
  const [status, setStatus] = useState<Status>("verifying");
  const [order, setOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    if (!reference) { setStatus("error"); return; }
    fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          if (data.order) setOrder({
            orderNumber: data.order.orderNumber,
            subtotal: data.order.subtotal,
            shippingFee: data.order.shippingFee,
            shippingZoneName: data.order.shippingZoneName,
            total: data.order.total,
          });
          track("order_placed", { value: data.order?.total });
          clearCart();
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  return (
    <div className="min-h-screen bg-[#0B3D33] flex flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="mb-10">
        <Image src="/logo-main.png" alt="Naire Scents" width={200} height={80} className="h-14 w-auto object-contain" />
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full"
      >
        {status === "verifying" && (
          <>
            <div className="w-12 h-12 border-2 border-[#C9A96E]/40 border-t-[#C9A96E] rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-white text-xl font-bold mb-2">Confirming your payment…</h1>
            <p className="text-white/50 text-sm">This only takes a moment. Please don&apos;t close this page.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/40 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#C9A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-white text-2xl font-bold mb-3">Payment successful!</h1>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              {order ? `Order ${order.orderNumber} is confirmed.` : "Your order is confirmed."} We&apos;ll reach out via WhatsApp or email shortly.
            </p>
            {order && (
              <div className="text-left rounded-xl border border-white/10 bg-white/5 p-4 mb-8 space-y-2 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span><span>Ksh {order.subtotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>
                    Shipping{order.shippingZoneName ? ` — ${order.shippingZoneName.split(",")[0]}` : ""}
                  </span>
                  <span>
                    {(order.shippingFee ?? order.total - order.subtotal) === 0
                      ? "FREE"
                      : `Ksh ${(order.shippingFee ?? order.total - order.subtotal).toLocaleString()}.00`}
                  </span>
                </div>
                <div className="flex justify-between text-white font-semibold border-t border-white/10 pt-2">
                  <span>Total</span><span>Ksh {order.total.toLocaleString()}.00</span>
                </div>
              </div>
            )}
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-xl border border-[#C9A96E] text-[#C9A96E] text-sm font-semibold tracking-widest uppercase hover:bg-[#C9A96E]/10 active:scale-[0.98] transition-all"
            >
              Back to Store
            </Link>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-400/30 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-white text-2xl font-bold mb-3">Payment not completed</h1>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              Your payment didn&apos;t go through. Your cart is still saved — you can try again or choose Cash on Delivery instead.
            </p>
            <Link
              href="/checkout"
              className="inline-block px-8 py-3 rounded-xl bg-[#C9A96E] text-[#0B3D33] text-sm font-bold tracking-widest uppercase hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Back to Checkout
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-white text-xl font-bold mb-3">Something went wrong</h1>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              We couldn&apos;t verify your payment automatically. If you were charged, please contact us with your reference so we can confirm your order manually.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 rounded-xl border border-[#C9A96E] text-[#C9A96E] text-sm font-semibold tracking-widest uppercase hover:bg-[#C9A96E]/10 active:scale-[0.98] transition-all"
            >
              Contact Us
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
