import { Post, PostAttrs } from '@/database/models/post'
import Db from '@/db'
import SqlB from '@/modules/sqlb'
import { ArrayUtil } from '@/modules/utils/array-util'
import _ from 'lodash'
import { FetchPostsOfBoard } from './fetch-posts-of-board'

export async function fetchPostsOfBoard(
  data: FetchPostsOfBoard['data']
): Promise<FetchPostsOfBoard['payload']> {
  const fromID = data?.lastPostID || 0
  const amount = data?.amount || 20
  const { noBody } = data

  // Fetch all columns if no columns specified
  const columns = data.columns || Object.keys(Post.attrs)

  if (noBody) {
    _.pullAllWith(columns, ['body'], _.isEqual)
  } else {
    ArrayUtil.replace(columns, 'body', 'substring(body, 1, 100) as body')
  }

  const sqlBInstance = SqlB<PostAttrs>()
    .selectAny(
      ...columns,
      SqlB()
        .select('count(*)')
        .from('comment')
        .where('comment.post_id = post.id')
        .as('comment_count')
        .build()
    )
    .from('post')
    .where()
    .equal('board_id', data.boardID)

  if (fromID) {
    sqlBInstance.and(`id < ${SqlB.escape(fromID)}`)
  }

  sqlBInstance.order('id', 'desc').limit(amount)

  const query = sqlBInstance.build()
  const [, results] = await Db.query<FetchPostsOfBoard['payload']>(query)

  return results
}
