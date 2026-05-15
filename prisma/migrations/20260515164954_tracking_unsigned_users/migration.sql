-- AlterTable
ALTER TABLE `Education` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `UserDetail` MODIFY `professionalSummary` TEXT NULL;

-- CreateTable
CREATE TABLE `UnregisteredRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ip` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UnregisteredRequest_ip_date_idx`(`ip`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
