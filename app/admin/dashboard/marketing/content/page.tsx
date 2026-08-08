"use client";
import { useRef, useState } from "react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trash2, Save, Upload, Loader2 } from "lucide-react";

export default function ContentPage() {
  const featured = useQuery(api.hero.getBySlot, { slot: "featured" });
  const upsert = useMutation(api.hero.upsert);
  const generateUploadUrl = useMutation(api.hero.generateUploadUrl);
  const convex = useConvex();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localImages, setLocalImages] = useState<string[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const baseImages = featured?.rotationImages ?? [];
  const images = localImages ?? baseImages;

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const next = [...images];
    for (const file of Array.from(files)) {
      if (!/^image\/(jpeg|jpg|png|webp)$/.test(file.type)) continue;
      try {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await res.json();
        const url = await convex.query(api.hero.getStorageUrl, { storageId });
        if (url) next.push(url);
      } catch (e) {
        console.error("Upload failed", e);
      }
    }
    setLocalImages(next);
    setUploading(false);
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

        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); uploadFiles(e.dataTransfer.files); }}
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#C9A96E]/50 hover:bg-[#C9A96E]/5 transition-colors mb-5"
        >
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => uploadFiles(e.target.files)} />
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Uploading…</span>
            </div>
          ) : (
            <>
              <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-500">Drop media to upload</p>
              <p className="text-xs text-gray-300 mt-1">or click to select files — JPG, PNG, WEBP</p>
            </>
          )}
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
