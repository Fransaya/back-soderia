# SCRIPT DE LA BASE DE DATOS:

## -- MySQL dump 10.13 Distrib 8.0.36, for Linux (x86_64)

-- Host: 127.0.0.1 Database: soderiaSistema

---

-- Server version 8.0.39-0ubuntu0.24.04.2

/_!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT _/;
/_!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS _/;
/_!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION _/;
/_!50503 SET NAMES utf8 _/;
/_!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE _/;
/_!40103 SET TIME_ZONE='+00:00' _/;
/_!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 _/;
/_!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 _/;
/_!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' _/;
/_!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 _/;

--
-- Table structure for table `barrio`
--

DROP TABLE IF EXISTS `barrio`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `barrio` (
`idBarrio` int NOT NULL,
`nombre` varchar(150) NOT NULL,
PRIMARY KEY (`idBarrio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `barrio`
--

LOCK TABLES `barrio` WRITE;
/_!40000 ALTER TABLE `barrio` DISABLE KEYS _/;
INSERT INTO `barrio` VALUES (1,'Buenos Aires'),(2,'Córdoba'),(3,'Santa Fe');
/_!40000 ALTER TABLE `barrio` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `clientes` (
`id` int NOT NULL AUTO_INCREMENT,
`nombre` varchar(100) NOT NULL,
`email` varchar(150) DEFAULT NULL,
`telefono` varchar(100) DEFAULT NULL,
`direccion` varchar(200) DEFAULT NULL,
`idBarrio` int DEFAULT NULL,
`estado` tinyint(1) DEFAULT '1',
`observaciones` text,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/_!40000 ALTER TABLE `clientes` DISABLE KEYS _/;
INSERT INTO `clientes` VALUES (1,'cliente1','juan.perez@example.com','123456789','Calle Falsa 12',2,1,'Cliente frecuente'),(2,'cliente2','maria.lopez@example.com','987654321','Avenida Siempreviva 456',2,1,'Cliente potencial'),(3,'cliente3','fransay04@gmail.com','0987654321','Av. Siempre Viva 742',1,0,NULL),(4,'cliente4','francisquin@gmail.com','3534023650','Buenos Aires 1377',1,1,NULL),(5,'cliente6','franchusaya@gmail.com','buenos aires','9 de julio 627',1,1,NULL),(6,'cliente5','wasquin@gmail.com','24565656','pingal',1,1,NULL),(7,'cliente7','hoshtiastio@example.com','23213213','321321fa',2,NULL,NULL),(8,'cliente9','kikon@gmail.com','1312313','pelegrini 2',1,NULL,NULL),(9,'nuevo cliente','kikon@saya.com.ar','3534050912','bueno villa',2,NULL,NULL),(10,'dadsadada','testing@gmail.com','03534060236','Buenos Aires 1377',3,1,NULL),(11,'ivana','testing123123@gmail.com','12313131','daudsadadada',1,1,NULL);
/_!40000 ALTER TABLE `clientes` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `detalleListaPrecio`
--

DROP TABLE IF EXISTS `detalleListaPrecio`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `detalleListaPrecio` (
`idDetalle` int NOT NULL AUTO_INCREMENT,
`idLista` int NOT NULL,
`idProducto` int NOT NULL,
`precioProducto` float DEFAULT NULL,
`estado` tinyint(1) DEFAULT '1',
PRIMARY KEY (`idDetalle`),
KEY `fk_Lista` (`idLista`),
KEY `fk_producto_lista` (`idProducto`),
CONSTRAINT `fk_Lista` FOREIGN KEY (`idLista`) REFERENCES `listaPrecio` (`idLista`),
CONSTRAINT `fk_producto_lista` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `detalleListaPrecio`
--

LOCK TABLES `detalleListaPrecio` WRITE;
/_!40000 ALTER TABLE `detalleListaPrecio` DISABLE KEYS _/;
INSERT INTO `detalleListaPrecio` VALUES (32,1,1,2000,1),(33,1,2,1500,1),(34,1,3,1500,1),(36,1,4,1000,1);
/_!40000 ALTER TABLE `detalleListaPrecio` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `detallePedido`
--

DROP TABLE IF EXISTS `detallePedido`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `detallePedido` (
`idDetalle` int NOT NULL AUTO_INCREMENT,
`idPedido` int NOT NULL,
`idProducto` int NOT NULL,
`cantidadUnidades` int NOT NULL,
`total` float DEFAULT NULL,
`precio` float DEFAULT NULL,
PRIMARY KEY (`idDetalle`),
KEY `fk_pedido` (`idPedido`),
KEY `fk_producto_detalle` (`idProducto`),
CONSTRAINT `fk_pedido` FOREIGN KEY (`idPedido`) REFERENCES `pedidos` (`idPedido`),
CONSTRAINT `fk_producto_detalle` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=244 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `detallePedido`
--

LOCK TABLES `detallePedido` WRITE;
/_!40000 ALTER TABLE `detallePedido` DISABLE KEYS _/;
INSERT INTO `detallePedido` VALUES (25,12,3,4,40,10),(26,13,2,1,1500,1500),(27,14,2,1,1500,1500),(28,15,2,1,1500,1500),(29,15,1,1,1000,1000),(30,16,1,2,2000,1000),(31,16,2,2,3000,1500),(32,17,1,1,1000,1000),(33,18,1,2,2000,1000),(34,19,2,1,1500,1500),(35,20,2,1,1500,1500),(36,20,2,1,1500,1500),(37,20,2,1,1500,1500),(38,20,2,1,1500,1500),(39,20,2,1,1500,1500),(40,20,2,1,1500,1500),(41,20,2,1,1500,1500),(42,20,2,1,1500,1500),(43,20,2,1,1500,1500),(44,20,2,1,1500,1500),(45,20,2,1,1500,1500),(46,20,2,1,1500,1500),(47,20,2,1,1500,1500),(48,20,2,1,1500,1500),(49,20,2,1,1500,1500),(50,20,2,1,1500,1500),(51,20,2,1,1500,1500),(52,20,2,1,1500,1500),(53,20,2,1,1500,1500),(54,20,2,1,1500,1500),(55,20,2,1,1500,1500),(56,20,2,1,1500,1500),(57,20,2,1,1500,1500),(58,20,2,1,1500,1500),(59,20,2,1,1500,1500),(60,20,2,1,1500,1500),(61,21,2,1,1500,1500),(62,21,2,1,1500,1500),(63,21,2,1,1500,1500),(64,21,2,1,1500,1500),(65,21,2,1,1500,1500),(66,21,2,1,1500,1500),(67,21,2,1,1500,1500),(68,21,2,1,1500,1500),(69,21,2,1,1500,1500),(70,21,2,1,1500,1500),(71,21,2,1,1500,1500),(72,21,2,1,1500,1500),(73,21,2,1,1500,1500),(74,21,2,1,1500,1500),(75,21,2,1,1500,1500),(76,21,2,1,1500,1500),(77,21,2,1,1500,1500),(78,21,2,1,1500,1500),(79,21,2,1,1500,1500),(80,21,2,1,1500,1500),(81,21,2,1,1500,1500),(82,21,2,1,1500,1500),(83,21,2,1,1500,1500),(84,21,2,1,1500,1500),(85,21,2,1,1500,1500),(86,21,2,1,1500,1500),(87,21,1,1,1000,1000),(88,21,1,1,1000,1000),(89,21,1,1,1000,1000),(90,21,1,1,1000,1000),(91,21,1,1,1000,1000),(92,21,1,1,1000,1000),(93,21,1,1,1000,1000),(94,21,1,1,1000,1000),(95,21,1,1,1000,1000),(96,21,1,1,1000,1000),(97,21,1,1,1000,1000),(98,21,1,1,1000,1000),(99,21,1,1,1000,1000),(100,21,1,1,1000,1000),(101,21,1,1,1000,1000),(102,21,1,1,1000,1000),(103,21,1,1,1000,1000),(104,21,1,1,1000,1000),(105,21,1,1,1000,1000),(106,21,1,1,1000,1000),(107,21,1,1,1000,1000),(108,21,1,1,1000,1000),(109,21,1,1,1000,1000),(110,21,1,1,1000,1000),(111,21,1,1,1000,1000),(112,21,1,1,1000,1000),(113,21,1,1,1000,1000),(114,21,1,1,1000,1000),(115,21,2,1,1500,1500),(116,21,2,1,1500,1500),(117,21,2,1,1500,1500),(118,21,2,1,1500,1500),(119,21,1,1,1000,1000),(120,21,1,1,1000,1000),(121,21,1,1,1000,1000),(122,21,2,1,1500,1500),(123,21,1,1,1000,1000),(124,21,1,1,1000,1000),(125,21,1,1,1000,1000),(126,21,1,1,1000,1000),(127,21,1,1,1000,1000),(128,21,1,1,1000,1000),(129,21,2,1,1500,1500),(130,21,2,1,1500,1500),(131,21,2,1,1500,1500),(132,21,2,1,1500,1500),(133,21,1,1,1000,1000),(134,21,1,1,1000,1000),(135,22,1,1,1000,1000),(136,22,1,1,1000,1000),(137,22,1,1,1000,1000),(138,22,1,1,1000,1000),(139,22,1,1,1000,1000),(140,22,1,1,1000,1000),(141,22,1,1,1000,1000),(142,22,1,1,1000,1000),(143,22,1,1,1000,1000),(144,22,1,1,1000,1000),(145,22,1,1,1000,1000),(146,22,1,1,1000,1000),(147,22,1,1,1000,1000),(148,22,1,1,1000,1000),(149,22,1,1,1000,1000),(150,22,1,1,1000,1000),(151,22,1,1,1000,1000),(152,22,1,1,1000,1000),(153,22,1,1,1000,1000),(154,22,1,1,1000,1000),(155,22,1,1,1000,1000),(156,22,1,1,1000,1000),(157,22,1,1,1000,1000),(158,22,1,1,1000,1000),(159,22,1,1,1000,1000),(160,22,1,1,1000,1000),(161,22,1,1,1000,1000),(162,22,1,1,1000,1000),(163,22,1,1,1000,1000),(164,22,1,1,1000,1000),(165,22,1,1,1000,1000),(166,22,1,1,1000,1000),(167,22,1,1,1000,1000),(168,22,1,1,1000,1000),(169,22,1,1,1000,1000),(170,22,1,1,1000,1000),(171,22,1,1,1000,1000),(172,22,1,1,1000,1000),(173,22,1,1,1000,1000),(174,22,1,1,1000,1000),(175,22,1,1,1000,1000),(176,22,1,1,1000,1000),(177,22,1,1,1000,1000),(178,22,1,1,1000,1000),(179,22,1,1,1000,1000),(180,22,1,1,1000,1000),(181,22,1,1,1000,1000),(182,22,1,1,1000,1000),(183,23,1,2,2000,1000),(184,24,2,5,7500,1500),(185,24,2,5,7500,1500),(187,23,1,5,5000,1000),(188,23,1,1,1000,1000),(189,23,1,1,1000,1000),(190,23,1,1,1000,1000),(191,23,1,1,1000,1000),(192,24,1,1,1000,1000),(193,23,2,1,1500,1500),(194,25,1,1,1000,1000),(195,25,2,2,3000,1500),(196,23,1,2,2000,1000),(197,25,1,10,10000,1000),(198,27,1,1,1000,1000),(202,28,1,1,1000,1000),(204,29,2,1,1500,1500),(207,12,2,4,40,10),(208,12,1,4,40,10),(209,12,1,4,40,10),(210,12,1,4,40,10),(211,12,2,4,40,10),(212,12,1,4,40,10),(213,12,1,4,40,10),(214,30,1,1,1000,1000),(215,30,2,1,1500,1500),(216,31,1,1,1000,1000),(217,31,2,1,1500,1500),(233,32,1,1,1000,1000),(236,33,1,1,1000,1000),(237,33,4,1,1000,1000),(238,33,3,1,250,250),(239,34,1,1,1000,1000),(240,34,2,2,3000,1500),(241,35,1,1,1000,1000),(242,35,4,2,2000,1000),(243,34,2,1,1500,1500);
/_!40000 ALTER TABLE `detallePedido` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `detalleVenta`
--

DROP TABLE IF EXISTS `detalleVenta`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `detalleVenta` (
`idDetalle` int NOT NULL AUTO_INCREMENT,
`idVenta` int NOT NULL,
`idProducto` int NOT NULL,
`precio` float DEFAULT NULL,
`cantidadUnidades` int NOT NULL DEFAULT '0',
`total` float DEFAULT NULL,
PRIMARY KEY (`idDetalle`),
KEY `fk_detalle_venta` (`idVenta`),
KEY `fk_detalleVenta_producto` (`idProducto`),
CONSTRAINT `fk_detalle_venta` FOREIGN KEY (`idVenta`) REFERENCES `ventas` (`idVenta`),
CONSTRAINT `fk_detalleVenta_producto` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `detalleVenta`
--

LOCK TABLES `detalleVenta` WRITE;
/_!40000 ALTER TABLE `detalleVenta` DISABLE KEYS _/;
INSERT INTO `detalleVenta` VALUES (2,6,1,500,2,1000),(3,7,1,500,2,1000),(4,7,2,500,2,1000);
/_!40000 ALTER TABLE `detalleVenta` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `estadoPedido`
--

DROP TABLE IF EXISTS `estadoPedido`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `estadoPedido` (
`idEstado` int NOT NULL AUTO_INCREMENT,
`valor` varchar(150) DEFAULT NULL,
PRIMARY KEY (`idEstado`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `estadoPedido`
--

LOCK TABLES `estadoPedido` WRITE;
/_!40000 ALTER TABLE `estadoPedido` DISABLE KEYS _/;
INSERT INTO `estadoPedido` VALUES (1,'RECIBIDO'),(2,'ENTREGADO'),(3,'CANCELADO');
/_!40000 ALTER TABLE `estadoPedido` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `estadoVenta`
--

DROP TABLE IF EXISTS `estadoVenta`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `estadoVenta` (
`id` int NOT NULL AUTO_INCREMENT,
`nombre` varchar(150) DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `estadoVenta`
--

LOCK TABLES `estadoVenta` WRITE;
/_!40000 ALTER TABLE `estadoVenta` DISABLE KEYS _/;
INSERT INTO `estadoVenta` VALUES (1,'Finalizada'),(2,'Cancelada');
/_!40000 ALTER TABLE `estadoVenta` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `listaPrecio`
--

DROP TABLE IF EXISTS `listaPrecio`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `listaPrecio` (
`idLista` int NOT NULL AUTO_INCREMENT,
`tipoLista` int NOT NULL,
`fechaCreacion` datetime DEFAULT NULL,
PRIMARY KEY (`idLista`),
KEY `fk_tipoLista` (`tipoLista`),
CONSTRAINT `fk_tipoLista` FOREIGN KEY (`tipoLista`) REFERENCES `tipoLista` (`idTipo`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `listaPrecio`
--

LOCK TABLES `listaPrecio` WRITE;
/_!40000 ALTER TABLE `listaPrecio` DISABLE KEYS _/;
INSERT INTO `listaPrecio` VALUES (1,2,'2024-10-13 00:00:00');
/_!40000 ALTER TABLE `listaPrecio` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `localidad`
--

DROP TABLE IF EXISTS `localidad`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `localidad` (
`idLocalidad` int NOT NULL AUTO_INCREMENT,
`nombre` varchar(150) NOT NULL,
`idBarrio` int DEFAULT NULL,
PRIMARY KEY (`idLocalidad`),
KEY `fk_barrio` (`idBarrio`),
CONSTRAINT `fk_barrio` FOREIGN KEY (`idBarrio`) REFERENCES `barrio` (`idBarrio`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `localidad`
--

LOCK TABLES `localidad` WRITE;
/_!40000 ALTER TABLE `localidad` DISABLE KEYS _/;
INSERT INTO `localidad` VALUES (1,'Mar del Plata',1),(2,'Córdoba Capital',2),(3,'Rosario',3);
/_!40000 ALTER TABLE `localidad` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `metodoPago`
--

DROP TABLE IF EXISTS `metodoPago`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `metodoPago` (
`id` int NOT NULL AUTO_INCREMENT,
`nombre` varchar(100) NOT NULL,
`estado` tinyint(1) DEFAULT '1',
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `metodoPago`
--

LOCK TABLES `metodoPago` WRITE;
/_!40000 ALTER TABLE `metodoPago` DISABLE KEYS _/;
INSERT INTO `metodoPago` VALUES (1,'Tarjeta de Crédito',1),(2,'Efectivo',1),(3,'Transferencia Bancaria',1);
/_!40000 ALTER TABLE `metodoPago` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `modulos`
--

DROP TABLE IF EXISTS `modulos`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `modulos` (
`idModulo` int NOT NULL AUTO_INCREMENT,
`nombre` varchar(50) NOT NULL,
`pathMenu` varchar(100) DEFAULT NULL,
`estado` int DEFAULT '1',
`icono` varchar(50) DEFAULT NULL,
`color` varchar(100) DEFAULT NULL,
PRIMARY KEY (`idModulo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `modulos`
--

LOCK TABLES `modulos` WRITE;
/_!40000 ALTER TABLE `modulos` DISABLE KEYS _/;
INSERT INTO `modulos` VALUES (1,'Ventas','ventas',1,'pi pi-shopping-cart','#FF5733'),(2,'Pedido','pedidos',1,'pi pi-box','#FFC300'),(3,'Clientes','cliente',1,'pi pi-user','#33B5E5'),(4,'Lista de Precios','lista-precios',1,'pi pi-list','#8E44AD'),(5,'Usuarios','usuarios',1,'pi pi-users','#2ECC71');
/_!40000 ALTER TABLE `modulos` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `pedidos` (
`idPedido` int NOT NULL AUTO_INCREMENT,
`idCliente` int NOT NULL,
`idUsuario` int NOT NULL,
`total` float DEFAULT NULL,
`fechaRegistro` date DEFAULT NULL,
`estado` int NOT NULL,
`observaciones` text,
PRIMARY KEY (`idPedido`),
KEY `fk_cliente_pedidos` (`idCliente`),
KEY `fk_cliente_usuario` (`idUsuario`),
KEY `fk_estadoPedido` (`estado`),
CONSTRAINT `fk_cliente_pedidos` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`id`),
CONSTRAINT `fk_cliente_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`),
CONSTRAINT `fk_estadoPedido` FOREIGN KEY (`estado`) REFERENCES `estadoPedido` (`idEstado`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/_!40000 ALTER TABLE `pedidos` DISABLE KEYS _/;
INSERT INTO `pedidos` VALUES (12,1,1,340,'2024-09-28',1,NULL),(13,3,1,1500,'2024-09-28',2,NULL),(14,3,1,1500,'2024-09-28',2,''),(15,4,1,2500,'2024-09-28',2,''),(16,1,1,5000,'2024-09-29',3,''),(17,3,1,1000,'2024-09-29',1,'0'),(18,1,1,2000,'2024-09-30',2,NULL),(19,3,1,1500,'2024-09-30',1,'0'),(20,6,1,39000,'2024-09-30',1,'0'),(21,1,1,91500,'2024-09-30',3,NULL),(22,6,1,48000,'2024-09-30',1,'0'),(23,1,1,14500,'2024-10-01',1,''),(24,3,1,16000,'2024-10-01',2,''),(25,3,1,-4500,'2024-10-01',1,''),(26,3,1,4000,'2024-10-01',1,''),(27,5,1,1000,'2024-10-01',1,'0'),(28,5,1,0,'2024-10-01',1,'0'),(29,5,1,-500,'2024-10-01',1,'0'),(30,1,1,2500,'2024-10-05',2,''),(31,1,1,2500,'2024-10-12',3,''),(32,6,1,1000,'2024-10-15',2,''),(33,1,1,2250,'2024-10-15',1,'0'),(34,1,1,5500,'2024-10-16',2,''),(35,1,1,3000,'2024-10-16',1,'0');
/_!40000 ALTER TABLE `pedidos` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `permisos` (
`idPermiso` int NOT NULL AUTO_INCREMENT,
`idRol` int NOT NULL,
`idModulo` int NOT NULL,
`estado` int NOT NULL DEFAULT '0',
PRIMARY KEY (`idPermiso`),
KEY `fk_rol_permiso` (`idRol`),
KEY `fk_modulo_permiso` (`idModulo`),
CONSTRAINT `fk_modulo_permiso` FOREIGN KEY (`idModulo`) REFERENCES `modulos` (`idModulo`),
CONSTRAINT `fk_rol_permiso` FOREIGN KEY (`idRol`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/_!40000 ALTER TABLE `permisos` DISABLE KEYS _/;
INSERT INTO `permisos` VALUES (1,1,1,1),(2,1,2,1),(3,1,3,1),(4,1,4,1),(5,1,5,1),(6,2,1,1),(7,2,2,1),(8,3,3,1),(9,3,4,1);
/_!40000 ALTER TABLE `permisos` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `producto` (
`id` int NOT NULL AUTO_INCREMENT,
`nombre` varchar(100) NOT NULL,
`descripcion` varchar(255) DEFAULT NULL,
`precio` float DEFAULT NULL,
`estado` tinyint(1) DEFAULT '1',
`unidadesDisponibles` int DEFAULT '0',
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/_!40000 ALTER TABLE `producto` DISABLE KEYS _/;
INSERT INTO `producto` VALUES (1,'soda modificada','soda de 1.5L',1000,1,30),(2,'bido de agua','bidon de 20L',1500,1,30),(3,'sifon','bidon de 1l',250,1,30),(4,'coca',NULL,1000,1,0),(5,'ferne','ferne branca',700,1,0),(6,'kkkkk','uuu',1,0,0);
/_!40000 ALTER TABLE `producto` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `roles` (
`id` int NOT NULL AUTO_INCREMENT,
`nombre` varchar(50) NOT NULL,
`estado` int DEFAULT '1',
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/_!40000 ALTER TABLE `roles` DISABLE KEYS _/;
INSERT INTO `roles` VALUES (1,'Administrador',1),(2,'Vendedor',1),(3,'Comprador',1);
/_!40000 ALTER TABLE `roles` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `sesiones`
--

DROP TABLE IF EXISTS `sesiones`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `sesiones` (
`idSesion` int NOT NULL AUTO_INCREMENT,
`tokenSesion` varchar(255) DEFAULT NULL,
`idUsuario` int NOT NULL,
`fechaCreacion` datetime DEFAULT NULL,
`estado` tinyint(1) DEFAULT '1',
PRIMARY KEY (`idSesion`),
KEY `fk_usuario_sesion` (`idUsuario`),
CONSTRAINT `fk_usuario_sesion` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `sesiones`
--

LOCK TABLES `sesiones` WRITE;
/_!40000 ALTER TABLE `sesiones` DISABLE KEYS _/;
INSERT INTO `sesiones` VALUES (72,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzI5MTE4NTgwLCJleHAiOjE3MjkxMjIxODB9.k6m-XyBEOzK_es_szUUqQTHHZlm-ZWX-9iwqbuXWkVY',8,'2024-10-16 19:43:00',1),(73,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzI5MTE4NTk4LCJleHAiOjE3MjkxMjIxOTh9.lYkmriNEXxdE2-DFJ64rjemL6sBJ5yiiVBtE5U9jkHA',7,'2024-10-16 19:43:18',1);
/_!40000 ALTER TABLE `sesiones` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `tipoLista`
--

DROP TABLE IF EXISTS `tipoLista`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `tipoLista` (
`idTipo` int NOT NULL AUTO_INCREMENT,
`nombre` varchar(100) NOT NULL,
PRIMARY KEY (`idTipo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `tipoLista`
--

LOCK TABLES `tipoLista` WRITE;
/_!40000 ALTER TABLE `tipoLista` DISABLE KEYS _/;
INSERT INTO `tipoLista` VALUES (1,'Lista Mayorista'),(2,'Lista Minorista');
/_!40000 ALTER TABLE `tipoLista` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `usuario` (
`id` int NOT NULL AUTO_INCREMENT,
`alias` varchar(100) NOT NULL,
`email` varchar(200) NOT NULL,
`telefono` varchar(100) DEFAULT NULL,
`idRol` int DEFAULT NULL,
`estado` tinyint DEFAULT NULL,
`fecha_nacimiento` date DEFAULT NULL,
`password` varchar(255) DEFAULT NULL,
PRIMARY KEY (`id`),
KEY `fk_usuario` (`idRol`),
CONSTRAINT `fk_usuario` FOREIGN KEY (`idRol`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/_!40000 ALTER TABLE `usuario` DISABLE KEYS _/;
INSERT INTO `usuario` VALUES (1,'nancy pasos','testing@gmail.com','1523647844',1,1,'2024-02-02','$2b$10$NLNxqoPPqn66ztZNpXvGAOCVjHnDdkcGX6fIgs30GcTspay6zUYaW'),(2,'vendedor1','vendedor1@example.com','987654321',2,0,'1992-02-15',NULL),(3,'juan123','juan@example.com','123456789',2,0,'1970-01-01','$2b$10$B01ctbqTlhfDZmt40KUeQ.W/cCUxP9LV4tCKb2yBuXxbuJZN7cxtC'),(4,'testeo','instagood@example.com','123456789',2,0,'1970-01-01','$2b$10$IBeMzID4A7sxUE0QfwwkSu5yUGNeLTzkKv/rTQuPcnxrkeGNPAgoy'),(5,'test2','idonea@example.com','123456789',2,0,'1970-01-01','$2b$10$PcnG7pQiGcBbt7nuRTVW/ewUeuOPxRmR672ONHl5bfvYa1gZa155a'),(6,'insta','insta@example.com','123456789',2,0,'1970-01-01','$2b$10$AjWUZTCGQELMUaDeB3i9te13T32GrP7X6t8FEBpHUujYgwdvj1bSG'),(7,'admin','fransay04@gmail.com','3534060236',1,0,'2004-04-21','$2b$10$JV1KyyPjxWnuwBg7yO1o9eb19vz2WPCatRYd5LdWtjHG0GUBUueDS'),(8,'testing','fabriziorumachella@gmail.com','3534060236',2,1,'2004-04-21','$2b$10$BSPegOBq7nkcbgwMgEw1tOAlYhOry8s5tFqlj29XaoE0A4gW53Wd.'),(9,'brizzio','brchi@gmail.com','456987123',3,1,'2004-10-10','$2b$10$sG0pejYshJ9CBWVyhmnR3uTBkZ9RM2KRes9nZf0MIGP6KLZO6oeYG');
/_!40000 ALTER TABLE `usuario` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `ventas` (
`idVenta` int NOT NULL AUTO_INCREMENT,
`idCliente` int NOT NULL,
`idUsuario` int NOT NULL,
`idMetodoPago` int DEFAULT NULL,
`estado` int NOT NULL,
`fecha` datetime NOT NULL,
`total` float DEFAULT NULL,
`observaciones` text,
PRIMARY KEY (`idVenta`),
KEY `fk_cliente_ventas` (`idCliente`),
KEY `fk_ventas_usuario` (`idUsuario`),
KEY `fk_metodo_pago` (`idMetodoPago`),
KEY `fk_estado_venta` (`estado`),
CONSTRAINT `fk_cliente_ventas` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`id`),
CONSTRAINT `fk_estado_venta` FOREIGN KEY (`estado`) REFERENCES `estadoVenta` (`id`),
CONSTRAINT `fk_metodo_pago` FOREIGN KEY (`idMetodoPago`) REFERENCES `metodoPago` (`id`),
CONSTRAINT `fk_ventas_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/_!40101 SET character_set_client = @saved_cs_client _/;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/_!40000 ALTER TABLE `ventas` DISABLE KEYS _/;
INSERT INTO `ventas` VALUES (6,1,1,1,1,'2024-10-10 00:00:00',1000,'prueba registro venta'),(7,2,2,1,1,'2024-10-10 00:00:00',1000,'prueba registro venta');
/_!40000 ALTER TABLE `ventas` ENABLE KEYS _/;
UNLOCK TABLES;
/_!40103 SET TIME_ZONE=@OLD_TIME_ZONE _/;

/_!40101 SET SQL_MODE=@OLD_SQL_MODE _/;
/_!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS _/;
/_!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS _/;
/_!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT _/;
/_!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS _/;
/_!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION _/;
/_!40111 SET SQL_NOTES=@OLD_SQL_NOTES _/;

-- Dump completed on 2024-10-27 11:36:53
