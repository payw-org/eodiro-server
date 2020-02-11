import express from 'express'
import Db from '@/db'
import SqlB from '@/modules/sqlb'

const router = express.Router()

const lectureCols = [
  'year',
  'semester',
  'campus',
  'college',
  'major',
  'grade',
  'credit',
  'course',
  'section',
  'code',
  'name',
  'professor',
  'schedule',
  'building',
  'room',
  'note',
]

router.get('/:year/:semester/:campus/lectures', async (req, res) => {
  const year = parseInt(Db.escape(req.params?.year))
  const semester = Db.escape(req.params?.semester)
  const campus = Db.escape(req.params?.campus)
  const amount = parseInt(req.query?.amount) || 20
  const offset = parseInt(req.query?.offset) || 0

  const query = SqlB()
    .select(...lectureCols)
    .from('lecture')
    .where(`year=${year} AND semester='${semester}' AND campus='${campus}'`)
    .multiOrder([
      ['name', 'ASC'],
      ['professor', 'ASC'],
      ['schedule', 'ASC'],
    ])
    .limit(amount, offset)
    .build()
  const [err, results] = await Db.query(query)

  if (err) {
    res.sendStatus(500)
    return
  }

  res.json(results)
})

router.get('/:year/:semester/:campus/lectures/search', async (req, res) => {
  const year = parseInt(Db.escape(req.params?.year))
  const semester = Db.escape(req.params?.semester)
  const campus = Db.escape(req.params?.campus)
  const searchKeyword = Db.escape(req.query?.q)
  const amount = parseInt(req.query?.amount) || 20
  const offset = parseInt(req.query?.offset) || 0

  const [err, results] = await Db.query(
    SqlB()
      .select(...lectureCols)
      .from('lecture')
      .where(`year=${year} AND semester='${semester}' AND campus='${campus}'`)
      .and()
      .like('college', `%${searchKeyword}%`)
      .or()
      .like('major', `%${searchKeyword}%`)
      .or()
      .like('name', `%${searchKeyword}%`)
      .or()
      .like('schedule', `%${searchKeyword}%`)
      .or()
      .like('professor', `%${searchKeyword}%`)
      .multiOrder([
        ['name', 'ASC'],
        ['professor', 'ASC'],
        ['schedule', 'ASC'],
      ])
      .limit(amount, offset)
      .build()
  )

  if (err) {
    res.sendStatus(500)
    return
  }

  res.json(results)
})

export default router
