-- AlterEnum
ALTER TYPE "MessageType" ADD VALUE 'AUDIO';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isUrgent" BOOLEAN NOT NULL DEFAULT false;
