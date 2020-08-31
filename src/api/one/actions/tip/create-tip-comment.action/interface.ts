import {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
  OneApiError,
} from '@/api/one/types'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    tipId: number
    body: string
  }>,
  OneApiActionTemplatePayload<{
    tipCommentId: number
  }>
>
