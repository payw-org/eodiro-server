import { Action } from './interface'
import Auth from '@/modules/auth'
import { OneApiError } from '@/api/one/types'

export default async function (
  data: Action['data']
): Promise<Action['payload']> {
  const authPayload = await Auth.isSignedUser(data.accessToken)

  if (!authPayload) {
    return {
      err: OneApiError.UNAUTHORIZED,
      data: null,
    }
  }

  return {
    err: null,
    data: {
      userId: authPayload.userId,
    },
  }
}
