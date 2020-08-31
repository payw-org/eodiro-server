import { Action } from './interface'
import Auth from '@/modules/auth'
import { CommentAttrs } from '@/database/models/comment'
import Db from '@/db'
import { OneApiError } from '@/api/one/types'
import SqlB from '@/modules/sqlb'

export default async function (
  data: Action['data']
): Promise<Action['payload']> {
  const authPayload = await Auth.isSignedUser(data.accessToken)
  if (!authPayload)
    return {
      err: OneApiError.UNAUTHORIZED,
      data: null,
    }

  const query = SqlB<CommentAttrs>()
    .select('*')
    .from('comment')
    .where()
    .equal('post_id', data.postId)
    .andMore('id', data.mostRecentCommentId || 0)
    .order('id', 'asc')
    .limit(data.amount)
    .build()

  const [err, results] = await Db.query<CommentAttrs[]>(query)

  if (err) {
    return {
      err: OneApiError.INTERNAL_SERVER_ERROR,
      data: null,
    }
  }

  return {
    err: null,
    data: results,
  }
}
