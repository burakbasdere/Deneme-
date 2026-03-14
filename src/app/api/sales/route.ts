import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    const sales = await db.saleRecord.findMany({
      where: {
        ...(productId && { productId }),
      },
      include: { product: true },
      orderBy: { soldAt: "desc" },
    });

    return NextResponse.json(sales);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Satış kaydet, stok düş ve log oluştur - Prisma Transaction kullanıyoruz
    const result = await db.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: body.productId } });
      if (!product) throw new Error("Product not found");

      if (product.currentStock < Number(body.quantity)) {
        throw new Error("Insufficient stock");
      }

      const salePrice = product.salePrice;
      const quantity = Number(body.quantity);
      const totalAmount = salePrice * quantity;

      const sale = await tx.saleRecord.create({
        data: {
          productId: product.id,
          quantity,
          salePrice,
          totalAmount,
          cashierId: body.cashierId || "system",
        },
      });

      const updatedProduct = await tx.product.update({
        where: { id: product.id },
        data: { currentStock: product.currentStock - quantity },
      });

      await tx.stockMovement.create({
        data: {
          productId: product.id,
          type: "sale",
          quantityChange: -quantity,
          stockBefore: product.currentStock,
          stockAfter: updatedProduct.currentStock,
          referenceId: sale.id,
          createdBy: body.cashierId || "system",
        },
      });

      return sale;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/sales error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
