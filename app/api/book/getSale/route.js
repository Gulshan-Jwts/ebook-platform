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

    const users = await User.find({});
    const allPurchasedIds = users.flatMap((user) => user.purchasedList);

    const saleMap = {};
    let totalSales = 0;
    let totalRevenue = 0;

    for (const bookId of allPurchasedIds) {
      saleMap[bookId] = (saleMap[bookId] || 0) + 1;
      totalSales++;
    }

    const books = await Book.find({ _id: { $in: Object.keys(saleMap) } });

    for (const book of books) {
      const count = saleMap[book._id.toString()] || 0;
      const price = parseFloat(book.currentPrice);
      totalRevenue += count * price;
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
