CREATE SCHEMA `posts`;

CREATE TABLE `posts`.`communities` (
    `community_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`community_id`)
);

CREATE TABLE `posts`.`posts` (
    `post_id` INT UNSIGNED NOT NULL,
    `community_id` INT UNSIGNED NOT NULL,
    `content` TEXT NOT NULL,
    `date_published` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`post_id`)
);

CREATE TABLE `posts`.`photos` (
    `photo_id` INT UNSIGNED NOT NULL,
    `post_id` INT UNSIGNED NOT NULL,
    `url_large` VARCHAR(255),
    `url_medium` VARCHAR(255),
    `url_small` VARCHAR(255),
    PRIMARY KEY (`photo_id`),
    INDEX `idx_post_id` (`post_id`)
);