import { OneApiFunction } from '@/api/one/scheme/types/utils'
import { eodiroQuery } from '@/database/eodiro-query'
import { Comment } from '@/database/models/comment'
import { Post, PostAttrs } from '@/database/models/post'
import { PostLike } from '@/database/models/post_like'
import SqlB, { Q } from '@/modules/sqlb'
import { ArrayUtil } from '@/modules/utils/array-util'
import _ from 'lodash'
import { Action } from './interface'

const func: OneApiFunction<Action> = async (data) => {
  const fromId = data?.lastPostId || 0
  const amount = data?.amount || 20
  const { noBody, boardId } = data

  // Fetch all columns if no columns specified
  const columns = data.columns || Object.keys(Post.attrs)

  if (noBody) {
    _.pullAllWith(columns, ['body'], _.isEqual)
  } else {
    ArrayUtil.replace(columns, 'body', 'substring(body, 1, 100) as body')
  }

  const q = Q()
    .select(
      ...columns,
      'likes',
      Q()
        .select('count(*)')
        .from(Comment.tableName)
        .where(
          `${Comment.tableName}.${Comment.attrs.post_id} = ${Post.tableName}.${Post.attrs.id}`
        )
        .as('comment_count')
    )
    .from(
      Q()
        .join(
          Post.tableName,
          Q()
            .select(PostLike.attrs.post_id, 'count(*) as likes')
            .from(PostLike.tableName)
            .group(PostLike.attrs.post_id)
            .bind('t')
            .build(),
          'left'
        )
        .on(`${Post.tableName}.${Post.attrs.id} = t.${PostLike.attrs.post_id}`)
    )
    .where()
    .equal(Post.attrs.board_id, boardId)

  if (fromId) {
    q.and(`id < ${SqlB.escape(fromId)}`)
  }

  q.order('id', 'desc').limit(amount)

  const result = await eodiroQuery(q.build())

  return {
    err: null,
    data: result as (PostAttrs & { comment_count: number; likes: number })[],
  }
}

export default func
