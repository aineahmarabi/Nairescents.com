import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./authHelpers";

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.clerkId) {
      await requireAdmin(ctx);
    }
    return ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Admin-only: this is also how a role gets assigned, so it must never be
// callable by an arbitrary logged-in (or logged-out) caller — otherwise
// anyone could grant themselves role: "admin".
export const upsert = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("customer")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (existing) {
      return ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        role: args.role,
      });
    }
    return ctx.db.insert("users", args);
  },
});
