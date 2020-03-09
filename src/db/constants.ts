export type DbTableNames =
  | 'admin'
  | 'user'
  | 'pending_user'
  | 'refresh_token'
  | 'coverage_college'
  | 'coverage_major'
  | 'lecture'
  | 'period'
  | 'coverage_major_lecture'
  | 'cafeteria_menu'
  | 'post'
  | 'comment'
  | 'inquiry'
  | 'change_password'

export const DbTables: Record<DbTableNames, DbTableNames> = {
  admin: 'admin',
  user: 'user',
  pending_user: 'pending_user',
  refresh_token: 'refresh_token',
  coverage_college: 'coverage_college',
  coverage_major: 'coverage_major',
  lecture: 'lecture',
  period: 'period',
  coverage_major_lecture: 'coverage_major_lecture',
  cafeteria_menu: 'cafeteria_menu',
  post: 'post',
  comment: 'comment',
  inquiry: 'inquiry',
  change_password: 'change_password',
}
