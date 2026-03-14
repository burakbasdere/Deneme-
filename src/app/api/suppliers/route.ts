import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const suppliers = await db.supplier.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(suppliers);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supplier = await db.supplier.create({
      data: {
        name: body.name,
        contactName: body.contactName,
        email: body.email,
        phone: body.phone,
        minOrderAmount: Number(body.minOrderAmount),
        deliveryDays: Number(body.deliveryDays),
        reliabilityScore: Number(body.reliabilityScore || 100),
      },
    });
    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
