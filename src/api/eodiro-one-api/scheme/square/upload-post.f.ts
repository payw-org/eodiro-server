import { PostType } from '@/database/models/post'
import { user } from '@/database/models/user'
import Db, { MysqlInsertOrUpdateResult } from '@/db'
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

  // TODO: Proper board ID
  const query = SqlB<PostType>()
    .insert('post', {
      board_id: 1,
      title: undefined,
      body: undefined,
      user_id: undefined,
      uploaded_at: undefined,
      random_nickname: undefined,
    })
    .build()

  const User = await user()
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
