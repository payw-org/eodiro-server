import Db from '@/db'

const sql = `
CREATE TABLE cafeteria_menu (
  campus char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  served_at date NOT NULL,
  cafeteria_name varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  title varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  time char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  price varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  menus text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (campus,served_at,cafeteria_name,title),
  KEY served_at (served_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export async function createCafeteriaMenuTable(): Promise<void> {
  await Db.query(sql)
}
