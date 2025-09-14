import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const protectedRoutes = ["/dashboard", "/profile"]; // add protected paths here

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    try {
      jwt.verify(token, process.env.JWT_SECRET as string);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  return NextResponse.next();
}
