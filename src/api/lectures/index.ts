import Db from '@/db'
import SqlB from '@/modules/sqlb'
import express from 'express'

const router = express.Router()

const lectureAttrs = [
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

router.get('/lectures/:year/:semester/:campus/list', async (req, res) => {
  const year = parseInt(Db.escape(req.params?.year))
  const semester = Db.escape(req.params?.semester)
  const campus = Db.escape(req.params?.campus)
  const amount = parseInt(req.query?.amount) || 20
  const offset = parseInt(req.query?.offset) || 0

  const query = SqlB()
    .select(...lectureAttrs)
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

router.get('/lectures/:year/:semester/:campus/search', async (req, res) => {
  const year = parseInt(Db.escape(req.params?.year))
  const semester = Db.escape(req.params?.semester)
  const campus = Db.escape(req.params?.campus)
  const searchKeyword = Db.escape(req.query?.q)
  const amount = parseInt(req.query?.amount) || 20
  const offset = parseInt(req.query?.offset) || 0

  const [err, results] = await Db.query(
    SqlB()
      .select(...lectureAttrs)
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

router.get('/lectures/coverages', async (...ctx) => {
  type Result = {
    year: number
    semester: string
    campus: string
  }

  const res = ctx[1]
  const year = [],
    semester = [],
    campus = []
  const query = SqlB()
    .distinctSelect('year', 'semester', 'campus', 'major')
    .from('lecture')
    .build()
  const [err, results] = await Db.query<Result[]>(query)
  if (err) {
    res.sendStatus(500)
  } else {
    results.forEach((item) => {
      if (item.year) year.push(item.year)
      if (item.semester) semester.push(item.semester)
      if (item.campus) campus.push(item.campus)
    })
    const yearSet = new Set(year)
    const semesterSet = new Set(semester)
    const campusSet = new Set(campus)
    const mixed = {
      year: Array.from(yearSet).reverse(),
      semester: Array.from(semesterSet).sort(),
      campus: Array.from(campusSet).sort(),
    }
    res.json(mixed)
  }
})

export default router
