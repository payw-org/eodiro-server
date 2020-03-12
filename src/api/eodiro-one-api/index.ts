import * as square from './api-functions/square'
import { APIScheme } from './scheme'
export { oneAPIClient } from './client'

const apiFunctions: Record<
  APIScheme['request']['action'],
  (data: any) => Promise<any>
> = {
  ...square,
}

export async function oneAPI<T extends APIScheme>(
  request: T['request']
): Promise<T['payload']> {
  const apiF = apiFunctions[request.action]

  if (!apiF) {
    return undefined
  }

  return await apiFunctions[request.action](request.data)
}
