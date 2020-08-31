import {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
} from '@/api/one/types'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    tipCommentId: number
  }>,
  OneApiActionTemplatePayload<{ isRemoved: boolean }>
>
