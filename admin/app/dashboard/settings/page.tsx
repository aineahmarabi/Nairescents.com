"use client";
import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "@/lib/api";
import type { Settings } from "@/lib/types";
import { Save } from "lucide-react";

const defaultSettings: Settings = {
  storeName: "Naire Scents",
  address: "Stanbank House Shop A604, Wing A 6th floor, Nairobi, Kenya",
  phone: "+254758333996",
  whatsapp: "+254758333996",
  email: "nairescents@gmail.com",
  hours: "Monday – Saturday, 9 AM – 5 PM",
  social: { facebook: "", instagram: "", tiktok: "" },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function setField(key: keyof Settings, val: string) {
    setSettings(s => ({ ...s, [key]: val }));
  }

  function setSocial(key: keyof Settings['social'], val: string) {
    setSettings(s => ({ ...s, social: { ...s.social, [key]: val } }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      await updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save. Make sure the storefront is running.");
    }
    setSaving(false);
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] transition-colors bg-white";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-5 h-5 rounded-full border-2 border-[#C9A96E] border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        {saved && <span className="text-sm text-emerald-600 font-medium">Changes saved!</span>}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Store info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Store information</h2>
          <div>
            <label className={labelClass}>Store name</label>
            <input value={settings.storeName} onChange={e => setField('storeName', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <textarea value={settings.address} onChange={e => setField('address', e.target.value)} rows={2} className={inputClass + " resize-none"} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone</label>
              <input value={settings.phone} onChange={e => setField('phone', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>WhatsApp</label>
              <input value={settings.whatsapp} onChange={e => setField('whatsapp', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={settings.email} onChange={e => setField('email', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Business hours</label>
              <input value={settings.hours} onChange={e => setField('hours', e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Social media</h2>
          <div>
            <label className={labelClass}>Facebook URL</label>
            <input value={settings.social.facebook} onChange={e => setSocial('facebook', e.target.value)} className={inputClass} placeholder="https://facebook.com/…" />
          </div>
          <div>
            <label className={labelClass}>Instagram URL</label>
            <input value={settings.social.instagram} onChange={e => setSocial('instagram', e.target.value)} className={inputClass} placeholder="https://instagram.com/…" />
          </div>
          <div>
            <label className={labelClass}>TikTok URL</label>
            <input value={settings.social.tiktok} onChange={e => setSocial('tiktok', e.target.value)} className={inputClass} placeholder="https://tiktok.com/…" />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B3D33] text-white rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60">
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
