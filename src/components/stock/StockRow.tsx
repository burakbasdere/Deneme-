import { Product } from "@prisma/client";
import StockBadge from "./StockBadge";
import StockBar from "./StockBar";
import { MoreHorizontal } from "lucide-react";

interface StockRowProps {
  product: Product;
}

export default function StockRow({ product }: StockRowProps) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
      <td className="py-4 px-6">
        <div>
          <p className="font-semibold text-slate-800">{product.name}</p>
          <p className="text-xs text-slate-500 mt-1">{product.barcode}</p>
        </div>
      </td>
      <td className="py-4 px-6 text-slate-600">
        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-sm font-medium">
          {product.category}
        </span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-24">
            <StockBar 
              current={product.currentStock} 
              max={product.maxCapacity} 
              warning={product.warningLevel} 
              critical={product.criticalLevel} 
            />
          </div>
          <p className="text-sm font-bold text-slate-700 w-16 text-right">
            {product.currentStock} / {product.maxCapacity}
          </p>
        </div>
      </td>
      <td className="py-4 px-6 font-medium text-slate-700">
        ₺{product.salePrice.toFixed(2)}
      </td>
      <td className="py-4 px-6">
        <StockBadge 
          current={product.currentStock} 
          warning={product.warningLevel} 
          critical={product.criticalLevel} 
        />
      </td>
      <td className="py-4 px-6 text-right">
        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}
