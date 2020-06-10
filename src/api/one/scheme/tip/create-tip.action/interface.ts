import { AuthRequired, OneApiError } from '@/api/one/scheme/types/utils'

export interface Action {
  data: AuthRequired<{
    topic: string
    title: string
    body: string
  }>
  payload: {
    err: OneApiError
    data: number
  }
}
