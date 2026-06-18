import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

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

    // Validate inventory and collect updates
    const inventoryUpdates: Array<{
      id: Id<"products">;
      newInventory: number;
      markOutOfStock: boolean;
    }> = [];

    for (const item of args.items) {
      const product = await ctx.db.get(item.productId as Id<"products">);
      if (!product || !product.trackInventory) continue;

      const newInventory = product.inventory - item.quantity;
      inventoryUpdates.push({
        id: product._id,
        newInventory,
        // Only auto-flip inStock=false when sellWhenOutOfStock is explicitly false
        markOutOfStock: newInventory <= 0 && !product.sellWhenOutOfStock,
      });
    }

    // Insert order — derive next number from highest existing order number
    const allOrders = await ctx.db.query("orders").collect();
    const maxNum = allOrders.reduce((max, o) => {
      const n = parseInt(o.orderNumber.replace(/[^0-9]/g, ""), 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 1000);
    const orderNumber = `#NS${maxNum + 1}`;
    const orderId = await ctx.db.insert("orders", {
      ...rest,
      orderNumber,
      paymentStatus: paymentStatus ?? "Pending",
      fulfillmentStatus: fulfillmentStatus ?? "Unfulfilled",
    });

    // Decrement inventory atomically in the same mutation
    for (const { id, newInventory, markOutOfStock } of inventoryUpdates) {
      const patch: { inventory: number; inStock?: boolean } = { inventory: newInventory };
      if (markOutOfStock) patch.inStock = false;
      await ctx.db.patch(id, patch);
    }

    return orderId;
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

// One-time migration: add #NS prefix to any order numbers missing it
export const fixOrderNumberPrefix = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("orders").collect();
    let fixed = 0;
    for (const o of all) {
      if (!o.orderNumber.startsWith("#NS")) {
        const digits = o.orderNumber.replace(/[^0-9]/g, "");
        await ctx.db.patch(o._id, { orderNumber: `#NS${digits}` });
        fixed++;
      }
    }
    return { fixed };
  },
});

export const remove = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => ctx.db.delete(args.id),
});

export const removeWithInventoryRestore = mutation({
  args: {
    id: v.id("orders"),
    restoreInventory: v.boolean(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) return;

    if (args.restoreInventory) {
      for (const item of order.items) {
        const product = await ctx.db.get(item.productId as Id<"products">);
        if (!product || !product.trackInventory) continue;

        const newInventory = product.inventory + item.quantity;
        // Auto-sync inStock: if inventory is positive again, mark back in stock
        const patch: { inventory: number; inStock?: boolean } = { inventory: newInventory };
        if (newInventory > 0) patch.inStock = true;
        await ctx.db.patch(product._id, patch);
      }
    }

    await ctx.db.delete(args.id);
  },
});
