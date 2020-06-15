import * as funcs from './scheme/functions'

import { Payload } from '@/modules/jwt'

const apiFunctions: Record<
  string,
  (data: any, authPayload?: Payload) => Promise<any>
> = {
  ...funcs,
}

export async function oneApi(request: Record<string, any>): Promise<unknown> {
  const apiF = apiFunctions[request.action]

  if (!apiF) {
    console.log('API function not exists')
    return undefined
  }

  return await apiFunctions[request.action](request.data)
}
