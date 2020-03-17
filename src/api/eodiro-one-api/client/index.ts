import axios from 'axios'
import { APIScheme } from '../scheme'
import { OneAPIPayload } from '../scheme/types/utils'

// One API for client application
export async function oneAPIClient<T extends APIScheme>(
  host: string,
  request: Omit<T, 'payload'>
): Promise<OneAPIPayload<T>> {
  let accessToken = ''

  if ('accessToken' in request.data) {
    accessToken = request.data['accessToken']
    delete request.data['accessToken']
  }

  try {
    const { data }: { data: OneAPIPayload<T> } = await axios({
      url: `${host}/one`,
      method: 'POST',
      data: request,
      headers: {
        accessToken: accessToken || '',
      },
    })

    return data
  } catch (err) {
    console.error(err)
    if (typeof window !== 'undefined') {
      window.alert('[One API] 서버와 연결할 수 없습니다.')
    }
    throw err
  }
}
