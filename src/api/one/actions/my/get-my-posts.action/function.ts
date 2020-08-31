import { Action } from './interface'
import { BoardType } from '@/database/models/board'
import { OneApiFunction } from '@/api/one/types'
import { PostAttrs } from '@/database/models/post'
import { Q } from '@/modules/sqlb'
import { eodiroQuery } from '@/database/eodiro-query'

const func: OneApiFunction<Action> = async (data) => {
  const { authPayload } = data

  const lastPostId = data.lastPostId || 2147483647
  const amount = data.amount || 20

  const query = Q()
    .select(
      'post.id as id, board_id, title, body, user_id, random_nickname, uploaded_at, edited_at, is_deleted, board_name'
    )
    .from(Q().join('post', 'board').on('post.board_id = board.id'))
    .where(
      Q().equal('user_id', authPayload.userId).andLess('post.id', lastPostId)
    )
    .order('post.id', 'DESC')
    .limit(amount)

  const posts = await eodiroQuery<PostAttrs & BoardType>(query)

  return {
    err: null,
    data: posts,
  }
}

export default func
