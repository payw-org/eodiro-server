import SqlB from '@/modules/sqlb'
import { describe, it } from 'mocha'
import { assert } from 'chai'

const sqlB = SqlB()
console.log(
  sqlB
    .select(
      '*',
      SqlB()
        .select('count(*)')
        .from('comment')
        .where('comment.post_id = post.id')
        .as('comment_count')
        .build()
    )
    .from('post')
    .order('id', 'DESC')
    .limit(undefined)
    .build(true)
)

console.log(
  sqlB
    .insert('post', {
      title: undefined,
      body: undefined,
      user_id: undefined,
      uploaded_at: undefined,
      random_nickname: undefined
    })
    .build()
)

console.log(
  sqlB
    .update('post', {
      title: undefined,
      body: 'hello',
      is_edited: 1
    })
    .where('id = ?')
    .build()
)

console.log(
  sqlB
    .delete()
    .from('post')
    .where('id = ?')
    .build()
)
