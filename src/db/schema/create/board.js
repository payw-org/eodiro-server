module.exports = `
CREATE TABLE board (
  id int NOT NULL AUTO_INCREMENT,
  board_name varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (id),
  KEY board_name (board_name)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`
