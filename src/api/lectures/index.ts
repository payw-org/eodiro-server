import Db from '@/db'
import SqlB from '@/modules/sqlb'
import { TableNames } from '@/database/table-names'
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
  const year = parseInt(req.params?.year)
  const semester = req.params?.semester
  const campus = req.params?.campus
  const amount = parseInt(req.query?.amount as string) || 20
  const offset = parseInt(req.query?.offset as string) || 0

  const query = SqlB()
    .select(`${TableNames.lecture}.*, major.code AS major_code`)
    .from()
    .join(TableNames.lecture, `${TableNames.coverage_major} major`, 'left')
    .on(`${TableNames.lecture}.major = major.name`)
    .where(`year=? AND semester=? AND campus=?`)
    .multiOrder([
      ['lecture.name', 'ASC'],
      ['professor', 'ASC'],
      ['schedule', 'ASC'],
    ])
    .limit(amount, offset)
    .build()
  const [err, results] = await Db.query(query, [year, semester, campus])

  if (err) {
    res.sendStatus(500)
    return
  }

  res.json(results)
})

router.get('/lectures/:year/:semester/:campus/search', async (req, res) => {
  const year = parseInt(req.params?.year)
  const semester = req.params?.semester
  const campus = req.params?.campus
  const searchKeyword = req.query?.q
  const amount = parseInt(req.query?.amount as string) || 20
  const offset = parseInt(req.query?.offset as string) || 0

  const [err, results] = await Db.query(
    SqlB()
      .select(`${TableNames.lecture}.*, major.code AS major_code`)
      .from()
      .join(TableNames.lecture, `${TableNames.coverage_major} major`, 'left')
      .on(`${TableNames.lecture}.major = major.name`)
      .where(`year=? AND semester=? AND campus=?`)
      .and(
        SqlB()
          .like('college', `%${searchKeyword}%`)
          .or()
          .like('major', `%${searchKeyword}%`)
          .or()
          .like('lecture.name', `%${searchKeyword}%`)
          .or()
          .like('lecture.code', `%${searchKeyword}%`)
          .or()
          .like('schedule', `%${searchKeyword}%`)
          .or()
          .like('professor', `%${searchKeyword}%`)
          .bind()
      )
      .multiOrder([
        ['lecture.name', 'ASC'],
        ['professor', 'ASC'],
        ['schedule', 'ASC'],
      ])
      .limit(amount, offset)
      .build(),
    [year, semester, campus]
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
