# Stok Takip & Tahmin Sistemi 🚀

Yapay zeka ve istatistiksel modeller destekli, modern arayüze sahip stok takip ve satış tahmin sistemi. Bu proje Next.js 15 (App Router), Tailwind CSS, SQLite ve Prisma kullanılarak geliştirilmiştir.

## 🌟 Özellikler

- **Dinamik Dashboard**: Güncel metrikler, son satışlar ve kritik stok uyarıları.
- **Stok Yönetimi**: Ürünlerin güncel durumlarını, kapasite doluluk oranlarını ve uyarı seviyelerini takip etme.
- **Yapay Zeka Destekli Tahmin**: Geçmiş satış verilerinden beslenen "Ağırlıklı Hareketli Ortalama (WMA)" algoritması ile gelecek 3 haftanın satış tahmini ve model güven skoru.
- **Otomatik Siparişler**: Kritik seviyeye düşen ürünleri tespit edip satıcı gruplarına göre otomatik sipariş algoritmaları (Arka plan servisi / Cron Job konsepti).
- **Tedarikçi Yönetimi**: Firma performansları (SLA) ve iletişim bilgileri.

## 🛠 Kullanılan Teknolojiler

- **Frontend:** Next.js 15 (React), Tailwind CSS, Recharts (Grafikler), Lucide-React (İkonlar)
- **Backend:** Next.js Server Components, API Routes
- **Veritabanı:** SQLite
- **ORM:** Prisma Client

---

## 💻 Kurulum Adımları (Adım Adım)

Projeyi bilgisayarınızda yerel olarak (localhost) çalıştırmak için aşağıdaki adımları sırasıyla uygulayın.

### 1. Projeyi Bilgisayarınıza İndirin (Clone)

Terminal veya Komut Satırını açarak projeyi bilgisayarınıza klonlayın ve klasöre girin:

```bash
git clone https://github.com/burakbasdere/Deneme-.git
cd Deneme-
```

### 2. Bağımlılıkları Yükleyin

Projenin çalışması için gereken tüm Node.js paketlerini yükleyin:

```bash
npm install
```

### 3. Veritabanını Hazırlayın

Projede veritabanı olarak **SQLite** kullanılmaktadır. Prisma yapılandırmasını kurmak ve örnek verileri (Sütaş, Ülker vb.) veritabanına eklemek için şu komutları sırasıyla çalıştırın:

```bash
# 1. Prisma İstemcisini oluşturun
npx prisma generate

# 2. Veritabanı tablolarını şemaya göre oluşturun
npx prisma db push

# 3. Örnek (Seed) verileri veritabanına ekleyin
npx tsx prisma/seed.ts
```

*Not: `npx tsx prisma/seed.ts` komutu başarıyla çalıştığında ekranda `Seeding tamamlandı.` mesajını göreceksiniz.*

### 4. Projeyi Çalıştırın

Tüm kurulumlar tamamlandı. Artık yerel geliştirme sunucusunu başlatabilirsiniz:

```bash
npm run dev
```

Tarayıcınızı açın ve [http://localhost:3000](http://localhost:3000) adresine gidin. Stok Takip Sistemi karşınıza gelecektir! 🎉

---

## 📂 Proje Yapısı

```
src/
├── app/               # Sayfalar ve API Rotaları (Next.js App Router)
├── components/        # Yeniden kullanılabilir UI bileşenleri (Layout, Dashboard, Grafikler vs.)
├── lib/               # Veritabanı bağlantısı (Prisma) ve Tahminleme algoritması 
├── server/            # Cron Job ve arka plan servis logic'leri
└── types/             # TypeScript arayüz ve veri modelleri
prisma/
├── schema.prisma      # Veritabanı mimarisi
└── seed.ts            # Başlangıç verileri oluşturucu
```

## 📜 Lisans

Bu proje kişisel kullanım ve test amaçlı oluşturulmuştur.
