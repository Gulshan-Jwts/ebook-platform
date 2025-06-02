import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import user from "@/models/user";

export async function PUT(req) {
  try {
    await connectMongo();

    const session = await getServerSession(authOptions);
    const { bookId } = await req.json();

    if (!bookId) {
      return NextResponse.json({ message: "Missing bookId" }, { status: 400 });
    }

    const fUser = await user.findOne({ email: session.user.email });


    if (!fUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (fUser.purchasedList.includes(bookId)) {
      return NextResponse.json({ message: "Already in library" }, { status: 200 });
    }

    console.log("work comole")

    fUser.purchasedList.push(bookId);
    await fUser.save();

    return NextResponse.json({ message: "Book added to library", cartList: user.cartList }, { status: 200 });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
