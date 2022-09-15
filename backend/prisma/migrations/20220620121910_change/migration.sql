/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `slack_id` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[team_id]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creator` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_teamId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_teamId_fkey";

-- DropIndex
DROP INDEX "Channel_creatorId_key";

-- DropIndex
DROP INDEX "Channel_teamId_key";

-- DropIndex
DROP INDEX "Team_slack_id_key";

-- DropIndex
DROP INDEX "User_teamId_key";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "creatorId",
DROP COLUMN "teamId",
ADD COLUMN     "creator" TEXT NOT NULL,
ADD COLUMN     "team_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "slack_id",
ADD COLUMN     "team_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "teamId",
ADD COLUMN     "team_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_team_id_key" ON "Team"("team_id");
