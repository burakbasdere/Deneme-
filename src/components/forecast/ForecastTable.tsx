interface ForecastTableProps {
  data: {
    week: number;
    predicted: number;
    confidence: number;
  }[];
}

export default function ForecastTable({ data }: ForecastTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 p-6 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-800 text-lg">Gelecek 3 Haftalık Detaylı Tahmin</h3>
        <span className="px-3 py-1 bg-fuchsia-100 text-fuchsia-700 font-bold rounded-lg text-xs">
          AI Model Aktif
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-sm">
              <th className="py-4 px-6 font-semibold bg-white">Hafta</th>
              <th className="py-4 px-6 font-semibold bg-white text-right">Tahmini Satış (Adet)</th>
              <th className="py-4 px-6 font-semibold bg-white text-right">Model Güven Skoru (%)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-700">
                  {row.week}. Hafta
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="font-bold text-lg text-slate-800">{row.predicted}</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${row.confidence >= 0.8 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${row.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-600 w-8">
                      {Math.round(row.confidence * 100)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
