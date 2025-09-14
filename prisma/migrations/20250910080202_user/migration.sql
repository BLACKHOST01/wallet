/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Changed the type of `accountType` on the `BankAccount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('Savings', 'CURRENT', 'FIXED_DEPOSIT');

-- AlterTable
ALTER TABLE "public"."BankAccount" DROP COLUMN "accountType",
ADD COLUMN     "accountType" "public"."AccountType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT;
