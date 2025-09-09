import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

// Generate random 10-digit account number
function generateAccountNumber(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

// Ensure uniqueness with retries
async function generateUniqueAccountNumber(): Promise<string> {
  let accountNumber: string;
  let exists = true;

  while (exists) {
    accountNumber = generateAccountNumber();

    const existing = await prisma.bankAccount.findUnique({
      where: { accountNumber },
      select: { id: true },
    });

    exists = !!existing;
  }

  return accountNumber!;
}

// Middleware: auto-assign unique account number on BankAccount creation
prisma.$use(async (params, next) => {
  if (params.model === "BankAccount" && params.action === "create") {
    if (!params.args.data.accountNumber) {
      params.args.data.accountNumber = await generateUniqueAccountNumber();
    }
  }
  return next(params);
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
