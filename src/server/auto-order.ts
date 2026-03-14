import cron from 'node-cron';
import { db } from '@/lib/db';
import { calculateForecast } from '@/lib/forecast';

// Helper to group by key
function groupBy<T, K extends string | number | symbol>(array: T[], keyCallback: (item: T) => K): Record<K, T[]> {
  return array.reduce((acc, current) => {
    const key = keyCallback(current);
    if (!acc[key]) acc[key] = [];
    acc[key].push(current);
    return acc;
  }, {} as Record<K, T[]>);
}

// Add days to a Date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Cron job that runs every night at 02:00
export function initAutoOrderCron() {
  console.log("Auto-order cron job initialized. Will run every night at 02:00 AM.");
  
  cron.schedule('0 2 * * *', async () => {
    console.log("Running auto-order check...");
    await runAutoOrderCheck();
  });
}

export async function runAutoOrderCheck() {
  try {
    // 1. Tüm kritik stok ürünleri bul
    const criticalProducts = await db.product.findMany({
      where: {
        // Find products where currentStock is less than or equal to criticalLevel
        // Note: Prisma schema does not allow column-to-column comparisons easily in findMany, 
        // so we fetch all and filter, or we ensure the data logic handles it. 
        // We'll fetch products that might be critical, but the safest way is to query all active products or use raw query.
        // For simplicity, we filter in JS since it's a demo.
      },
      include: { 
        supplier: true,
        sales: {
          orderBy: { soldAt: 'desc' },
          take: 100 // Get some recent sales to build a forecast
        }
      }
    });

    // Filtreleme (currentStock <= criticalLevel)
    const actualCriticalProducts = criticalProducts.filter(p => p.currentStock <= p.criticalLevel);

    if (actualCriticalProducts.length === 0) {
      console.log("No critical products found. Skipping auto-order.");
      return;
    }

    // 2. Tedarikçiye göre grupla
    const bySupplier = groupBy(actualCriticalProducts, p => p.supplierId);

    // 3. Her tedarikçi için bir sipariş oluştur
    for (const [supplierId, products] of Object.entries(bySupplier)) {
      const supplier = products[0].supplier;
      let totalOrderAmount = 0;
      
      const itemsToCreate = products.map(product => {
        // Ortalama 2 haftalık tahmin al
        const forecasts = calculateForecast(product.sales, 2);
        const totalPredicted = forecasts.reduce((sum, f) => sum + f.predicted, 0);
        
        // Sipariş miktarı = (2 haftalık tahmin) - mevcut stok + uyarı seviyesi (buffer)
        let orderQty = totalPredicted - product.currentStock + product.warningLevel;
        
        // Min %50 kapasite doldurmayı zorla
        const minRefill = Math.max(0, Math.floor(product.maxCapacity * 0.5) - product.currentStock);
        orderQty = Math.max(orderQty, minRefill);

        const totalPrice = orderQty * product.purchasePrice;
        totalOrderAmount += totalPrice;

        return {
          productId: product.id,
          quantity: orderQty,
          unitPrice: product.purchasePrice,
          totalPrice: totalPrice,
        };
      });

      // 4. Siparişi veritabanına kaydet (status: "pending" — onay bekliyor)
      await db.order.create({
        data: {
          supplierId,
          status: "pending",
          triggerType: "automatic",
          triggerReason: "critical_stock",
          totalAmount: totalOrderAmount,
          estimatedDeliveryDate: addDays(new Date(), supplier.deliveryDays),
          items: {
            create: itemsToCreate
          }
        }
      });
      
      console.log(`Auto-order created for supplier ${supplier.name} (ID: ${supplierId}) with ${itemsToCreate.length} items.`);
    }
    
    // 5. Yöneticiye bildirim gönder
    const count = Object.keys(bySupplier).length;
    console.log(`Auto-order process finished. Generated ${count} orders.`);
    // await sendNotification({ type: "auto_order_created", count });
    
  } catch (error) {
    console.error("Failed to run auto-order check:", error);
  }
}
