import { Action } from './interface'
import { OneApiFunction } from '@/api/one/types'
import { Post } from '@/database/models/post'

const func: OneApiFunction<Action> = async (data) => {
  return {
    err: null,
    data: await Post.isLikedBy(data.postId, data.authPayload.userId),
  }
}

export default func
