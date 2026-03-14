import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const orders = await db.order.findMany({
      where: {
        ...(status && { status }),
      },
      include: {
        supplier: true,
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // items must be { productId, quantity, unitPrice }
    const totalAmount = body.items.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0);

    const order = await db.order.create({
      data: {
        supplierId: body.supplierId,
        status: "pending",
        triggerType: body.triggerType || "manual",
        totalAmount,
        estimatedDeliveryDate: new Date(body.estimatedDeliveryDate),
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice
          }))
        }
      },
      include: { items: true }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
