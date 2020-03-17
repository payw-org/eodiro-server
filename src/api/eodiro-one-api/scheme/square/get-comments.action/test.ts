import DbConnector from '@/modules/db-connector'
import { getComments } from '../../functions'
;(async () => {
  const posts = await getComments({
    postId: 91,
    mostRecentCommentId: 0,
  })
  console.log(posts)
  ;(await DbConnector.getConnection()).end()
})()
