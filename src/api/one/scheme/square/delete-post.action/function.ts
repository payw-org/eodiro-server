import { FileType } from '@/database/models/file'
import { getPost, PostType } from '@/database/models/post'
import { PostFileType } from '@/database/models/post_file'
import { query, QueryTypes } from '@/database/query'
import { TableNames } from '@/database/table-names'
import Auth from '@/modules/auth'
import SqlB from '@/modules/sqlb'
import { DeletePost } from '../..'
import { OneApiError } from '../../types/utils'

export default async function(
  data: DeletePost['data']
): Promise<DeletePost['payload']> {
  const authPayload = await Auth.isSignedUser(data.accessToken)
  if (!authPayload) {
    return {
      err: OneApiError.UNAUTHORIZED,
    }
  }

  const Post = await getPost()
  if (!(await Post.isOwnedBy(data.postId, authPayload.userId))) {
    return {
      err: OneApiError.FORBIDDEN,
    }
  }

  // Find file ids included in the post
  const postFiles = await query<PostFileType>(
    SqlB<PostFileType>()
      .select('*')
      .from('post_file')
      .where()
      .equal('post_id', data.postId),
    {
      type: QueryTypes.SELECT,
    }
  )

  //  Delete file entries from db
  await query(
    SqlB<FileType>()
      .delete()
      .from(TableNames.file)
      .where()
      .in(
        'id',
        postFiles.map((postFile) => postFile.file_id)
      )
  )

  // Delete the post
  await query(
    SqlB<PostType>()
      .delete()
      .from('post')
      .where()
      .equal('id', data.postId),
    {
      type: QueryTypes.DELETE,
    }
  )

  return {
    err: null,
  }
}
