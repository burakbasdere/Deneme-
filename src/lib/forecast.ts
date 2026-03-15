import { SaleRecord } from "@prisma/client";

/**
 * DOUBLE EXPONENTIAL SMOOTHING (Holt's Linear Trend Method)
 * Zaman serisi verilerinde hem "seviyeyi" (level) hem de "trendi" (trend) öğrenerek
 * geleceğe yönelik daha tutarlı tahminler yapar.
 */
export function calculateForecast(salesHistory: SaleRecord[], weeksAhead: number = 3) {
  if (salesHistory.length === 0) {
    return Array.from({ length: weeksAhead }).map((_, i) => ({
      week: i + 1,
      predicted: 0,
      confidence: 0,
    }));
  }

  // 1. Satışları haftalık olarak grupla
  const weeklyTotals = groupByWeek(salesHistory);
  
  // Eğer sadece 1 haftalık veri varsa trend hesaplanamaz, basit kopyalama yap
  if (weeklyTotals.length === 1) {
    return Array.from({ length: weeksAhead }).map((_, i) => ({
      week: i + 1,
      predicted: weeklyTotals[0],
      confidence: 0.5,
    }));
  }

  // ALGORİTMA PARAMETRELERİ (Gerçekte bunlar geçmiş veri ile optimize edilebilir)
  const alpha = 0.4;  // Data Smoothing Factor (Yeniliğe ne kadar hızlı tepki verecek)
  const beta = 0.3;   // Trend Smoothing Factor (Trend değişimine ne kadar hızlı tepki verecek)

  // 2. Başlangıç Değerleri
  // Level(0) = Y(0)
  // Trend(0) = Y(1) - Y(0)
  let currentLevel = weeklyTotals[0];
  let currentTrend = weeklyTotals.length > 1 ? (weeklyTotals[1] - weeklyTotals[0]) : 0;
  
  // Modeli eğit (Son noktaya kadar simüle et)
  for (let i = 1; i < weeklyTotals.length; i++) {
    const actual = weeklyTotals[i];
    
    // Önceki duruma göre değerleri sakla
    const lastLevel = currentLevel;
    
    // Yeni Seviye = a * Gerçek + (1-a) * (Eski Seviye + Eski Trend)
    currentLevel = alpha * actual + (1 - alpha) * (lastLevel + currentTrend);
    
    // Yeni Trend = b * (Yeni Seviye - Eski Seviye) + (1-b) * Eski Trend
    currentTrend = beta * (currentLevel - lastLevel) + (1 - beta) * currentTrend;
  }

  // 3. Gelecek Tahminleri (Forecasting)
  // Y(t+m) = Level(t) + m * Trend(t)
  const forecasts = [];
  
  // Güven skoru için basit bir hata sapması varsayımı
  // Uzak gelecekte trendin sapma ihtimali daha yüksektir.
  const baseConfidence = 0.92;

  for (let i = 1; i <= weeksAhead; i++) {
    const prediction = Math.max(0, Math.round(currentLevel + (i * currentTrend)));
    
    // i (hafta) arttıkça güven skoru üssel olarak düşer
    const confidenceDrop = Math.pow(1.15, i) * 0.05;
    const confidence = Math.max(0.4, baseConfidence - confidenceDrop);

    forecasts.push({
      week: i,
      predicted: prediction,
      confidence: confidence,
    });
  }
  
  return forecasts;
}

function groupByWeek(sales: SaleRecord[]): number[] {
  if (sales.length === 0) return [];
  
  const sorted = [...sales].sort((a, b) => a.soldAt.getTime() - b.soldAt.getTime());
  const startDate = sorted[0].soldAt;
  
  const weeks = new Map<number, number>();
  
  sorted.forEach(sale => {
    const diffTime = Math.abs(sale.soldAt.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weekIndex = Math.floor(diffDays / 7);
    
    weeks.set(weekIndex, (weeks.get(weekIndex) || 0) + sale.quantity);
  });

  const maxWeek = Math.max(...Array.from(weeks.keys()));
  const result: any[] = [];
  
  for (let i = 0; i <= maxWeek; i++) {
    result.push({weekIndex: i, value: weeks.get(i) || 0});
  }
  
  // Sıralı diziyi dön (0'lar dahil)
  return result.map(r => r.value);
}

// GUI/UI testi için yapay (Mock) ama trend içeren gerçekçi satış serisi üreten fonksiyon
export function generateMockTrendData(weeks: number, startBase: number, trendSlope: number): SaleRecord[] {
  const records: SaleRecord[] = [];
  const now = new Date();
  
  let currentBase = startBase;
  
  for (let w = weeks - 1; w >= 0; w--) {
    // Biraz rastgelelik (Noise) ekle, +/- %15 sapma
    const noise = currentBase * (Math.random() * 0.3 - 0.15);
    const weeklySalesCount = Math.max(0, Math.round(currentBase + noise));
    
    // Satışları haftanın günlerine dağıt (Veritabanı modeli SaleRecord objesi gibi simüle et)
    for (let s = 0; s < weeklySalesCount; s++) {
      const pastDate = new Date(now.getTime() - (w * 7 * 24 * 60 * 60 * 1000));
      // Haftanın rastgele bir gününe/saatine dağıt
      pastDate.setHours(pastDate.getHours() - Math.floor(Math.random() * 168));
      
      records.push({
        id: `mock_sale_${w}_${s}`,
        productId: "mock_product_1",
        quantity: 1, // Satış başına 1 ürün
        salePrice: 15.0,
        totalAmount: 15.0,
        soldAt: pastDate,
        cashierId: null
      });
    }
    
    // Sonraki hafta için taban sayıyı trende göre arttır/azalt
    currentBase += trendSlope; 
  }
  
  return records;
}
