import { TableNames } from '@/database/table-names'
import Db from '@/db'
import SqlB from '@/modules/sqlb'
import { Campus } from '@/types'
import dayjs from 'dayjs'
import express from 'express'

const router = express.Router()

router.get('/cafeteria/:servedAt/:campus/menus', async (req, res) => {
  const now = dayjs()
  const campus: Campus = (req.params?.campus as Campus) || '서울'
  const servedAt = req.params?.servedAt || now.format('YYYY-MM-DD')
  const sql = SqlB()
    .select('data')
    .from(TableNames.cafeteria_menu)
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
