import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

import connectMongo from "@/lib/connectMongo";
import User from "@/models/user";

export async function PUT(req) {
  try {
    await connectMongo();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId, username } = await req.json();

    if (!userId || !username) {
      return NextResponse.json({ message: "userId or username are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const existingUserWithId = await User.findOne({ username: userId });
    if (existingUserWithId && existingUserWithId.email !== session.user.email) {
      return NextResponse.json({ message: "User ID already taken" }, { status: 409 });
    }

    user.username = userId;
    user.firstName = username;

    await user.save();

    return NextResponse.json({ message: "User updated successfully", user }, { status: 200 });

  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
