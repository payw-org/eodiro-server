import Db from '@/db'
import { DBSchema } from '@/db/schema'
import SqlB from '@/modules/sqlb'
import { Interface } from './interface'

export default async function(
  data: Interface['data']
): Promise<Interface['payload']> {
  const q = SqlB<DBSchema.Board>()
    .select('*')
    .from('board')
    .where()
    .equal('board_name', data.boardName)
  const [, results] = await Db.query<DBSchema.Boards>(q)

  if (results.length === 0) {
    return {
      err: 'No Board',
      data: null,
    }
  }

  return {
    err: null,
    data: results[0].id,
  }
}
