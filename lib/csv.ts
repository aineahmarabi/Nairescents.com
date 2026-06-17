// Shopify-compatible CSV import/export

const HEADERS = [
  "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value",
  "Variant SKU", "Variant Grams", "Variant Inventory Qty", "Variant Inventory Policy",
  "Variant Price", "Variant Compare At Price", "Variant Requires Shipping",
  "Variant Taxable", "Variant Barcode",
  "Image Src", "Image Position", "Image Alt Text",
  "SEO Title", "SEO Description", "Status",
  // Custom Naire Scents fields
  "Brand", "Gender", "When to Wear", "Size",
];

function esc(v: string | number | boolean | undefined | null): string {
  if (v === undefined || v === null) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

interface CsvProduct {
  title: string;
  handle: string;
  descriptionHtml: string;
  vendor: string;
  productType?: string;
  tags: string[];
  publishedOnlineStore: boolean;
  options: { name: string; values: string[] }[];
  variants: {
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    sku?: string;
    barcode?: string;
    inventory: number;
    weight?: number;
    option1?: string;
    option2?: string;
  }[];
  images: { url: string; alt: string; position: number }[];
  seoTitle?: string;
  seoDescription?: string;
  status: "Active" | "Draft";
  brand?: string;
  gender?: string;
  whenToWear: string[];
  size?: string;
  isPhysical: boolean;
  weight?: number;
  weightUnit?: string;
  chargeTax: boolean;
}

export function exportToCsv(products: CsvProduct[]): string {
  const rows: string[][] = [HEADERS];

  for (const p of products) {
    const variantRows = p.variants.length > 0 ? p.variants : [null];

    for (let vi = 0; vi < variantRows.length; vi++) {
      const v = variantRows[vi];
      const imgSrc = p.images[vi]?.url ?? (vi === 0 ? p.images[0]?.url ?? "" : "");
      const imgPos = p.images[vi]?.position ?? (vi === 0 ? 1 : "");
      const imgAlt = p.images[vi]?.alt ?? "";

      rows.push([
        vi === 0 ? p.handle : "",
        vi === 0 ? p.title : "",
        vi === 0 ? p.descriptionHtml : "",
        vi === 0 ? p.vendor : "",
        vi === 0 ? (p.productType ?? "") : "",
        vi === 0 ? p.tags.join(", ") : "",
        vi === 0 ? (p.publishedOnlineStore ? "true" : "false") : "",
        p.options[0]?.name ?? "",
        v?.option1 ?? (p.options[0]?.values[0] ?? ""),
        p.options[1]?.name ?? "",
        v?.option2 ?? "",
        v?.sku ?? "",
        v ? String(Math.round((v.weight ?? p.weight ?? 0) * 1000)) : "",
        v ? String(v.inventory) : "",
        "deny",
        v ? String(v.price) : String(p.variants[0]?.price ?? 0),
        v?.compareAtPrice != null ? String(v.compareAtPrice) : "",
        p.isPhysical ? "true" : "false",
        p.chargeTax ? "true" : "false",
        v?.barcode ?? "",
        imgSrc,
        String(imgPos),
        imgAlt,
        vi === 0 ? (p.seoTitle ?? "") : "",
        vi === 0 ? (p.seoDescription ?? "") : "",
        vi === 0 ? p.status : "",
        vi === 0 ? (p.brand ?? "") : "",
        vi === 0 ? (p.gender ?? "") : "",
        vi === 0 ? p.whenToWear.join(", ") : "",
        vi === 0 ? (p.size ?? "") : "",
      ].map(esc));
    }
  }

  return rows.map((r) => r.join(",")).join("\n");
}

// ---- Parser ----

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let val = "";
      i++;
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') { val += '"'; i += 2; }
        else if (line[i] === '"') { i++; break; }
        else { val += line[i++]; }
      }
      result.push(val);
      if (line[i] === ",") i++;
    } else {
      const end = line.indexOf(",", i);
      if (end === -1) { result.push(line.slice(i)); break; }
      result.push(line.slice(i, end));
      i = end + 1;
    }
  }
  return result;
}

export interface ImportProduct {
  title: string;
  handle: string;
  descriptionHtml: string;
  vendor: string;
  productType?: string;
  tags: string[];
  publishedOnlineStore: boolean;
  hasVariants: boolean;
  options: { name: string; values: string[] }[];
  variants: {
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    sku?: string;
    barcode?: string;
    inventory: number;
    weight?: number;
    option1?: string;
    option2?: string;
  }[];
  images: { url: string; alt: string; position: number }[];
  seoTitle?: string;
  seoDescription?: string;
  status: "Active" | "Draft";
  brand?: string;
  gender?: string;
  whenToWear: string[];
  size?: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  barcode?: string;
  inventory: number;
  isPhysical: boolean;
  weight?: number;
  weightUnit?: "g" | "kg" | "lb" | "oz";
  chargeTax: boolean;
  trackInventory: boolean;
  sellWhenOutOfStock: boolean;
  inStock: boolean;
  costPerItem?: number;
  unitPrice?: number;
  category?: string;
  themeTemplate?: string;
  whenToWearArr?: string[];
}

export function parseCsv(text: string): ImportProduct[] {
  const stripped = text.replace(/^﻿/, "");
  const lines = stripped.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  const col = (name: string) => headers.indexOf(name);

  const grouped = new Map<string, string[][]>();
  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvLine(lines[i]);
    const handle = row[col("Handle")];
    if (!handle) {
      const last = Array.from(grouped.keys()).pop();
      if (last) grouped.get(last)!.push(row);
    } else {
      if (!grouped.has(handle)) grouped.set(handle, []);
      grouped.get(handle)!.push(row);
    }
  }

  const products: ImportProduct[] = [];

  for (const [handle, rows] of Array.from(grouped.entries())) {
    const first = rows[0];
    const g = (name: string, r: string[] = first) => r[col(name)] ?? "";

    const images: { url: string; alt: string; position: number }[] = [];
    const variants: ImportProduct["variants"] = [];
    const optionNames = [g("Option1 Name"), g("Option2 Name")].filter(Boolean);
    const optionValuesMap = new Map<string, Set<string>>();

    for (const row of rows) {
      const imgSrc = g("Image Src", row);
      const imgPos = parseInt(g("Image Position", row)) || images.length + 1;
      const imgAlt = g("Image Alt Text", row);
      if (imgSrc && !images.find((im) => im.url === imgSrc)) {
        images.push({ url: imgSrc, alt: imgAlt, position: imgPos });
      }

      const o1 = g("Option1 Value", row);
      const o2 = g("Option2 Value", row);
      const variantTitle = [o1, o2].filter(Boolean).join(" / ") || g("Title", row);
      const vSku = g("Variant SKU", row);
      const vPrice = parseFloat(g("Variant Price", row)) || 0;
      const vCompare = g("Variant Compare At Price", row);
      const vInv = parseInt(g("Variant Inventory Qty", row)) || 0;
      const vGrams = parseInt(g("Variant Grams", row)) || 0;
      const vBarcode = g("Variant Barcode", row);

      if (optionNames[0]) {
        if (!optionValuesMap.has(optionNames[0])) optionValuesMap.set(optionNames[0], new Set());
        if (o1) optionValuesMap.get(optionNames[0])!.add(o1);
      }
      if (optionNames[1]) {
        if (!optionValuesMap.has(optionNames[1])) optionValuesMap.set(optionNames[1], new Set());
        if (o2) optionValuesMap.get(optionNames[1])!.add(o2);
      }

      variants.push({
        id: `${o1}-${o2}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || handle,
        title: variantTitle,
        price: vPrice,
        compareAtPrice: vCompare ? parseFloat(vCompare) : undefined,
        sku: vSku || undefined,
        barcode: vBarcode || undefined,
        inventory: vInv,
        weight: vGrams ? vGrams / 1000 : undefined,
        option1: o1 || undefined,
        option2: o2 || undefined,
      });
    }

    const options = optionNames.map((name) => ({
      name,
      values: Array.from(optionValuesMap.get(name) ?? []),
    }));

    const hasVariants = variants.length > 1 || optionNames.length > 0;
    const baseVariant = variants[0];
    const rawWhenToWear = g("When to Wear");

    products.push({
      title: g("Title"),
      handle,
      descriptionHtml: g("Body (HTML)"),
      vendor: g("Vendor"),
      productType: g("Type") || undefined,
      tags: g("Tags").split(",").map((t: string) => t.trim()).filter(Boolean),
      publishedOnlineStore: g("Published").toLowerCase() === "true",
      hasVariants,
      options,
      variants,
      images,
      seoTitle: g("SEO Title") || undefined,
      seoDescription: g("SEO Description") || undefined,
      status: g("Status") === "active" || g("Status") === "Active" ? "Active" : "Draft",
      brand: g("Brand") || undefined,
      gender: g("Gender") || undefined,
      whenToWear: rawWhenToWear ? rawWhenToWear.split(",").map((w: string) => w.trim()).filter(Boolean) : [],
      size: g("Size") || undefined,
      price: baseVariant?.price ?? 0,
      compareAtPrice: baseVariant?.compareAtPrice,
      sku: baseVariant?.sku,
      barcode: baseVariant?.barcode,
      inventory: baseVariant?.inventory ?? 0,
      isPhysical: g("Variant Requires Shipping").toLowerCase() !== "false",
      weight: baseVariant?.weight,
      weightUnit: "g",
      chargeTax: g("Variant Taxable").toLowerCase() !== "false",
      trackInventory: true,
      sellWhenOutOfStock: g("Variant Inventory Policy") === "continue",
      inStock: (baseVariant?.inventory ?? 0) > 0,
    });
  }

  return products;
}


// ============================================================
// Orders CSV — Shopify-compatible import / export
// ============================================================

const ORDER_HEADERS = [
  "Name", "Email", "Financial Status", "Paid at", "Fulfillment Status", "Fulfilled at",
  "Currency", "Subtotal", "Shipping", "Taxes", "Total",
  "Discount Code", "Discount Amount", "Shipping Method", "Created at",
  "Lineitem quantity", "Lineitem name", "Lineitem price", "Lineitem sku",
  "Billing Name", "Billing Address1", "Billing City", "Billing Zip", "Billing Province",
  "Billing Country", "Billing Phone",
  "Shipping Name", "Shipping Address1", "Shipping City", "Shipping Zip", "Shipping Province",
  "Shipping Country", "Shipping Phone",
  "Notes", "Phone", "Payment Method", "Payment Reference",
];

interface CsvOrder {
  orderNumber: string;
  customer: { name: string; email: string; phone?: string };
  items: { title: string; quantity: number; price: number; sku?: string }[];
  shippingAddress?: string;
  subtotal: number;
  shippingFee?: number;
  shippingZoneName?: string;
  total: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  paymentMethod?: string;
  paystackReference?: string;
  notes?: string;
  _creationTime: number;
}

export function exportOrdersToCsv(orders: CsvOrder[]): string {
  const rows: string[][] = [ORDER_HEADERS];

  for (const o of orders) {
    const createdAt = new Date(o._creationTime).toISOString();
    const paidAt = o.paymentStatus === "Paid" ? createdAt : "";
    const fulfilledAt = o.fulfillmentStatus === "Fulfilled" ? createdAt : "";
    const financialStatus = o.paymentStatus.toLowerCase();
    const fulfillmentStatus = o.fulfillmentStatus.toLowerCase();
    const items = o.items.length > 0 ? o.items : [{ title: "", quantity: 1, price: 0, sku: "" }];

    items.forEach((item, idx) => {
      rows.push([
        idx === 0 ? o.orderNumber : "",
        idx === 0 ? o.customer.email : "",
        idx === 0 ? financialStatus : "",
        idx === 0 ? paidAt : "",
        idx === 0 ? fulfillmentStatus : "",
        idx === 0 ? fulfilledAt : "",
        idx === 0 ? "KES" : "",
        idx === 0 ? String(o.subtotal) : "",
        idx === 0 ? String(o.shippingFee ?? o.total - o.subtotal) : "",
        idx === 0 ? "0" : "",
        idx === 0 ? String(o.total) : "",
        "",
        "0",
        idx === 0 ? (o.shippingZoneName ?? "") : "",
        idx === 0 ? createdAt : "",
        String(item.quantity),
        item.title,
        String(item.price),
        item.sku ?? "",
        idx === 0 ? o.customer.name : "",
        idx === 0 ? (o.shippingAddress ?? "") : "",
        "", "", "", "KE",
        idx === 0 ? (o.customer.phone ?? "") : "",
        idx === 0 ? o.customer.name : "",
        idx === 0 ? (o.shippingAddress ?? "") : "",
        "", "", "", "KE",
        idx === 0 ? (o.customer.phone ?? "") : "",
        idx === 0 ? (o.notes ?? "") : "",
        idx === 0 ? (o.customer.phone ?? "") : "",
        idx === 0 ? (o.paymentMethod ?? "") : "",
        idx === 0 ? (o.paystackReference ?? "") : "",
      ].map(esc));
    });
  }

  return rows.map((r) => r.join(",")).join("\n");
}

export interface ImportOrder {
  orderNumber: string;
  customer: { name: string; email: string; phone?: string };
  items: { title: string; quantity: number; price: number }[];
  shippingAddress?: string;
  subtotal: number;
  shippingFee?: number;
  shippingZoneName?: string;
  total: number;
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  fulfillmentStatus: "Unfulfilled" | "Fulfilled" | "Cancelled";
  paymentMethod?: "Cash on Delivery" | "Paystack" | "Manual";
  paystackReference?: string;
  notes?: string;
}

function mapFinancialStatus(s: string): ImportOrder["paymentStatus"] {
  const v = s.toLowerCase();
  if (v === "paid") return "Paid";
  if (v === "refunded" || v === "partially_refunded") return "Refunded";
  if (v === "voided") return "Failed";
  return "Pending";
}

function mapFulfillmentStatus(s: string): ImportOrder["fulfillmentStatus"] {
  const v = s.toLowerCase();
  if (v === "fulfilled") return "Fulfilled";
  if (v === "cancelled") return "Cancelled";
  return "Unfulfilled";
}

function mapPaymentMethod(s: string): ImportOrder["paymentMethod"] {
  const v = s.toLowerCase();
  if (v.includes("paystack") || v.includes("card") || v.includes("online")) return "Paystack";
  if (v.includes("cash")) return "Cash on Delivery";
  return undefined;
}

export function parseOrdersCsv(text: string): ImportOrder[] {
  const stripped = text.replace(/^﻿/, "");
  const lines = stripped.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  const col = (name: string) => headers.indexOf(name);

  // Group rows by order Name
  const grouped = new Map<string, string[][]>();
  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvLine(lines[i]);
    const name = row[col("Name")]?.trim();
    if (name) {
      if (!grouped.has(name)) grouped.set(name, []);
      grouped.get(name)!.push(row);
    } else {
      // continuation row (extra line items)
      const last = Array.from(grouped.keys()).pop();
      if (last) grouped.get(last)!.push(row);
    }
  }

  const orders: ImportOrder[] = [];

  for (const [name, rows] of Array.from(grouped.entries())) {
    const first = rows[0];
    const g = (colName: string, r: string[] = first) => (r[col(colName)] ?? "").trim();

    const items: ImportOrder["items"] = [];
    for (const row of rows) {
      const qty = parseInt(g("Lineitem quantity", row)) || 1;
      const title = g("Lineitem name", row);
      const price = parseFloat(g("Lineitem price", row)) || 0;
      if (title) items.push({ title, quantity: qty, price });
    }

    const subtotal = parseFloat(g("Subtotal")) || 0;
    const shipping = parseFloat(g("Shipping")) || 0;
    const total = parseFloat(g("Total")) || subtotal + shipping;
    const phone = (g("Phone") || g("Billing Phone") || g("Shipping Phone") || undefined);
    const addr = [g("Shipping Address1"), g("Shipping City"), g("Shipping Province"), g("Shipping Zip"), g("Shipping Country")]
      .filter(Boolean).join(", ") || undefined;

    orders.push({
      orderNumber: name,
      customer: {
        name: g("Billing Name") || g("Shipping Name") || "Unknown",
        email: g("Email") || "unknown@shopify-import.com",
        phone: phone || undefined,
      },
      items,
      shippingAddress: addr,
      subtotal,
      shippingFee: shipping || undefined,
      shippingZoneName: g("Shipping Method") || undefined,
      total,
      paymentStatus: mapFinancialStatus(g("Financial Status")),
      fulfillmentStatus: mapFulfillmentStatus(g("Fulfillment Status")),
      paymentMethod: mapPaymentMethod(g("Payment Method")),
      paystackReference: g("Payment Reference") || undefined,
      notes: g("Notes") || undefined,
    });
  }

  return orders;
}
