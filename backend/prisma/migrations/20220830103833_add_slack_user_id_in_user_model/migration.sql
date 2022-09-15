/*
  Warnings:

  - A unique constraint covering the columns `[slack_user_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slack_user_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "slack_user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_slack_user_id_key" ON "User"("slack_user_id");
