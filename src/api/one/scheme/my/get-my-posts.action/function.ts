import { eodiroQuery } from '@/database/eodiro-query'
import { BoardType } from '@/database/models/board'
import { PostType } from '@/database/models/post'
import Auth from '@/modules/auth'
import { Q } from '@/modules/sqlb'
import { OneApiError, OneApiFunction } from '../../types/utils'
import { Action } from './interface'

const func: OneApiFunction<Action> = async (data) => {
  const authPayload = await Auth.isSignedUser(data.accessToken)

  if (!authPayload) {
    return {
      err: OneApiError.FORBIDDEN,
    }
  }

  const lastPostId = data.lastPostId || 2147483647
  const amount = data.amount || 20

  const posts = await eodiroQuery<PostType & BoardType>(
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
