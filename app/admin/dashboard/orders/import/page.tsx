"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { parseOrdersCsv, ImportOrder } from "@/lib/csv";
import { Upload, CheckCircle2, AlertCircle, ArrowLeft, FileText, ShoppingCart } from "lucide-react";
import Link from "next/link";

type Step = "upload" | "preview" | "done";

export default function ImportOrdersPage() {
  const router = useRouter();
  const bulkImport = useMutation(api.orders.bulkImport);
  const inputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [parsed, setParsed] = useState<ImportOrder[]>([]);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<{ created: number; errors: string[] }>({ created: 0, errors: [] });

  function handleFile(file: File) {
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const orders = parseOrdersCsv(text);
        if (orders.length === 0) {
          setError("No orders found in file. Ensure it is a Shopify orders CSV export.");
          return;
        }
        setParsed(orders);
        setStep("preview");
      } catch (err) {
        setError("Failed to parse CSV. Make sure it is a valid Shopify orders export.");
        console.error(err);
      }
    };
    reader.readAsText(file, "utf-8");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith(".csv")) handleFile(file);
    else setError("Please drop a .csv file.");
  }

  async function handleImport() {
    setImporting(true);
    const errors: string[] = [];
    let created = 0;

    const BATCH = 20;
    for (let i = 0; i < parsed.length; i += BATCH) {
      const batch = parsed.slice(i, i + BATCH).map((o) => ({
        ...o,
        items: o.items.map((item) => ({ ...item, productId: "imported" })),
      }));
      try {
        const res = await bulkImport({ orders: batch });
        created += res.created;
        errors.push(...res.errors);
      } catch (err) {
        errors.push(`Batch ${Math.floor(i / BATCH) + 1}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    setResults({ created, errors });
    setStep("done");
    setImporting(false);
  }

  if (step === "done") return (
    <div className="max-w-xl mx-auto pt-16 text-center">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-8 h-8 text-green-500" />
      </div>
      <h1 className="text-xl font-bold text-gray-800 mb-2">Import complete</h1>
      <p className="text-gray-500 text-sm mb-6">{results.created} order{results.created !== 1 ? "s" : ""} imported successfully.</p>
      {results.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left mb-6">
          <p className="text-red-600 font-semibold text-sm mb-2">{results.errors.length} error{results.errors.length !== 1 ? "s" : ""}:</p>
          {results.errors.map((e, i) => <p key={i} className="text-red-500 text-xs">{e}</p>)}
        </div>
      )}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => { setParsed([]); setResults({ created: 0, errors: [] }); setStep("upload"); }}
          className="px-5 py-2.5 text-sm font-medium border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Import more
        </button>
        <button
          onClick={() => router.push("/admin/dashboard/orders")}
          className="px-5 py-2.5 text-sm font-semibold bg-[#0B3D33] text-white rounded-xl hover:opacity-90 transition-all"
        >
          View orders
        </button>
      </div>
    </div>
  );

  if (step === "preview") return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3">
        <button onClick={() => setStep("upload")} className="p-2 rounded-xl text-gray-500 hover:bg-white hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Preview — {parsed.length} orders found</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Order #</th>
              <th className="text-left px-4 py-3 font-semibold">Customer</th>
              <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Items</th>
              <th className="text-left px-4 py-3 font-semibold">Payment</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Fulfillment</th>
              <th className="text-right px-4 py-3 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {parsed.slice(0, 50).map((o, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-[#0B3D33]">{o.orderNumber}</td>
                <td className="px-4 py-3">
                  <p className="text-gray-800 font-medium">{o.customer.name}</p>
                  <p className="text-xs text-gray-400">{o.customer.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    o.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-700" :
                    o.paymentStatus === "Refunded" ? "bg-red-100 text-red-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>{o.paymentStatus}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    o.fulfillmentStatus === "Fulfilled" ? "bg-blue-100 text-blue-700" :
                    o.fulfillmentStatus === "Cancelled" ? "bg-red-100 text-red-500" :
                    "bg-gray-100 text-gray-600"
                  }`}>{o.fulfillmentStatus}</span>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-800">KES {o.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {parsed.length > 50 && (
          <p className="px-4 py-3 text-xs text-gray-400 border-t border-gray-50">
            Showing first 50 of {parsed.length} orders. All will be imported.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Importing {parsed.length} orders — stock levels will NOT be adjusted (historical import only).
        </p>
        <button
          onClick={handleImport}
          disabled={importing}
          className="inline-flex items-center gap-2 bg-[#0B3D33] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {importing ? (
            <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Importing…</>
          ) : (
            <>Import {parsed.length} orders</>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/dashboard/orders" className="p-2 rounded-xl text-gray-500 hover:bg-white hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Import orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Upload a Shopify orders CSV export</p>
        </div>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-14 text-center cursor-pointer hover:border-[#C9A96E]/50 hover:bg-[#C9A96E]/5 transition-colors"
      >
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 font-medium mb-1">Drop your CSV here or click to browse</p>
        <p className="text-sm text-gray-400">Shopify orders export format (.csv)</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3 text-sm text-gray-500">
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <FileText className="w-4 h-4" /> What gets imported
        </div>
        <ul className="space-y-1.5 pl-6 list-disc">
          <li>Order number, customer name, email, phone</li>
          <li>Line items (name, quantity, price)</li>
          <li>Subtotal, shipping fee, total</li>
          <li>Payment status (paid/pending/refunded) and fulfillment status</li>
          <li>Shipping method / zone name and address</li>
          <li>Notes</li>
        </ul>
        <p className="text-amber-600 font-medium">Stock levels are NOT decremented — imported orders are treated as historical records only.</p>
      </div>
    </div>
  );
}
