import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({
      where: { id },
      include: { supplier: true },
    });

    if (!product) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const product = await db.product.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.purchasePrice && { purchasePrice: Number(body.purchasePrice) }),
        ...(body.salePrice && { salePrice: Number(body.salePrice) }),
        ...(body.currentStock !== undefined && { currentStock: Number(body.currentStock) }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
