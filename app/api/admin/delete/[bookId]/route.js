import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectMongo from "@/lib/connectMongo";
import Book from "@/models/book";

export async function DELETE(request, { params }) {
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

    const bookId = params.bookId;

    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Delete Book Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
