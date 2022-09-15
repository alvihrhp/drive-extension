/*
  Warnings:

  - You are about to drop the column `google_userId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[google_user_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `google_user_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_google_userId_key";

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "folder_id" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "google_userId",
ADD COLUMN     "google_user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_google_user_id_key" ON "User"("google_user_id");
