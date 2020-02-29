import express from 'express'
import Db from '@/db'
import SqlB from '@/modules/sqlb'
import dayjs from 'dayjs'
import dayIndexToString from '@/modules/day-index-to-string'

const router = express.Router()

router.get('/:year/:semester/:campus/vacant/buildings', async (req, res) => {
  const now = dayjs()

  // Queries
  const hour = parseInt(Db.escape(req.query?.hour)) || now.hour()
  const minute = parseInt(Db.escape(req.query?.minute)) || now.minute()
  const today = dayIndexToString(now.day())
  const day = Db.escape(req.query?.day) || today

  // Params
  const year = Db.escape(req.params?.year)
  const semester = Db.escape(req.params?.semester)
  const campus = Db.escape(req.params?.campus)

  // Find total classrooms number
  const q1 = SqlB()
    .select('building as building_number', 'count(building) as total')
    .from(
      SqlB()
        .select('distinct *')
        .from(
          SqlB()
            .select('building', 'room')
            .from(
              SqlB()
                .join('lecture', 'period')
                .on('lecture.id = period.lecture_id')
            )
            .where()
            .equal('year', year)
            .andEqual('semester', semester)
            .andEqual('campus', campus)
            .andEqual('day', day)
            .andNotEqual('building', '')
            .andNotEqual('room', '')
            .multiOrder([
              ['building', 'asc'],
              ['room', 'asc'],
              ['start_h', 'asc'],
            ])
            .bind('t1')
        )
        .multiOrder([
          ['building', 'asc'],
          ['room', 'asc'],
        ])
        .bind('t2')
        .group('building')
    )
    .format()
    .build()

  const [err1, results1] = await Db.query(q1)

  if (err1) {
    res.sendStatus(500)
    return
  }

  // Fill empty key with 0 value
  results1.forEach((item) => {
    item.empty = item.total
  })

  if (err1) {
    res.sendStatus(500)
    return
  }

  // Find in-class classrooms number
  const q2 = SqlB()
    .select('building as building_number', 'count(building) as in_class_count')
    .from(
      SqlB()
        .select('building', 'room')
        .from(
          SqlB()
            .join('lecture', 'period')
            .on('lecture.id = period.lecture_id')
        )
        .where()
        .equal('year', year)
        .andEqual('semester', semester)
        .andEqual('campus', campus)
        .andEqual('day', day)
        .andNotEqual('building', '')
        .andNotEqual('room', '')
        .and(
          SqlB()
            .less('start_h', hour)
            .or()
            .equalOrLess('start_h', hour)
            .and()
            .equalOrLess('start_m', minute)
            .bind()
        )
        .and(
          SqlB()
            .more('end_h', hour)
            .or()
            .equalOrMore('end_h', hour)
            .and()
            .equalOrMore('end_m', minute)
            .bind()
        )
        .multiOrder([
          ['building', 'asc'],
          ['room', 'asc'],
          ['start_h', 'asc'],
        ])
        .bind('t1')
    )
    .group('building')
    .order('building')
    .build()

  const [err2, results2] = await Db.query(q2)
  if (err2) {
    res.sendStatus(500)
    return
  }

  results2.forEach((b) => {
    const index = results1.findIndex((item) => {
      return item.building_number === b.building_number
    })

    if (index !== -1) {
      results1[index].empty = results1[index].total - b.in_class_count
    }
  })

  res.json(results1)
})

router.get(
  '/:year/:semester/:campus/vacant/:building/classrooms',
  async (req, res) => {
    const now = dayjs()

    // Queries
    const today = dayIndexToString(now.day())
    const day = Db.escape(req.query?.day) || today

    // Params
    const year = Db.escape(req.params?.year)
    const semester = Db.escape(req.params?.semester)
    const campus = Db.escape(req.params?.campus)
    const building = Db.escape(req.params?.building)

    const q1 = SqlB()
      .select('*')
      .from(
        SqlB()
          .select('*')
          .from(
            SqlB()
              .join('lecture', 'period')
              .on('lecture.id = period.lecture_id')
          )
          .where(
            SqlB()
              .equal('year', year)
              .andEqual('semester', semester)
              .andEqual('campus', campus)
              .andEqual('building', building)
              .andEqual('day', day)
          )
          .order('room', 'asc')
          .bind('t1')
      )
      .multiOrder([
        ['room', 'asc'],
        ['start_h', 'asc'],
        ['start_m', 'asc'],
      ])
      .build()
    const [err1, results1] = await Db.query(q1)

    if (err1) {
      res.sendStatus(500)
      return
    }

    const info: {
      classroom_number: string
      lectures: {
        name: string
        professor: string
        start_h: number
        start_m: number
        end_h: number
        end_m: number
      }[]
    }[] = []

    results1.forEach((lecture) => {
      let index = info.findIndex((item) => {
        return item.classroom_number === lecture.room
      })

      if (index === -1) {
        index =
          info.push({
            classroom_number: lecture.room,
            lectures: [],
          }) - 1
      }

      info[index].lectures.push({
        name: lecture.name,
        professor: lecture.professor,
        start_h: lecture.start_h,
        start_m: lecture.start_m,
        end_h: lecture.end_h,
        end_m: lecture.end_m,
      })
    })

    res.json(info)
  }
)

export default router
