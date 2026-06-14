"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, User, LogOut } from "lucide-react";
import { useAuth } from "./AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Tab = "login" | "signup";

export default function AuthModal({ open, onClose }: Props) {
  const { user, login, signup, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function reset() { setName(""); setEmail(""); setPassword(""); setConfirm(""); setError(""); setShowPw(false); }
  function switchTab(t: Tab) { setTab(t); reset(); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (tab === "signup" && password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      if (tab === "login") { await login(email, password); }
      else { await signup(name, email, password); }
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
    setLoading(false);
  }

  function handleLogout() { logout(); onClose(); }

  const inputClass = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#C9A96E] transition-colors";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
          >
            <div className="rounded-2xl border border-white/10 p-8 shadow-2xl" style={{ background: "linear-gradient(135deg, #0B3D33 0%, #081f1a 100%)" }}>
              {/* Close */}
              <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>

              {/* Logged in state */}
              {user ? (
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/30 flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#C9A96E] text-xl font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <p className="text-white font-semibold text-lg">{user.name}</p>
                  <p className="text-white/40 text-sm mt-0.5">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="mt-6 w-full flex items-center justify-center gap-2 py-3 border border-white/15 text-white/60 hover:text-white hover:border-white/30 rounded-xl text-sm font-medium transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              ) : (
                <>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center mx-auto mb-5">
                    <User className="w-5 h-5 text-[#C9A96E]" />
                  </div>

                  {/* Tabs */}
                  <div className="flex rounded-xl bg-white/5 p-1 mb-6">
                    {(["login", "signup"] as Tab[]).map(t => (
                      <button key={t} onClick={() => switchTab(t)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-[#C9A96E] text-[#0B3D33]" : "text-white/40 hover:text-white/70"}`}>
                        {t === "login" ? "Sign in" : "Create account"}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {tab === "signup" && (
                      <input value={name} onChange={e => setName(e.target.value)} required placeholder="Full name" className={inputClass} />
                    )}
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email address" className={inputClass} />
                    <div className="relative">
                      <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password" className={inputClass + " pr-10"} />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {tab === "signup" && (
                      <input type={showPw ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Confirm password" className={inputClass} />
                    )}

                    {error && <p className="text-red-400 text-xs pt-1">{error}</p>}

                    <button type="submit" disabled={loading}
                      className="w-full py-3 bg-[#C9A96E] text-[#0B3D33] rounded-xl font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 mt-1">
                      {loading ? "Please wait…" : tab === "login" ? "Sign in" : "Create account"}
                    </button>
                  </form>

                  <p className="text-center text-white/20 text-xs mt-5">
                    {tab === "login" ? "New here? " : "Already have an account? "}
                    <button onClick={() => switchTab(tab === "login" ? "signup" : "login")} className="text-[#C9A96E] hover:underline">
                      {tab === "login" ? "Create an account" : "Sign in"}
                    </button>
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
