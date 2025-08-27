/*
 Navicat Premium Dump SQL

 Source Server         : Cpanel
 Source Server Type    : MySQL
 Source Server Version : 100622 (10.6.22-MariaDB-cll-lve)
 Source Host           : 208.109.20.5:3306
 Source Schema         : tp_appointment_pe

 Target Server Type    : MySQL
 Target Server Version : 100622 (10.6.22-MariaDB-cll-lve)
 File Encoding         : 65001

 Date: 27/08/2025 02:29:35
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for appointments
-- ----------------------------
DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `appointment_id` varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `insured_id` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `schedule_id` int NOT NULL,
  `status` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `country_iso` char(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_appointment_id`(`appointment_id` ASC) USING BTREE,
  INDEX `scheduled`(`schedule_id` ASC) USING BTREE,
  CONSTRAINT `scheduled` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`schedule_id`) ON DELETE NO ACTION ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of appointments
-- ----------------------------
INSERT INTO `appointments` VALUES (1, '01K3M1S3WYCX92SY988Y0TRKAW', '01234', 100, NULL, 'PE', '2025-08-26 13:40:46', '2025-08-26 13:40:46', 0);
INSERT INTO `appointments` VALUES (2, '01K3M34SVY4T21BFA295KMT0NP', '01234', 100, NULL, 'PE', '2025-08-26 14:04:38', '2025-08-26 14:04:38', 0);
INSERT INTO `appointments` VALUES (3, '01K3M5DRGE1DM5S721JQPRW5Z6', '01234', 100, 'COMPLETED', 'PE', '2025-08-26 14:44:28', '2025-08-26 14:44:28', 0);
INSERT INTO `appointments` VALUES (4, '01K3N08BQEP4XV8N87CHNPVVC7', '01234', 100, 'COMPLETED', 'PE', '2025-08-26 22:33:23', '2025-08-26 22:33:23', 0);
INSERT INTO `appointments` VALUES (5, '01K3N09KAVFYNR8RPDXNVRBRXA', '01234', 100, 'COMPLETED', 'PE', '2025-08-26 22:34:03', '2025-08-26 22:34:03', 0);
INSERT INTO `appointments` VALUES (6, '01K3N3KEGWKG9YYJPFQK2HSCPK', '01234', 100, 'COMPLETED', 'PE', '2025-08-26 23:31:52', '2025-08-26 23:31:52', 0);

-- ----------------------------
-- Table structure for schedules
-- ----------------------------
DROP TABLE IF EXISTS `schedules`;
CREATE TABLE `schedules`  (
  `schedule_id` int NOT NULL AUTO_INCREMENT,
  `center_id` int NOT NULL,
  `specialty_id` int NOT NULL,
  `medic_id` int NOT NULL,
  `date` datetime NOT NULL,
  `status` enum('available','booked','cancelled') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`schedule_id`) USING BTREE,
  INDEX `idx_center_date`(`center_id` ASC, `date` ASC) USING BTREE,
  INDEX `idx_medic_date`(`medic_id` ASC, `date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1002 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of schedules
-- ----------------------------
INSERT INTO `schedules` VALUES (100, 1, 2, 10, '2024-09-30 12:30:00', 'available', '2025-08-25 21:20:19', '2025-08-26 13:00:49');
INSERT INTO `schedules` VALUES (101, 1, 2, 10, '2024-09-30 13:00:00', 'available', '2025-08-25 21:20:19', '2025-08-26 13:00:59');
INSERT INTO `schedules` VALUES (102, 2, 3, 15, '2024-10-01 09:00:00', 'available', '2025-08-25 21:20:19', '2025-08-26 13:00:56');

SET FOREIGN_KEY_CHECKS = 1;
