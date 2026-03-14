import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const supplierId = searchParams.get("supplierId");

    const products = await db.product.findMany({
      where: {
        ...(category && { category }),
        ...(supplierId && { supplierId }),
      },
      include: {
        supplier: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const product = await db.product.create({
      data: {
        name: body.name,
        barcode: body.barcode,
        category: body.category,
        supplierId: body.supplierId,
        unit: body.unit,
        purchasePrice: Number(body.purchasePrice),
        salePrice: Number(body.salePrice),
        currentStock: Number(body.currentStock || 0),
        maxCapacity: Number(body.maxCapacity),
        criticalLevel: Number(body.criticalLevel),
        warningLevel: Number(body.warningLevel),
        leadTimeDays: Number(body.leadTimeDays || 2),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
