import { Action } from './interface'
import { OneApiFunction } from '@/api/one/types'
import { Post } from '@/database/models/post'

const func: OneApiFunction<Action> = async (data) => {
  const { authPayload } = data

  const { postId } = data
  const userId = authPayload.userId
  let liked = false

  if (await Post.isLikedBy(postId, userId)) {
    await Post.unlike(postId, userId)
    liked = false
  } else {
    await Post.like(data.postId, authPayload.userId)
    liked = true
  }

  return {
    err: null,
    data: {
      liked,
      total: await Post.getLikes(data.postId),
    },
  }
}

export default func
