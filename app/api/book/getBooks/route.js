import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import Book from "@/models/book";

export async function GET() {
  try {
    await connectMongo();

    let books = await Book.find();

    books = books.map((elem)=>{
      elem.pdf = ""
      return elem
    })

    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
