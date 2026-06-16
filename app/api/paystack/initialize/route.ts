import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const { orderId, email, amount } = (await req.json()) as {
    orderId: string;
    email: string;
    amount: number;
  };

  if (!orderId || !email || !amount) {
    return NextResponse.json({ error: "Missing orderId, email, or amount" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100), // KES to kobo-equivalent (smallest unit)
      currency: "KES",
      callback_url: `${origin}/checkout/success`,
      metadata: { orderId },
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.status) {
    return NextResponse.json({ error: data.message ?? "Failed to initialize transaction" }, { status: 502 });
  }

  await convex.mutation(api.orders.setPaystackReference, {
    id: orderId as Id<"orders">,
    reference: data.data.reference,
  }).catch(() => {});

  return NextResponse.json({
    authorizationUrl: data.data.authorization_url,
    reference: data.data.reference,
  });
}
