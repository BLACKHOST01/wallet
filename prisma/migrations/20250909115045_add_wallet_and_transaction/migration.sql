/*
  Warnings:

  - Changed the type of `type` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `currency` on the `Wallet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');

-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('NGN', 'USD', 'EUR', 'GBP');

-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "type",
ADD COLUMN     "type" "public"."TransactionType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Wallet" DROP COLUMN "currency",
ADD COLUMN     "currency" "public"."Currency" NOT NULL;
