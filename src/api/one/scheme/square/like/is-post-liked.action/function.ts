import { OneApiFunction } from '@/api/one/scheme/types/utils'
import { Post } from '@/database/models/post'
import { Action } from './interface'

const func: OneApiFunction<Action> = async (data) => {
  return {
    err: null,
    data: await Post.isLikedBy(data.postId, data.authPayload.userId),
  }
}

export default func
