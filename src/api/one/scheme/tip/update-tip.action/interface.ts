import { AuthRequired, OneApiError } from '@/api/one/types'

export interface Action {
  data: AuthRequired<{
    tipId: number
    title: string
    body: string
  }>
  payload: {
    err: OneApiError
    data: boolean
  }
}
