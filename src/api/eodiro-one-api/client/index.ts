import axios from 'axios'
import { APIScheme } from '../scheme'

// One API for client application
export async function oneAPIClient<T extends APIScheme>(
  host: string,
  request: Omit<T, 'payload'>
): Promise<T['payload']> {
  try {
    const { data }: { data: unknown } = await axios({
      url: `${host}/one`,
      method: 'POST',
      data: request,
    })

    return data as T['payload']
  } catch (err) {
    console.log(err)
    return undefined
  }
}
