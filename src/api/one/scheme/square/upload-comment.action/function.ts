import { CommentType } from '@/database/models/comment'
import { PostType } from '@/database/models/post'
import { getUser } from '@/database/models/user'
import { TableNames } from '@/database/table-names'
import Db from '@/db'
import Auth from '@/modules/auth'
import SqlB from '@/modules/sqlb'
import Time from '@/modules/time'
import { Action } from './interface'

export default async function (
  data: Action['data']
): Promise<Action['payload']> {
  const authPayload = await Auth.isSignedUser(data.accessToken)

  if (authPayload === false) {
    return {
      err: 'Unauthorized',
    }
  }

  // Get user info
  const User = await getUser()
  const userInfo = await User.findAtId(authPayload.userId)

  // Check if the post exist
  const [, posts] = await Db.query(
    SqlB<PostType>()
      .select('*')
      .from(TableNames.post)
      .where()
      .equal('id', data.postId)
  )

  if (posts.length === 0) {
    return {
      err: 'No Post',
    }
  }

  const body = data.body.trim()
  if (body.length === 0) {
    return {
      err: 'No Body',
    }
  }

  const query = SqlB<CommentType>()
    .insert(TableNames.comment, {
      user_id: userInfo.id,
      random_nickname: userInfo.random_nickname,
      post_id: data.postId,
      body: data.body,
      uploaded_at: Time.getCurrTime(),
    })
    .build()

  const [err] = await Db.query(query)
  if (err) {
    return {
      err: 'Internal Server Error',
    }
  }

  return {
    err: null,
  }
}
