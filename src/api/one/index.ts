import * as funcs from './scheme/functions'

import { OneAPIPayload } from './scheme/types/utils'
import { OneApiAction } from './scheme'
import { Payload } from '@/modules/jwt'

const apiFunctions: Record<
  OneApiAction['action'],
  (data: any, authPayload?: Payload) => Promise<any>
> = {
  ...funcs,
}

export async function oneAPI<T extends OneApiAction>(
  request: Omit<T, 'payload'>
): Promise<OneAPIPayload<T>> {
  const apiF = apiFunctions[request.action]

  if (!apiF) {
    console.log('API function not exists')
    return undefined
  }

  return await apiFunctions[request.action](request.data)
}
