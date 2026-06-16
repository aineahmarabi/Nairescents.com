import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const imageObj = v.object({ url: v.string(), alt: v.string(), position: v.number() });

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

const optionObj = v.object({ name: v.string(), values: v.array(v.string()) });

const weightUnit = v.optional(
  v.union(v.literal("g"), v.literal("kg"), v.literal("lb"), v.literal("oz"))
);

export default defineSchema({
  products: defineTable({
    // Identity
    title: v.string(),
    handle: v.string(),

    // Content
    descriptionHtml: v.string(),

    // Status
    status: v.union(v.literal("Active"), v.literal("Draft")),
    publishedOnlineStore: v.boolean(),

    // Media
    images: v.array(imageObj),

    // Pricing
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    costPerItem: v.optional(v.number()),
    unitPrice: v.optional(v.number()),
    chargeTax: v.boolean(),

    // Inventory
    trackInventory: v.boolean(),
    inventory: v.number(),
    sku: v.optional(v.string()),
    barcode: v.optional(v.string()),
    sellWhenOutOfStock: v.boolean(),
    inStock: v.boolean(),

    // Shipping
    isPhysical: v.boolean(),
    weight: v.optional(v.number()),
    weightUnit,
    countryOfOrigin: v.optional(v.string()),
    hsCode: v.optional(v.string()),

    // Variants
    hasVariants: v.boolean(),
    options: v.array(optionObj),
    variants: v.array(variantObj),

    // Organization
    vendor: v.string(),
    productType: v.optional(v.string()),
    tags: v.array(v.string()),
    category: v.optional(v.string()),
    themeTemplate: v.optional(v.string()),

    // SEO
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),

    // Naire Scents custom
    brand: v.optional(v.string()),
    gender: v.optional(v.string()),
    whenToWear: v.array(v.string()),
    size: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_handle", ["handle"])
    .index("by_gender", ["gender"])
    .index("by_brand", ["brand"]),

  collections: defineTable({
    title: v.string(),
    handle: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_handle", ["handle"]),

  orders: defineTable({
    orderNumber: v.string(),
    userId: v.optional(v.string()),
    customer: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
    }),
    items: v.array(
      v.object({
        productId: v.string(),
        variantId: v.optional(v.string()),
        title: v.string(),
        quantity: v.number(),
        price: v.number(),
        imageUrl: v.optional(v.string()),
      })
    ),
    shippingAddress: v.optional(v.string()),
    subtotal: v.number(),
    total: v.number(),
    paymentStatus: v.union(v.literal("Pending"), v.literal("Paid"), v.literal("Refunded")),
    fulfillmentStatus: v.union(
      v.literal("Unfulfilled"),
      v.literal("Fulfilled"),
      v.literal("Cancelled")
    ),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_order_number", ["orderNumber"]),

  carts: defineTable({
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.string(),
        variantId: v.optional(v.string()),
        title: v.string(),
        price: v.number(),
        imageUrl: v.optional(v.string()),
        quantity: v.number(),
      })
    ),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"]),

  heroContent: defineTable({
    slot: v.string(),
    label: v.optional(v.string()),
    heading: v.optional(v.string()),
    subheading: v.optional(v.string()),
    href: v.optional(v.string()),
    bg: v.optional(v.string()),
    rotationImages: v.optional(v.array(v.string())),
  }).index("by_slot", ["slot"]),

  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),

  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("customer")),
  }).index("by_clerk_id", ["clerkId"]),

  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    comment: v.string(),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("responded")),
  }).index("by_status", ["status"]),

  analyticsEvents: defineTable({
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
  })
    .index("by_session", ["sessionId"])
    .index("by_type", ["type"]),
});
