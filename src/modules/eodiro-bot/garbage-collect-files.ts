import { getStoragePath } from '@/cdn/get-storage-path'
import { eodiroQuery, EodiroQueryType } from '@/database/eodiro-query'
import { FileType } from '@/database/models/file'
import { PostFileType } from '@/database/models/post_file'
import { TableNames } from '@/database/table-names'
import dayjs from 'dayjs'
import fs from 'fs'
import glob from 'glob'
import _ from 'lodash'
import path from 'path'
import util from 'util'
import SqlB from '../sqlb'

const globSync = util.promisify(glob)

export const garbageCollectFiles = async () => {
  const squarePublicPath = getStoragePath() + '/public-user-content'

  const fileDirs = await globSync(squarePublicPath + '/*/*')

  const dbFiles = await eodiroQuery<FileType>(
    SqlB().select().from(TableNames.file).order('uuid')
  )

  const fileDirsWithUploadDate = fileDirs.map((fileDir) => {
    const fileUuid = path.basename(fileDir)

    return {
      fileDir: fileDir,
      uuid: fileUuid,
      uploadedAt: dayjs(_.find(dbFiles, { uuid: fileUuid }).uploaded_at),
    }
  })

  const selectPostFile = await eodiroQuery<PostFileType & FileType>(
    SqlB()
      .select()
      .from()
      .join(TableNames.post_file, TableNames.file)
      .on('post_file.file_id = file.id')
      .order('uuid')
  )
  const postFileUuids = selectPostFile.map((result) => result.uuid)

  const now = dayjs()
  const lostRefs = fileDirsWithUploadDate.filter(
    (fileWithDate) =>
      !postFileUuids.includes(fileWithDate.uuid) &&
      now.diff(fileWithDate.uploadedAt, 'hour') > 3
  )

  for (const ref of lostRefs) {
    // Delete from DB
    await eodiroQuery(
      SqlB().delete().from(TableNames.file).where().equal('uuid', ref.uuid),
      EodiroQueryType.DELETE
    )
    // Delete from file system
    fs.rmdirSync(ref.fileDir, { recursive: true })
  }
}
