import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/users → fetch all users
export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, createdAt: true }, // exclude password
  });
  return NextResponse.json(users);
}

// POST /api/users → create new user
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
      },
    });

    // strip password before returning
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating user", details: String(error) },
      { status: 500 }
    );
  }
}
