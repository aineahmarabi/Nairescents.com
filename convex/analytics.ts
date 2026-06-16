import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const log = mutation({
  args: {
    sessionId: v.string(),
    type: v.union(
      v.literal("pageview"),
      v.literal("product_view"),
      v.literal("add_to_cart"),
      v.literal("checkout_started"),
      v.literal("order_placed")
    ),
    path: v.optional(v.string()),
    productId: v.optional(v.string()),
    productTitle: v.optional(v.string()),
    value: v.optional(v.number()),
    referrer: v.optional(v.string()),
    device: v.optional(v.union(v.literal("mobile"), v.literal("desktop"))),
    isNewVisitor: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => ctx.db.insert("analyticsEvents", args),
});

// Raw events since a timestamp (ms) — aggregation (sessions, funnel, top
// products, traffic, device split) happens client-side over this list so the
// admin dashboard stays reactive via Convex's live useQuery.
export const eventsSince = query({
  args: { since: v.number() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("analyticsEvents").collect();
    return all.filter((e) => e._creationTime >= args.since);
  },
});

export const liveVisitors = query({
  args: {},
  handler: async (ctx) => {
    const fiveMinAgo = Date.now() - 5 * 60 * 1000;
    const all = await ctx.db.query("analyticsEvents").collect();
    const recent = all.filter((e) => e._creationTime >= fiveMinAgo);
    return new Set(recent.map((e) => e.sessionId)).size;
  },
});
