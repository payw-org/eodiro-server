import { Payload } from '@/modules/jwt'
import { APIScheme } from './scheme'
import * as funcs from './scheme/functions'
import { OneAPIPayload } from './scheme/types/utils'

const apiFunctions: Record<
  APIScheme['action'],
  (data: any, authPayload?: Payload) => Promise<any>
> = {
  ...funcs,
}

export async function oneAPI<T extends APIScheme>(
  request: Omit<T, 'payload'>
): Promise<OneAPIPayload<T>> {
  const apiF = apiFunctions[request.action]

  if (!apiF) {
    console.log('API function not exists')
    return undefined
  }

  return await apiFunctions[request.action](request.data)
}
