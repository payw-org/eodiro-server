module.exports = `
CREATE TABLE coverage_major_lecture (
  lecture_id int NOT NULL,
  coverage_major char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  KEY lecture_id (lecture_id),
  KEY coverage_major (coverage_major),
  CONSTRAINT fk_coverage_major FOREIGN KEY (coverage_major) REFERENCES coverage_major (name) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_coverage_major_lecture_id FOREIGN KEY (lecture_id) REFERENCES lecture (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`
