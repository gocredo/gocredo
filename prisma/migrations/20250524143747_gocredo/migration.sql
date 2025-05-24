/*
  Warnings:

  - You are about to drop the column `userId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the `_AppointmentToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AppointmentToUser" DROP CONSTRAINT "_AppointmentToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_AppointmentToUser" DROP CONSTRAINT "_AppointmentToUser_B_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "userId";

-- DropTable
DROP TABLE "_AppointmentToUser";
