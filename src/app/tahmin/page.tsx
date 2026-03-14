import { db } from "@/lib/db";
import { calculateForecast } from "@/lib/forecast";
import ForecastChart from "@/components/forecast/ForecastChart";
import ForecastTable from "@/components/forecast/ForecastTable";
import { BrainCircuit, RefreshCw, CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ForecastPage() {
  // Demo amaçlı, veritabanındaki tüm satışları çekip en çok satanı alacağız
  // Gerçekte burada ProductSelector ile tek ürün bazlı gösterim gerekir.
  
  const topProduct = await db.product.findFirst({
    include: { sales: true },
    orderBy: { sales: { _count: "desc" } }
  });

  if (!topProduct) {
    return (
      <div className="p-8 text-center text-slate-500">
        Yeterli veri bulunamadı. Lütfen önce satış ekleyin.
      </div>
    );
  }

  // Get past sales by week to mock "actual" data for the chart
  const pastWeeks = 5;
  const actualDataDemo = Array.from({ length: pastWeeks }).map((_, i) => ({
    week: `Geçmiş ${pastWeeks - i}.Hafta`,
    actual: Math.floor(Math.random() * 50) + 10 // Mock actual data directly for the UI representation
  }));

  // Run the algorithm on the real sales data
  const forecastResults = calculateForecast(topProduct.sales, 3);
  
  const predictedDataChart = forecastResults.map(f => ({
    week: `Gelecek ${f.week}.Hafta`,
    predicted: f.predicted
  }));

  // Combine them for the chart
  const chartData = [...actualDataDemo, ...predictedDataChart];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1 flex items-center gap-3">
            Satış Tahminleri <BrainCircuit className="w-8 h-8 text-fuchsia-500" />
          </h1>
          <p className="text-slate-500 font-medium">
             Yapay zeka ve istatistiksel modellerle gelecek talepleri öngörün.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 shadow-sm transition-all">
            <CalendarDays className="w-4 h-4 text-slate-500" /> Son 30 Gün
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-transparent text-white rounded-xl font-medium hover:bg-slate-800 shadow-md transition-all">
            <RefreshCw className="w-4 h-4" /> Modeli Yeniden Eğit
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-fuchsia-50 to-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-indigo-900 mb-1 uppercase tracking-wider">Aktif Ürün</h2>
          <p className="text-xl font-bold text-slate-900">{topProduct.name} <span className="text-sm font-normal text-slate-500">({topProduct.barcode})</span></p>
        </div>
        <div className="text-right hidden sm:block">
          <h2 className="text-sm font-bold text-indigo-900 mb-1 uppercase tracking-wider">Kullanılan Algoritma</h2>
          <p className="font-medium text-slate-700">Ağırlıklı Hareketli Ortalama (WMA)</p>
        </div>
      </div>

      <ForecastChart data={chartData} />
      
      <div className="mt-8">
        <ForecastTable data={forecastResults} />
      </div>
    </div>
  );
}
