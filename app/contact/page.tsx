"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/ui/BackButton";

const ease = [0.16, 1, 0.3, 1] as const;

const INPUT =
  "w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors";

interface FormState {
  name: string;
  email: string;
  phone: string;
  comment: string;
}

export default function ContactPage() {
  const submitMessage = useMutation(api.messages.create);
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", comment: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.comment) return;
    setSending(true);
    try {
      await submitMessage({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        comment: form.comment,
      });
      setSent(true);
      setForm({ name: "", email: "", phone: "", comment: "" });
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <BackButton />
          <h1 className="text-white text-4xl sm:text-5xl font-bold tracking-tight text-center mb-12">
            Contact
          </h1>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease }}
                className="text-center py-12 border border-[#C9A96E]/30 rounded-2xl"
              >
                <div className="w-14 h-14 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/40 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-[#C9A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white text-lg font-semibold mb-2">
                  Thanks — we&apos;ve received your message.
                </p>
                <p className="text-white/50 text-sm mb-6">We&apos;ll get back to you shortly.</p>
                <button
                  onClick={() => setSent(false)}
                  className="px-8 py-2.5 border border-[#C9A96E]/50 text-[#C9A96E] rounded-xl text-sm font-semibold tracking-widest uppercase hover:bg-[#C9A96E]/10 transition-all"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Your name"
                      className={INPUT}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="your@email.com"
                      className={INPUT}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+254 ..."
                    className={INPUT}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium">Comment</label>
                  <textarea
                    required
                    rows={6}
                    value={form.comment}
                    onChange={(e) => set("comment", e.target.value)}
                    placeholder="Write your message here..."
                    className={INPUT + " resize-none"}
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-12 py-3.5 border border-[#C9A96E] text-[#C9A96E] rounded-xl text-sm font-semibold tracking-widest uppercase
                      hover:bg-[#C9A96E]/10 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {sending ? "Sending…" : "Send message"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
