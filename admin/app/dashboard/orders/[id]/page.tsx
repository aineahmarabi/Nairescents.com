"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrder, updateOrder } from "@/lib/api";
import type { Order } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const PAYMENT_STATUSES = ['Pending', 'Paid', 'Refunded'] as const;
const FULFILLMENT_STATUSES = ['Unfulfilled', 'Fulfilled', 'Cancelled'] as const;

const STATUS_COLORS: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Refunded: "bg-red-100 text-red-700",
  Fulfilled: "bg-blue-100 text-blue-700",
  Unfulfilled: "bg-gray-100 text-gray-600",
  Cancelled: "bg-red-100 text-red-500",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getOrder(id).then(setOrder).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  async function saveStatus(field: 'paymentStatus' | 'fulfillmentStatus', val: string) {
    if (!order) return;
    setSaving(true);
    const updated = { ...order, [field]: val };
    setOrder(updated);
    await updateOrder(id, { [field]: val }).catch(() => {});
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-5 h-5 rounded-full border-2 border-[#C9A96E] border-t-transparent animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Order not found.</p>
      <Link href="/dashboard/orders" className="text-[#C9A96E] text-sm hover:underline mt-2 inline-block">← Back to orders</Link>
    </div>
  );

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/orders" className="p-2 rounded-xl text-gray-500 hover:bg-white hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">{order.orderNumber}</h1>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.paymentStatus]}`}>
          {order.paymentStatus}
        </span>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.fulfillmentStatus]}`}>
          {order.fulfillmentStatus}
        </span>
        {saved && <span className="text-xs text-emerald-600 font-medium ml-auto">Saved!</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="lg:col-span-2 space-y-4">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Items</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} × KES {item.price.toLocaleString()}</p>
                  </div>
                  <p className="font-semibold text-gray-800">KES {(item.quantity * item.price).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="pt-3 flex justify-between items-center font-semibold text-gray-900">
              <span>Total</span>
              <span>KES {order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-3">Customer</h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium text-gray-800">{order.customer.name}</p>
              <p className="text-gray-500">{order.customer.email}</p>
              <p className="text-gray-500">{order.customer.phone}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Shipping address</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{order.shippingAddress}</p>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-2">Notes</h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Payment status</h3>
            <select
              value={order.paymentStatus}
              onChange={e => saveStatus('paymentStatus', e.target.value)}
              disabled={saving}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 bg-white"
            >
              {PAYMENT_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Fulfillment status</h3>
            <select
              value={order.fulfillmentStatus}
              onChange={e => saveStatus('fulfillmentStatus', e.target.value)}
              disabled={saving}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 bg-white"
            >
              {FULFILLMENT_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-xs text-gray-400 space-y-1">
            <p>Created: {new Date(order.createdAt).toLocaleString('en-GB')}</p>
            <p>Updated: {new Date(order.updatedAt).toLocaleString('en-GB')}</p>
            <p className="font-mono break-all pt-1 text-gray-300">{order.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
