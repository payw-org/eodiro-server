import express from 'express'
import Db from '@/db'
import SqlB from '@/modules/sqlb'

const router = express.Router()

router.get('/:year/:semester/:campus/buildings', async (req, res) => {
  const year = Db.escape(req.params?.year)
  const semester = Db.escape(req.params?.semester)
  const campus = Db.escape(req.params?.campus)

  const query = SqlB()
    .distinctSelect('building')
    .from('lecture')
    .where()
    .same('year', year)
    .and()
    .same('semester', semester)
    .and()
    .same('campus', campus)
    .order('building', 'asc')
    .build()

  console.log(query)

  type BuildingsResult = {
    building: string
  }[]

  const [err, results] = await Db.query<BuildingsResult>(query)
  if (err) {
    res.sendStatus(500)
    return
  }

  res.json(
    results
      .map((b) => {
        return b.building
      })
      .filter((b) => {
        return b !== ''
      })
  )
})

export default router
