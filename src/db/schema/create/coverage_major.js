module.exports = `
CREATE TABLE coverage_major (
  name varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  coverage_college varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (name),
  KEY fk_coverage_college (coverage_college),
  CONSTRAINT fk_coverage_college FOREIGN KEY (coverage_college) REFERENCES coverage_college (name) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`
