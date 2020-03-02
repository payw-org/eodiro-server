import Db from '..'

export interface InquiryModel extends Record<string, string | number> {
  id: number
  title: string
  body: string
  user_id: number
  answer: string
  uploaded_at: string
  likes: number
}

const createInquiryTableSql = `
CREATE TABLE inquiry (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(320) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  title varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  body text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  user_id int DEFAULT NULL,
  answer text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  uploaded_at datetime NOT NULL,
  likes int NOT NULL DEFAULT '0',
  PRIMARY KEY (id),
  KEY user_id_idx (user_id),
  CONSTRAINT fk_inquiry_user_id FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export async function createInquiryTable(): Promise<void> {
  await Db.query(createInquiryTableSql)
}
