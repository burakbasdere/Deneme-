import { db } from "@/lib/db";
import StockTable from "@/components/stock/StockTable";
import { Plus, Filter, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StockPage() {
  const products = await db.product.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
            Stok Yönetimi
          </h1>
          <p className="text-slate-500 font-medium">
             Tüm ürünlerinizin detaylı güncel stok durumları
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
            <Filter className="w-4 h-4" /> Filtrele
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Dışa Aktar
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 border border-transparent text-white rounded-xl font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
            <Plus className="w-5 h-5" /> Yeni Ürün
          </button>
        </div>
      </div>

      <StockTable products={products} />
    </div>
  );
}
