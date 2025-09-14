import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs"; // Ensure using Node runtime

// -------------------
// GET /api/users → fetch all users
// -------------------
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        email: true, 
        firstName: true, 
        lastName: true, 
        createdAt: true 
      }, // exclude password
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching users", details: String(error) },
      { status: 500 }
    );
  }
}

// -------------------
// POST /api/users → create a new user
// -------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ validate required fields
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { error: "First name, last name, email, and password are required" },
        { status: 400 }
      );
    }

    // ✅ check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // ✅ create user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        password: hashedPassword,
        phone: body.phone ?? null,
      },
    });

    // ✅ remove password before sending response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating user", details: String(error) },
      { status: 500 }
    );
  }
}
