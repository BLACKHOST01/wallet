import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, phone } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // wrap inside transaction so user, bank account, and wallet are created together
    const result = await prisma.$transaction(async (tx) => {
      // create user
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          phone,
        },
      });

      // generate a random 10-digit account number
      const accountNumber = String(Math.floor(1000000000 + Math.random() * 9000000000));

      // create default savings account
      await tx.bankAccount.create({
        data: {
          accountNumber,
          userId: user.id,
          accountType: "Savings",   // default
          balance: 0,
          currency: "NGN",          // default currency
        },
      });

      // create default wallet
      await tx.wallet.create({
        data: {
          name: "Main Wallet",
          userId: user.id,
          balance: 0,
          currency: "NGN",
        },
      });

      return user;
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { id: result.id, email: result.email, firstName: result.firstName },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Registration failed", details: String(error) },
      { status: 500 }
    );
  }
}
