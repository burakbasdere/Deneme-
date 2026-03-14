interface StockBadgeProps {
  current: number;
  warning: number;
  critical: number;
}

export default function StockBadge({ current, warning, critical }: StockBadgeProps) {
  let status = "Normal";
  let classes = "bg-emerald-100 text-emerald-700";

  if (current <= critical) {
    status = "Kritik";
    classes = "bg-red-100 text-red-700 animate-pulse";
  } else if (current <= warning) {
    status = "Uyarı";
    classes = "bg-amber-100 text-amber-700";
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-md inline-block ${classes}`}>
      {status}
    </span>
  );
}
