import SqlB from '@/modules/sqlb'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('Test SqlB', () => {
  const sqlB = SqlB()

  it('Select posts', () => {
    expect(
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
        .build()
    ).to.equal(
      'SELECT *, (SELECT count(*) FROM comment WHERE comment.post_id = post.id) AS comment_count FROM post ORDER BY id DESC LIMIT ?'
    )
  })

  it('Insert', () => {
    expect(
      sqlB
        .insert('post', {
          title: undefined,
          body: undefined,
          user_id: undefined,
          uploaded_at: undefined,
          random_nickname: undefined
        })
        .build()
    ).to.equal(
      'INSERT INTO post (title, body, user_id, uploaded_at, random_nickname) VALUES(?, ?, ?, ?, ?)'
    )
  })

  it('Update', () => {
    expect(
      sqlB
        .update('post', {
          title: undefined,
          body: 'hello',
          is_edited: 1
        })
        .where('id = ?')
        .build()
    ).to.equal(
      "UPDATE post SET title = ?, body = 'hello', is_edited = 1 WHERE id = ?"
    )
  })

  it('Delete', () => {
    expect(
      sqlB
        .delete()
        .from('post')
        .where('id = ?')
        .build()
    ).to.equal('DELETE FROM post WHERE id = ?')
  })
})
