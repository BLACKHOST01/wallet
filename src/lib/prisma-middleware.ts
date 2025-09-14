import { prisma } from "./prisma";

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
// This runs only in Node.js runtime
prisma.$use(async (params, next) => {
  if (params.model === "BankAccount" && params.action === "create") {
    if (!params.args.data.accountNumber) {
      params.args.data.accountNumber = await generateUniqueAccountNumber();
    }
  }
  return next(params);
});

export default prisma;
