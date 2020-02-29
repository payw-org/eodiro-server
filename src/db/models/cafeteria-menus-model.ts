import { Campus } from '@/types'

export interface CafeteriaMenu extends Record<string, string | number> {
  campus: Campus
  served_at: string
  cafeteria_name: string
  title: string
  time: string
  price: string
  menus: string
}
