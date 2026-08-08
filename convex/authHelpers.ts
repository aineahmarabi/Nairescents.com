import { QueryCtx, MutationCtx } from "./_generated/server";

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();
  if (!user || user.role !== "admin") throw new Error("Not authorized: admin access required");
  return user;
}
