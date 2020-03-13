module.exports = `
CREATE TABLE change_password (
  token varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  user_id int NOT NULL,
  requested_at datetime NOT NULL,
  PRIMARY KEY (user_id),
  KEY token (token),
  CONSTRAINT fk_temp_password_user_id FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`
