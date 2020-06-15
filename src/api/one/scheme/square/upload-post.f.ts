import { QueryTypes, query } from '@/database/query'

import Auth from '@/modules/auth'
import { OneApiError } from '../../types'
import { PostAttrs } from '@/database/models/post'
import { PostFileType } from '@/database/models/post_file'
import SqlB from '@/modules/sqlb'
import { TableNames } from '@/database/table-names'
import Time from '@/modules/time'
import { UploadPost } from './upload-post'
import { getUser } from '@/database/models/user'

export async function uploadPost(
  data: UploadPost['data']
): Promise<UploadPost['payload']> {
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

  const insertQuery = SqlB<PostAttrs>()
    .insert(TableNames.post, {
      board_id: data.boardID,
      title,
      body,
      user_id: authPayload.userId,
      uploaded_at: Time.getCurrTime(),
      random_nickname: userInfo.random_nickname,
    })
    .build()

  const [insertId] = await query(insertQuery, {
    type: QueryTypes.INSERT,
  })

  if (data.fileIds && data.fileIds.length > 0) {
    await query(
      SqlB<PostFileType>().bulkInsert(
        TableNames.post_file,
        data.fileIds.map((fileId) => {
          return {
            post_id: insertId,
            file_id: fileId,
          }
        })
      )
    )
  }

  return {
    err: null,
    data: insertId,
  }
}
