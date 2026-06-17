import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const orderItem = v.object({
  productId: v.string(),
  variantId: v.optional(v.string()),
  title: v.string(),
  quantity: v.number(),
  price: v.number(),
  imageUrl: v.optional(v.string()),
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("orders").collect();
    return all.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const get = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const getByReference = query({
  args: { reference: v.string() },
  handler: async (ctx, args) =>
    ctx.db
      .query("orders")
      .withIndex("by_paystack_reference", (q) => q.eq("paystackReference", args.reference))
      .first(),
});

export const create = mutation({
  args: {
    userId: v.optional(v.string()),
    customer: v.object({ name: v.string(), email: v.string(), phone: v.optional(v.string()) }),
    items: v.array(orderItem),
    shippingAddress: v.optional(v.string()),
    subtotal: v.number(),
    shippingFee: v.optional(v.number()),
    shippingZoneName: v.optional(v.string()),
    total: v.number(),
    paymentMethod: v.optional(
      v.union(v.literal("Cash on Delivery"), v.literal("Paystack"), v.literal("Manual"))
    ),
    paystackReference: v.optional(v.string()),
    paymentStatus: v.optional(
      v.union(v.literal("Pending"), v.literal("Paid"), v.literal("Failed"), v.literal("Refunded"))
    ),
    fulfillmentStatus: v.optional(
      v.union(v.literal("Unfulfilled"), v.literal("Fulfilled"), v.literal("Cancelled"))
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { paymentStatus, fulfillmentStatus, ...rest } = args;
    const count = (await ctx.db.query("orders").collect()).length;
    const orderNumber = `#${1000 + count + 1}`;
    return ctx.db.insert("orders", {
      ...rest,
      orderNumber,
      paymentStatus: paymentStatus ?? "Pending",
      fulfillmentStatus: fulfillmentStatus ?? "Unfulfilled",
    });
  },
});

export const setPaystackReference = mutation({
  args: { id: v.id("orders"), reference: v.string() },
  handler: async (ctx, args) => ctx.db.patch(args.id, { paystackReference: args.reference }),
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    paymentStatus: v.optional(
      v.union(v.literal("Pending"), v.literal("Paid"), v.literal("Failed"), v.literal("Refunded"))
    ),
    fulfillmentStatus: v.optional(
      v.union(v.literal("Unfulfilled"), v.literal("Fulfilled"), v.literal("Cancelled"))
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    return ctx.db.patch(id, patch);
  },
});

export const markByReference = mutation({
  args: {
    reference: v.string(),
    paymentStatus: v.union(v.literal("Paid"), v.literal("Failed")),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_paystack_reference", (q) => q.eq("paystackReference", args.reference))
      .first();
    if (!order) return null;
    await ctx.db.patch(order._id, { paymentStatus: args.paymentStatus });
    return order._id;
  },
});

// Import historical orders from Shopify CSV — does NOT decrement stock
export const bulkImport = mutation({
  args: {
    orders: v.array(v.object({
      orderNumber: v.string(),
      customer: v.object({ name: v.string(), email: v.string(), phone: v.optional(v.string()) }),
      items: v.array(v.object({
        productId: v.string(),
        title: v.string(),
        quantity: v.number(),
        price: v.number(),
      })),
      shippingAddress: v.optional(v.string()),
      subtotal: v.number(),
      shippingFee: v.optional(v.number()),
      shippingZoneName: v.optional(v.string()),
      total: v.number(),
      paymentMethod: v.optional(
        v.union(v.literal("Cash on Delivery"), v.literal("Paystack"), v.literal("Manual"))
      ),
      paymentStatus: v.union(
        v.literal("Pending"), v.literal("Paid"), v.literal("Failed"), v.literal("Refunded")
      ),
      fulfillmentStatus: v.union(
        v.literal("Unfulfilled"), v.literal("Fulfilled"), v.literal("Cancelled")
      ),
      notes: v.optional(v.string()),
      paystackReference: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    let created = 0;
    const errors: string[] = [];
    for (const o of args.orders) {
      try {
        await ctx.db.insert("orders", {
          ...o,
          userId: undefined,
        });
        created++;
      } catch (e) {
        errors.push(`${o.orderNumber}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    return { created, errors };
  },
});

export const remove = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => ctx.db.delete(args.id),
});
