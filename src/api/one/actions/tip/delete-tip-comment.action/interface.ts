import {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
  OneApiError,
} from '@/api/one/types'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    tipCommentId: number
  }>,
  OneApiActionTemplatePayload<OneApiError, { isRemoved: boolean }>
>
