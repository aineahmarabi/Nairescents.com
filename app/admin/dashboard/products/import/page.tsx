"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { parseCsv, ImportProduct } from "@/lib/csv";
import { Upload, CheckCircle2, AlertCircle, ArrowLeft, FileText } from "lucide-react";

type Step = "upload" | "preview" | "done";

export default function ImportPage() {
  const router = useRouter();
  const bulkCreate = useMutation(api.products.bulkCreate);
  const inputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [parsed, setParsed] = useState<ImportProduct[]>([]);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<{ created: number; errors: string[] }>({ created: 0, errors: [] });

  function handleFile(file: File) {
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const products = parseCsv(text);
        if (products.length === 0) { setError("No products found in file. Ensure it follows Shopify CSV format."); return; }
        setParsed(products);
        setStep("preview");
      } catch (err) {
        setError("Failed to parse CSV. Make sure it's a valid Shopify export format.");
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

    const BATCH = 10;
    for (let i = 0; i < parsed.length; i += BATCH) {
      const batch = parsed.slice(i, i + BATCH);
      try {
        await bulkCreate({ products: batch });
        created += batch.length;
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
      <p className="text-gray-500 text-sm mb-6">{results.created} product{results.created !== 1 ? "s" : ""} imported successfully.</p>
      {results.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left mb-6">
          <p className="text-red-600 font-semibold text-sm mb-2">{results.errors.length} error{results.errors.length !== 1 ? "s" : ""}:</p>
          {results.errors.map((e, i) => <p key={i} className="text-red-500 text-xs">{e}</p>)}
        </div>
      )}
      <button onClick={() => router.push("/admin/dashboard/products")}
        className="px-6 py-2.5 bg-[#0B3D33] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
        Back to Products
      </button>
    </div>
  );

  if (step === "preview") return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep("upload")} className="text-gray-400 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Preview import</h1>
            <p className="text-gray-400 text-sm">{parsed.length} product{parsed.length !== 1 ? "s" : ""} ready to import</p>
          </div>
        </div>
        <button onClick={handleImport} disabled={importing}
          className="px-6 py-2.5 bg-[#0B3D33] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50">
          {importing ? "Importing…" : `Import ${parsed.length} product${parsed.length !== 1 ? "s" : ""}`}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Title", "Vendor", "Price", "Inventory", "Status", "Gender", "Images"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {parsed.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800 truncate max-w-[180px]">{p.title}</p>
                  <p className="text-xs text-gray-400 truncate max-w-[180px]">{p.handle}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.vendor}</td>
                <td className="px-4 py-3 text-gray-700">KES {p.price.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-700">{p.inventory}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.gender ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500">{p.images.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.push("/admin/dashboard/products")} className="text-gray-400 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Import products</h1>
          <p className="text-gray-400 text-sm">Upload a Shopify-format CSV file</p>
        </div>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center cursor-pointer hover:border-[#C9A96E]/50 hover:bg-[#C9A96E]/5 transition-colors"
      >
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Upload className="w-6 h-6 text-gray-400" />
        </div>
        <p className="font-semibold text-gray-700 mb-1">Drop your CSV here</p>
        <p className="text-sm text-gray-400">or click to browse — Shopify export format supported</p>
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>

      {error && (
        <div className="flex items-start gap-2 mt-4 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="mt-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-gray-400" />
          <p className="text-sm font-semibold text-gray-600">Expected columns</p>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Handle, Title, Body (HTML), Vendor, Type, Tags, Published, Option1 Name, Option1 Value,
          Option2 Name, Option2 Value, Variant SKU, Variant Price, Variant Compare At Price,
          Variant Inventory Qty, Image Src, Image Alt Text, SEO Title, SEO Description, Status,
          Brand, Gender, When to Wear, Size
        </p>
      </div>
    </div>
  );
}
