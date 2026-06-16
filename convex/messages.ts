import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("contactSubmissions").collect();
    return all.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const get = query({
  args: { id: v.id("contactSubmissions") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const unread = await ctx.db
      .query("contactSubmissions")
      .withIndex("by_status", (q) => q.eq("status", "new"))
      .collect();
    return unread.length;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    comment: v.string(),
  },
  handler: async (ctx, args) =>
    ctx.db.insert("contactSubmissions", { ...args, status: "new" }),
});

export const setStatus = mutation({
  args: {
    id: v.id("contactSubmissions"),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("responded")),
  },
  handler: async (ctx, args) => ctx.db.patch(args.id, { status: args.status }),
});
