/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionToken]` on the table `session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expires` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionToken` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."session_token_key";

-- AlterTable
ALTER TABLE "session" DROP COLUMN "expiresAt",
DROP COLUMN "token",
ADD COLUMN     "expires" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sessionToken" TEXT NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "session_sessionToken_key" ON "session"("sessionToken");
