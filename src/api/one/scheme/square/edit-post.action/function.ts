import { getPost, PostType } from '@/database/models/post'
import { query, QueryTypes } from '@/database/query'
import Auth from '@/modules/auth'
import SqlB from '@/modules/sqlb'
import Time from '@/modules/time'
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

  const Post = await getPost()
  const yourPost = await Post.isOwnedBy(data.postId, authPayload.userId)

  if (!yourPost) {
    return {
      err: OneApiError.FORBIDDEN,
    }
  }

  const title = data.title.trim()
  if (title.length === 0) {
    return {
      err: 'No Title',
    }
  }

  const body = data.body.trim()
  if (body.length === 0) {
    return {
      err: 'No Body',
    }
  }

  await query(
    SqlB<PostType>()
      .update('post', {
        title,
        body,
        edited_at: Time.getCurrTime(),
      })
      .where()
      .equal('id', data.postId),
    {
      type: QueryTypes.UPDATE,
      plain: true,
    }
  )

  return {
    err: null,
  }
}
