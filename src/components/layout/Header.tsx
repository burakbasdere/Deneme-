import { Bell, Search, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 w-full transition-all">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative group hidden sm:block">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-indigo-500" />
          <input
            type="text"
            placeholder="Ürün, sipariş veya tedarikçi ara..."
            className="pl-10 pr-4 py-2 w-72 bg-slate-100 border-transparent rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      </div>
    </header>
  );
}
