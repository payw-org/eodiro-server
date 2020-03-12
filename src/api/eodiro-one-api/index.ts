import { APIScheme } from './scheme'
import * as square from './scheme/functions'

const apiFunctions: Record<APIScheme['action'], (data: any) => Promise<any>> = {
  ...square,
}

export async function oneAPI<T extends APIScheme>(
  request: Omit<T, 'payload'>
): Promise<T['payload']> {
  const apiF = apiFunctions[request.action]

  if (!apiF) {
    return undefined
  }

  return await apiFunctions[request.action](request.data)
}
