/**
 * ÜRÜN
 * Marketteki her ürünü temsil eder
 */
export interface Product {
  id: string;                  // "prod_001"
  name: string;                // "Sütaş Süt 1L"
  barcode: string;             // "8690536012345"
  category: string;            // "Süt Ürünleri"
  supplierId: string;          // Tedarikçi referansı
  unit: "adet" | "kg" | "lt"; // Ölçü birimi
  purchasePrice: number;       // Alış fiyatı (₺)
  salePrice: number;           // Satış fiyatı (₺)
  currentStock: number;        // Mevcut stok adedi
  maxCapacity: number;         // Raf kapasitesi
  criticalLevel: number;       // Bu seviyede sipariş tetiklenir
  warningLevel: number;        // Bu seviyede uyarı verilir
  leadTimeDays: number;        // Tedarikçiden teslimat süresi (gün)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SATIŞ KAYDI
 * Her satış işlemi için oluşturulur (kasa entegrasyonu veya manuel)
 */
export interface SaleRecord {
  id: string;
  productId: string;
  quantity: number;            // Satılan adet
  salePrice: number;           // O anki satış fiyatı
  totalAmount: number;         // quantity * salePrice
  soldAt: Date;                // Satış tarihi ve saati
  cashierId?: string | null;   // Kasa/kasiyer ID (opsiyonel)
}

/**
 * SATIŞ TAHMİNİ
 * AI/algoritma tarafından üretilen haftalık tahmin
 */
export interface ForecastResult {
  id: string;
  productId: string;
  weekStartDate: Date;         // Tahmin haftasının başlangıcı
  predictedQuantity: number;   // Tahmini satış adedi
  confidenceScore: number;     // Güven skoru (0-1 arası)
  algorithm: string;           // "moving_average" | "linear_regression" | "ml"
  createdAt: Date;
}

/**
 * TEDARİKÇİ
 */
export interface Supplier {
  id: string;
  name: string;                // "Sütaş A.Ş."
  contactName: string;
  email: string;
  phone: string;
  minOrderAmount: number;      // Min. sipariş tutarı (₺)
  deliveryDays: number;        // Ortalama teslimat günü
  reliabilityScore: number;    // 0-100 güvenilirlik puanı
  isActive: boolean;
}

/**
 * SİPARİŞ
 * Tedarikçiye gönderilen sipariş
 */
export interface Order {
  id: string;
  supplierId: string;
  items?: OrderItem[];
  status: "pending" | "approved" | "sent" | "delivered" | "cancelled";
  triggerType: "automatic" | "manual"; // Otomatik mi, elle mi oluşturuldu
  triggerReason?: string | null;       // "critical_stock" | "weekly_forecast"
  totalAmount: number;
  estimatedDeliveryDate: Date;
  createdAt: Date;
  sentAt?: Date | null;
  deliveredAt?: Date | null;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/**
 * STOK HAREKETİ
 * Her stok değişikliğini loglar (audit trail)
 */
export interface StockMovement {
  id: string;
  productId: string;
  type: "sale" | "purchase" | "adjustment" | "return";
  quantityChange: number;      // Pozitif = giriş, Negatif = çıkış
  stockBefore: number;
  stockAfter: number;
  referenceId?: string | null; // SaleRecord.id veya Order.id
  note?: string | null;
  createdAt: Date;
  createdBy: string;           // Kullanıcı ID
}
