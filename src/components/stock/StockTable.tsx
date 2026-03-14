import { Product } from "@prisma/client";
import StockRow from "./StockRow";

export default function StockTable({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <p className="text-slate-500">Gösterilecek ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <th className="py-4 px-6 font-semibold">ÜRÜN BİLGİSİ</th>
              <th className="py-4 px-6 font-semibold">KATEGORİ</th>
              <th className="py-4 px-6 font-semibold">STOK DURUMU</th>
              <th className="py-4 px-6 font-semibold">SATIŞ FİYATI</th>
              <th className="py-4 px-6 font-semibold">SEVİYE</th>
              <th className="py-4 px-6 font-semibold text-right">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <StockRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
