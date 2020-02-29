import Db from '@/db'

const sql = `
CREATE TABLE cafeteria_menu (
  campus char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  served_at date NOT NULL,
  data json DEFAULT NULL,
  PRIMARY KEY (campus,served_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export async function createCafeteriaMenuTable(): Promise<void> {
  await Db.query(sql)
}
