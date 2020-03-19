import { postAttrs } from '@/database/models/post'
import Db from '@/db'
import SqlB from '@/modules/sqlb'
import { ArrayUtil } from '@/modules/utils/array-util'
import { FetchPostsOfBoard } from './fetch-posts-of-board'

export async function fetchPostsOfBoard(
  data: FetchPostsOfBoard['data']
): Promise<FetchPostsOfBoard['payload']> {
  const fromID = data?.lastPostID || 0
  const amount = data?.amount || 20
  const { noBody } = data

  let fields = ArrayUtil.replace(
    postAttrs,
    'body',
    'substring(body, 1, 100) as body'
  )

  if (noBody) {
    fields = ArrayUtil.remove<string>(fields, 'body')
  }

  const sqlBInstance = SqlB()
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

  if (fromID) {
    sqlBInstance.where(`id < ${fromID}`)
  }

  sqlBInstance.order('id', 'desc').limit(amount)

  const query = sqlBInstance.build()
  const [err, results] = await Db.query<FetchPostsOfBoard['payload']>(query)

  if (err) return undefined

  return results
}
