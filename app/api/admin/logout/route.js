import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(new URL("/","http://localhost:3000"));
  res.cookies.set("token", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
