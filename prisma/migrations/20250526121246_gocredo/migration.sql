/*
  Warnings:

  - Added the required column `clerkId` to the `CustomerUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomerUser" ADD COLUMN     "clerkId" TEXT NOT NULL;
