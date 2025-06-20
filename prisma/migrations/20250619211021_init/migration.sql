-- CreateTable
CREATE TABLE `Complaint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCustomer` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `area` VARCHAR(191) NOT NULL,
    `timeStartComplain` DATETIME(3) NOT NULL,
    `timeCloseComplain` DATETIME(3) NOT NULL,
    `complaintDurationHours` DOUBLE NOT NULL,
    `picHandlingComplain` VARCHAR(191) NOT NULL,
    `timeShifting` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
