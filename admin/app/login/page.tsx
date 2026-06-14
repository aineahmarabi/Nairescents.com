"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 400));
    if (login(email, password)) {
      router.replace("/dashboard");
    } else {
      setError("Invalid email or password.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0B3D33 0%, #081f1a 100%)" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 mb-4">
            <span className="text-[#C9A96E] text-2xl font-bold" style={{ fontFamily: "Jost, sans-serif" }}>N</span>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: "Jost, sans-serif" }}>Naire Scents</h1>
          <p className="text-white/40 text-sm mt-1">Admin Dashboard</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-white font-semibold text-lg mb-6" style={{ fontFamily: "Jost, sans-serif" }}>Sign in</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@nairescents.com"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A96E] transition-colors"
                style={{ fontFamily: "Jost, sans-serif" }}
              />
            </div>
            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A96E] transition-colors pr-10"
                  style={{ fontFamily: "Jost, sans-serif" }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400/80 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#C9A96E] text-[#0B3D33] rounded-xl font-semibold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 mt-2"
              style={{ fontFamily: "Jost, sans-serif" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Naire Scents Admin — Authorized access only
        </p>
      </div>
    </div>
  );
}
