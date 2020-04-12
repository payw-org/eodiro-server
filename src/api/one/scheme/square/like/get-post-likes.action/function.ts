import { OneApiFunction } from '@/api/one/scheme/types/utils'
import { Post } from '@/database/models/post'
import { Action } from './interface'

const func: OneApiFunction<Action> = async (data) => {
  return {
    err: null,
    data: await Post.getLikes(data.postId),
  }
}

export default func
