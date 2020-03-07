import Db from '..'

export interface ChangePasswordModel extends Record<string, string | number> {
  temp_key: string
  user_id: number
  created_at: string
}

const createChangePasswordTableSql = `
CREATE TABLE change_password(
  temp_key varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  user_id int NOT NULL,
  created_at datetime NOT NULL,
  PRIMARY KEY(user_id),
  KEY user_id_idx (user_id),
  CONSTRAINT fk_temp_password_user_id FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export async function createChangePasswordTable(): Promise<void> {
  {
    await Db.query(createChangePasswordTableSql)
  }
}
