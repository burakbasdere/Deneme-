import { db } from "@/lib/db";
import MetricGrid from "@/components/dashboard/MetricGrid";
import AlertList from "@/components/dashboard/AlertList";
import QuickStats from "@/components/dashboard/QuickStats";

export const dynamic = "force-dynamic"; // Always fetch fresh data

export default async function Dashboard() {
  const [
    totalProducts,
    alerts,
    recentSales,
    pendingOrders,
  ] = await Promise.all([
    db.product.count(),
    db.product.findMany({
      where: {
        currentStock: {
          lte: db.product.fields.warningLevel, // Compare currentStock <= warningLevel
        },
      },
      orderBy: { currentStock: "asc" },
      take: 10,
    }),
    db.saleRecord.findMany({
      include: { product: true },
      orderBy: { soldAt: "desc" },
      take: 5,
    }),
    db.order.count({
      where: { status: "pending" },
    }),
  ]);

  // Calculate current week sales strictly
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const weeklySalesData = await db.saleRecord.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      soldAt: {
        gte: oneWeekAgo,
      },
    },
  });

  const weeklySales = weeklySalesData._sum.totalAmount || 0;
  const criticalCount = alerts.filter(p => p.currentStock <= p.criticalLevel).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
            Genel Bakış
          </h1>
          <p className="text-slate-500 font-medium">
            Stok durumunuz ve son satış aktiviteleri
          </p>
        </div>
      </div>

      <MetricGrid 
        totalProducts={totalProducts} 
        criticalCount={criticalCount}
        weeklySales={weeklySales}
        pendingOrders={pendingOrders}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AlertList alerts={alerts} />
        <QuickStats recentSales={recentSales} />
      </div>
    </div>
  );
}
