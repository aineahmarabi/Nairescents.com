"use client";
import { useEffect, useState } from "react";
import { getCustomers } from "@/lib/admin-api";
import type { Customer } from "@/lib/types";
import { Search, Users } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomers().then(setCustomers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Customers</h1>
        <div className="text-sm text-gray-400">{customers.length} total</div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30" />
          </div>
        </div>
        {loading ? (
          <div className="py-16 flex items-center justify-center"><div className="w-5 h-5 rounded-full border-2 border-[#C9A96E] border-t-transparent animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">{search ? "No matching customers" : "No customers yet"}</p>
            <p className="text-gray-400 text-sm mt-1">Customers appear here when orders are placed.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Customer</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Location</th>
                <th className="text-right px-4 py-3 font-semibold hidden sm:table-cell">Orders</th>
                <th className="text-right px-4 py-3 font-semibold">Total spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                    <p className="text-xs text-gray-400">{c.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{c.location || "—"}</td>
                  <td className="px-4 py-3 text-right text-gray-700 hidden sm:table-cell">{c.orders}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">KES {c.totalSpent.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
