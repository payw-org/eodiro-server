import Db from '..'

export interface RefreshTokenModel extends Record<string, string | number> {
  user_id: number
  token: string
  manually_changed_at: number
}

const createRefreshTokenTableSql = `
CREATE TABLE refresh_token (
  user_id int DEFAULT NULL,
  token varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  manually_changed_at int DEFAULT NULL,
  KEY fk_refresh_token_user_id (user_id),
  CONSTRAINT fk_refresh_token_user_id FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export async function createRefreshTokenTable(): Promise<void> {
  await Db.query(createRefreshTokenTableSql)
}
