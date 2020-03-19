import { PostType } from '@/database/models/post'
import Db from '@/db'
import Auth from '@/modules/auth'
import SqlB from '@/modules/sqlb'
import { OneAPIData, OneAPIPayload } from '../types/utils'
import { GetPostById } from './get-post-by-id'

export async function getPostById(
  data: OneAPIData<GetPostById>
): Promise<OneAPIPayload<GetPostById>> {
  const authPayload = await Auth.isSignedUser(data.accessToken)

  if (!authPayload) {
    return {
      err: 'Unauthorized',
      data: null,
    }
  }

  const { postID } = data

  if (typeof postID !== 'number') {
    return {
      err: 'Bad Request',
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
      err: 'Internal Server Error',
      data: null,
    }
  }

  if (results.length === 0) {
    return {
      err: 'No Content',
      data: null,
    }
  }

  return {
    err: null,
    data: results[0],
  }
}
