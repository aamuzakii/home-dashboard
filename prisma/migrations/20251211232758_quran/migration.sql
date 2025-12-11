-- AlterTable
ALTER TABLE "User" ADD COLUMN     "quranMinutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quranObligationMinutes" INTEGER NOT NULL DEFAULT 210;
