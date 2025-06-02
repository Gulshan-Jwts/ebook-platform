import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from 'bcrypt';
import connectMongo from "@/lib/connectMongo";

export async function POST(req) {
  if (process.env.NODE_ENV === "development") {
    try {
      await connectMongo();
      const body = await req.json();

      const { email, password, username, secret, firstName } = body;

      if (!email || !password || !username || !secret) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      if (secret != process.env.ADMIN_SECRET) {
        console.log(secret);
        console.log(process.env.ADMIN_SECRET);
        return NextResponse.json(
          { error: "you're not an admin" },
          { status: 400 }
        );
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: "Admin already exists" },
          { status: 409 }
        );
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await User.create({
        email,
        password: hashedPassword,
        username,
        firstName,
        isAdmin: true,
      });

      return NextResponse.json({ user: newUser }, { status: 201 });
    } catch (error) {
      console.error("User creation error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ error: "environment does not supported" }, { status: 500 });
}
