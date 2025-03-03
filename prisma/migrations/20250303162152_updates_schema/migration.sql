/*
  Warnings:

  - Added the required column `typeId` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `typeId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `Types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
