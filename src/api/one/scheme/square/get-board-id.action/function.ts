import { BoardType } from '@/database/models/board'
import Db from '@/db'
import SqlB from '@/modules/sqlb'
import { OneApiError } from '../../types/utils'
import { Action } from './interface'

export default async function (
  data: Action['data']
): Promise<Action['payload']> {
  if (!data.boardName) {
    return {
      err: OneApiError.BAD_REQUEST,
      data: null,
    }
  }

  const q = SqlB<BoardType>()
    .select('*')
    .from('board')
    .where()
    .equal('board_name', data.boardName)
  const [, results] = await Db.query<BoardType[]>(q)

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
