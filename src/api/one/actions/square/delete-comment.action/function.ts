import { Action } from './interface'
import Auth from '@/modules/auth'
import { CommentAttrs } from '@/database/models/comment'
import Db from '@/db'
import { OneApiError } from '@/api/one/types'
import SqlB from '@/modules/sqlb'
import { getUser } from '@/database/models/user'

export default async function (
  data: Action['data']
): Promise<Action['payload']> {
  const authPayload = await Auth.isSignedUser(data.accessToken)
  if (!authPayload) {
    return {
      err: OneApiError.UNAUTHORIZED,
    }
  }

  const User = await getUser()
  const userInfo = await User.findAtId(authPayload.userId)

  const [, results] = await Db.query<CommentAttrs[]>(
    SqlB<CommentAttrs>()
      .select('user_id')
      .from('comment')
      .where()
      .equal('id', data.commentId)
  )

  // No comment
  if (results.length === 0) {
    return {
      err: OneApiError.NO_CONTENT,
    }
  }

  // Not your comment
  if (results[0].user_id !== userInfo.id) {
    return {
      err: OneApiError.FORBIDDEN,
    }
  }

  await Db.query(
    SqlB<CommentAttrs>()
      .delete()
      .from('comment')
      .where()
      .equal('id', data.commentId)
  )

  return {
    err: null,
  }
}
