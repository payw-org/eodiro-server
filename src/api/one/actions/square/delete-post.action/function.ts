import { PostAttrs, initPost } from '@/database/models/post'
import { QueryTypes, query } from '@/database/query'

import Auth from '@/modules/auth'
import { DeletePost } from '../..'
import { OneApiError } from '@/api/one/types'
import SqlB from '@/modules/sqlb'

export default async function (
  data: DeletePost['data']
): Promise<DeletePost['payload']> {
  const authPayload = await Auth.isSignedUser(data.accessToken)
  if (!authPayload) {
    return {
      err: OneApiError.UNAUTHORIZED,
    }
  }

  const Post = await initPost()
  if (!(await Post.isOwnedBy(data.postId, authPayload.userId))) {
    return {
      err: OneApiError.FORBIDDEN,
    }
  }

  // Delete the post
  await query(
    SqlB<PostAttrs>().delete().from('post').where().equal('id', data.postId),
    {
      type: QueryTypes.DELETE,
    }
  )

  return {
    err: null,
  }
}
