import SqlB from '@/modules/sqlb'
import { expect } from 'chai'

describe('Test SqlB', () => {
  const sqlB = SqlB()

  it('Select posts using subquery, as, order, limit', () => {
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
      'SELECT *, (SELECT count(*) FROM comment WHERE comment.post_id = post.id) AS comment_count FROM post ORDER BY id DESC'
    )
  })

  it('Insert with 5 placeholders', () => {
    expect(
      sqlB
        .insert('post', {
          title: undefined,
          body: undefined,
          user_id: undefined,
          uploaded_at: undefined,
          random_nickname: undefined,
        })
        .build()
    ).to.equal(
      'INSERT INTO post (title, body, user_id, uploaded_at, random_nickname) VALUES(?, ?, ?, ?, ?)'
    )
  })

  it('Bulk insert', () => {
    expect(
      sqlB
        .insertBulk('lecture', [
          {
            year: 2011,
            semester: '1',
            grade: 3,
            code: '9999-01',
          },
          {
            year: 2012,
            semester: '2',
            grade: 4,
            code: '9999-02',
          },
        ])
        .build()
    ).to.equal(
      `INSERT INTO lecture (year, semester, grade, code) VALUES (2011, '1', 3, '9999-01'), (2012, '2', 4, '9999-02')`
    )
  })

  it('Update with 1 placeholder, 1 string and 1 number', () => {
    expect(
      sqlB
        .update('post', {
          title: undefined,
          body: 'hello',
          is_edited: 1,
        })
        .where('id = ?')
        .build()
    ).to.equal(
      "UPDATE post SET title = ?, body = 'hello', is_edited = 1 WHERE id = ?"
    )
  })

  it('Delete', () => {
    expect(sqlB.delete().from('post').where('id = ?').build()).to.equal(
      'DELETE FROM post WHERE id = ?'
    )
  })
})

describe('Test SQL Injections', () => {
  it('Prevent sign in bypass', () => {
    const sql = SqlB()
      .select('*')
      .from('users')
      .where(
        SqlB()
          .equal('username', 'admin')
          .andEqual('password', `password' OR 1=1 --`)
      )
      .build()
    expect(sql).not.equal(
      `SELECT * FROM users WHERE username = 'admin' AND password = 'password' OR 1=1 --`
    )
  })
})
