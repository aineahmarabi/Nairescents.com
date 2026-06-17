import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { sendOrderEmail, OrderEmailData } from "@/lib/email";
import { Id } from "@/convex/_generated/dataModel";

export const runtime = "nodejs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { orderId?: string; trigger?: "new_order" | "fulfilled" } & Partial<OrderEmailData>;

    let data: OrderEmailData;

    if (body.orderId) {
      const order = await convex.query(api.orders.get, { id: body.orderId as Id<"orders"> });
      if (!order) return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
      data = {
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
      };
    } else {
      data = body as OrderEmailData;
    }

    await sendOrderEmail(data, body.trigger ?? "new_order");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[notify/order]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
