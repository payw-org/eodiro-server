import axios from 'axios'
import { APIScheme } from '../scheme'
import { OneApiError, OneAPIPayload } from '../scheme/types/utils'

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

    if ('err' in data) {
      const oneApiErr = data['err'] as OneApiError

      if (typeof window !== 'undefined') {
        let msg = ''
        switch (oneApiErr) {
          case OneApiError.BAD_REQUEST:
            msg = '잘못된 요청입니다.'
            break
          case OneApiError.FORBIDDEN:
            msg = '금지된 요청입니다.'
            break
          case OneApiError.UNAUTHORIZED:
            msg = '로그인 정보가 없습니다.'
            break
          case OneApiError.INTERNAL_SERVER_ERROR:
            msg = '서버에 문제가 발생했습니다.'
            break
          default:
            break
        }
        window.alert(msg)
      }
    }

    return data
  } catch (err) {
    console.error(err)
    if (typeof window !== 'undefined') {
      window.alert('[One API] 서버와 연결할 수 없습니다.')
    }
    throw err
  }
}
