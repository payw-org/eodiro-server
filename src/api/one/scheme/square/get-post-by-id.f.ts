import { FileType } from '@/database/models/file'
import { getPost, PostType } from '@/database/models/post'
import { PostFileType } from '@/database/models/post_file'
import { query, QueryTypes } from '@/database/query'
import Db from '@/db'
import Auth from '@/modules/auth'
import SqlB from '@/modules/sqlb'
import { OneAPIData, OneApiError, OneAPIPayload } from '../types/utils'
import { GetPostById } from './get-post-by-id'

export async function getPostById(
  data: OneAPIData<GetPostById>
): Promise<OneAPIPayload<GetPostById>> {
  const authPayload = await Auth.isSignedUser(data.accessToken)

  if (!authPayload) {
    return {
      err: OneApiError.UNAUTHORIZED,
      data: null,
    }
  }

  const { postId } = data

  if (typeof postId !== 'number') {
    return {
      err: OneApiError.BAD_REQUEST,
      data: null,
    }
  }

  const selectPostSql = SqlB<PostType>()
    .select('*')
    .from('post')
    .where()
    .equal('id', postId)
    .build()

  const [err, results] = await Db.query<PostType[]>(selectPostSql)

  if (err) {
    return {
      err: OneApiError.INTERNAL_SERVER_ERROR,
      data: null,
    }
  }

  if (results.length === 0) {
    return {
      err: OneApiError.NO_CONTENT,
      data: null,
    }
  }

  const postItem = results[0]

  // Check authority when request with edit mode
  if (data.edit === true) {
    const Post = await getPost()
    const isYourPost = await Post.isOwnedBy(data.postId, authPayload.userId)
    if (!isYourPost) {
      return {
        err: OneApiError.FORBIDDEN,
        data: null,
      }
    }
  }

  // Join file and post_file
  const postFiles = await query<PostFileType & FileType>(
    SqlB()
      .select('*')
      .from(SqlB().join('file', 'post_file').on('file.id = post_file.file_id'))
      .where(SqlB().equal('post_id', data.postId)),
    {
      type: QueryTypes.SELECT,
    }
  )

  const payload: GetPostById['payload']['data'] = postItem

  if (postFiles.length > 0) {
    payload.files = postFiles.map((postFile) => {
      return {
        fileId: postFile.file_id,
        path: `/public-user-content/${postFile.uuid}/${encodeURIComponent(
          postFile.file_name
        )}`,
        mimeType: postFile.mime,
        name: postFile.file_name,
      }
    })
  }

  return {
    err: null,
    data: results[0],
  }
}
