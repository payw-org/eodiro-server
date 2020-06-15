import {
  AuthOptional,
  OneApiActionTemplate,
  OneApiActionTemplatePayload,
  OneApiError,
} from '../../types'

export type Action = OneApiActionTemplate<
  AuthOptional,
  OneApiActionTemplatePayload<OneApiError | 'WHAT', null>
>
