import Db from '@/db'
import { DbTables } from '@/db/constants'
import SqlB from '@/modules/sqlb'
import { Campus } from '@/types'
import dayjs from 'dayjs'
import express from 'express'

const router = express.Router()

router.get('/cafeteria/:servedAt/:campus/menus', async (req, res) => {
  const now = dayjs()
  const campus: Campus = (Db.escape(req.params?.campus) as Campus) || '서울'
  const servedAt = Db.escape(req.params?.servedAt) || now.format('YYYY-MM-DD')
  const sql = SqlB()
    .select('data')
    .from(DbTables.cafeteria_menu)
    .where()
    .equal('campus', campus)
    .andEqual('served_at', servedAt)
    .build()

  const [err, results] = await Db.query(sql)
  if (err) {
    res.sendStatus(500)
    return
  }

  if (results.length === 0) {
    res.sendStatus(204)
    return
  }

  res.json(JSON.parse(results[0]?.data))
})

export default router
