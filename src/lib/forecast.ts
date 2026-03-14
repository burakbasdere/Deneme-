import { SaleRecord } from "@prisma/client";

// Ağırlıklı hareketli ortalama kullanarak haftalık satış tahmini
export function calculateForecast(salesHistory: SaleRecord[], weeksAhead: number = 3) {
  if (salesHistory.length === 0) {
    return Array.from({ length: weeksAhead }).map((_, i) => ({
      week: i + 1,
      predicted: 0,
      confidence: 0,
    }));
  }

  // Adım 1: Haftalık satışları grupla
  const weeklyTotals = groupByWeek(salesHistory);
  
  if (weeklyTotals.length === 0) {
    return Array.from({ length: weeksAhead }).map((_, i) => ({
      week: i + 1,
      predicted: 0,
      confidence: 0,
    }));
  }

  // Adım 2: Ağırlıklı hareketli ortalama (son haftalar daha ağır)
  // Max 5 hafta geriye bak, her hafta için ağırlık: [1, 2, 3, 4, 5]
  const weights = [1, 2, 3, 4, 5];
  const recentWeeks = weeklyTotals.slice(-5);
  const actualWeights = weights.slice(5 - recentWeeks.length);
  
  const weightedAvg = calculateWeightedAverage(recentWeeks, actualWeights);
  
  // Adım 3: Trend hesapla (artıyor mu azalıyor mu)
  const trend = calculateTrend(weeklyTotals);
  
  // Adım 4: Her hafta için tahmin üret
  const forecasts = [];
  for (let i = 1; i <= weeksAhead; i++) {
    // Negatif tahmin olmamasını sağla
    const predicted = Math.max(0, Math.round(weightedAvg + (trend * i)));
    forecasts.push({
      week: i,
      predicted,
      confidence: Math.max(0.5, 0.95 - (i * 0.1)), // Uzak tahmin = düşük güven
    });
  }
  
  return forecasts;
}

function groupByWeek(sales: SaleRecord[]): number[] {
  // Basit gruplama (örnek demo algoritması: 7'şer günlük dilimlere ayırır)
  if (sales.length === 0) return [];
  
  // En eski ve en yeni tarih
  const sorted = [...sales].sort((a, b) => a.soldAt.getTime() - b.soldAt.getTime());
  const startDate = sorted[0].soldAt;
  
  const weeks = new Map<number, number>();
  
  sorted.forEach(sale => {
    const diffTime = Math.abs(sale.soldAt.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weekIndex = Math.floor(diffDays / 7);
    
    weeks.set(weekIndex, (weeks.get(weekIndex) || 0) + sale.quantity);
  });

  // Eksik haftaları 0 ile doldur
  const maxWeek = Math.max(...Array.from(weeks.keys()));
  const result: number[] = [];
  
  for (let i = 0; i <= maxWeek; i++) {
    result.push(weeks.get(i) || 0);
  }
  
  return result;
}

function calculateWeightedAverage(data: number[], weights: number[]): number {
  let sum = 0;
  let weightSum = 0;
  
  for (let i = 0; i < data.length; i++) {
    sum += data[i] * weights[i];
    weightSum += weights[i];
  }
  
  return weightSum === 0 ? 0 : sum / weightSum;
}

function calculateTrend(data: number[]): number {
  if (data.length < 2) return 0;
  
  // Basit lineer eğim hesabı
  let trendSum = 0;
  for (let i = 1; i < data.length; i++) {
    trendSum += data[i] - data[i - 1];
  }
  
  return trendSum / (data.length - 1);
}
