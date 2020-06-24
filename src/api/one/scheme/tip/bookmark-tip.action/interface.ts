import {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
  OneApiError,
} from '@/api/one/types'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    tipId: number
  }>,
  OneApiActionTemplatePayload<
    OneApiError,
    {
      isBookmarked: boolean
      bookmarks: number
    }
  >
>
