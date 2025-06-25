-- AlterTable
ALTER TABLE `challenge` ADD COLUMN `streak_days` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `pin_code` VARCHAR(100) NULL;
