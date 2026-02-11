/*
  Warnings:

  - You are about to drop the column `date` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `staff_id` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `end_time` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "date",
DROP COLUMN "staff_id",
DROP COLUMN "time",
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL;
