/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `CustomerUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CustomerUser_clerkId_key" ON "CustomerUser"("clerkId");
