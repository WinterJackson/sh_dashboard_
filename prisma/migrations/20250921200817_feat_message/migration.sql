/*
  Warnings:

  - You are about to drop the column `readAt` on the `ReadReceipt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "editedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ReadReceipt" DROP COLUMN "readAt",
ADD COLUMN     "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
