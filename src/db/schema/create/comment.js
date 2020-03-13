module.exports = `
CREATE TABLE comment (
  id int NOT NULL AUTO_INCREMENT,
  body varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  uploaded_at datetime NOT NULL,
  user_id int NOT NULL,
  likes int NOT NULL DEFAULT '0',
  post_id int NOT NULL,
  random_nickname varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (id),
  KEY fk_user_id_idx (user_id),
  KEY fk_post_id_idx (post_id),
  CONSTRAINT fk_comment_post_id FOREIGN KEY (post_id) REFERENCES post (id) ON DELETE CASCADE,
  CONSTRAINT fk_comment_user_id FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`
