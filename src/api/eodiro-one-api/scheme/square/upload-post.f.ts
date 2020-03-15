import Db, { MysqlInsertOrUpdateResult } from '@/db'
import User from '@/db/modules/user'
import Auth from '@/modules/auth'
import SqlB from '@/modules/sqlb'
import Time from '@/modules/time'
import { OneAPIData, OneAPIPayload } from '../types/utils'
import { UploadPost } from './upload-post'

export async function uploadPost(
  data: OneAPIData<UploadPost>
): Promise<OneAPIPayload<UploadPost>> {
  const authPayload = await Auth.isSignedUser(data.accessToken)
  if (!authPayload) {
    return {
      err: 'Unauthorized',
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

  const query = SqlB()
    .insert('post', {
      title: undefined,
      body: undefined,
      user_id: undefined,
      uploaded_at: undefined,
      random_nickname: undefined,
    })
    .build()

  const userInfo = await User.findAtId(authPayload.userId)

  if (!userInfo) {
    return {
      err: 'Unauthorized',
    }
  }

  // Pass trimmed title and body
  const values = [
    title,
    body,
    authPayload.userId,
    Time.getCurrTime(),
    userInfo.random_nickname,
  ]
  const [err, results] = await Db.query<MysqlInsertOrUpdateResult>(
    query,
    values
  )

  if (err) {
    return {
      err: 'Internal Server Error',
    }
  }

  return {
    err: null,
    data: results.insertId,
  }
}
