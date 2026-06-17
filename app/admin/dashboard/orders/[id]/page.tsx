"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/admin/ui/Skeleton";

const PAYMENT_STATUSES = ["Pending", "Paid", "Failed", "Refunded"] as const;
const FULFILLMENT_STATUSES = ["Unfulfilled", "Fulfilled", "Cancelled"] as const;
const STATUS_COLORS: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed: "bg-red-100 text-red-700",
  Refunded: "bg-red-100 text-red-700",
  Fulfilled: "bg-blue-100 text-blue-700",
  Unfulfilled: "bg-gray-100 text-gray-600",
  Cancelled: "bg-red-100 text-red-500",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const order = useQuery(api.orders.get, { id: id as Id<"orders"> });
  const updateStatus = useMutation(api.orders.updateStatus);
  const removeOrder = useMutation(api.orders.remove);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();

  async function saveStatus(field: "paymentStatus" | "fulfillmentStatus", val: string) {
    if (!order) return;
    setSaving(true);
    await updateStatus({ id: order._id, [field]: val } as never).catch(() => {});
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (field === "fulfillmentStatus" && val === "Fulfilled") {
      fetch("/api/notify/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: String(order._id), trigger: "fulfilled" }),
      }).catch(() => {});
    }
  }

  if (order === undefined) return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </div>
    </div>
  );
  if (!order) return <div className="text-center py-20"><p className="text-gray-500">Order not found.</p><Link href="/admin/dashboard/orders" className="text-[#C9A96E] text-sm hover:underline mt-2 inline-block">← Back</Link></div>;

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3 flex-wrap">
        <Link href="/admin/dashboard/orders" className="p-2 rounded-xl text-gray-500 hover:bg-white hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">{order.orderNumber}</h1>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.paymentStatus]}`}>{order.paymentStatus}</span>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.fulfillmentStatus]}`}>{order.fulfillmentStatus}</span>
        {order.paymentMethod && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{order.paymentMethod}</span>}
        {saved && <span className="text-xs text-emerald-600 font-medium ml-auto">Saved!</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Items</h2>
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity} × KES {item.price.toLocaleString()}</p>
                </div>
                <p className="font-semibold text-gray-800">KES {(item.quantity * item.price).toLocaleString()}</p>
              </div>
            ))}
            <div className="pt-3 space-y-1.5 border-t border-gray-100 mt-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>KES {order.subtotal.toLocaleString()}</span>
              </div>
              {(() => {
                const fee = order.shippingFee ?? (order.total - order.subtotal);
                const zoneName = order.shippingZoneName;
                return (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping{zoneName ? ` — ${zoneName.split(",")[0]}` : ""}</span>
                    <span>{fee === 0 ? "FREE" : `KES ${fee.toLocaleString()}`}</span>
                  </div>
                );
              })()}
              <div className="flex justify-between font-semibold text-gray-900 pt-1.5 border-t border-gray-100">
                <span>Total</span>
                <span>KES {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-3">Customer</h2>
            <p className="font-medium text-gray-800">{order.customer.name}</p>
            <p className="text-sm text-gray-500">{order.customer.email}</p>
            <p className="text-sm text-gray-500">{order.customer.phone}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Shipping address</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{order.shippingAddress}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Payment status</h3>
            <select value={order.paymentStatus} onChange={e => saveStatus("paymentStatus", e.target.value)} disabled={saving}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 bg-white">
              {PAYMENT_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Fulfillment status</h3>
            <select value={order.fulfillmentStatus} onChange={e => saveStatus("fulfillmentStatus", e.target.value)} disabled={saving}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 bg-white">
              {FULFILLMENT_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-xs text-gray-400 space-y-1">
            <p>Created: {new Date(order._creationTime).toLocaleString("en-GB")}</p>
            {order.paystackReference && <p>Reference: {order.paystackReference}</p>}
          </div>
          <button
            onClick={() => setShowDelete(true)}
            className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-600 hover:bg-red-50 py-2 px-4 rounded-xl border border-red-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete order
          </button>
        </div>
      </div>
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-bold text-gray-900">Delete {order.orderNumber}?</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              This permanently deletes this order. This cannot be undone. If you want to restore stock first, cancel the order before deleting it.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Keep order
              </button>
              <button
                onClick={async () => {
                  await removeOrder({ id: order._id });
                  router.push("/admin/dashboard/orders");
                }}
                className="flex-1 py-2.5 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
