import { eodiroQuery, EodiroQueryType } from '@/database/eodiro-query'
import { FileType } from '@/database/models/file'
import { initPost, Post, PostAttrs } from '@/database/models/post'
import { PostFileType } from '@/database/models/post_file'
import { PostLike, PostLikeAttrs } from '@/database/models/post_like'
import Auth from '@/modules/auth'
import SqlB, { Q } from '@/modules/sqlb'
import dayjs from 'dayjs'
import {
  OneAPIData,
  OneApiError,
  OneAPIPayload,
  OneApiPayloadData,
} from '../types/utils'
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

  const result = await eodiroQuery<
    PostAttrs & PostLikeAttrs & { likes: number }
  >(
    Q<PostAttrs & PostLikeAttrs>()
      .select('*')
      .alsoSelectAny('count(*) as likes')
      .from()
      .join(Post.tableName, PostLike.tableName)
      .on(
        `${Post.tableName}.${Post.attrs.id} = ${PostLike.tableName}.${PostLike.attrs.post_id}`
      )
      .where()
      .equal('post_id', postId)
  )

  if (result.length === 0) {
    return {
      err: OneApiError.NO_CONTENT,
      data: null,
    }
  }

  const postItem = result[0] as OneApiPayloadData<GetPostById>

  // Check authority when request with edit mode
  if (data.edit === true) {
    const Post = await initPost()
    const isYourPost = await Post.isOwnedBy(data.postId, authPayload.userId)
    if (!isYourPost) {
      return {
        err: OneApiError.FORBIDDEN,
        data: null,
      }
    }
  }

  // Join file and post_file
  const postFiles = await eodiroQuery<PostFileType & FileType>(
    SqlB()
      .select('*')
      .from(SqlB().join('file', 'post_file').on('file.id = post_file.file_id'))
      .where(SqlB().equal('post_id', data.postId)),
    EodiroQueryType.SELECT
  )

  if (postFiles.length > 0) {
    postItem.files = postFiles.map((postFile) => {
      return {
        fileId: postFile.file_id,
        path: `/public-user-content/${dayjs(postFile.uploaded_at).format(
          'YYYYMMDD'
        )}/${postFile.uuid}/${encodeURIComponent(postFile.file_name)}`,
        mimeType: postFile.mime,
        name: postFile.file_name,
      }
    })
  }

  return {
    err: null,
    data: postItem,
  }
}
