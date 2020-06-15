import {
  OneApiActionTemplate,
  OneApiActionTemplateWithoutReqeustData,
} from '../types'

export function oneApiResponse<
  T extends OneApiActionTemplate | OneApiActionTemplateWithoutReqeustData
>(
  errOrData: T['payload']['data'],
  dataOrError?: T['payload']['err'] | null
): T['payload']
export function oneApiResponse<
  T extends OneApiActionTemplate | OneApiActionTemplateWithoutReqeustData
>(
  errOrData: T['payload']['err'] | null,
  dataOrError?: T['payload']['data']
): T['payload']
export function oneApiResponse<
  T extends OneApiActionTemplate | OneApiActionTemplateWithoutReqeustData
>(errOrData: unknown, dataOrError?: unknown): T['payload'] {
  const returnObj: T['payload'] = {
    err: null,
    data: null,
  }

  if (typeof errOrData === 'string') {
    // First argument is error

    returnObj.err = errOrData

    if (typeof dataOrError === 'object') {
      returnObj.data = dataOrError as Record<string, unknown>
    }
  } else if (typeof errOrData === 'object') {
    // First argument is data

    returnObj.data = errOrData as Record<string, unknown>

    if (typeof dataOrError === 'string') {
      returnObj.err = dataOrError
    }
  }

  return returnObj
}
