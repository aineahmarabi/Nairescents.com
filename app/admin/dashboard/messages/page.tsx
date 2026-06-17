"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MessageSquare, Mail, Phone, Clock, MessageCircle, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/admin/ui/Skeleton";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-amber-100 text-amber-700",
  read: "bg-blue-100 text-blue-700",
  responded: "bg-emerald-100 text-emerald-700",
};

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminMessagesPage() {
  const messages = useQuery(api.messages.list);
  const setStatus = useMutation(api.messages.setStatus);
  const removeMessage = useMutation(api.messages.remove);
  const [selectedId, setSelectedId] = useState<Id<"contactSubmissions"> | null>(null);
  const [showDeleteId, setShowDeleteId] = useState<Id<"contactSubmissions"> | null>(null);

  const selected = messages?.find((m) => m._id === selectedId) ?? null;

  function handleSelect(id: Id<"contactSubmissions">, currentStatus: string) {
    setSelectedId(id);
    if (currentStatus === "new") setStatus({ id, status: "read" });
  }

  return (
    <div className="space-y-5">
      {showDeleteId && (() => {
        const msg = messages?.find(m => m._id === showDeleteId);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
              <h3 className="font-bold text-gray-900">Delete this message?</h3>
              <p className="text-sm text-gray-500">
                Message from <strong>{msg?.name}</strong> will be permanently deleted. This cannot be undone.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteId(null)}
                  className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await removeMessage({ id: showDeleteId });
                    if (selectedId === showDeleteId) setSelectedId(null);
                    setShowDeleteId(null);
                  }}
                  className="flex-1 py-2.5 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Messages</h1>
        <div className="text-sm text-gray-400">{messages?.length ?? 0} total</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5">
        {/* List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {messages === undefined ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-4 py-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-32 mb-1.5" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="py-16 text-center">
              <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No messages yet</p>
              <p className="text-sm text-gray-400 mt-1">Submissions from the Contact page will appear here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 max-h-[70vh] overflow-y-auto">
              {messages.map((m) => (
                <li key={m._id}>
                  <button
                    onClick={() => handleSelect(m._id, m.status)}
                    className={`w-full text-left px-4 py-3.5 transition-colors hover:bg-gray-50 ${
                      selectedId === m._id ? "bg-[#C9A96E]/10" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-semibold text-gray-800 ${m.status === "new" ? "" : ""}`}>{m.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[m.status]}`}>
                        {m.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mb-1">{m.email}</p>
                    <p className="text-xs text-gray-500 truncate">{m.comment}</p>
                    <p className="text-[10px] text-gray-300 mt-1">{formatDate(m._creationTime)}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {!selected ? (
            <div className="py-16 text-center text-gray-400">
              <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p>Select a message to view it</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[selected.status]}`}>
                  {selected.status}
                </span>
              </div>

              <div className="space-y-1.5 text-sm text-gray-500">
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-300" /> {selected.email}</p>
                {selected.phone && (
                  <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-300" /> {selected.phone}</p>
                )}
                <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-gray-300" /> {formatDate(selected._creationTime)}</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.comment}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowDeleteId(selected._id)}
                  className="px-4 py-2 text-sm font-medium border border-red-100 rounded-xl text-red-400 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setStatus({ id: selected._id, status: "read" })}
                  disabled={selected.status === "read"}
                  className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
                >
                  Mark as read
                </button>
                <button
                  onClick={() => setStatus({ id: selected._id, status: "responded" })}
                  disabled={selected.status === "responded"}
                  className="px-4 py-2 text-sm font-semibold bg-[#0B3D33] text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-40"
                >
                  Mark as responded
                </button>
                <div className="flex items-center gap-2 ml-auto">
                  {selected.phone && (
                    <a
                      href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${selected.name}, thanks for reaching out to Naire Scents!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-emerald-300 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Reply on WhatsApp
                    </a>
                  )}
                  <a
                    href={`mailto:${selected.email}`}
                    className="px-4 py-2 text-sm font-medium border border-[#C9A96E]/50 text-[#C9A96E] rounded-xl hover:bg-[#C9A96E]/10 transition-colors"
                  >
                    Reply by email
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
