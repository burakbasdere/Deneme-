"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface ForecastChartProps {
  data: {
    week: string;
    actual?: number;
    predicted?: number;
  }[];
}

export default function ForecastChart({ data }: ForecastChartProps) {
  // We determine where actual data ends and prediction begins to draw a divider
  const lastActualIndex = data.findLastIndex((d) => d.actual !== undefined);
  const dividerWeek = lastActualIndex >= 0 ? data[lastActualIndex].week : undefined;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[400px]">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-lg">Satış Trendi ve Tahmin Modeli</h3>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-2 text-indigo-500">
            <div className="w-3 h-3 bg-indigo-500 rounded-full" /> Gerçekleşen
          </div>
          <div className="flex items-center gap-2 text-fuchsia-500">
            <div className="w-3 h-3 rounded-full border-2 border-fuchsia-500 border-dashed" /> Tahmin
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="week" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
            cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          {dividerWeek && (
            <ReferenceLine x={dividerWeek} stroke="#94a3b8" strokeDasharray="3 3" />
          )}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Gerçekleşen Satış"
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#d946ef"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Tahmini Satış"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
