import {
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
  OneApiError,
} from '@/api/one/types'

export interface Action {
  data: {
    accessToken: string
  }
  payload: {
    err: OneApiError
    data: {
      userId: number
    }
  }
}

export type Action2 = OneApiActionTemplate<
  {
    accessToken: string
  },
  OneApiActionTemplatePayload<
    'hello world',
    {
      what: string
    }
  >
>
