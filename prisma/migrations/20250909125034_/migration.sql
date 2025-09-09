/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountType` to the `BankAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `BankAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- DropIndex
DROP INDEX "public"."BankAccount_userId_key";

-- DropIndex
DROP INDEX "public"."Wallet_userId_key";

-- AlterTable
ALTER TABLE "public"."BankAccount" ADD COLUMN     "accountType" TEXT NOT NULL,
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "currency" "public"."Currency" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "fromAccountId" TEXT,
ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "status" "public"."TransactionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "toAccountId" TEXT,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "walletId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Wallet" ADD COLUMN     "linkedAccount" TEXT;

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_key" ON "public"."Transaction"("reference");

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "public"."BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "public"."BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
