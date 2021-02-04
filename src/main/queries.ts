export enum SELECTOR_ITEMS {
  auction = "select id, auctionName, id_auctioneer, id_type " +
    "from auction",
  auctioneer = "select id, auctioneerName, id_city " +
    "from auctioneer",
  auction_lot = "select id, lotName, id_category, id_auction " +
    "from auction_lot",
  auction_member = "select auction_member.id, fio, id_person, id_auction " +
    "from auction_member inner join person " +
    "on auction_member.id_person = person.id",
  auction_type = "select id, typeName " +
    "from auction_type",
  category = "select id, categoryName " +
    "from category",
  city = "select city.id, cityName, id_country, countryName " +
    "from city inner join country " +
    "on city.id_country = country.id",
  country = "select id, countryName " +
    "from country",
  person = "select id, fio " +
    "from person",
  website = "select id, websiteName " +
    "from website",
  bet = "select bet.id, fio, cost_increment, lotName " +
    "from bet inner join auction_member inner join person inner join auction_lot " +
    "on bet.id_member = auction_member.id and auction_member.id_person = person.id and bet.id_lot = auction_lot.id"
}

export enum MAIN {
  daily = "select auction.*, id_city, id_country " +
    "from auction inner join auctioneer inner join city " +
    "on auction.id_auctioneer = auctioneer.id and auctioneer.id_city = city.id " +
    "where start_date > CURDATE() and start_date <= CURDATE() + interval 1 day " +
    "order by start_date asc",
  weekly = "select auction.*, id_city, id_country " +
    "from auction inner join auctioneer inner join city " +
    "on auction.id_auctioneer = auctioneer.id and auctioneer.id_city = city.id " +
    "where start_date > CURDATE() + interval 1 day and start_date <= CURDATE() + interval 1 week " +
    "order by start_date asc",
  monthly = "select auction.*, id_city, id_country " +
    "from auction inner join auctioneer inner join city " +
    "on auction.id_auctioneer = auctioneer.id and auctioneer.id_city = city.id " +
    "where start_date > CURDATE() + interval 1 week and start_date <= CURDATE() + interval 1 month " +
    "order by start_date asc",
}

export const ADDITIONAL_QUERIES = [
  `select auctioneerName, start_date, sold_date, sum(bet.cost_increment) as total 
from sold_auction_lot 
inner join bet 
inner join auction_lot
inner join auction
inner join auctioneer 
on sold_auction_lot.id_bet = bet.id 
and bet.id_lot = auction_lot.id
and auction_lot.id_auction = auction.id
and auction.id_auctioneer = auctioneer.id
where start_date >= "1970-01-30" and sold_date <= "1970-01-30"`,

  `select lotName, current_cost 
from auction_lot 
where current_cost = (select max(current_cost) from auction_lot) 
or current_cost = (select min(current_cost) from auction_lot)`,

  `select auctionName, categoryName, count(*) as countOfLots
from auction
inner join auction_lot 
inner join category 
on auction.id = auction_lot.id_auction 
and auction_lot.id_category = category.id 
where categoryName = ""
group by auctionName
order by auctionName asc`,

  `select (select count(*) from auction_lot) - (select count(*) from sold_auction_lot) as uncosted_lot_count`,

  `select id, lotName, current_cost
from auction_lot 
where current_cost < (select avg(current_cost) from auction_lot)
order by current_cost asc`
]

export const SCHEMA = `CREATE DATABASE  IF NOT EXISTS \`auctions\` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE \`auctions\`;
-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: auctions
-- ------------------------------------------------------
-- Server version\t8.0.19

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
-- Table structure for table \`auction\`
--

DROP TABLE IF EXISTS \`auction\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`auction\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`auctionName\` varchar(45) NOT NULL,
  \`start_date\` datetime NOT NULL,
  \`id_auctioneer\` int unsigned NOT NULL,
  \`id_type\` int unsigned NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`id_UNIQUE\` (\`id\`),
  KEY \`id_auctioneer_idx\` (\`id_auctioneer\`),
  KEY \`id_type_idx\` (\`id_type\`),
  CONSTRAINT \`id_auction_auctioneer\` FOREIGN KEY (\`id_auctioneer\`) REFERENCES \`auctioneer\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`id_type\` FOREIGN KEY (\`id_type\`) REFERENCES \`auction_type\` (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`auction\`
--

LOCK TABLES \`auction\` WRITE;
/*!40000 ALTER TABLE \`auction\` DISABLE KEYS */;
INSERT INTO \`auction\` VALUES (17,'A','2020-05-28 23:00:00',1,6),(18,'B','2020-05-29 12:00:00',2,6),(19,'C','2020-05-30 12:00:00',3,6),(20,'D','2020-05-31 12:00:00',1,6),(21,'E','2020-06-01 12:00:00',2,6),(22,'F','2020-06-02 12:00:00',3,6),(23,'G','2020-06-03 12:00:00',1,6),(24,'H','2020-06-04 12:00:00',2,6),(25,'I','2020-06-05 12:00:00',3,6);
/*!40000 ALTER TABLE \`auction\` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table \`auction_lot\`
--

DROP TABLE IF EXISTS \`auction_lot\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`auction_lot\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`lotName\` varchar(45) NOT NULL,
  \`description\` longtext,
  \`initial_cost\` decimal(15,2) unsigned NOT NULL,
  \`min_increment\` decimal(15,2) unsigned NOT NULL,
  \`max_increment\` decimal(15,2) unsigned NOT NULL,
  \`current_cost\` decimal(15,2) unsigned NOT NULL,
  \`id_category\` int unsigned DEFAULT NULL,
  \`id_auction\` int unsigned NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idauction_lot_UNIQUE\` (\`id\`),
  KEY \`id_category_idx\` (\`id_category\`),
  KEY \`id_auction_idx\` (\`id_auction\`),
  CONSTRAINT \`id_auction\` FOREIGN KEY (\`id_auction\`) REFERENCES \`auction\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`id_category\` FOREIGN KEY (\`id_category\`) REFERENCES \`category\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`auction_lot\`
--

LOCK TABLES \`auction_lot\` WRITE;
/*!40000 ALTER TABLE \`auction_lot\` DISABLE KEYS */;
INSERT INTO \`auction_lot\` VALUES (9,'lot 1','',10.00,1.00,10.00,10.00,1,18),(10,'lot 2','',11.00,2.00,11.00,11.00,1,18),(11,'lot 3','',12.00,3.00,12.00,12.00,1,18),(12,'lot 4','',13.00,4.00,13.00,13.00,1,18),(13,'lot 5','',14.00,5.00,14.00,14.00,1,18),(14,'lot 6','',15.00,6.00,15.00,15.00,1,18),(15,'lot 7','',16.00,7.00,16.00,16.00,1,18),(16,'lot 8','',17.00,8.00,17.00,17.00,1,18),(17,'lot 9','',18.00,9.00,18.00,18.00,1,18),(18,'lot 10','',19.00,10.00,19.00,19.00,1,18),(19,'lot 1 19','',10.00,1.00,10.00,10.00,1,19),(20,'lot 2 19','',11.00,2.00,11.00,11.00,1,19),(21,'lot 3 19','',12.00,3.00,12.00,12.00,1,19),(22,'lot 4 19','',13.00,4.00,13.00,13.00,1,19),(23,'lot 5 19','',14.00,5.00,14.00,14.00,1,19),(24,'lot 6 19','',15.00,6.00,15.00,15.00,1,19),(25,'lot 7 19','',16.00,7.00,16.00,16.00,1,19),(26,'lot 8 19','',17.00,8.00,17.00,17.00,1,19),(27,'lot 9 19','',18.00,9.00,18.00,18.00,1,19),(28,'lot 10 19','',19.00,10.00,19.00,19.00,1,19);
/*!40000 ALTER TABLE \`auction_lot\` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table \`auction_member\`
--

DROP TABLE IF EXISTS \`auction_member\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`auction_member\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`id_person\` int unsigned NOT NULL,
  \`id_auction\` int unsigned NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`id_UNIQUE\` (\`id\`),
  KEY \`id_member_person_idx\` (\`id_person\`),
  KEY \`id_member_auction_idx\` (\`id_auction\`),
  CONSTRAINT \`id_member_auction\` FOREIGN KEY (\`id_auction\`) REFERENCES \`auction\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`id_member_person\` FOREIGN KEY (\`id_person\`) REFERENCES \`person\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`auction_member\`
--

LOCK TABLES \`auction_member\` WRITE;
/*!40000 ALTER TABLE \`auction_member\` DISABLE KEYS */;
/*!40000 ALTER TABLE \`auction_member\` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table \`auction_type\`
--

DROP TABLE IF EXISTS \`auction_type\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`auction_type\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`typeName\` varchar(45) NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`id_UNIQUE\` (\`id\`),
  UNIQUE KEY \`type_UNIQUE\` (\`typeName\`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`auction_type\`
--

LOCK TABLES \`auction_type\` WRITE;
/*!40000 ALTER TABLE \`auction_type\` DISABLE KEYS */;
INSERT INTO \`auction_type\` VALUES (6,'Английский аукцион'),(4,'Аукцион второй цены'),(3,'Аукцион первой цены'),(7,'Голландский аукцион'),(5,'Двойной аукцион'),(2,'Закрытый аукцион'),(1,'Открытый аукцион');
/*!40000 ALTER TABLE \`auction_type\` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table \`auctioneer\`
--

DROP TABLE IF EXISTS \`auctioneer\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`auctioneer\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`auctioneerName\` varchar(45) NOT NULL,
  \`id_city\` int unsigned NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`id_UNIQUE\` (\`id\`),
  UNIQUE KEY \`name_UNIQUE\` (\`auctioneerName\`),
  KEY \`id_city_idx\` (\`id_city\`),
  CONSTRAINT \`id_city\` FOREIGN KEY (\`id_city\`) REFERENCES \`city\` (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`auctioneer\`
--

LOCK TABLES \`auctioneer\` WRITE;
/*!40000 ALTER TABLE \`auctioneer\` DISABLE KEYS */;
INSERT INTO \`auctioneer\` VALUES (1,'Автоамиго Доставка Авто',1),(2,'ООО \\"БелАукцион-Групп\\"',1),(3,'БЕЛРЕАЛИЗАЦИЯ ЗАО',1);
/*!40000 ALTER TABLE \`auctioneer\` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table \`bet\`
--

DROP TABLE IF EXISTS \`bet\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`bet\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`id_lot\` int unsigned NOT NULL,
  \`id_member\` int unsigned NOT NULL,
  \`cost_increment\` decimal(15,2) unsigned NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idbet_UNIQUE\` (\`id\`),
  KEY \`id_lot_idx\` (\`id_lot\`),
  KEY \`id_member_idx\` (\`id_member\`),
  CONSTRAINT \`id_lot\` FOREIGN KEY (\`id_lot\`) REFERENCES \`auction_lot\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT \`id_member\` FOREIGN KEY (\`id_member\`) REFERENCES \`auction_member\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`bet\`
--

LOCK TABLES \`bet\` WRITE;
/*!40000 ALTER TABLE \`bet\` DISABLE KEYS */;
/*!40000 ALTER TABLE \`bet\` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=\`root\`@\`localhost\`*/ /*!50003 TRIGGER \`bet_insert\` AFTER INSERT ON \`bet\` FOR EACH ROW BEGIN
    UPDATE auction_lot SET current_cost = NEW.cost_increment WHERE auction_lot.id = NEW.id_lot;
  END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table \`category\`
--

DROP TABLE IF EXISTS \`category\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`category\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`categoryName\` varchar(45) NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`id_UNIQUE\` (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`category\`
--

LOCK TABLES \`category\` WRITE;
/*!40000 ALTER TABLE \`category\` DISABLE KEYS */;
INSERT INTO \`category\` VALUES (1,'Авто'),(2,'Одежда'),(3,'Недвижимость'),(4,'Украшения'),(5,'Драгоценности');
/*!40000 ALTER TABLE \`category\` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table \`city\`
--

DROP TABLE IF EXISTS \`city\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`city\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`cityName\` varchar(45) NOT NULL,
  \`id_country\` int unsigned NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idcity_UNIQUE\` (\`id\`),
  KEY \`id_country_idx\` (\`id_country\`),
  CONSTRAINT \`id_country\` FOREIGN KEY (\`id_country\`) REFERENCES \`country\` (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`city\`
--

LOCK TABLES \`city\` WRITE;
/*!40000 ALTER TABLE \`city\` DISABLE KEYS */;
INSERT INTO \`city\` VALUES (1,'Минск',1),(2,'Варшава',2),(3,'Бостон',3);
/*!40000 ALTER TABLE \`city\` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table \`contact\`
--

DROP TABLE IF EXISTS \`contact\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`contact\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`value\` varchar(100) NOT NULL,
  \`id_person\` int unsigned NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`id_UNIQUE\` (\`id\`),
  KEY \`id_person_idx\` (\`id_person\`),
  CONSTRAINT \`id_person\` FOREIGN KEY (\`id_person\`) REFERENCES \`person\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`contact\`
--

LOCK TABLES \`contact\` WRITE;
/*!40000 ALTER TABLE \`contact\` DISABLE KEYS */;
INSERT INTO \`contact\` VALUES (1,'(29) 305 98 00',1);
/*!40000 ALTER TABLE \`contact\` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table \`country\`
--

DROP TABLE IF EXISTS \`country\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`country\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`countryName\` varchar(45) NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`id_UNIQUE\` (\`id\`),
  UNIQUE KEY \`name_UNIQUE\` (\`countryName\`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`country\`
--

LOCK TABLES \`country\` WRITE;
/*!40000 ALTER TABLE \`country\` DISABLE KEYS */;
INSERT INTO \`country\` VALUES (1,'Беларусь'),(2,'Польша'),(3,'США');
/*!40000 ALTER TABLE \`country\` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table \`employee\`
--

DROP TABLE IF EXISTS \`employee\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`employee\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`id_person\` int unsigned NOT NULL,
  \`id_auctioneer\` int unsigned NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`id_UNIQUE\` (\`id\`),
  UNIQUE KEY \`id_person_UNIQUE\` (\`id_person\`),
  KEY \`id_empl_auctioneer_idx\` (\`id_auctioneer\`),
  CONSTRAINT \`id_empl_auctioneer\` FOREIGN KEY (\`id_auctioneer\`) REFERENCES \`auctioneer\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`id_empl_person\` FOREIGN KEY (\`id_person\`) REFERENCES \`person\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`employee\`
--

LOCK TABLES \`employee\` WRITE;
/*!40000 ALTER TABLE \`employee\` DISABLE KEYS */;
/*!40000 ALTER TABLE \`employee\` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table \`partner\`
--

DROP TABLE IF EXISTS \`partner\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`partner\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`id_auctioneer\` int unsigned NOT NULL,
  \`id_website\` int unsigned NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`id_UNIQUE\` (\`id\`),
  KEY \`id_auctioneer_idx\` (\`id_auctioneer\`),
  KEY \`id_website_idx\` (\`id_website\`),
  CONSTRAINT \`id_auctioneer\` FOREIGN KEY (\`id_auctioneer\`) REFERENCES \`auctioneer\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`id_website\` FOREIGN KEY (\`id_website\`) REFERENCES \`website\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`partner\`
--

LOCK TABLES \`partner\` WRITE;
/*!40000 ALTER TABLE \`partner\` DISABLE KEYS */;
/*!40000 ALTER TABLE \`partner\` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table \`person\`
--

DROP TABLE IF EXISTS \`person\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`person\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`fio\` varchar(45) NOT NULL,
  \`age\` tinyint unsigned NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`id_UNIQUE\` (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`person\`
--

LOCK TABLES \`person\` WRITE;
/*!40000 ALTER TABLE \`person\` DISABLE KEYS */;
INSERT INTO \`person\` VALUES (1,'Хмель В.А.',49),(20,'Сапешко Е.Б.',23),(21,'Кудревич А.С.',21);
/*!40000 ALTER TABLE \`person\` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table \`sold_auction_lot\`
--

DROP TABLE IF EXISTS \`sold_auction_lot\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`sold_auction_lot\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`id_bet\` int unsigned NOT NULL,
  \`sold_date\` datetime NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idsold_auction_lot_UNIQUE\` (\`id\`),
  KEY \`id_bet_idx\` (\`id_bet\`),
  CONSTRAINT \`id_bet\` FOREIGN KEY (\`id_bet\`) REFERENCES \`bet\` (\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`sold_auction_lot\`
--

LOCK TABLES \`sold_auction_lot\` WRITE;
/*!40000 ALTER TABLE \`sold_auction_lot\` DISABLE KEYS */;
/*!40000 ALTER TABLE \`sold_auction_lot\` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table \`website\`
--

DROP TABLE IF EXISTS \`website\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE \`website\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`websiteName\` varchar(45) NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idwebsite_UNIQUE\` (\`id\`),
  UNIQUE KEY \`name_UNIQUE\` (\`websiteName\`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table \`website\`
--

LOCK TABLES \`website\` WRITE;
/*!40000 ALTER TABLE \`website\` DISABLE KEYS */;
/*!40000 ALTER TABLE \`website\` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'auctions'
--

--
-- Dumping routines for database 'auctions'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-28 23:54:37
`
