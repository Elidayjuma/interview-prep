-- CreateTable
CREATE TABLE `Job` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `source` ENUM('GREENHOUSE', 'REMOTE_OK') NOT NULL,
    `externalId` VARCHAR(191) NULL,
    `url` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `remoteType` VARCHAR(191) NULL,
    `employmentType` VARCHAR(191) NULL,
    `salaryMin` INTEGER NULL,
    `salaryMax` INTEGER NULL,
    `currency` VARCHAR(191) NULL,
    `postedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NULL,
    `tags` JSON NULL,
    `description` TEXT NULL,
    `status` ENUM('ACTIVE', 'EXPIRED', 'CLOSED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Job_title_idx`(`title`),
    UNIQUE INDEX `Job_source_externalId_key`(`source`, `externalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
