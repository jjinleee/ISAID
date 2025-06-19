-- CreateTable
CREATE TABLE `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `eng_name` VARCHAR(20) NULL,
    `email` VARCHAR(30) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `pin_code` VARCHAR(10) NULL,
    `rrn` VARCHAR(20) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `telno` VARCHAR(20) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `reward_agreed` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_rrn_key`(`rrn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `challenge` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `etf_id` BIGINT NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `title` VARCHAR(50) NOT NULL,
    `challenge_type` ENUM('ONCE', 'DAILY', 'STREAK') NOT NULL,
    `quantity` DECIMAL(20, 6) NOT NULL,
    `targetval` INTEGER NULL,

    UNIQUE INDEX `challenge_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_challenge_claim` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `challenge_id` BIGINT NOT NULL,
    `claim_date` DATETIME(3) NOT NULL,
    `claimed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_challenge_claim_user_id_challenge_id_claim_date_key`(`user_id`, `challenge_id`, `claim_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etf_category` (
    `id` BIGINT NOT NULL,
    `asset_class` VARCHAR(50) NOT NULL,
    `asset_type` VARCHAR(50) NULL,
    `asset_subtype` VARCHAR(50) NULL,
    `full_path` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etf` (
    `id` BIGINT NOT NULL,
    `etf_category_id` BIGINT NOT NULL,
    `issue_std_code` VARCHAR(191) NULL,
    `issue_code` VARCHAR(191) NULL,
    `issue_name` VARCHAR(191) NULL,
    `issue_name_ko` VARCHAR(191) NULL,
    `issue_name_abbrv` VARCHAR(191) NULL,
    `issue_name_en` VARCHAR(191) NULL,
    `list_date` DATETIME(3) NULL,
    `etf_obj_index_name` VARCHAR(191) NULL,
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
    `risk_grade` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etf_pdf` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `etf_id` BIGINT NOT NULL,
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
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `etf_id` BIGINT NOT NULL,
    `base_date` DATETIME(3) NOT NULL,
    `issue_code` VARCHAR(191) NOT NULL,
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

    UNIQUE INDEX `etf_daily_trading_etf_id_base_date_key`(`etf_id`, `base_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `investment_profile` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `invest_type` ENUM('CONSERVATIVE', 'MODERATE', 'NEUTRAL', 'ACTIVE', 'AGGRESSIVE') NOT NULL,

    UNIQUE INDEX `investment_profile_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_etf_category` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `etf_category_id` BIGINT NOT NULL,

    UNIQUE INDEX `user_etf_category_user_id_etf_category_id_key`(`user_id`, `etf_category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_calendar` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `solved_date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `quiz_calendar_user_id_solved_date_key`(`user_id`, `solved_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `selection` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `question_id` BIGINT NOT NULL,
    `content` VARCHAR(100) NOT NULL,
    `answer_flag` BOOLEAN NOT NULL,

    UNIQUE INDEX `selection_question_id_content_key`(`question_id`, `content`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `isa_account` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `bank_code` VARCHAR(30) NOT NULL,
    `account_num` VARCHAR(191) NOT NULL,
    `connected_at` DATETIME(3) NOT NULL,
    `current_balance` DECIMAL(20, 6) NOT NULL,
    `account_type` VARCHAR(191) NOT NULL,
    `payment_amount` BIGINT NOT NULL,

    UNIQUE INDEX `isa_account_user_id_key`(`user_id`),
    UNIQUE INDEX `isa_account_account_num_key`(`account_num`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `financial_product` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `instrument_type` ENUM('FUND', 'ELS', 'BOND') NOT NULL,
    `product_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `general_holding_snapshot` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `isa_account_id` BIGINT NOT NULL,
    `instrument_type` ENUM('FUND', 'ELS', 'BOND') NOT NULL,
    `snapshot_date` DATETIME(3) NOT NULL,
    `evaluated_amount` DECIMAL(20, 2) NOT NULL,

    UNIQUE INDEX `general_holding_snapshot_isa_account_id_snapshot_date_key`(`isa_account_id`, `snapshot_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etf_holding_snapshot` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `isa_account_id` BIGINT NOT NULL,
    `etf_id` BIGINT NOT NULL,
    `snapshot_date` DATETIME(3) NOT NULL,
    `evaluated_amount` DECIMAL(20, 2) NOT NULL,

    UNIQUE INDEX `etf_holding_snapshot_isa_account_id_etf_id_snapshot_date_key`(`isa_account_id`, `etf_id`, `snapshot_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etf_holding` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `etf_id` BIGINT NOT NULL,
    `isa_account_id` BIGINT NOT NULL,
    `quantity` DECIMAL(20, 6) NOT NULL,
    `avg_cost` DECIMAL(20, 2) NOT NULL,
    `acquired_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `etf_holding_isa_account_id_etf_id_key`(`isa_account_id`, `etf_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `general_holding` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,
    `isa_account_id` BIGINT NOT NULL,
    `total_cost` DECIMAL(20, 2) NULL,
    `acquired_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `general_holding_isa_account_id_product_id_key`(`isa_account_id`, `product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etf_transaction` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `etf_id` BIGINT NOT NULL,
    `isa_account_id` BIGINT NOT NULL,
    `transaction_type` ENUM('BUY', 'SELL', 'DIVIDEND', 'INTEREST') NOT NULL,
    `quantity` DECIMAL(20, 6) NOT NULL,
    `price` DECIMAL(20, 6) NOT NULL,
    `transaction_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `general_transaction` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,
    `isa_account_id` BIGINT NOT NULL,
    `transaction_type` ENUM('BUY', 'SELL', 'DIVIDEND', 'INTEREST') NOT NULL,
    `price` DECIMAL(20, 6) NULL,
    `transaction_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monthly_return` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `isa_account_id` BIGINT NOT NULL,
    `base_date` DATETIME(3) NOT NULL,
    `entire_profit` DECIMAL(20, 6) NOT NULL,

    UNIQUE INDEX `monthly_return_isa_account_id_base_date_key`(`isa_account_id`, `base_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `challenge` ADD CONSTRAINT `challenge_etf_id_fkey` FOREIGN KEY (`etf_id`) REFERENCES `etf`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_challenge_claim` ADD CONSTRAINT `user_challenge_claim_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_challenge_claim` ADD CONSTRAINT `user_challenge_claim_challenge_id_fkey` FOREIGN KEY (`challenge_id`) REFERENCES `challenge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etf` ADD CONSTRAINT `etf_etf_category_id_fkey` FOREIGN KEY (`etf_category_id`) REFERENCES `etf_category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etf_pdf` ADD CONSTRAINT `etf_pdf_etf_id_fkey` FOREIGN KEY (`etf_id`) REFERENCES `etf`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etf_daily_trading` ADD CONSTRAINT `etf_daily_trading_etf_id_fkey` FOREIGN KEY (`etf_id`) REFERENCES `etf`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `investment_profile` ADD CONSTRAINT `investment_profile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_etf_category` ADD CONSTRAINT `user_etf_category_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_etf_category` ADD CONSTRAINT `user_etf_category_etf_category_id_fkey` FOREIGN KEY (`etf_category_id`) REFERENCES `etf_category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_calendar` ADD CONSTRAINT `quiz_calendar_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `selection` ADD CONSTRAINT `selection_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `isa_account` ADD CONSTRAINT `isa_account_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `general_holding_snapshot` ADD CONSTRAINT `general_holding_snapshot_isa_account_id_fkey` FOREIGN KEY (`isa_account_id`) REFERENCES `isa_account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etf_holding_snapshot` ADD CONSTRAINT `etf_holding_snapshot_isa_account_id_fkey` FOREIGN KEY (`isa_account_id`) REFERENCES `isa_account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etf_holding_snapshot` ADD CONSTRAINT `etf_holding_snapshot_etf_id_fkey` FOREIGN KEY (`etf_id`) REFERENCES `etf`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etf_holding` ADD CONSTRAINT `etf_holding_etf_id_fkey` FOREIGN KEY (`etf_id`) REFERENCES `etf`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etf_holding` ADD CONSTRAINT `etf_holding_isa_account_id_fkey` FOREIGN KEY (`isa_account_id`) REFERENCES `isa_account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `general_holding` ADD CONSTRAINT `general_holding_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `financial_product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `general_holding` ADD CONSTRAINT `general_holding_isa_account_id_fkey` FOREIGN KEY (`isa_account_id`) REFERENCES `isa_account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etf_transaction` ADD CONSTRAINT `etf_transaction_etf_id_fkey` FOREIGN KEY (`etf_id`) REFERENCES `etf`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etf_transaction` ADD CONSTRAINT `etf_transaction_isa_account_id_fkey` FOREIGN KEY (`isa_account_id`) REFERENCES `isa_account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `general_transaction` ADD CONSTRAINT `general_transaction_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `financial_product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `general_transaction` ADD CONSTRAINT `general_transaction_isa_account_id_fkey` FOREIGN KEY (`isa_account_id`) REFERENCES `isa_account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monthly_return` ADD CONSTRAINT `monthly_return_isa_account_id_fkey` FOREIGN KEY (`isa_account_id`) REFERENCES `isa_account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
