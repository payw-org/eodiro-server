import { getPost, PostType } from '@/database/models/post'
import Db from '@/db'
import Auth from '@/modules/auth'
import SqlB from '@/modules/sqlb'
import { OneAPIData, OneApiError, OneAPIPayload } from '../types/utils'
import { GetPostById } from './get-post-by-id'

export async function getPostById(
  data: OneAPIData<GetPostById>
): Promise<OneAPIPayload<GetPostById>> {
  const authPayload = await Auth.isSignedUser(data.accessToken)

  if (!authPayload) {
    return {
      err: OneApiError.UNAUTHORIZED,
      data: null,
    }
  }

  const { postID } = data

  if (typeof postID !== 'number') {
    return {
      err: OneApiError.BAD_REQUEST,
      data: null,
    }
  }

  const query = SqlB<PostType>()
    .select('*')
    .from('post')
    .where()
    .equal('id', postID)
    .build()

  const [err, results] = await Db.query<PostType[]>(query)

  if (err) {
    return {
      err: OneApiError.INTERNAL_SERVER_ERROR,
      data: null,
    }
  }

  if (results.length === 0) {
    return {
      err: OneApiError.NO_CONTENT,
      data: null,
    }
  }

  if (data.edit === true) {
    const Post = await getPost()
    const isYourPost = await Post.isOwnedBy(data.postID, authPayload.userId)
    if (!isYourPost) {
      return {
        err: OneApiError.FORBIDDEN,
        data: null,
      }
    }
  }

  return {
    err: null,
    data: results[0],
  }
}
