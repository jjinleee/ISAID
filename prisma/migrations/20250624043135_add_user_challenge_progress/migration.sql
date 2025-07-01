/*
  Warnings:

  - You are about to drop the column `targetval` on the `challenge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `challenge` DROP COLUMN `targetval`,
    MODIFY `code` VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE `user_challenge_progress` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `challenge_id` BIGINT NOT NULL,
    `progress_val` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `user_challenge_progress_user_id_challenge_id_key`(`user_id`, `challenge_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_challenge_progress` ADD CONSTRAINT `user_challenge_progress_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_challenge_progress` ADD CONSTRAINT `user_challenge_progress_challenge_id_fkey` FOREIGN KEY (`challenge_id`) REFERENCES `challenge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
