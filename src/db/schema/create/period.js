module.exports = `
CREATE TABLE period (
  lecture_id int NOT NULL,
  day char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  start_h tinyint NOT NULL,
  start_m tinyint NOT NULL,
  end_h tinyint NOT NULL,
  end_m tinyint NOT NULL,
  PRIMARY KEY (lecture_id,day,start_h,start_m,end_h,end_m),
  CONSTRAINT fk_period_lecture_id FOREIGN KEY (lecture_id) REFERENCES lecture (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`
