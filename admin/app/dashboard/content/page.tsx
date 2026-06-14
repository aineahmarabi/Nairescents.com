"use client";
import { useEffect, useState } from "react";
import { getHero, updateHero } from "@/lib/api";
import type { HeroPanel } from "@/lib/types";
import { Save, GripVertical } from "lucide-react";

export default function ContentPage() {
  const [panels, setPanels] = useState<HeroPanel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getHero().then(setPanels).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function updatePanel(idx: number, key: keyof HeroPanel, val: string) {
    setPanels(p => p.map((panel, i) => i === idx ? { ...panel, [key]: val } : panel));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      await updateHero(panels);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save. Make sure the storefront is running on port 3000.");
    }
    setSaving(false);
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] transition-colors bg-white";
  const labelClass = "block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1";

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-5 h-5 rounded-full border-2 border-[#C9A96E] border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Content</h1>
          <p className="text-sm text-gray-400 mt-0.5">Edit the hero panels shown on the storefront homepage.</p>
        </div>
        {saved && <span className="text-sm text-emerald-600 font-medium">Saved!</span>}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {panels.map((panel, idx) => (
          <div key={panel.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
              <div className="w-4 h-4 rounded shrink-0" style={{ background: panel.bg.includes('gradient') ? '#0B3D33' : panel.bg }} />
              <span className="font-semibold text-gray-800 text-sm">Panel {idx + 1}: {panel.label}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Label (e.g. SHOP)</label>
                <input value={panel.label} onChange={e => updatePanel(idx, 'label', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Name (large heading)</label>
                <input value={panel.name} onChange={e => updatePanel(idx, 'name', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Subtitle</label>
                <input value={panel.sub} onChange={e => updatePanel(idx, 'sub', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Link (href)</label>
                <input value={panel.href} onChange={e => updatePanel(idx, 'href', e.target.value)} className={inputClass} placeholder="/gender/men" />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Image URL (optional)</label>
                <input value={panel.image} onChange={e => updatePanel(idx, 'image', e.target.value)} className={inputClass} placeholder="https://…" />
              </div>
            </div>
          </div>
        ))}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B3D33] text-white rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60">
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save hero panels"}
        </button>
      </form>
    </div>
  );
}
