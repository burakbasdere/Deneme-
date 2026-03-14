import { db } from "@/lib/db";
import { Users, Mail, Phone, MapPin, Building2, Plus, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  const suppliers = await db.supplier.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1 flex items-center gap-3">
            Tedarikçiler <Users className="w-8 h-8 text-blue-500" />
          </h1>
          <p className="text-slate-500 font-medium">Birlikte çalıştığınız firmalar ve performans metrikleri.</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 border border-transparent text-white rounded-xl font-medium hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition-all">
          <Plus className="w-5 h-5" /> Yeni Tedarikçi Ekley
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="p-2 bg-slate-50 rounded-full text-indigo-500 hover:text-white hover:bg-indigo-500 transition-colors">
                  <ArrowUpRight className="w-5 h-5"/>
               </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center shadow-inner">
                <Building2 className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{supplier.name}</h3>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-1">
                  <span className={`w-2 h-2 rounded-full ${supplier.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  {supplier.isActive ? 'Aktif Çalışılan' : 'Pasif'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div className="border border-slate-100 rounded-xl p-3 bg-slate-50">
                 <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">İletişim Kişisi</p>
                 <p className="font-semibold text-slate-700">{supplier.contactName}</p>
              </div>
              <div className="border border-slate-100 rounded-xl p-3 bg-slate-50">
                 <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">Güvenilirlik (SLA)</p>
                 <div className="flex items-center gap-2">
                   <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 rounded-full" style={{width: `${supplier.reliabilityScore}%`}}></div>
                   </div>
                   <span className="font-bold text-slate-700">{supplier.reliabilityScore}%</span>
                 </div>
              </div>
              
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" /> {supplier.email}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" /> {supplier.phone}
              </div>
              
              <div className="col-span-2 flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                <div className="text-slate-600">
                  <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Min. Sipariş Tutarı</span>
                  <span className="font-bold text-slate-800">₺{supplier.minOrderAmount.toFixed(2)}</span>
                </div>
                <div className="text-right text-slate-600">
                  <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Ort. Teslimat</span>
                  <span className="font-bold text-slate-800">{supplier.deliveryDays} Gün</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
