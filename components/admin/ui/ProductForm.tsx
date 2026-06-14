"use client";
import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import RichTextEditor from "./RichTextEditor";
import VariantsEditor, { ProductOption, ProductVariant } from "./VariantsEditor";
import {
  ChevronDown, ChevronUp, Upload, X, Loader2,
} from "lucide-react";

interface ProductImage { url: string; alt: string; position: number; }

interface FormState {
  title: string;
  handle: string;
  descriptionHtml: string;
  status: "Active" | "Draft";
  publishedOnlineStore: boolean;
  images: ProductImage[];
  price: string;
  compareAtPrice: string;
  costPerItem: string;
  unitPrice: string;
  chargeTax: boolean;
  trackInventory: boolean;
  inventory: string;
  sku: string;
  barcode: string;
  sellWhenOutOfStock: boolean;
  inStock: boolean;
  isPhysical: boolean;
  weight: string;
  weightUnit: "g" | "kg" | "lb" | "oz";
  countryOfOrigin: string;
  hsCode: string;
  hasVariants: boolean;
  options: ProductOption[];
  variants: ProductVariant[];
  vendor: string;
  productType: string;
  tags: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  brand: string;
  gender: string;
  whenToWear: string[];
  size: string;
}

interface Props {
  initial?: Partial<FormState> & { _id?: Id<"products"> };
}

const WHEN_TO_WEAR_OPTIONS = [
  "Daytime", "Evening", "Night Out", "Office", "Casual",
  "Date Night", "Wedding", "Summer", "Winter", "All Seasons",
];

const CARD = "bg-white rounded-2xl border border-gray-100 shadow-sm p-6";
const LABEL = "block text-xs font-semibold text-gray-500 mb-1.5";
const INPUT = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] transition-colors bg-white text-gray-800 placeholder-gray-300";
const SECTION_BTN = "flex items-center justify-between w-full text-sm font-semibold text-gray-700 py-2";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const DEFAULT: FormState = {
  title: "", handle: "", descriptionHtml: "",
  status: "Draft", publishedOnlineStore: false,
  images: [],
  price: "", compareAtPrice: "", costPerItem: "", unitPrice: "",
  chargeTax: true,
  trackInventory: true, inventory: "0", sku: "", barcode: "",
  sellWhenOutOfStock: false, inStock: true,
  isPhysical: true, weight: "", weightUnit: "g", countryOfOrigin: "", hsCode: "",
  hasVariants: false, options: [], variants: [],
  vendor: "", productType: "", tags: "", category: "",
  seoTitle: "", seoDescription: "",
  brand: "", gender: "", whenToWear: [], size: "",
};

export default function ProductForm({ initial }: Props) {
  const router = useRouter();
  const createFn = useMutation(api.products.create);
  const updateFn = useMutation(api.products.update);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);
  const convex = useConvex();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({ ...DEFAULT, ...initial });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [open, setOpen] = useState({
    pricing: true, inventory: true, shipping: false,
    variants: false, seo: false, custom: true,
  });

  function toggle(k: keyof typeof open) {
    setOpen((o) => ({ ...o, [k]: !o[k] }));
  }

  const set = useCallback(<K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === "title" && !initial?._id) next.handle = slugify(v as string);
      return next;
    });
  }, [initial]);

  function pushImage(url: string) {
    setForm((f) => ({
      ...f,
      images: [...f.images, { url, alt: f.title || "Product image", position: f.images.length }],
    }));
  }

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await res.json();
        const url = await convex.query(api.products.getStorageUrl, { storageId });
        if (url) pushImage(url);
      } catch (e) {
        console.error("Upload failed", e);
      }
    }
    setUploading(false);
  }

  function removeImage(i: number) {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, idx) => idx !== i).map((img, j) => ({ ...img, position: j })),
    }));
  }

  function addTag(t: string) {
    const tag = t.trim();
    if (!tag) return;
    const existing = form.tags.split(",").map((s) => s.trim()).filter(Boolean);
    if (!existing.includes(tag)) set("tags", [...existing, tag].join(", "));
    setTagInput("");
  }

  function removeTag(t: string) {
    const existing = form.tags.split(",").map((s) => s.trim()).filter(Boolean);
    set("tags", existing.filter((x) => x !== t).join(", "));
  }

  function toggleWhenToWear(w: string) {
    set(
      "whenToWear",
      form.whenToWear.includes(w)
        ? form.whenToWear.filter((x) => x !== w)
        : [...form.whenToWear, w]
    );
  }

  async function handleSave(status?: "Active" | "Draft") {
    setSaving(true);
    const s = status ?? form.status;
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const payload = {
      title: form.title,
      handle: form.handle || slugify(form.title),
      descriptionHtml: form.descriptionHtml,
      status: s,
      publishedOnlineStore: form.publishedOnlineStore,
      images: form.images,
      price: Number(form.price) || 0,
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      costPerItem: form.costPerItem ? Number(form.costPerItem) : undefined,
      unitPrice: form.unitPrice ? Number(form.unitPrice) : undefined,
      chargeTax: form.chargeTax,
      trackInventory: form.trackInventory,
      inventory: Number(form.inventory) || 0,
      sku: form.sku || undefined,
      barcode: form.barcode || undefined,
      sellWhenOutOfStock: form.sellWhenOutOfStock,
      inStock: form.inStock,
      isPhysical: form.isPhysical,
      weight: form.weight ? Number(form.weight) : undefined,
      weightUnit: form.isPhysical ? form.weightUnit : undefined,
      countryOfOrigin: form.countryOfOrigin || undefined,
      hsCode: form.hsCode || undefined,
      hasVariants: form.hasVariants,
      options: form.options,
      variants: form.variants,
      vendor: form.vendor,
      productType: form.productType || undefined,
      tags,
      category: form.category || undefined,
      seoTitle: form.seoTitle || undefined,
      seoDescription: form.seoDescription || undefined,
      brand: form.brand || undefined,
      gender: form.gender || undefined,
      whenToWear: form.whenToWear,
      size: form.size || undefined,
    };

    try {
      if (initial?._id) {
        await updateFn({ id: initial._id, patch: payload });
      } else {
        await createFn(payload);
      }
      router.push("/admin/dashboard/products");
    } catch (e) {
      console.error(e);
      alert("Failed to save product.");
    } finally {
      setSaving(false);
    }
  }

  const tagList = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          ← Products
        </button>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => handleSave("Draft")} disabled={saving}
            className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
            Save draft
          </button>
          <button type="button" onClick={() => handleSave("Active")} disabled={saving || !form.title}
            className="px-5 py-2 text-sm font-semibold bg-[#0B3D33] text-white rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50">
            {saving ? "Saving…" : initial?._id ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Title */}
          <div className={CARD}>
            <label className={LABEL}>Title</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className={INPUT} placeholder="e.g. Lattafa Oud for Glory" />
          </div>

          {/* Description */}
          <div className={CARD}>
            <p className="text-sm font-semibold text-gray-700 mb-3">Description</p>
            <RichTextEditor value={form.descriptionHtml} onChange={(v) => set("descriptionHtml", v)} />
          </div>

          {/* Media */}
          <div className={CARD}>
            <p className="text-sm font-semibold text-gray-700 mb-4">Media</p>
            {form.images.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-black/60 text-white py-0.5">Cover</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); uploadFiles(e.dataTransfer.files); }}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#C9A96E]/50 hover:bg-[#C9A96E]/5 transition-colors"
            >
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadFiles(e.target.files)} />
              {uploading ? (
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Uploading…</span>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-500">Drop media to upload</p>
                  <p className="text-xs text-gray-300 mt-1">or click to select files</p>
                </>
              )}
            </div>
          </div>

          {/* Category */}
          <div className={CARD}>
            <div className="flex items-start justify-between mb-1">
              <p className="text-sm font-semibold text-gray-700">Category</p>
            </div>
            <p className="text-xs text-gray-400 mb-3">Determines tax rates and adds metafields to improve search, filters, and cross-channel sales</p>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className={INPUT}>
              <option value="">Uncategorized</option>
              <option value="Eaux de Parfum">Eaux de Parfum in Perfumes &amp; Colognes</option>
              <option value="Eau de Toilette">Eau de Toilette in Perfumes &amp; Colognes</option>
              <option value="Perfume Oil">Perfume Oil in Perfumes &amp; Colognes</option>
              <option value="Gift Sets">Gift Sets</option>
            </select>
          </div>

          {/* Pricing */}
          <div className={CARD}>
            <p className="text-sm font-semibold text-gray-700 mb-4">Price</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Price</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">KES</span>
                    <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} className={INPUT + " pl-12"} placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>Compare-at price</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">KES</span>
                    <input type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} className={INPUT + " pl-12"} placeholder="0.00" />
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.chargeTax} onChange={(e) => set("chargeTax", e.target.checked)} className="rounded accent-[#C9A96E]" />
                <span className="text-sm text-gray-600">Charge tax on this product</span>
              </label>
              <div className="pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Cost per item</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">KES</span>
                      <input type="number" min="0" step="0.01" value={form.costPerItem} onChange={(e) => set("costPerItem", e.target.value)} className={INPUT + " pl-12"} placeholder="0.00" />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL}>Unit price (per ml)</label>
                    <input type="number" min="0" step="0.01" value={form.unitPrice} onChange={(e) => set("unitPrice", e.target.value)} className={INPUT} placeholder="—" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className={CARD}>
            <label className="flex items-center justify-between mb-4 cursor-pointer">
              <p className="text-sm font-semibold text-gray-700">Inventory</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Track inventory</span>
                <button type="button" onClick={() => set("trackInventory", !form.trackInventory)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${form.trackInventory ? "bg-[#0B3D33]" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.trackInventory ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
            </label>
            <div className="space-y-4">
              {form.trackInventory && (
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Location</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500">Unavailable</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500">Committed</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500">Available</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500">On hand</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-700">Stanbank House</td>
                        <td className="text-center px-3 py-3 text-gray-400">0</td>
                        <td className="text-center px-3 py-3 text-gray-400">0</td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="number" min="0"
                            value={form.inventory}
                            onChange={(e) => set("inventory", e.target.value)}
                            className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E]"
                          />
                        </td>
                        <td className="text-center px-3 py-3 font-semibold text-gray-800">{Number(form.inventory) || 0}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>SKU (Stock Keeping Unit)</label>
                  <input value={form.sku} onChange={(e) => set("sku", e.target.value)} className={INPUT} placeholder="—" />
                </div>
                <div>
                  <label className={LABEL}>Barcode (ISBN, UPC, GTIN, etc.)</label>
                  <input value={form.barcode} onChange={(e) => set("barcode", e.target.value)} className={INPUT} placeholder="—" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.sellWhenOutOfStock} onChange={(e) => set("sellWhenOutOfStock", e.target.checked)} className="rounded accent-[#C9A96E]" />
                <span className="text-sm text-gray-600">Continue selling when out of stock</span>
              </label>
            </div>
          </div>

          {/* Shipping */}
          <div className={CARD}>
            <button type="button" className={SECTION_BTN} onClick={() => toggle("shipping")}>
              Shipping {open.shipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {open.shipping && (
              <div className="mt-4 space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPhysical} onChange={(e) => set("isPhysical", e.target.checked)} className="rounded accent-[#C9A96E]" />
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Physical product</p>
                    <p className="text-xs text-gray-400">Naire Scents will ship this product to customers</p>
                  </div>
                </label>
                {form.isPhysical && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className={LABEL}>Weight</label>
                        <input type="number" min="0" step="0.01" value={form.weight} onChange={(e) => set("weight", e.target.value)} className={INPUT} placeholder="0.0" />
                      </div>
                      <div>
                        <label className={LABEL}>Unit</label>
                        <select value={form.weightUnit} onChange={(e) => set("weightUnit", e.target.value as "g" | "kg" | "lb" | "oz")} className={INPUT}>
                          {["g", "kg", "lb", "oz"].map((u) => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={LABEL}>Country/Region of origin</label>
                      <input value={form.countryOfOrigin} onChange={(e) => set("countryOfOrigin", e.target.value)} className={INPUT} placeholder="e.g. United Arab Emirates" />
                    </div>
                    <div>
                      <label className={LABEL}>HS (Harmonized System) code</label>
                      <input value={form.hsCode} onChange={(e) => set("hsCode", e.target.value)} className={INPUT} placeholder="e.g. 3303.00" />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Variants */}
          <div className={CARD}>
            <button type="button" className={SECTION_BTN} onClick={() => toggle("variants")}>
              Variants {open.variants ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {open.variants && (
              <div className="mt-4">
                <label className="flex items-center gap-2 cursor-pointer mb-4">
                  <input type="checkbox" checked={form.hasVariants} onChange={(e) => {
                    set("hasVariants", e.target.checked);
                    if (!e.target.checked) { set("options", []); set("variants", []); }
                  }} className="rounded accent-[#C9A96E]" />
                  <span className="text-sm text-gray-600">This product has options, like size or color</span>
                </label>
                {form.hasVariants && (
                  <VariantsEditor
                    options={form.options} variants={form.variants}
                    basePrice={Number(form.price) || 0}
                    onChange={(opts, vars) => { set("options", opts); set("variants", vars); }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Search engine listing */}
          <div className={CARD}>
            <button type="button" className={SECTION_BTN} onClick={() => toggle("seo")}>
              Search engine listing {open.seo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {open.seo && (
              <div className="mt-4 space-y-4">
                {/* Live preview */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                  <p className="text-[#8b4513] text-[10px] mb-1">Naire Scents</p>
                  <p className="text-[#1a0dab] font-medium text-sm">{form.seoTitle || form.title || "Product title"}</p>
                  <p className="text-[#006621] mt-0.5">https://nairescents.com › products › {form.handle || "product-handle"}</p>
                  {form.seoDescription && <p className="text-gray-600 mt-1 line-clamp-2">{form.seoDescription}</p>}
                </div>
                <div>
                  <label className={LABEL}>Page title</label>
                  <input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} className={INPUT} placeholder={form.title} />
                  <p className="text-xs text-gray-400 mt-1">{(form.seoTitle || form.title).length}/70 characters used</p>
                </div>
                <div>
                  <label className={LABEL}>Meta description</label>
                  <textarea value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} rows={3} className={INPUT + " resize-none"} />
                  <p className="text-xs text-gray-400 mt-1">{form.seoDescription.length}/320 characters used</p>
                </div>
                <div>
                  <label className={LABEL}>URL handle</label>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#C9A96E]/30 focus-within:border-[#C9A96E]">
                    <span className="px-3 py-2.5 bg-gray-50 border-r border-gray-200 text-xs text-gray-400 whitespace-nowrap">/products/</span>
                    <input value={form.handle} onChange={(e) => set("handle", slugify(e.target.value))} className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-white text-gray-800" placeholder="product-handle" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Status + Publishing */}
          <div className={CARD}>
            <p className="text-sm font-semibold text-gray-700 mb-3">Status</p>
            <select value={form.status} onChange={(e) => set("status", e.target.value as "Active" | "Draft")} className={INPUT}>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-600 mb-3">Publishing</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-700 font-medium">Online Store</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{form.publishedOnlineStore ? "Visible" : "Hidden"}</p>
                </div>
                <button type="button" onClick={() => set("publishedOnlineStore", !form.publishedOnlineStore)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${form.publishedOnlineStore ? "bg-[#0B3D33]" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.publishedOnlineStore ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-xs text-gray-700 font-medium">Shopify Catalog</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Synced</p>
                </div>
                <span className="text-[11px] text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
            </div>
          </div>

          {/* Product organization */}
          <div className={CARD}>
            <p className="text-sm font-semibold text-gray-700 mb-4">Product organization</p>
            <div className="space-y-3">
              <div>
                <label className={LABEL}>Type</label>
                <input value={form.productType} onChange={(e) => set("productType", e.target.value)} className={INPUT} placeholder="Eaux de Parfum" />
              </div>
              <div>
                <label className={LABEL}>Vendor</label>
                <input value={form.vendor} onChange={(e) => set("vendor", e.target.value)} className={INPUT} placeholder="Naire Scents" />
              </div>
              <div>
                <label className={LABEL}>Collections</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {["Best Seller", "New In", "Featured", "Sale", "Gift Sets"].map((c) => (
                    <button
                      key={c} type="button"
                      onClick={() => tagList.includes(c) ? removeTag(c) : addTag(c)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors font-medium ${
                        tagList.includes(c)
                          ? "bg-[#0B3D33] text-white border-[#0B3D33]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={LABEL}>Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tagList.map((t) => (
                    <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-lg text-xs text-gray-600">
                      {t}
                      <button type="button" onClick={() => removeTag(t)}><X className="w-2.5 h-2.5" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1">
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); } }}
                    placeholder="Add tag…" className={INPUT + " flex-1 py-2"} />
                  <button type="button" onClick={() => addTag(tagInput)} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-600 transition-colors">+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Fragrance details */}
          <div className={CARD}>
            <button type="button" className={SECTION_BTN} onClick={() => toggle("custom")}>
              Fragrance Details {open.custom ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {open.custom && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className={LABEL}>Brand</label>
                  <select value={form.brand} onChange={(e) => set("brand", e.target.value)} className={INPUT}>
                    <option value="">Select brand</option>
                    {["Lattafa", "French Avenue", "Fragrance World", "Ard Al Zaafaran", "Maison Alhambra"].map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Target gender</label>
                  <select value={form.gender} onChange={(e) => set("gender", e.target.value)} className={INPUT}>
                    <option value="">Unspecified</option>
                    <option value="Men">For Men</option>
                    <option value="Women">For Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Size</label>
                  <select value={form.size} onChange={(e) => set("size", e.target.value)} className={INPUT}>
                    <option value="">Select size</option>
                    {["30ml", "50ml", "60ml", "80ml", "100ml", "125ml", "200ml"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>When to Wear</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {WHEN_TO_WEAR_OPTIONS.map((w) => (
                      <button key={w} type="button" onClick={() => toggleWhenToWear(w)}
                        className={`text-xs px-2.5 py-1 rounded-xl border transition-colors ${form.whenToWear.includes(w) ? "bg-[#0B3D33] text-white border-[#0B3D33]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
