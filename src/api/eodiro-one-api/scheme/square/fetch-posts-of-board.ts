import Db from '@/db'
import SqlB from '@/modules/sqlb'
import { DBSchema } from '../../db-schema'

export interface FetchPostsOfBoard {
  action: 'fetchPostsOfBoard'
  data: {
    boardID: number
    fromID?: number
    offset?: number
    amount?: number
  }
  payload: DBSchema.Post[]
}

export async function fetchPostsOfBoard(
  data: FetchPostsOfBoard['data']
): Promise<FetchPostsOfBoard['payload']> {
  const fromID = data?.fromID || 0
  const amount = data?.amount || 20

  const sqlBInstance = SqlB()
    .select(
      ...DBSchema.trimmedPostFields,
      SqlB()
        .select('count(*)')
        .from('comment')
        .where('comment.post_id = post.id')
        .as('comment_count')
        .build()
    )
    .from('post')

  if (fromID) {
    sqlBInstance.where(`id <= ${fromID}`)
  }

  sqlBInstance.order('id', 'desc').limit(amount)

  const query = sqlBInstance.build()
  const [err, results] = await Db.query<FetchPostsOfBoard['payload']>(query)

  if (err) return undefined

  return results
}
