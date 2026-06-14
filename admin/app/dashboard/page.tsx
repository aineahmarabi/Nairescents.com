"use client";
import { useEffect, useState } from "react";
import { getProducts, getOrders, getCustomers } from "@/lib/api";
import type { Product, Order, Customer } from "@/lib/types";
import MetricCard from "@/components/ui/MetricCard";
import SalesChart from "@/components/charts/SalesChart";
import { Package, CheckCircle, Clock } from "lucide-react";

const DATE_RANGES = ["Today", "Yesterday", "Last 7 days", "Last 30 days", "This month"];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [range, setRange] = useState("Last 7 days");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getOrders(), getCustomers()])
      .then(([p, o, c]) => { setProducts(p); setOrders(o); setCustomers(c); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalSales = orders.filter(o => o.paymentStatus === 'Paid').reduce((s, o) => s + o.total, 0);
  const activeProducts = products.filter(p => p.status === 'Active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{greeting()}, Naire Scents 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here&apos;s what&apos;s happening in your store.</p>
        </div>
        <select
          value={range}
          onChange={e => setRange(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 bg-white"
        >
          {DATE_RANGES.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Sales" value={`KES ${totalSales.toLocaleString()}`} />
        <MetricCard label="Orders" value={String(orders.length)} />
        <MetricCard label="Customers" value={String(customers.length)} />
        <MetricCard label="Active Products" value={String(activeProducts)} />
      </div>

      {/* Main chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-800">Sales Overview</h2>
          <span className="text-xs text-gray-400">{range}</span>
        </div>
        <SalesChart data={[]} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Orders</h2>
            <a href="/dashboard/orders" className="text-xs text-[#C9A96E] hover:underline font-medium">View all</a>
          </div>
          {orders.length === 0 ? (
            <div className="py-10 text-center">
              <Clock className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map(o => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{o.orderNumber}</p>
                    <p className="text-xs text-gray-400">{o.customer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">KES {o.total.toLocaleString()}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      o.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                      o.paymentStatus === 'Refunded' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>{o.paymentStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Products</h2>
            <a href="/dashboard/products" className="text-xs text-[#C9A96E] hover:underline font-medium">View all</a>
          </div>
          {products.length === 0 ? (
            <div className="py-10 text-center">
              <Package className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No products yet</p>
              <a href="/dashboard/products/new" className="inline-block mt-2 text-xs text-[#C9A96E] hover:underline">Add your first product →</a>
            </div>
          ) : (
            <div className="space-y-3">
              {products.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <Package className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.brand}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-800">KES {p.price.toLocaleString()}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Onboarding tasks */}
      {products.length === 0 && orders.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-1">Get started with your store</h2>
          <p className="text-sm text-gray-500 mb-5">Complete these steps to launch Naire Scents.</p>
          <div className="space-y-3">
            {[
              { label: "Add your first product", href: "/dashboard/products/new", done: products.length > 0 },
              { label: "Configure store settings", href: "/dashboard/settings", done: false },
              { label: "Set up a discount code", href: "/dashboard/discounts/new", done: false },
              { label: "Customize your hero banner", href: "/dashboard/content", done: false },
            ].map(t => (
              <a key={t.label} href={t.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${t.done ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`}>
                  {t.done && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm ${t.done ? 'text-gray-400 line-through' : 'text-gray-700 group-hover:text-[#0B3D33]'}`}>{t.label}</span>
                {!t.done && <span className="ml-auto text-[#C9A96E] text-xs font-medium">Start →</span>}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
