CREATE USER 'sample_user'@'%' IDENTIFIED BY 'password';
GRANT ALL ON *.* TO 'sample_user'@'%';
FLUSH PRIVILEGES;
select * from mysql.user;

CREATE DATABASE `todo`;
USE `todo`;
CREATE TABLE `todo`.`todo_list` (
	`id` INT NOT NULL AUTO_INCREMENT,
  `uuid` BINARY(16)  NOT NULL DEFAULT (UUID_TO_BIN(UUID(), TRUE)),
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` VARCHAR(100) NOT NULL,
  `finished` boolean DEFAULT FALSE,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;