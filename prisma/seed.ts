import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding veritabanı...')

  // Tedarikçi Ekle
  const supplier1 = await prisma.supplier.upsert({
    where: { email: 'satis@sutas.com' },
    update: {},
    create: {
      name: 'Sütaş A.Ş.',
      contactName: 'Ahmet Yılmaz',
      email: 'satis@sutas.com',
      phone: '05551234567',
      minOrderAmount: 1000,
      deliveryDays: 2,
      reliabilityScore: 95,
      isActive: true,
    },
  })

  const supplier2 = await prisma.supplier.upsert({
    where: { email: 'bilgi@ulker.com' },
    update: {},
    create: {
      name: 'Ülker Gıda',
      contactName: 'Ayşe Kaya',
      email: 'bilgi@ulker.com',
      phone: '05559876543',
      minOrderAmount: 500,
      deliveryDays: 3,
      reliabilityScore: 90,
      isActive: true,
    },
  })

  // Ürün Ekle
  await prisma.product.upsert({
    where: { barcode: '8690536012345' },
    update: {},
    create: {
      name: 'Sütaş Süt 1L',
      barcode: '8690536012345',
      category: 'Süt Ürünleri',
      supplierId: supplier1.id,
      unit: 'lt',
      purchasePrice: 20.5,
      salePrice: 28.0,
      currentStock: 45,
      maxCapacity: 100,
      criticalLevel: 20,
      warningLevel: 30,
      leadTimeDays: 2,
    },
  })

  await prisma.product.upsert({
    where: { barcode: '8690504012345' },
    update: {},
    create: {
      name: 'Ülker Çikolatalı Gofret',
      barcode: '8690504012345',
      category: 'Atıştırmalık',
      supplierId: supplier2.id,
      unit: 'adet',
      purchasePrice: 3.5,
      salePrice: 6.0,
      currentStock: 15, // Warning/Critical level!
      maxCapacity: 200,
      criticalLevel: 50,
      warningLevel: 80,
      leadTimeDays: 3,
    },
  })

  console.log('Seeding tamamlandı.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
