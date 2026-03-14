import { Package, TrendingUp, AlertTriangle, ShoppingCart } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  colorClass: string;
}

function MetricCard({ title, value, icon, trend, trendUp, colorClass }: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>{icon}</div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trendUp ? "text-emerald-500" : "text-rose-500"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </div>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold text-slate-800">{value}</div>
    </div>
  );
}

export default function MetricGrid({ 
  totalProducts, 
  criticalCount, 
  weeklySales, 
  pendingOrders 
}: { 
  totalProducts: number; 
  criticalCount: number; 
  weeklySales: number; 
  pendingOrders: number 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 mt-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Toplam Ürün Çeşidi"
        value={totalProducts}
        icon={<Package className="w-6 h-6" />}
        colorClass="bg-blue-100 text-blue-600"
      />
      <MetricCard
        title="Kritik Stok Uyarısı"
        value={criticalCount}
        icon={<AlertTriangle className="w-6 h-6" />}
        colorClass="bg-red-100 text-red-600"
        trend={criticalCount > 0 ? "Dikkat!" : "İyi"}
        trendUp={criticalCount === 0}
      />
      <MetricCard
        title="Bu Haftaki Satış (₺)"
        value={new Intl.NumberFormat("tr-TR").format(weeklySales)}
        icon={<TrendingUp className="w-6 h-6" />}
        colorClass="bg-emerald-100 text-emerald-600"
        trend="+12.5%"
        trendUp={true}
      />
      <MetricCard
        title="Bekleyen Sipariş"
        value={pendingOrders}
        icon={<ShoppingCart className="w-6 h-6" />}
        colorClass="bg-amber-100 text-amber-600"
      />
    </div>
  );
}
