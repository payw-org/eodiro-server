import Auth from '@/modules/auth'
import { Interface } from './interface'

export default async function(
  data: Interface['data']
): Promise<Interface['payload']> {
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
