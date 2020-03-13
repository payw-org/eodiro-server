module.exports = `
CREATE TABLE admin (
  user_id int NOT NULL,
  PRIMARY KEY (user_id),
  KEY fk_admin_user_id (user_id),
  CONSTRAINT fk_admin_user_id FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`
