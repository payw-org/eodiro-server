import { PostType } from '@/database/models/post'
import { getUser } from '@/database/models/user'
import Db, { MysqlInsertOrUpdateResult } from '@/db'
import Auth from '@/modules/auth'
import SqlB from '@/modules/sqlb'
import Time from '@/modules/time'
import { OneAPIData, OneApiError, OneAPIPayload } from '../types/utils'
import { UploadPost } from './upload-post'

export async function uploadPost(
  data: OneAPIData<UploadPost>
): Promise<OneAPIPayload<UploadPost>> {
  const authPayload = await Auth.isSignedUser(data.accessToken)
  if (!authPayload) {
    return {
      err: OneApiError.UNAUTHORIZED,
    }
  }

  const title = data.title.trim()
  if (title.length === 0) {
    return {
      err: 'No Title',
    }
  }

  const body = data.body.trim()
  if (body.length === 0) {
    return {
      err: 'No Body',
    }
  }

  // TODO: Proper board ID
  const insertQuery = SqlB<PostType>()
    .insert('post', {
      board_id: data.boardID,
      title: undefined,
      body: undefined,
      user_id: undefined,
      uploaded_at: undefined,
      random_nickname: undefined,
    })
    .build()

  const User = await getUser()
  const userInfo = await User.findAtId(authPayload.userId)

  if (!userInfo) {
    return {
      err: OneApiError.UNAUTHORIZED,
    }
  }

  // Upload a new post

  // Pass trimmed title and body
  const values = [
    title,
    body,
    authPayload.userId,
    Time.getCurrTime(),
    userInfo.random_nickname,
  ]
  const [err, results] = await Db.query<MysqlInsertOrUpdateResult>(
    insertQuery,
    values
  )

  if (err) {
    return {
      err: OneApiError.INTERNAL_SERVER_ERROR,
    }
  }

  return {
    err: null,
    data: results.insertId,
  }
}
