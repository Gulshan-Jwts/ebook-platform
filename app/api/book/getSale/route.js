import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import User from "@/models/user";
import Book from "@/models/book";
import { jwtVerify } from "jose";

export const runtime = "nodejs";

export async function GET(request) {
  try {
     const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (!payload?.isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    await connectMongo();
    const sales = await Sale.find({});
    const saleMap = {};
    let totalSales = 0;
    let totalRevenue = 0;

    for (const sale of sales) {
      const bookId = sale.consumer;
      saleMap[bookId] = (saleMap[bookId] || 0) + 1;
      totalSales++;
      totalRevenue += parseFloat(sale.amount);
    }

    return NextResponse.json({
      ...saleMap,
      totalSales,
      totalRevenue: Math.round(totalRevenue),
    });
    
  } catch (error) {
    console.error("Error in getSale route:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
