import axios from 'axios'
import { APIScheme } from '../scheme'

// One API for client application
export async function oneAPIClient<T extends APIScheme>(
  host: string,
  request: T['request'] & {
    auth?: boolean
  }
): Promise<T['payload']> {
  try {
    const payload: unknown = await axios({
      url: `${host}/one`,
      method: 'POST',
      data: request,
    })

    return payload as T['payload']
  } catch (err) {
    console.log(err)
    return undefined
  }
}
