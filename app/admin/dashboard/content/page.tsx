"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trash2, Save, ImagePlus } from "lucide-react";

const INPUT = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] transition-colors bg-white text-gray-800 placeholder-gray-300";

export default function ContentPage() {
  const featured = useQuery(api.hero.getBySlot, { slot: "featured" });
  const upsert = useMutation(api.hero.upsert);

  const [localImages, setLocalImages] = useState<string[] | null>(null);
  const [newUrl, setNewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const baseImages = featured?.rotationImages ?? [];
  const images = localImages ?? baseImages;

  function addImage() {
    const url = newUrl.trim();
    if (!url) return;
    setLocalImages([...images, url]);
    setNewUrl("");
  }

  function removeImage(i: number) {
    setLocalImages(images.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true);
    await upsert({ slot: "featured", rotationImages: images });
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">Hero Content</h1>
        <p className="text-gray-400 text-sm mt-1">
          The featured left panel rotates through these images every 6 hours.
          The 4 door panels auto-fill from real product images by category.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm font-semibold text-gray-700 mb-4">Featured Panel — Rotation Images</p>

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {images.map((url, i) => (
              <div key={i} className="relative group aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-3 h-3" />
                </button>
                <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-md">
                  Slot {i + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
            placeholder="Paste image URL…" className={INPUT + " flex-1"} />
          <button type="button" onClick={addImage}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors whitespace-nowrap">
            <ImagePlus className="w-4 h-4" /> Add
          </button>
        </div>

        <p className="text-xs text-gray-400 mb-5">
          Each image displays for 6 hours before switching to the next. Changes take effect on the next 6-hour window.
        </p>

        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0B3D33] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50">
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : saved ? "Saved!" : "Save changes"}
        </button>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Door Panels (auto-wired from products)</p>
        <div className="space-y-0 divide-y divide-gray-100">
          {[
            { label: "For Him", rule: "First Active product with Gender = Men" },
            { label: "For Her", rule: "First Active product with Gender = Women" },
            { label: "Best Sellers", rule: "First Active product tagged \"Best Seller\"" },
            { label: "New In", rule: "First Active product tagged \"New In\"" },
          ].map((p) => (
            <div key={p.label} className="flex items-center gap-4 py-3">
              <span className="text-xs font-semibold text-gray-700 w-24 shrink-0">{p.label}</span>
              <span className="text-xs text-gray-500">{p.rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
