import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const variantObj = v.object({
  id: v.string(),
  title: v.string(),
  price: v.number(),
  compareAtPrice: v.optional(v.number()),
  sku: v.optional(v.string()),
  barcode: v.optional(v.string()),
  inventory: v.number(),
  weight: v.optional(v.number()),
  option1: v.optional(v.string()),
  option2: v.optional(v.string()),
});

const imageObj = v.object({ url: v.string(), alt: v.string(), position: v.number() });
const optionObj = v.object({ name: v.string(), values: v.array(v.string()) });
const weightUnit = v.optional(
  v.union(v.literal("g"), v.literal("kg"), v.literal("lb"), v.literal("oz"))
);

const productFields = {
  title: v.string(),
  handle: v.string(),
  descriptionHtml: v.string(),
  status: v.union(v.literal("Active"), v.literal("Draft")),
  publishedOnlineStore: v.boolean(),
  images: v.array(imageObj),
  price: v.number(),
  compareAtPrice: v.optional(v.number()),
  costPerItem: v.optional(v.number()),
  unitPrice: v.optional(v.number()),
  chargeTax: v.boolean(),
  trackInventory: v.boolean(),
  inventory: v.number(),
  sku: v.optional(v.string()),
  barcode: v.optional(v.string()),
  sellWhenOutOfStock: v.boolean(),
  inStock: v.boolean(),
  isPhysical: v.boolean(),
  weight: v.optional(v.number()),
  weightUnit,
  countryOfOrigin: v.optional(v.string()),
  hsCode: v.optional(v.string()),
  hasVariants: v.boolean(),
  options: v.array(optionObj),
  variants: v.array(variantObj),
  vendor: v.string(),
  productType: v.optional(v.string()),
  tags: v.array(v.string()),
  category: v.optional(v.string()),
  themeTemplate: v.optional(v.string()),
  seoTitle: v.optional(v.string()),
  seoDescription: v.optional(v.string()),
  brand: v.optional(v.string()),
  gender: v.optional(v.string()),
  whenToWear: v.array(v.string()),
  size: v.optional(v.string()),
};

export const list = query({
  args: {
    status: v.optional(v.string()),
    gender: v.optional(v.string()),
    brand: v.optional(v.string()),
    tag: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db.query("products").collect();
    if (args.status) products = products.filter((p) => p.status === args.status);
    if (args.gender) products = products.filter((p) => p.gender === args.gender);
    if (args.brand) products = products.filter((p) => p.brand === args.brand);
    if (args.tag) products = products.filter((p) => p.tags.includes(args.tag!));
    if (args.limit) products = products.slice(0, args.limit);
    return products;
  },
});

export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const getByHandle = query({
  args: { handle: v.string() },
  handler: async (ctx, args) =>
    ctx.db
      .query("products")
      .withIndex("by_handle", (q) => q.eq("handle", args.handle))
      .first(),
});

export const create = mutation({
  args: productFields,
  handler: async (ctx, args) => ctx.db.insert("products", args),
});

export const update = mutation({
  args: { id: v.id("products"), patch: v.any() },
  handler: async (ctx, { id, patch }) => ctx.db.patch(id, patch),
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => ctx.db.delete(args.id),
});

export const bulkCreate = mutation({
  args: { products: v.array(v.object(productFields)) },
  handler: async (ctx, args) => {
    const ids: string[] = [];
    for (const product of args.products) {
      const id = await ctx.db.insert("products", product);
      ids.push(id);
    }
    return ids;
  },
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

// One-time cleanup: remove ghost rows from CSV parse errors, set all real products Active
export const cleanupImport = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("products").collect();
    let deleted = 0;
    let activated = 0;
    for (const p of all) {
      const raw = p.title ?? "";
      const t = raw.trim();
      const isGhost =
        !t ||
        raw.startsWith(" ") ||           // leading space = fragment row
        t === "Naire Scents" ||
        t.includes("</p>") ||            // HTML bleed
        /notes? are/i.test(t) ||         // fragrance note descriptions
        /^(Lemon|Vanilla|Lavender|Orange Blossom|Bergamot|Oud|Musk|Rose|Amber|Vetiver|Iris|Saffron|Tobacco|Patchouli|Praline|Cacao|Cinnamon|Cardamom|Ginger|Heliotrope|Tangerine|Litchi|Kumquat|Osmanthus|Tuberose|Jasmine|Milk|Sugar|Honey|Dates)$/i.test(t);
      if (isGhost) {
        await ctx.db.delete(p._id);
        deleted++;
      } else {
        await ctx.db.patch(p._id, { status: "Active" });
        activated++;
      }
    }
    return { deleted, activated };
  },
});
