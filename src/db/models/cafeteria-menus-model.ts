import { Campus } from '@/types'

export interface CafeteriaMenuModel extends Record<string, string | number> {
  campus: Campus
  served_at: string
  data: string
}
