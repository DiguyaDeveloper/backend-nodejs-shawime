CREATE DATABASE  IF NOT EXISTS `node_crud_user`;
USE `node_crud_user`;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `sobrenome` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
INSERT INTO `user` VALUES (1,'admin', 'admin', '2019-08-20 13:47:58.696549','2019-08-20 13:47:58.696549','$2a$10$WJoFjlW14Ucgcz.ilF8pjuWmZMlTvrAi0CbSnz0SImIC/NQJG.Nd.','admin@admin.com');
UNLOCK TABLES;
