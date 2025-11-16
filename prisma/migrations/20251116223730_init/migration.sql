/*
  Warnings:

  - You are about to drop the column `createdByUserId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `locationName` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `routePolyline` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `Ride` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Ride" DROP CONSTRAINT "Ride_userId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "createdByUserId",
DROP COLUMN "locationName",
DROP COLUMN "routePolyline",
DROP COLUMN "title",
ADD COLUMN     "location" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "Ride";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "UserRole";
