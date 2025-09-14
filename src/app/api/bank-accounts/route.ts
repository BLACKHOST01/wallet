export const runtime = "nodejs"; // Required for $use to work

import prisma from "@/lib/prisma-middleware";

// Create a new bank account
export async function POST(req: Request) {
  const body = await req.json();

  try {
    const newAccount = await prisma.bankAccount.create({
      data: body, // no need to include accountNumber, middleware handles it
    });

    return new Response(JSON.stringify(newAccount), { status: 201 });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong" }),
      { status: 500 }
    );
  }
}

// Get all bank accounts
export async function GET() {
  try {
    const accounts = await prisma.bankAccount.findMany();
    return new Response(JSON.stringify(accounts), { status: 200 });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong" }),
      { status: 500 }
    );
  }
}
