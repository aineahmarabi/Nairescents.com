import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

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

  return NextResponse.json({ success, order });
}
