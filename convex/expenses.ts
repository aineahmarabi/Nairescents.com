import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./authHelpers";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const all = await ctx.db.query("expenses").withIndex("by_date").collect();
    return all.reverse();
  },
});

export const create = mutation({
  args: {
    description: v.string(),
    category: v.string(),
    amount: v.number(),
    date: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return ctx.db.insert("expenses", args);
  },
});

export const update = mutation({
  args: { id: v.id("expenses"), patch: v.any() },
  handler: async (ctx, { id, patch }) => {
    await requireAdmin(ctx);
    return ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("expenses") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    return ctx.db.delete(id);
  },
});
