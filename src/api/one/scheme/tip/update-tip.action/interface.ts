import {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
  OneApiError,
} from '@/api/one/types'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    tipId: number
    title: string
    body: string
    fileIds: number[]
  }>,
  OneApiActionTemplatePayload<OneApiError, { isUpdated: boolean }>
>
