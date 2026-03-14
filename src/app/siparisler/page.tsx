import { db } from "@/lib/db";
import { Truck, CheckCircle2, Clock, Plus, Filter, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    include: {
      supplier: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 font-bold rounded-lg text-sm flex items-center gap-2"><Clock className="w-4 h-4"/> Onay Bekliyor</span>;
      case "approved":
      case "sent":
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg text-sm flex items-center gap-2"><Truck className="w-4 h-4"/> Yolda</span>;
      case "delivered":
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-lg text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Teslim Alındı</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1 flex items-center gap-3">
            Siparişler <ShoppingCartIcon className="w-8 h-8 text-amber-500" />
          </h1>
          <p className="text-slate-500 font-medium">Satın alma siparişleri ve otomatik sipariş geçmişi.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
            <Filter className="w-4 h-4" /> Filtrele
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 border border-transparent text-white rounded-xl font-medium hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition-all">
            <Plus className="w-5 h-5" /> Manuel Sipariş
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-slate-500">Henüz sipariş bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex-1">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{order.supplier.name}</h3>
                      <p className="text-sm text-slate-500 font-medium font-mono mt-1">Sipariş ID: {order.id.slice(0,8).toUpperCase()}</p>
                    </div>
                    {getStatusBadge(order.status)}
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Toplam Tutar</p>
                      <p className="text-lg font-bold text-slate-800">₺{order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Tahmini Teslimat</p>
                      <p className="text-lg font-bold text-slate-800">
                        {new Intl.DateTimeFormat("tr-TR").format(order.estimatedDeliveryDate)}
                      </p>
                    </div>
                 </div>

                 {order.triggerType === "automatic" && (
                   <div className="flex items-center gap-2 text-sm text-fuchsia-600 bg-fuchsia-50 px-3 py-2 rounded-lg border border-fuchsia-100 w-fit font-medium">
                     <AlertCircle className="w-4 h-4" /> AI tarafından kritik stok nedeniyle otomatik oluşturuldu.
                   </div>
                 )}
               </div>

               <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6">
                  <h4 className="font-bold text-slate-800 mb-4 bg-slate-50 p-2 rounded-lg">Sipariş İçeriği ({order.items?.length} Ürün)</h4>
                  <ul className="space-y-3">
                    {order.items?.map((item) => (
                      <li key={item.id} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                        <span className="font-medium text-slate-700">{item.product.name}</span>
                        <div className="text-right">
                          <span className="font-bold text-slate-900">{item.quantity} {item.product.unit}</span>
                          <p className="text-xs text-slate-500">₺{item.unitPrice.toFixed(2)} / br</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  {order.status === "pending" && (
                    <div className="mt-6 flex gap-3">
                      <button className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                        Siparişi Onayla
                      </button>
                      <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:text-red-600 transition-colors">
                        İptal
                      </button>
                    </div>
                  )}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ShoppingCartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
