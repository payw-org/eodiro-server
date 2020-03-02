import Db from '@/db'

// User

// Model
export interface UserModel extends Record<string, string | number> {
  id: number
  portal_id: string
  password: string
  registered_at: string
  nickname: string
  random_nickname: string
}

export type UserModelPasswordOmitted = Omit<UserModel, 'password'>

const createUserTableSql = `
CREATE TABLE user (
  id int NOT NULL AUTO_INCREMENT,
  portal_id varchar(320) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  password char(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  registered_at datetime NOT NULL,
  nickname varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  random_nickname varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (id),
  UNIQUE KEY portal_id (portal_id),
  UNIQUE KEY nickname (nickname)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

// Create function
export async function createUserTable(): Promise<void> {
  await Db.query(createUserTableSql)
}

// Pending User
export interface PendingUserModel extends UserModel {
  token: string
}

const createPendingUserTableSql = `
CREATE TABLE pending_user (
  id int NOT NULL AUTO_INCREMENT,
  portal_id varchar(320) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  password char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  registered_at datetime NOT NULL,
  nickname varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  random_nickname varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  token varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (id),
  UNIQUE KEY portal_id (portal_id),
  UNIQUE KEY nickname (nickname)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export async function createPendingUserTable(): Promise<void> {
  await Db.query(createPendingUserTableSql)
}
