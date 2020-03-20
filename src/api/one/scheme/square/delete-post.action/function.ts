import { getPost, PostType } from '@/database/models/post'
import { query, QueryTypes } from '@/database/query'
import Auth from '@/modules/auth'
import SqlB from '@/modules/sqlb'
import { DeletePost } from '../..'
import { OneApiError } from '../../types/utils'

export default async function(
  data: DeletePost['data']
): Promise<DeletePost['payload']> {
  const authPayload = await Auth.isSignedUser(data.accessToken)
  if (!authPayload) {
    return {
      err: OneApiError.UNAUTHORIZED,
    }
  }

  const Post = await getPost()
  if (!(await Post.isOwnedBy(data.postId, authPayload.userId))) {
    return {
      err: OneApiError.FORBIDDEN,
    }
  }

  await query(
    SqlB<PostType>()
      .delete()
      .from('post')
      .where()
      .equal('id', data.postId),
    {
      type: QueryTypes.DELETE,
    }
  )

  return {
    err: null,
  }
}
