/*
  Warnings:

  - You are about to drop the column `tumbnail` on the `artikel` table. All the data in the column will be lost.
  - Added the required column `thumbnail` to the `Artikel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `artikel` DROP FOREIGN KEY `Artikel_categoryId_fkey`;

-- DropIndex
DROP INDEX `Artikel_categoryId_fkey` ON `artikel`;

-- AlterTable
ALTER TABLE `artikel` DROP COLUMN `tumbnail`,
    ADD COLUMN `thumbnail` VARCHAR(191) NOT NULL,
    MODIFY `categoryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Artikel` ADD CONSTRAINT `Artikel_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
