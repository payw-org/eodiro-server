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

const createPostTableSql = `
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

export async function createPostTable(): Promise<void> {
  await Db.query(createPostTableSql)
}

// Comment
export interface CommentModel extends Record<string, string | number> {
  id: number
  body: string
  uploaded_at: string
  user_id: number
  likes: number
  post_id: number
  random_nickname: string
}

const createCommentTableSql = `
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

export async function createCommentTable(): Promise<void> {
  await Db.query(createCommentTableSql)
}

export interface NewComment {
  postId: number
  body: string
}
