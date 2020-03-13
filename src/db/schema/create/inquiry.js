module.exports = `
CREATE TABLE inquiry (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(320) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  title varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  body text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  answer text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  user_id int DEFAULT NULL,
  uploaded_at datetime NOT NULL,
  answered_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY user_id_idx (user_id),
  CONSTRAINT fk_inquiry_user_id FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`
