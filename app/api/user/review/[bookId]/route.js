import { getServerSession } from "next-auth";
import connectMongo from "@/lib/connectMongo";
import User from "@/models/user";
import Book from "@/models/book";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.redirect(new URL("/user/login", request.url));
  }

  const { bookId } = await params;
  const { userId, title, message, stars } = await req.json();

  try {
    await connectMongo();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.email !== session.user.email) {
      return NextResponse.json(
        { message: "Identity mismatch" },
        { status: 403 }
      );
    }

    const hasPurchased = user.purchasedList.includes(bookId);
    if (!hasPurchased) {
      return NextResponse.json(
        { message: "Book not purchased" },
        { status: 403 }
      );
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    const alreadyReviewed = book.reviews.some(
      (review) => review.from.userId?.toString() === userId
    );
    if (alreadyReviewed) {
      return NextResponse.json(
        { message: "Already reviewed" },
        { status: 400 }
      );
    }

    const newReview = {
      from: {
        name:  user.firstName,
        avatar: session.user.image || "",
        userId: user.username,
        id: user._id,
      },
      rating: stars,
      title,
      message,
    };

    book.reviews.push(newReview);
    await book.save();

    return NextResponse.json(
      { message: "Review submitted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error submitting review:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
