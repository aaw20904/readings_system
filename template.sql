-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: my_bot
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `counter`
--

DROP TABLE IF EXISTS `counter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `counter` (
  `counter_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `factory_num` bigint unsigned DEFAULT NULL,
  `estate_id` bigint unsigned NOT NULL,
  `verified` bigint unsigned DEFAULT NULL,
  `counter_type` bigint unsigned NOT NULL,
  PRIMARY KEY (`counter_id`),
  KEY `estate_id_idx` (`estate_id`),
  KEY `co_counter_type_idx` (`counter_type`),
  CONSTRAINT `co_counter_type` FOREIGN KEY (`counter_type`) REFERENCES `counter_type` (`counter_type`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `co_estate_id` FOREIGN KEY (`estate_id`) REFERENCES `real_estate` (`estate_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `counter`
--

LOCK TABLES `counter` WRITE;
/*!40000 ALTER TABLE `counter` DISABLE KEYS */;
/*!40000 ALTER TABLE `counter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `counter_provider`
--

DROP TABLE IF EXISTS `counter_provider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `counter_provider` (
  `counter_id` bigint unsigned NOT NULL,
  `provider_id` bigint unsigned NOT NULL,
  `account` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`counter_id`),
  KEY `cp_provider_id_idx` (`provider_id`),
  CONSTRAINT `cp_counter_id` FOREIGN KEY (`counter_id`) REFERENCES `counter` (`counter_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cp_provider_id` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`provider_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `counter_provider`
--

LOCK TABLES `counter_provider` WRITE;
/*!40000 ALTER TABLE `counter_provider` DISABLE KEYS */;
/*!40000 ALTER TABLE `counter_provider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `counter_type`
--

DROP TABLE IF EXISTS `counter_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `counter_type` (
  `counter_type` bigint unsigned NOT NULL AUTO_INCREMENT,
  `descr` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`counter_type`),
  UNIQUE KEY `descr_UNIQUE` (`descr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `counter_type`
--

LOCK TABLES `counter_type` WRITE;
/*!40000 ALTER TABLE `counter_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `counter_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `districts`
--

DROP TABLE IF EXISTS `districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `districts` (
  `district_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `district` varchar(45) NOT NULL,
  PRIMARY KEY (`district_id`),
  UNIQUE KEY `district_UNIQUE` (`district`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `districts`
--

LOCK TABLES `districts` WRITE;
/*!40000 ALTER TABLE `districts` DISABLE KEYS */;
/*!40000 ALTER TABLE `districts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `locality_key` bigint unsigned NOT NULL AUTO_INCREMENT,
  `locality_id` bigint unsigned NOT NULL,
  `district_id` bigint unsigned NOT NULL,
  `region_id` bigint unsigned NOT NULL,
  `loc_type` bigint unsigned NOT NULL,
  PRIMARY KEY (`locality_key`),
  KEY `loc_district_id_idx` (`district_id`),
  KEY `loc_region_id_idx` (`region_id`),
  KEY `loc_loc_type_idx` (`loc_type`),
  CONSTRAINT `loc_district_id` FOREIGN KEY (`district_id`) REFERENCES `districts` (`district_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `loc_loc_type` FOREIGN KEY (`loc_type`) REFERENCES `type_of_localities` (`loc_type`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `loc_locality_id` FOREIGN KEY (`locality_key`) REFERENCES `names_of_localities` (`locality_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `loc_region_id` FOREIGN KEY (`region_id`) REFERENCES `regions` (`region_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `names_of_localities`
--

DROP TABLE IF EXISTS `names_of_localities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `names_of_localities` (
  `locality_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `locality` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`locality_id`),
  UNIQUE KEY `locality_UNIQUE` (`locality`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `names_of_localities`
--

LOCK TABLES `names_of_localities` WRITE;
/*!40000 ALTER TABLE `names_of_localities` DISABLE KEYS */;
/*!40000 ALTER TABLE `names_of_localities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provider_credentials`
--

DROP TABLE IF EXISTS `provider_credentials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provider_credentials` (
  `user_id` bigint unsigned NOT NULL,
  `provider_id` bigint unsigned NOT NULL,
  `usr_login` varchar(45) DEFAULT NULL,
  `usr_password` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`provider_id`),
  KEY `pc_provider_id_idx` (`provider_id`),
  CONSTRAINT `pc_provider_id` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`provider_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pc_user_id` FOREIGN KEY (`user_id`) REFERENCES `user_mail` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provider_credentials`
--

LOCK TABLES `provider_credentials` WRITE;
/*!40000 ALTER TABLE `provider_credentials` DISABLE KEYS */;
/*!40000 ALTER TABLE `provider_credentials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `providers`
--

DROP TABLE IF EXISTS `providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `providers` (
  `provider_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `provider` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`provider_id`),
  UNIQUE KEY `provider_UNIQUE` (`provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `providers`
--

LOCK TABLES `providers` WRITE;
/*!40000 ALTER TABLE `providers` DISABLE KEYS */;
/*!40000 ALTER TABLE `providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `readings`
--

DROP TABLE IF EXISTS `readings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `readings` (
  `read_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `counter_id` bigint unsigned NOT NULL,
  `readings` bigint unsigned DEFAULT NULL,
  `time_s` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`read_id`),
  KEY `rd_counter_id_idx` (`counter_id`),
  CONSTRAINT `rd_counter_id` FOREIGN KEY (`counter_id`) REFERENCES `counter` (`counter_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `readings`
--

LOCK TABLES `readings` WRITE;
/*!40000 ALTER TABLE `readings` DISABLE KEYS */;
/*!40000 ALTER TABLE `readings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `real_estate`
--

DROP TABLE IF EXISTS `real_estate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `real_estate` (
  `estate_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `locality_key` bigint unsigned NOT NULL,
  `house` varchar(16) DEFAULT NULL,
  `flat` int DEFAULT NULL,
  PRIMARY KEY (`estate_id`),
  KEY `re_user_id_idx` (`user_id`),
  KEY `re_locality_key_idx` (`locality_key`),
  CONSTRAINT `re_locality_key` FOREIGN KEY (`locality_key`) REFERENCES `locations` (`locality_key`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `re_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `real_estate`
--

LOCK TABLES `real_estate` WRITE;
/*!40000 ALTER TABLE `real_estate` DISABLE KEYS */;
/*!40000 ALTER TABLE `real_estate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regions`
--

DROP TABLE IF EXISTS `regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regions` (
  `region_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `region` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`region_id`),
  UNIQUE KEY `region_UNIQUE` (`region`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regions`
--

LOCK TABLES `regions` WRITE;
/*!40000 ALTER TABLE `regions` DISABLE KEYS */;
/*!40000 ALTER TABLE `regions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `streets`
--

DROP TABLE IF EXISTS `streets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `streets` (
  `street_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `street` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`street_id`),
  UNIQUE KEY `street_UNIQUE` (`street`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `streets`
--

LOCK TABLES `streets` WRITE;
/*!40000 ALTER TABLE `streets` DISABLE KEYS */;
/*!40000 ALTER TABLE `streets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `streets_in_localities`
--

DROP TABLE IF EXISTS `streets_in_localities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `streets_in_localities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `locality_key` bigint unsigned NOT NULL,
  `street_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `si_locality_key_idx` (`locality_key`),
  KEY `si_street_id_idx` (`street_id`),
  CONSTRAINT `si_locality_key` FOREIGN KEY (`locality_key`) REFERENCES `locations` (`locality_key`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `si_street_id` FOREIGN KEY (`street_id`) REFERENCES `streets` (`street_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `streets_in_localities`
--

LOCK TABLES `streets_in_localities` WRITE;
/*!40000 ALTER TABLE `streets_in_localities` DISABLE KEYS */;
/*!40000 ALTER TABLE `streets_in_localities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_of_localities`
--

DROP TABLE IF EXISTS `type_of_localities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_of_localities` (
  `loc_type` bigint unsigned NOT NULL AUTO_INCREMENT,
  `descr` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`loc_type`),
  UNIQUE KEY `descr_UNIQUE` (`descr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_of_localities`
--

LOCK TABLES `type_of_localities` WRITE;
/*!40000 ALTER TABLE `type_of_localities` DISABLE KEYS */;
/*!40000 ALTER TABLE `type_of_localities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_mail`
--

DROP TABLE IF EXISTS `user_mail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_mail` (
  `email` varchar(45) NOT NULL,
  `user_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`email`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_mail`
--

LOCK TABLES `user_mail` WRITE;
/*!40000 ALTER TABLE `user_mail` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_mail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint unsigned NOT NULL,
  `passw` blob,
  `picture` blob,
  `uname` varchar(45) DEFAULT NULL,
  `salt` blob,
  `fail_a` int DEFAULT '0',
  `fail_date` bigint unsigned DEFAULT '0',
  `phone` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_mail` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-13 20:17:34
