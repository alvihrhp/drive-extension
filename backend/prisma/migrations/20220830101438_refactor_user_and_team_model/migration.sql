/*
  Warnings:

  - You are about to drop the column `team_id` on the `User` table. All the data in the column will be lost.
  - Added the required column `access_token` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "team_id";

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
