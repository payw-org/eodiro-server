import {
  OneApiActionTemplatePayload,
  OneApiActionTemplateWithoutReqeustData,
  OneApiError,
} from '../../types'

export type Action = OneApiActionTemplateWithoutReqeustData<
  OneApiActionTemplatePayload<
    OneApiError | 'WHAT',
    {
      what: string
    }
  >
>
