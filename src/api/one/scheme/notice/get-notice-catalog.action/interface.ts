import { OneApiError } from '@/api/one/scheme/types/utils'

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
