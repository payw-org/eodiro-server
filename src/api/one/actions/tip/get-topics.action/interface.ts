import {
  OneApiActionTemplatePayload,
  OneApiActionTemplateWithoutReqeustData,
} from '@/api/one/types'

export type Action = OneApiActionTemplateWithoutReqeustData<
  OneApiActionTemplatePayload<Record<string, string>>
>
