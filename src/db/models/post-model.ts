import Db from '..'

export interface PostModel extends Record<string, string | number> {
  id: number
  title: string
  body: string
  user_id: number
  uploaded_at: string
  likes: number
  is_edited: number
  random_nickname: string
}

const createPostSql = `
CREATE TABLE post (
  id int NOT NULL AUTO_INCREMENT,
  title varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  body text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  user_id int NOT NULL,
  uploaded_at datetime NOT NULL,
  likes int NOT NULL DEFAULT '0',
  is_edited tinyint(1) NOT NULL DEFAULT '0',
  random_nickname varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (id),
  KEY user_id_idx (user_id),
  CONSTRAINT fk_post_user_id FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export async function createPost(): Promise<void> {
  await Db.query(createPostSql)
}
