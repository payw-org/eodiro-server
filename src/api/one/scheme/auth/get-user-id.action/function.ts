import Auth from '@/modules/auth'
import { Action } from './interface'

export default async function (
  data: Action['data']
): Promise<Action['payload']> {
  const authPayload = await Auth.isSignedUser(data.accessToken)

  if (!authPayload) {
    return {
      err: 'Unauthorized',
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
