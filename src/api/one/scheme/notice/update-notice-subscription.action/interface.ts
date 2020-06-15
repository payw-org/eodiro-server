import { AuthRequired, OneApiError } from '@/api/one/types'

export type NoticeKey = string

export interface Action {
  data: AuthRequired<{
    noticeKey: NoticeKey
  }>
  payload: {
    err: OneApiError | 'NoticeKey Required'
    data?: Record<NoticeKey, boolean>
  }
}
