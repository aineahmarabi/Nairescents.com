"use client";
import { useState } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import MetricCard from "@/components/admin/ui/MetricCard";
import SalesChart from "@/components/admin/charts/SalesChart";
import { Package, CheckCircle, Clock } from "lucide-react";

const DATE_RANGES = ["Today", "Yesterday", "Last 7 days", "Last 30 days", "This month"];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function AdminDashboardPage() {
  const { user } = useUser();
  const products = useQuery(api.products.list, {});
  const settings = useQuery(api.settings.getAll);
  const [range, setRange] = useState("Last 7 days");

  const storeName = settings?.storeName ?? "Naire Scents";
  const adminName = user?.firstName ?? user?.fullName ?? storeName;

  const totalProducts = products?.length ?? 0;
  const activeProducts = products?.filter((p) => p.status === "Active").length ?? 0;
  const lowStock = products?.filter((p) => p.inventory === 0 && p.trackInventory).length ?? 0;

  const loading = products === undefined;

  return (
    <div>
      {/* Greeting */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {greeting()}, {adminName}
          </h1>
          <p className="text-gray-400 text-sm mt-1">Here is what is happening in your store today.</p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] bg-white"
        >
          {DATE_RANGES.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Total Products"
          value={loading ? "—" : String(totalProducts)}
          sub={loading ? "" : `${activeProducts} active`}
          icon={<Package className="w-5 h-5" />}
          color="#C9A96E"
          sparkData={[0, 0, 0, 0, 0, 0, totalProducts]}
        />
        <MetricCard
          label="Active Listings"
          value={loading ? "—" : String(activeProducts)}
          sub="Online store"
          icon={<CheckCircle className="w-5 h-5" />}
          color="#22c55e"
          sparkData={[0, 0, 0, 0, 0, 0, activeProducts]}
        />
        <MetricCard
          label="Out of Stock"
          value={loading ? "—" : String(lowStock)}
          sub={lowStock > 0 ? "Needs attention" : "All good"}
          icon={<Clock className="w-5 h-5" />}
          color={lowStock > 0 ? "#ef4444" : "#6b7280"}
          sparkData={[0, 0, 0, 0, 0, 0, lowStock]}
        />
        <MetricCard
          label="Orders"
          value="—"
          sub="No data yet"
          icon={<Package className="w-5 h-5" />}
          color="#8b5cf6"
          sparkData={[0, 0, 0, 0, 0, 0, 0]}
        />
      </div>

      {/* Sales chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Revenue</p>
            <p className="text-3xl font-bold text-gray-800 mt-0.5">KES 0</p>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{range}</span>
        </div>
        <SalesChart data={[]} />
      </div>

      {/* Recent products */}
      {products && products.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="font-semibold text-gray-700">Recent Products</p>
            <a href="/admin/dashboard/products" className="text-xs text-[#C9A96E] hover:underline">View all</a>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Product", "Status", "Price", "Inventory"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.slice(0, 6).map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0].url} alt={p.title} className="w-8 h-8 rounded-lg object-cover bg-gray-100" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center"><Package className="w-3.5 h-3.5 text-gray-300" /></div>
                      )}
                      <span className="font-medium text-gray-800 truncate max-w-[180px]">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">KES {p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{p.trackInventory ? p.inventory : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
