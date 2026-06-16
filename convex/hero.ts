import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => ctx.db.query("heroContent").collect(),
});

export const getBySlot = query({
  args: { slot: v.string() },
  handler: async (ctx, args) =>
    ctx.db
      .query("heroContent")
      .withIndex("by_slot", (q) => q.eq("slot", args.slot))
      .first(),
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
});

export const getStorageUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, { storageId }) =>
    ctx.storage.getUrl(storageId as never),
});

export const upsert = mutation({
  args: {
    slot: v.string(),
    label: v.optional(v.string()),
    heading: v.optional(v.string()),
    subheading: v.optional(v.string()),
    href: v.optional(v.string()),
    bg: v.optional(v.string()),
    rotationImages: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("heroContent")
      .withIndex("by_slot", (q) => q.eq("slot", args.slot))
      .first();
    if (existing) return ctx.db.patch(existing._id, args);
    return ctx.db.insert("heroContent", args);
  },
});
