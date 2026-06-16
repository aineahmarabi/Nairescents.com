import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const expected = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  if (!signature || signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    await convex.mutation(api.orders.markByReference, {
      reference: event.data.reference,
      paymentStatus: "Paid",
    }).catch(() => {});
  } else if (event.event === "charge.failed") {
    await convex.mutation(api.orders.markByReference, {
      reference: event.data.reference,
      paymentStatus: "Failed",
    }).catch(() => {});
  }

  return NextResponse.json({ received: true });
}
