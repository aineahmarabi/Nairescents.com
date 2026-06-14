"use client";
import { useEffect, useState } from "react";
import { getOrders, getProducts, getCustomers } from "@/lib/admin-api";
import type { Order, Product, Customer } from "@/lib/types";
import SalesChart from "@/components/admin/charts/SalesChart";
import { BarChart2, TrendingUp, Users, Package } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrders(), getProducts(), getCustomers()])
      .then(([o, p, c]) => { setOrders(o); setProducts(p); setCustomers(c); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const paidOrders = orders.filter(o => o.paymentStatus === "Paid");
  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const avgOrder = paidOrders.length ? Math.round(totalRevenue / paidOrders.length) : 0;

  const productSales: Record<string, { title: string; qty: number; revenue: number }> = {};
  for (const o of paidOrders) {
    for (const item of o.items) {
      if (!productSales[item.productId]) productSales[item.productId] = { title: item.title, qty: 0, revenue: 0 };
      productSales[item.productId].qty += item.quantity;
      productSales[item.productId].revenue += item.price * item.quantity;
    }
  }
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-5 h-5 rounded-full border-2 border-[#C9A96E] border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `KES ${totalRevenue.toLocaleString()}`, icon: TrendingUp },
          { label: "Orders", value: String(paidOrders.length), icon: BarChart2 },
          { label: "Avg. Order Value", value: `KES ${avgOrder.toLocaleString()}`, icon: TrendingUp },
          { label: "Customers", value: String(customers.length), icon: Users },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <m.icon className="w-5 h-5 text-[#C9A96E]/60 mb-3" />
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{m.label}</p>
            <p className="text-xl font-bold text-gray-900">{m.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-5">Sales over time</h2>
        <SalesChart data={[]} />
      </div>
      {topProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Top products by revenue</h2>
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="text-left py-2 font-semibold">Product</th>
                <th className="text-right py-2 font-semibold">Units sold</th>
                <th className="text-right py-2 font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topProducts.map((p, i) => (
                <tr key={i}>
                  <td className="py-2.5 text-gray-800 font-medium">{p.title}</td>
                  <td className="py-2.5 text-right text-gray-500">{p.qty}</td>
                  <td className="py-2.5 text-right font-semibold text-gray-800">KES {p.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {products.length === 0 && orders.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No data yet</p>
          <p className="text-sm text-gray-400 mt-1">Analytics will populate once you have orders.</p>
        </div>
      )}
    </div>
  );
}
