import { postAttrs, PostType } from '@/database/models/post'
import Db from '@/db'
import SqlB from '@/modules/sqlb'
import { ArrayUtil } from '@/modules/utils/array-util'
import _ from 'lodash'
import { FetchRecentPostsOfBoard } from './fetch-recent-posts-of-board'

export async function fetchRecentPostsOfBoard(
  data: FetchRecentPostsOfBoard['data']
): Promise<FetchRecentPostsOfBoard['payload']> {
  const { boardID, mostRecentPostID, noBody } = data

  // Fetch all columns if no columns specified
  const columns = data.columns || postAttrs

  if (noBody) {
    _.pullAllWith(columns, ['body'], _.isEqual)
  } else {
    ArrayUtil.replace(columns, 'body', 'substring(body, 1, 100) as body')
  }

  const query = SqlB()
    .select(
      ...columns,
      SqlB()
        .select('count(*)')
        .from('comment')
        .where('comment.post_id = post.id')
        .as('comment_count')
    )
    .from('post')
    .where(SqlB<PostType>().equal('board_id', boardID))
    .and()
    .raw('id > ?')
    .order('id', 'DESC')
    .build()
  const values = [mostRecentPostID]
  const [, results] = await Db.query(query, values)

  return results as FetchRecentPostsOfBoard['payload']
}
