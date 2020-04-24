import { CoverageMajorType } from '@/database/models/coverage_major'
import { Q } from '@/modules/sqlb'
import { TableNames } from '@/database/table-names'
import { expect } from 'chai'

describe('Test SqlB', () => {
  it('SqlB instance should be empty after build', () => {
    const q = Q()
    q.select().from('user').build()

    expect(q.select().from('post').build(true)).to.equal('SELECT * FROM post;')
  })

  it('Select posts using subquery, as, order, limit', () => {
    expect(
      Q()
        .select(
          '*',
          Q()
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
      Q()
        .insert(TableNames.post, {
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

  it('Insert with ignore strategy', () => {
    expect(
      Q<CoverageMajorType>()
        .insert(
          TableNames.coverage_major,
          {
            name: 'what',
            coverage_college: 'hello',
            code: 'lecture code',
          },
          'ignore'
        )
        .build()
    ).to.equal(
      "INSERT IGNORE INTO coverage_major (name, coverage_college, code) VALUES('what', 'hello', 'lecture code')"
    )
  })

  it('Insert with update strategy', () => {
    expect(
      Q<CoverageMajorType>()
        .insert(
          TableNames.coverage_major,
          {
            name: 'what',
            coverage_college: 'hello',
            code: 'lecture code',
          },
          'update'
        )
        .build()
    ).to.equal(
      "INSERT INTO coverage_major (name, coverage_college, code) VALUES('what', 'hello', 'lecture code') ON DUPLICATE KEY UPDATE name = VALUES(name), coverage_college = VALUES(coverage_college), code = VALUES(code)"
    )
  })

  it('Bulk insert', () => {
    expect(
      Q()
        .bulkInsert(TableNames.lecture, [
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

  it('Bulk insert with ignore strategy', () => {
    expect(
      Q()
        .bulkInsert(
          TableNames.lecture,
          [
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
          ],
          'ignore'
        )
        .build()
    ).to.equal(
      `INSERT IGNORE INTO lecture (year, semester, grade, code) VALUES (2011, '1', 3, '9999-01'), (2012, '2', 4, '9999-02')`
    )
  })

  it('Bulk insert with update strategy', () => {
    expect(
      Q()
        .bulkInsert(
          TableNames.lecture,
          [
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
          ],
          'update'
        )
        .build()
    ).to.equal(
      `INSERT INTO lecture (year, semester, grade, code) VALUES (2011, '1', 3, '9999-01'), (2012, '2', 4, '9999-02') ON DUPLICATE KEY UPDATE year = VALUES(year), semester = VALUES(semester), grade = VALUES(grade), code = VALUES(code)`
    )
  })

  it('Update with 1 placeholder, 1 string and 1 number', () => {
    expect(
      Q()
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
    expect(Q().delete().from('post').where('id = ?').build()).to.equal(
      'DELETE FROM post WHERE id = ?'
    )
  })
})

describe('Test SQL Injections', () => {
  it('Prevent sign in bypass', () => {
    const sql = Q()
      .select('*')
      .from('users')
      .where(
        Q()
          .equal('username', 'admin')
          .andEqual('password', `password' OR 1=1 --`)
      )
      .build()
    expect(sql).not.equal(
      `SELECT * FROM users WHERE username = 'admin' AND password = 'password' OR 1=1 --`
    )
  })
})
