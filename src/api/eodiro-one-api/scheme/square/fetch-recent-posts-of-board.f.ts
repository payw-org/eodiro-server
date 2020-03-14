import Db from '@/db'
import { DBSchema } from '@/db/schema'
import SqlB from '@/modules/sqlb'
import { ArrayUtil } from '@/modules/utils/array-util'
import { FetchRecentPostsOfBoard } from './fetch-recent-posts-of-board'

export async function fetchRecentPostsOfBoard(
  data: FetchRecentPostsOfBoard['data']
): Promise<FetchRecentPostsOfBoard['payload']> {
  const { boardID, mostRecentPostID, noBody } = data

  let fields = ArrayUtil.replace<string>(
    DBSchema.postFields,
    'body',
    'substring(body, 1, 100) as body'
  )

  if (noBody) {
    fields = ArrayUtil.remove<string>(fields, 'body')
  }

  const query = SqlB()
    .select(
      ...fields,
      SqlB()
        .select('count(*)')
        .from('comment')
        .where('comment.post_id = post.id')
        .as('comment_count')
        .build()
    )
    .from('post')
    .where('id >= ?')
    .order('id', 'DESC')
    .build()
  const values = [mostRecentPostID]
  const [err, results] = await Db.query(query, values)

  if (err) {
    return undefined
  }

  return results as DBSchema.Post[]
}
