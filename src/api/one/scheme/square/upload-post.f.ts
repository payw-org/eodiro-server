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

  const User = await getUser()
  const userInfo = await User.findAtId(authPayload.userId)

  if (!userInfo) {
    return {
      err: OneApiError.UNAUTHORIZED,
    }
  }

  const insertQuery = SqlB<PostType>()
    .insert('post', {
      board_id: data.boardID,
      title,
      body,
      user_id: authPayload.userId,
      uploaded_at: Time.getCurrTime(),
      random_nickname: userInfo.random_nickname,
    })
    .build()

  const [err, results] = await Db.query<MysqlInsertOrUpdateResult>(insertQuery)

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
