import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./authHelpers";

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("settings").collect();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  },
});

export const set = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    if (existing) return ctx.db.patch(existing._id, { value: args.value });
    return ctx.db.insert("settings", args);
  },
});

export const setMany = mutation({
  args: { pairs: v.array(v.object({ key: v.string(), value: v.string() })) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    for (const { key, value } of args.pairs) {
      const existing = await ctx.db
        .query("settings")
        .withIndex("by_key", (q) => q.eq("key", key))
        .first();
      if (existing) await ctx.db.patch(existing._id, { value });
      else await ctx.db.insert("settings", { key, value });
    }
  },
});
