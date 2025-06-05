import { PDFDocument, rgb } from 'pdf-lib';
import Book from "@/models/book";
import User from "@/models/user";
import connectMongo from "@/lib/connectMongo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  const range = req.headers.get("range") || "";
  const body = await req.json();
  const { bookId } = body;

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const fUser = await User.findOne({ email: session.user.email });

    if (!fUser?.purchasedList.includes(bookId)) {
      return NextResponse.json(
        { message: "Book is not in library" },
        { status: 403 }
      );
    }

    const bookDoc = await Book.findOne({ _id: bookId });

    if (!bookDoc) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const pdfUrl = bookDoc.pdf;
    if (!pdfUrl) {
      return NextResponse.json({ error: "PDF URL missing" }, { status: 400 });
    }

    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 500 });
    }
    const pdfBytes = await pdfResponse.arrayBuffer();

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const username = fUser.username || session.user.email; 

    for (const page of pages) {
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont('Helvetica');
      const text = `for ${username}`;
      const fontSize = 50;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      page.drawText(text, {
        x: width / 2 - textWidth / 2,
        y: height / 2 - textHeight / 2,
        size: fontSize,
        font,
        color: rgb(1, 0.5, 0.5, 0.5),
        opacity: 0.3,
      });
      page.drawText("by Naveen Kewat", {
        x: width / 2 - textWidth / 2,
        y: (height / 2 - textHeight / 2) + textHeight + 50,
        size: fontSize,
        font,
        color: rgb(1, 0.5, 0.5, 0.5),
        opacity: 0.3,
      });
    }

    const modifiedPdfBytes = await pdfDoc.save();

    const rangeMatch = range.match(/bytes=(\d+)-(\d+)/);
    const start = rangeMatch ? parseInt(rangeMatch[1]) : 0;
    const end = rangeMatch ? parseInt(rangeMatch[2]) : modifiedPdfBytes.length - 1;
    const chunk = modifiedPdfBytes.slice(start, end + 1);

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Content-Range": `bytes ${start}-${end}/${modifiedPdfBytes.length}`,
      "Content-Length": chunk.length,
      "Accept-Ranges": "bytes",
    });

    return new Response(chunk, {
      status: rangeMatch ? 206 : 200,
      headers,
    });
  } catch (error) {
    console.error("Error streaming PDF:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}