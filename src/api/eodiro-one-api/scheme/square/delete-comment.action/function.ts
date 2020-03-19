import { CommentType } from '@/database/models/comment'
import { user } from '@/database/models/user'
import Db from '@/db'
import Auth from '@/modules/auth'
import SqlB from '@/modules/sqlb'
import { OneApiError } from '../../types/utils'
import { Interface } from './interface'

export default async function(
  data: Interface['data']
): Promise<Interface['payload']> {
  const authPayload = await Auth.isSignedUser(data.accessToken)
  if (!authPayload) {
    return {
      err: OneApiError.UNAUTHORIZED,
    }
  }

  const User = await user()
  const userInfo = await User.findAtId(authPayload.userId)

  const [, results] = await Db.query<CommentType[]>(
    SqlB<CommentType>()
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
    SqlB<CommentType>()
      .delete()
      .from('comment')
      .where()
      .equal('id', data.commentId)
  )

  return {
    err: null,
  }
}
