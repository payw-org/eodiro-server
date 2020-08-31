import type {
  OneApiActionTemplatePayload,
  OneApiActionTemplateWithoutReqeustData,
} from '@/api/one/types'

export type Action = OneApiActionTemplateWithoutReqeustData<
  OneApiActionTemplatePayload<{
    years: number[]
  }>
>
