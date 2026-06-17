import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { sendOrderEmail } from "@/lib/email";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");
  if (!reference) return NextResponse.json({ error: "Missing reference" }, { status: 400 });

  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });
  const data = await res.json();
  if (!res.ok || !data.status) {
    return NextResponse.json({ error: data.message ?? "Verification failed" }, { status: 502 });
  }

  const success = data.data.status === "success";
  await convex.mutation(api.orders.markByReference, {
    reference,
    paymentStatus: success ? "Paid" : "Failed",
  }).catch(() => {});

  const order = await convex.query(api.orders.getByReference, { reference }).catch(() => null);

  if (success && order) {
    sendOrderEmail({
      orderNumber: order.orderNumber,
      customer: order.customer,
      items: order.items,
      shippingAddress: order.shippingAddress,
      shippingZoneName: order.shippingZoneName,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
    }, "new_order").catch((e) => console.error("[notify] Paystack order email failed:", e));
  }

  return NextResponse.json({ success, order });
}
