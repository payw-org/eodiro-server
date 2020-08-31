import {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
} from '@/api/one/types'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    tipId: number
  }>,
  OneApiActionTemplatePayload<{
    isLiked: boolean
    likes: number
  }>
>
