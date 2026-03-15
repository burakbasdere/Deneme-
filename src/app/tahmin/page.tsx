import { db } from "@/lib/db";
import { calculateForecast, generateMockTrendData } from "@/lib/forecast";
import ForecastChart from "@/components/forecast/ForecastChart";
import ForecastTable from "@/components/forecast/ForecastTable";
import { BrainCircuit, RefreshCw, CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ForecastPage() {
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

  // Modelin yeteneklerini sergilemek için 10 haftalık artış trendinde mock data üretiyoruz
  const pastWeeks = 10;
  const mockTrendSales = generateMockTrendData(pastWeeks, 20, 5); // 20'den başla, her hafta ort. 5 artış (trend)
  
  // Create actual UI data mapping from the mock raw data
  // Using the same algorithm logic to group it back for charting the "past"
  const actualDataDemo = [];
  let currentBase = 20;
  for (let i = 0; i < pastWeeks; i++) {
    actualDataDemo.push({
      week: `Geçmiş ${pastWeeks - i}.Hafta`,
      actual: Math.round(currentBase)
    });
    currentBase += 5;
  }

  // Run Holt-Winters algorithm on the mock trend data
  const forecastResults = calculateForecast(mockTrendSales, 3);
  
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
             Yapay zeka ve Holt-Winters modeli ile gelecek talepleri öngörün.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 shadow-sm transition-all">
            <CalendarDays className="w-4 h-4 text-slate-500" /> Detaylar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-transparent text-white rounded-xl font-medium hover:bg-slate-800 shadow-md transition-all">
            <RefreshCw className="w-4 h-4" /> Modeli Yeniden Eğit
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-fuchsia-50 to-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-indigo-900 mb-1 uppercase tracking-wider">Aktif Ürün (Örnek Trend Verisiyle)</h2>
          <p className="text-xl font-bold text-slate-900">{topProduct.name} <span className="text-sm font-normal text-slate-500">({topProduct.barcode})</span></p>
        </div>
        <div className="text-right hidden sm:block">
          <h2 className="text-sm font-bold text-indigo-900 mb-1 uppercase tracking-wider">Kullanılan Algoritma</h2>
          <p className="font-medium text-slate-700">Çift Üstel Düzeltme (Holt-Winters)</p>
        </div>
      </div>

      <ForecastChart data={chartData} />
      
      <div className="mt-8">
        <ForecastTable data={forecastResults} />
      </div>
    </div>
  );
}
