import { OneApiError } from '@/api/one/types'

export type NoticeItem = {
  key: string
  displayName: string
}

export interface Action {
  data: undefined
  payload: {
    err: OneApiError
    data: {
      noticeCatalog: NoticeItem[]
    }
  }
}
