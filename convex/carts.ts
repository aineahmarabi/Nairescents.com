import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const cartItem = v.object({
  productId: v.string(),
  variantId: v.optional(v.string()),
  title: v.string(),
  price: v.number(),
  imageUrl: v.optional(v.string()),
  quantity: v.number(),
});

export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) =>
    ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first(),
});

export const getBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) =>
    ctx.db
      .query("carts")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first(),
});

export const setCart = mutation({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    items: v.array(cartItem),
  },
  handler: async (ctx, args) => {
    if (args.userId) {
      const existing = await ctx.db
        .query("carts")
        .withIndex("by_user", (q) => q.eq("userId", args.userId!))
        .first();
      if (existing) return ctx.db.patch(existing._id, { items: args.items });
      return ctx.db.insert("carts", { userId: args.userId, items: args.items });
    }
    if (args.sessionId) {
      const existing = await ctx.db
        .query("carts")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId!))
        .first();
      if (existing) return ctx.db.patch(existing._id, { items: args.items });
      return ctx.db.insert("carts", { sessionId: args.sessionId, items: args.items });
    }
  },
});

export const mergeGuestCart = mutation({
  args: { userId: v.string(), sessionId: v.string() },
  handler: async (ctx, args) => {
    const userCart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    const guestCart = await ctx.db
      .query("carts")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!guestCart || guestCart.items.length === 0) return;

    const merged = userCart ? [...userCart.items] : [];
    for (const gItem of guestCart.items) {
      const existing = merged.find(
        (m) => m.productId === gItem.productId && m.variantId === gItem.variantId
      );
      if (existing) existing.quantity += gItem.quantity;
      else merged.push(gItem);
    }

    if (userCart) await ctx.db.patch(userCart._id, { items: merged });
    else await ctx.db.insert("carts", { userId: args.userId, items: merged });

    await ctx.db.delete(guestCart._id);
  },
});
