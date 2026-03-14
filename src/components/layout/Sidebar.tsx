import Link from "next/link";
import { LayoutDashboard, Package, TrendingUp, ShoppingCart, Users } from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Stok Yönetimi", href: "/stok", icon: <Package className="w-5 h-5" /> },
    { name: "Satış Tahminleri", href: "/tahmin", icon: <TrendingUp className="w-5 h-5" /> },
    { name: "Siparişler", href: "/siparisler", icon: <ShoppingCart className="w-5 h-5" /> },
    { name: "Tedarikçiler", href: "/tedarikciler", icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col transition-all duration-300 shadow-2xl z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-indigo-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Package className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          Stok Takip
        </h1>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-300 hover:text-white hover:bg-slate-800 hover:shadow-md group"
          >
            <div className="text-slate-400 group-hover:text-indigo-400 transition-colors">
              {item.icon}
            </div>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold shadow-inner">
            BY
          </div>
          <div>
            <p className="text-sm font-medium text-white">Burak Yılmaz</p>
            <p className="text-xs text-slate-400">Yönetici</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
