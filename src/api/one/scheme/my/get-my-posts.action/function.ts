import { eodiroQuery } from '@/database/eodiro-query'
import { BoardType } from '@/database/models/board'
import { PostAttrs } from '@/database/models/post'
import { Q } from '@/modules/sqlb'
import { OneApiFunction } from '../../types/utils'
import { Action } from './interface'

const func: OneApiFunction<Action> = async (data) => {
  const { authPayload } = data

  const lastPostId = data.lastPostId || 2147483647
  const amount = data.amount || 20

  const posts = await eodiroQuery<PostAttrs & BoardType>(
    Q()
      .select()
      .from(Q().join('post', 'board').on('post.board_id = board.id'))
      .where(
        Q().equal('user_id', authPayload.userId).andLess('post.id', lastPostId)
      )
      .order('post.id', 'DESC')
      .limit(amount)
  )

  return {
    err: null,
    data: posts,
  }
}

export default func
