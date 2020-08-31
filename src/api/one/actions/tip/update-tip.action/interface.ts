import {
  AuthRequired,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
} from '@/api/one/types'

export type Action = OneApiActionTemplate<
  AuthRequired<{
    tipId: number
    title: string
    body: string
    fileIds: number[]
  }>,
  OneApiActionTemplatePayload<{ isUpdated: boolean }, 'No Title' | 'No Body'>
>
