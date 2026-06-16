"use client";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed: "bg-red-100 text-red-700",
  Refunded: "bg-red-100 text-red-700",
  Fulfilled: "bg-blue-100 text-blue-700",
  Unfulfilled: "bg-gray-100 text-gray-500",
  Cancelled: "bg-red-100 text-red-500",
};

export default function AdminOrdersPage() {
  const orders = useQuery(api.orders.list);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const loading = orders === undefined;
  const list = orders ?? [];

  const filtered = list.filter((o) => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ||
      (filter === "paid" && o.paymentStatus === "Paid") ||
      (filter === "pending" && o.paymentStatus === "Pending") ||
      (filter === "unfulfilled" && o.fulfillmentStatus === "Unfulfilled") ||
      (filter === "fulfilled" && o.fulfillmentStatus === "Fulfilled");
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Orders</h1>
        <div className="text-sm text-gray-400">{list.length} total</div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 bg-white">
            <option value="all">All orders</option>
            <option value="pending">Payment pending</option>
            <option value="paid">Paid</option>
            <option value="unfulfilled">Unfulfilled</option>
            <option value="fulfilled">Fulfilled</option>
          </select>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-[#C9A96E] border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingCart className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">{search ? "No matching orders" : "No orders yet"}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Order</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Customer</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Payment</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Fulfillment</th>
                <th className="text-right px-4 py-3 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(o => (
                <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/dashboard/orders/${o._id}`} className="font-medium text-[#0B3D33] hover:underline">{o.orderNumber}</Link>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="text-gray-800">{o.customer.name}</p>
                    <p className="text-xs text-gray-400">{o.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                    {new Date(o._creationTime).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLORS[o.paymentStatus] ?? "bg-gray-100 text-gray-500"}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLORS[o.fulfillmentStatus] ?? "bg-gray-100 text-gray-500"}`}>
                      {o.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">KES {o.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
