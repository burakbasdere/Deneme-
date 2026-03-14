export default function QuickStats({ recentSales }: { recentSales: any[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1 lg:col-span-1">
      <h2 className="text-lg font-bold text-slate-800 mb-6">Son Satışlar</h2>
      
      {recentSales.length === 0 ? (
        <div className="text-center text-slate-500 py-4 text-sm">
          Henüz satış kaydı bulunmuyor.
        </div>
      ) : (
        <div className="space-y-4">
          {recentSales.slice(0, 5).map((sale) => (
            <div key={sale.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {sale.product.name.substring(0,2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm tracking-tight">{sale.product.name}</p>
                  <p className="text-xs text-slate-500">
                    {new Intl.DateTimeFormat("tr-TR", { 
                      hour: "2-digit", 
                      minute: "2-digit",
                      day: "numeric",
                      month: "short"
                    }).format(sale.soldAt)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">₺{sale.totalAmount.toFixed(2)}</p>
                <p className="text-xs font-medium text-emerald-500">
                  {sale.quantity} {sale.product.unit}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
