import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // ✅ now you can fetch user-specific data
  return NextResponse.json({ message: "Protected route success", decoded });
}
