"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowLeft, Search, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/admin/ui/Skeleton";

type CartLine = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

const PAYMENT_OPTIONS = [
  { value: "Manual", label: "Cash (in-store)" },
  { value: "Manual-pending", label: "Pending payment" },
] as const;

export default function NewOrderPage() {
  const router = useRouter();
  const products = useQuery(api.products.list, { status: "Active" });
  const createOrder = useMutation(api.orders.create);

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [paid, setPaid] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const list = products ?? [];
    if (!search.trim()) return list.slice(0, 20);
    const q = search.toLowerCase();
    return list.filter((p) => p.title.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)).slice(0, 20);
  }, [products, search]);

  function addToCart(p: { _id: string; title: string; price: number; images: { url: string }[] }) {
    setCart((c) => {
      const existing = c.find((l) => l.productId === p._id);
      if (existing) {
        return c.map((l) => (l.productId === p._id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...c, { productId: p._id, title: p.title, price: p.price, quantity: 1, imageUrl: p.images[0]?.url }];
    });
  }

  function updateQty(productId: string, delta: number) {
    setCart((c) =>
      c
        .map((l) => (l.productId === productId ? { ...l, quantity: l.quantity + delta } : l))
        .filter((l) => l.quantity > 0)
    );
  }

  function removeLine(productId: string) {
    setCart((c) => c.filter((l) => l.productId !== productId));
  }

  const subtotal = cart.reduce((s, l) => s + l.price * l.quantity, 0);

  async function handleSubmit() {
    setError("");
    if (!name.trim()) { setError("Customer name is required."); return; }
    if (cart.length === 0) { setError("Add at least one item."); return; }

    setSubmitting(true);
    try {
      const orderId = await createOrder({
        customer: { name: name.trim(), email: email.trim() || "walkin@nairescents.com", phone: phone.trim() || undefined },
        items: cart.map((l) => ({
          productId: l.productId,
          title: l.title,
          quantity: l.quantity,
          price: l.price,
          imageUrl: l.imageUrl,
        })),
        subtotal,
        total: subtotal,
        paymentMethod: "Manual",
        paymentStatus: paid ? "Paid" : "Pending",
        notes: notes.trim() || undefined,
      });
      router.push(`/admin/dashboard/orders/${orderId}`);
    } catch {
      setError("Could not create order. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/dashboard/orders" className="p-2 rounded-xl text-gray-500 hover:bg-white hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Add order</h1>
        <span className="text-xs text-gray-400">Walk-in / DM order</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Product picker */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name or SKU…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30"
              />
            </div>
          </div>

          {products === undefined ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-100 p-3">
                  <Skeleton className="aspect-square mb-2" />
                  <Skeleton className="h-3 w-3/4 mb-1.5" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
              {filtered.map((p) => (
                <button
                  key={p._id}
                  onClick={() => addToCart(p)}
                  className="text-left rounded-xl border border-gray-100 hover:border-[#C9A96E]/50 hover:shadow-sm transition-all p-3 group"
                >
                  <div className="aspect-square rounded-lg bg-gray-50 mb-2 overflow-hidden flex items-center justify-center">
                    {p.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-800 truncate">{p.title}</p>
                  <p className="text-xs text-[#C9A96E] font-semibold">KES {p.price.toLocaleString()}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cart + customer */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Cart</h3>
            {cart.length === 0 ? (
              <p className="text-sm text-gray-400">No items added yet.</p>
            ) : (
              <div className="space-y-3">
                {cart.map((l) => (
                  <div key={l.productId} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{l.title}</p>
                      <p className="text-xs text-gray-400">KES {l.price.toLocaleString()} each</p>
                    </div>
                    <button onClick={() => updateQty(l.productId, -1)} className="p-1 rounded-lg border border-gray-200 hover:bg-gray-50">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-5 text-center">{l.quantity}</span>
                    <button onClick={() => updateQty(l.productId, 1)} className="p-1 rounded-lg border border-gray-200 hover:bg-gray-50">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeLine(l.productId)} className="p-1 rounded-lg text-red-400 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-100 flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h3 className="font-semibold text-gray-800">Customer</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer name *"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (e.g. picked up in-store, DM order via Instagram)"
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 resize-none"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h3 className="font-semibold text-gray-800">Payment</h3>
            <div className="flex gap-2">
              {PAYMENT_OPTIONS.map((opt) => {
                const isPaid = opt.value === "Manual";
                const selected = paid === isPaid;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setPaid(isPaid)}
                    className={`flex-1 text-xs font-medium px-3 py-2.5 rounded-xl border transition-colors ${
                      selected ? "border-[#C9A96E] bg-[#C9A96E]/10 text-[#0B3D33]" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-[#0B3D33] text-white font-semibold text-sm py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {submitting ? "Creating order…" : `Create order — KES ${subtotal.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
}
