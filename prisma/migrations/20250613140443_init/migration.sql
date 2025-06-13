-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `eng_name` VARCHAR(20) NULL,
    `email` VARCHAR(30) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `rrn` VARCHAR(20) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `telno` VARCHAR(20) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_rrn_key`(`rrn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etf_category` (
    `id` INTEGER NOT NULL,
    `asset_class` VARCHAR(50) NOT NULL,
    `asset_type` VARCHAR(50) NULL,
    `asset_subtype` VARCHAR(50) NULL,
    `full_path` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etf` (
    `id` INTEGER NOT NULL,
    `etf_category_id` INTEGER NOT NULL,
    `issue_std_code` VARCHAR(191) NULL,
    `issue_code` VARCHAR(191) NULL,
    `issue_name` VARCHAR(191) NULL,
    `issue_name_ko` VARCHAR(191) NULL,
    `issue_name_abbrv` VARCHAR(191) NULL,
    `issue_name_en` VARCHAR(191) NULL,
    `list_date` DATETIME(3) NULL,
    `etf_obj_index_name` VARCHAR(191) NULL,
    `idx_obj_index_name` VARCHAR(191) NULL,
    `idx_calc_inst_nm1` VARCHAR(191) NULL,
    `idx_calc_inst_nm2` VARCHAR(191) NULL,
    `etf_replication_method` VARCHAR(191) NULL,
    `idx_market_type` VARCHAR(191) NULL,
    `idx_asset_type` VARCHAR(191) NULL,
    `list_shrs` BIGINT NULL,
    `com_abbrv` VARCHAR(191) NULL,
    `cu_qtv` INTEGER NULL,
    `etf_total_fee` DECIMAL(5, 2) NULL,
    `tax_type` VARCHAR(191) NULL,
    `return_1y` DECIMAL(5, 2) NULL,
    `trace_err_rate` DECIMAL(5, 2) NULL,
    `net_asset_total_amount` BIGINT NULL,
    `divergence_rate` DECIMAL(5, 2) NULL,
    `volatility` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etf_pdf` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `etf_id` INTEGER NOT NULL,
    `compst_issue_code` VARCHAR(191) NULL,
    `compst_issue_name` VARCHAR(191) NULL,
    `compst_issue_cu1_shares` DECIMAL(15, 2) NULL,
    `value_amount` BIGINT NULL,
    `compst_amount` BIGINT NULL,
    `compst_ratio` DECIMAL(5, 2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etf_daily_trading` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `etf_id` INTEGER NOT NULL,
    `base_date` DATETIME(3) NULL,
    `issue_code` VARCHAR(191) NULL,
    `issue_name` VARCHAR(191) NULL,
    `cmp_prevdd_price` DECIMAL(10, 2) NULL,
    `fluc_rate` DECIMAL(5, 2) NULL,
    `tdd_close_price` DECIMAL(10, 2) NULL,
    `nav` DECIMAL(10, 2) NULL,
    `tdd_open_price` DECIMAL(10, 2) NULL,
    `tdd_high_price` DECIMAL(10, 2) NULL,
    `tdd_low_price` DECIMAL(10, 2) NULL,
    `acc_trade_volume` BIGINT NULL,
    `acc_total_value` BIGINT NULL,
    `market_cap` BIGINT NULL,
    `net_asset_total_amount` BIGINT NULL,
    `list_shrs` BIGINT NULL,
    `idx_ind_nm` VARCHAR(191) NULL,
    `obj_stkprc_idx` DECIMAL(10, 2) NULL,
    `cmpprevdd_idx` DECIMAL(10, 2) NULL,
    `fluc_rt_idx` DECIMAL(5, 2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invest_type` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `invest_type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_etf_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `etf_category_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question_category` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` INTEGER NOT NULL,
    `question_order` INTEGER NOT NULL,
    `question_text` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `questionCategoryId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `answer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question_id` INTEGER NOT NULL,
    `answer_order` INTEGER NOT NULL,
    `answer_text` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `isa_ccount` (
    `id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `bank_code` VARCHAR(30) NOT NULL,
    `account_num` VARCHAR(191) NOT NULL,
    `connected_at` DATETIME(3) NOT NULL,
    `current_balance` INTEGER NOT NULL,
    `account_type` VARCHAR(191) NOT NULL,
    `account_kind` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `instrument` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `holding` (
    `id` INTEGER NOT NULL,
    `instrument_id` INTEGER NOT NULL,
    `account_id` INTEGER NOT NULL,
    `quantity` INTEGER NULL,
    `avg_cost` INTEGER NOT NULL,
    `evaluated_amount` VARCHAR(191) NULL,
    `market_price` VARCHAR(191) NULL,
    `principal` DECIMAL(20, 2) NOT NULL,
    `market_value` DECIMAL(20, 2) NOT NULL,
    `unreal_gain` DECIMAL(20, 2) NOT NULL,
    `return_rate` DECIMAL(7, 4) NULL,
    `acquired_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction` (
    `id` INTEGER NOT NULL,
    `instrument_id` INTEGER NOT NULL,
    `account_id` INTEGER NOT NULL,
    `etf_id` INTEGER NULL,
    `type` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(20, 6) NULL,
    `price` DECIMAL(20, 6) NULL,
    `amount_won` DECIMAL(20, 6) NOT NULL,
    `transaction_at` DATETIME(3) NOT NULL,
    `fee` DECIMAL(20, 6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_snapshot` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `date` DATETIME(3) NULL,
    `total_asset_value` VARCHAR(191) NULL,
    `cumulative_return` VARCHAR(191) NULL,
    `daily_return` VARCHAR(191) NULL,
    `memo` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `etf` ADD CONSTRAINT `etf_etf_category_id_fkey` FOREIGN KEY (`etf_category_id`) REFERENCES `etf_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etf_pdf` ADD CONSTRAINT `etf_pdf_etf_id_fkey` FOREIGN KEY (`etf_id`) REFERENCES `etf`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etf_daily_trading` ADD CONSTRAINT `etf_daily_trading_etf_id_fkey` FOREIGN KEY (`etf_id`) REFERENCES `etf`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invest_type` ADD CONSTRAINT `invest_type_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_etf_category` ADD CONSTRAINT `user_etf_category_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_etf_category` ADD CONSTRAINT `user_etf_category_etf_category_id_fkey` FOREIGN KEY (`etf_category_id`) REFERENCES `etf_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question` ADD CONSTRAINT `question_questionCategoryId_fkey` FOREIGN KEY (`questionCategoryId`) REFERENCES `question_category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answer` ADD CONSTRAINT `answer_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `isa_ccount` ADD CONSTRAINT `isa_ccount_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `holding` ADD CONSTRAINT `holding_instrument_id_fkey` FOREIGN KEY (`instrument_id`) REFERENCES `instrument`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_instrument_id_fkey` FOREIGN KEY (`instrument_id`) REFERENCES `instrument`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_etf_id_fkey` FOREIGN KEY (`etf_id`) REFERENCES `etf`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_snapshot` ADD CONSTRAINT `daily_snapshot_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
