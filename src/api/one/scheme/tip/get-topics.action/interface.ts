import {
  OneApiActionTemplatePayload,
  OneApiActionTemplateWithoutReqeustData,
  OneApiError,
} from '@/api/one/types'

export type Action = OneApiActionTemplateWithoutReqeustData<
  OneApiActionTemplatePayload<OneApiError, { [key: string]: string }>
>
