import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const forecasts = await db.forecastResult.findMany({
      where: { productId },
      orderBy: { weekStartDate: "asc" },
    });

    return NextResponse.json(forecasts);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
