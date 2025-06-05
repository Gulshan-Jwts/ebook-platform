import connectMongo from "@/lib/connectMongo";
import Book from "@/models/book";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
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

    params = await params || {};
    const bookId = await params.bookId;
    const updates = await request.json();

    console.log(updates)

    const updatedBook = await Book.findByIdAndUpdate(bookId, updates, {
      new: true,
    });

    if (!updatedBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Book updated successfully",
      updatedBook,
    },{status: 200});
  } catch (err) {
    console.error("Edit Book Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
