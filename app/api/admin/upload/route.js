import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import { jwtVerify } from "jose";
import Book from "@/models/book";

export async function POST(request) {
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

    const {
      title,
      author,
      description,
      oldPrice,
      currentPrice,
      pdfUrl,
      imageUrl,
    } = await request.json();

    if (
      !title ||
      !author ||
      !description ||
      !oldPrice ||
      !currentPrice ||
      !pdfUrl ||
      !imageUrl 
    ) {
      console.log(request.body,"body")
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectMongo();

    const newBook = await Book.create({
      title,
      author,
      description,
      oldPrice,
      currentPrice,
      pdf: pdfUrl,
      image: imageUrl,
      uploadDate: new Date().toLocaleDateString(),
      sells: "0",
      reviews: [],
    });

    return NextResponse.json({ message: "bookAdded" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
