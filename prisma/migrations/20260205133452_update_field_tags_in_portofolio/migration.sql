/*
  Warnings:

  - You are about to drop the column `tag` on the `portofolio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `portofolio` DROP COLUMN `tag`;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PortofolioToTag` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PortofolioToTag_AB_unique`(`A`, `B`),
    INDEX `_PortofolioToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PortofolioToTag` ADD CONSTRAINT `_PortofolioToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `Portofolio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PortofolioToTag` ADD CONSTRAINT `_PortofolioToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
