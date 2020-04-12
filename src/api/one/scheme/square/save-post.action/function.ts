import { eodiroQuery, EodiroQueryType } from '@/database/eodiro-query'
import { PostAttrs } from '@/database/models/post'
import { PostFileType } from '@/database/models/post_file'
import { getUser } from '@/database/models/user'
import { TableNames } from '@/database/table-names'
import Auth from '@/modules/auth'
import SqlB from '@/modules/sqlb'
import Time from '@/modules/time'
import { OneApiError } from '../../types/utils'
import { Action } from './interface'

/**
 * Save post
 */
export default async function (
  data: Action['data']
): Promise<Action['payload']> {
  const authPayload = await Auth.isSignedUser(data.accessToken)
  if (!authPayload) {
    return {
      err: OneApiError.UNAUTHORIZED,
    }
  }

  // Request update without the post ID
  if (data.update && !data.postId) {
    return {
      err: OneApiError.BAD_REQUEST,
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

  let query: string

  // Distinct query based on the option
  if (data.update) {
    // Update (edit)
    query = SqlB<PostAttrs>()
      .update('post', {
        title,
        body,
        edited_at: Time.getCurrTime(),
      })
      .where()
      .equal('id', data.postId)
      .build()
  } else {
    // Insert (upload)
    query = SqlB<PostAttrs>()
      .insert(TableNames.post, {
        board_id: data.boardId,
        title,
        body,
        user_id: authPayload.userId,
        uploaded_at: Time.getCurrTime(),
        random_nickname: userInfo.random_nickname,
      })
      .build()
  }

  // TIPS: insertId is unavailable when update
  const { insertId } = await eodiroQuery(query, EodiroQueryType.NOT_SELECT)

  // Delete all the previously linked files on update
  if (data.update) {
    await eodiroQuery(
      SqlB<PostFileType>()
        .delete()
        .from(TableNames.post_file)
        .where()
        .equal('post_id', data.postId)
    )
  }

  if (data.fileIds && data.fileIds.length > 0) {
    await eodiroQuery(
      SqlB<PostFileType>().bulkInsert(
        TableNames.post_file,
        data.fileIds.map((fileId) => {
          return {
            post_id: insertId || data.postId,
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
