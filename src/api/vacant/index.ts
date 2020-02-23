import express from 'express'
import Db from '@/db'
import SqlB from '@/modules/sqlb'
import dayjs from 'dayjs'
import dayIndexToString from '@/modules/day-index-to-string'

const router = express.Router()

router.get('/:year/:semester/:campus/vacant/buildings', async (req, res) => {
  const now = dayjs()
  const hour = parseInt(Db.escape(req.query?.hour)) || now.hour()
  const minute = parseInt(Db.escape(req.query?.minute)) || now.minute()
  const today = dayIndexToString(now.day())

  const year = Db.escape(req.params?.year)
  const semester = Db.escape(req.params?.semester)
  const campus = Db.escape(req.params?.campus)
  const day = Db.escape(req.query?.day) || today

  // Find total classrooms number
  const q1 = SqlB()
    .select('building', 'count(building) as total')
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
    .build()

  const [err1, results1] = await Db.query(q1)

  if (err1) {
    res.sendStatus(500)
    return
  }

  // Find in-class classrooms number
  const q2 = SqlB()
    .select('building', 'count(building) as in_class_count')
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
    .format()
    .build()

  const [err2, results2] = await Db.query(q2)
  if (err2) {
    res.sendStatus(500)
    return
  }

  results2.forEach((b) => {
    const index = results1.findIndex((item) => {
      return item.building === b.building
    })

    if (index !== -1) {
      results1[index].empty = results1[index].total - b.in_class_count
    }
  })

  res.json(results1)
})

router.get('/:year/:semester/:campus/:building')

export default router
