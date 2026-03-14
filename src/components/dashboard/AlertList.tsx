import { LucideAlertTriangle } from "lucide-react";
import Link from "next/link";
import { Product } from "@prisma/client";

export default function AlertList({ alerts }: { alerts: Product[] }) {
  if (alerts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1 lg:col-span-2">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <LucideAlertTriangle className="text-amber-500 w-5 h-5" /> Stok Uyarıları
        </h2>
        <div className="text-slate-500 text-center py-8">
          Harika! Şu an kritik veya uyarı seviyesinde olan hiçbir ürününüz yok.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <LucideAlertTriangle className="text-amber-500 w-5 h-5" /> Stok Uyarıları
        </h2>
        <Link href="/stok" className="text-sm text-indigo-500 font-medium hover:text-indigo-600 transition-colors">
          Tümünü Gör
        </Link>
      </div>

      <div className="space-y-4">
        {alerts.slice(0, 5).map((product) => {
          const isCritical = product.currentStock <= product.criticalLevel;
          const statusColors = isCritical 
            ? "bg-red-50 border-red-100 text-red-700" 
            : "bg-amber-50 border-amber-100 text-amber-700";
            
          const badgeClass = isCritical
            ? "bg-red-100 text-red-700"
            : "bg-amber-100 text-amber-700";

          return (
            <div key={product.id} className={`flex items-center justify-between p-4 rounded-xl border ${statusColors} transition-all hover:shadow-sm`}>
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm opacity-80">Barkod: {product.barcode}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-bold uppercase rounded-md ${badgeClass} mb-1 inline-block`}>
                    {isCritical ? "Kritik" : "Uyarı"}
                  </span>
                  <div className="font-bold text-lg">
                    {product.currentStock} <span className="text-sm font-normal opacity-70">{product.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
