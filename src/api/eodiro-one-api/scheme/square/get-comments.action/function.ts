import Db from '@/db'
import { Comment, Comments } from '@/db/schema/generated'
import SqlB from '@/modules/sqlb'
import { Interface } from './interface'

export default async function(
  data: Interface['data']
): Promise<Interface['payload']> {
  const query = SqlB<Comment>()
    .select('*')
    .from('comment')
    .where()
    .equal('post_id', data.postId)
    .andMore('id', data.mostRecentCommentId || 0)
    .order('id', 'asc')
    .limit(data.amount)
    .build()

  const [err, results] = await Db.query<Comments>(query)

  if (err) {
    return {
      err: 'Internal Server Error',
      data: null,
    }
  }

  return {
    err: null,
    data: results,
  }
}
