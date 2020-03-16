import DbConnector from '@/modules/db-connector'
import { getCommentsOfPost } from './get-comments-of-post.f'
;(async () => {
  const posts = await getCommentsOfPost({
    postId: 91,
    mostRecentCommentId: 0,
  })
  console.log(posts)
  ;(await DbConnector.getConnection()).end()
})()
