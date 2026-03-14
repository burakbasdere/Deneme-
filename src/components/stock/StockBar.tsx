interface StockBarProps {
  current: number;
  max: number;
  critical: number;
  warning: number;
}

export default function StockBar({ current, max, critical, warning }: StockBarProps) {
  // Prevent division by zero and cap at 100%
  const percentage = Math.min(100, Math.max(0, (current / (max || 1)) * 100));
  
  let color = "bg-emerald-500";
  if (current <= critical) color = "bg-red-500";
  else if (current <= warning) color = "bg-amber-500";

  return (
    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
      <div 
        className={`h-full transition-all duration-1000 ease-out rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
